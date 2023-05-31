import { z } from 'zod';
import dayjs from 'dayjs';

import { Booking, bookingModel } from '../models/booking.model';
import { Lane, laneModel } from '../models/lane.model';
import { bookingsValidation } from '../validations/mod';

import { ApiError } from '../errors/api.error';

import {
  PLAY_TIME,
  PRICE_PER_LANE,
  PRICE_PER_PLAYER,
} from '../misc/constants.misc';

function calculateTotal(players: number, lanes: number) {
  const playerCost = players * PRICE_PER_PLAYER;
  const laneCost = lanes * PRICE_PER_LANE;

  return playerCost + laneCost;
}

async function availableLanes(from: Date, to: Date) {
  const bookings = await bookingModel
    .find<Booking>({
      $or: [
        { 'date.from': { $gte: from, $lt: to } },
        { 'date.to': { $gt: from, $lt: to } },
      ],
    })
    .select('-_id lanes');

  const occupiedLanes = bookings.flatMap((booking) => booking.lanes);

  return await laneModel.find<Lane>({ _id: { $nin: occupiedLanes } });
}

export async function getBookingByNumber(bookingNumber: string) {
  return await bookingModel
    .findOne({ bookingNumber })
    .populate<{ lanes: Lane[] }>('lanes')
    .orFail(
      new ApiError(404, {
        message: `No booking with the number: '${bookingNumber}' was found`,
      })
    );
}

export async function createBooking(
  booking: z.infer<typeof bookingsValidation.book>
): Promise<Booking> {
  const from = dayjs(booking.dateTime).toDate();
  const to = dayjs(booking.dateTime).add(PLAY_TIME, 'm').toDate();

  const possibleLanes = await availableLanes(from, to);

  if (possibleLanes.length < booking.lanes) {
    throw new ApiError(409, {
      message: 'Insufficient lanes available',
    });
  }

  return {
    email: booking.email,
    date: { from, to },
    players: booking.players,
    shoeSizes: booking.shoeSizes,
    total: calculateTotal(booking.players, booking.lanes),
    lanes: possibleLanes.slice(0, booking.lanes),
  };
}

export async function addBooking(
  booking: z.infer<typeof bookingsValidation.book>
) {
  return await bookingModel.create<Booking>(await createBooking(booking));
}

export async function editBooking(
  bookingNumber: string,
  booking: z.infer<typeof bookingsValidation.book>
) {
  await getBookingByNumber(bookingNumber); // lots of duplicate querys. Meh.
  await bookingModel.findOneAndUpdate({ bookingNumber }, { lanes: [] });

  return await bookingModel.findOneAndUpdate(
    { bookingNumber },
    await createBooking(booking),
    { new: true }
  );
}

export async function removeBooking(bookingNumber: string) {
  await getBookingByNumber(bookingNumber);
  return await bookingModel.deleteOne({ bookingNumber });
}
