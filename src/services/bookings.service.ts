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

export async function registerBook(
  booking: z.infer<typeof bookingsValidation.book>
) {
  const from = dayjs(booking.dateTime).toDate();
  const to = dayjs(booking.dateTime).add(PLAY_TIME, 'm').toDate();

  const possibleLanes = await availableLanes(from, to);

  if (possibleLanes.length < booking.lanes) {
    throw new ApiError(409, {
      message: 'Insufficient lanes available',
    });
  }

  return await bookingModel.create<Booking>({
    email: booking.email,
    date: { from, to },
    players: booking.players,
    shoeSizes: booking.shoeSizes,
    total: calculateTotal(booking.players, booking.lanes),
    lanes: possibleLanes.slice(0, booking.lanes),
  });
}

export async function editBooking(
  booking: z.infer<typeof bookingsValidation.book>
) {
  const from = dayjs(booking.dateTime).toDate();
  const to = dayjs(booking.dateTime).add(PLAY_TIME, 'm').toDate();

  const possibleLanes = await availableLanes(from, to);

  if (possibleLanes.length < booking.lanes) {
    throw new ApiError(409, {
      message: 'Insufficient lanes available',
    });
  }

  return await bookingModel.create<Booking>({
    email: booking.email,
    date: { from, to },
    players: booking.players,
    shoeSizes: booking.shoeSizes,
    total: calculateTotal(booking.players, booking.lanes),
    lanes: possibleLanes.slice(0, booking.lanes),
  });
}
