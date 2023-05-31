import dayjs from 'dayjs';

import { controller } from '../utils/controller.util';
import { bookingsService } from '../services/mod';

export const book = controller(async (request, response) => {
  const data = request.body;

  const booking = await bookingsService.addBooking(data);

  response.status(201).send({
    status: 'success',
    data: {
      booking: {
        number: booking.bookingNumber,
        total: booking.total,
      },
    },
  });
});

export const edit = controller(async (request, response) => {
  const data = request.body;
  const { bookingNumber } = request.params;

  const booking = await bookingsService.editBooking(bookingNumber, data);

  response.status(201).send({
    status: 'success',
    data: {
      booking: {
        number: booking?.bookingNumber,
        total: booking?.total,
      },
    },
  });
});

export const view = controller(async (request, response) => {
  const { bookingNumber } = request.params;

  const booking = await bookingsService.getBookingByNumber(bookingNumber);

  response.status(200).send({
    status: 'success',
    data: {
      booking: {
        number: booking.bookingNumber,
        email: booking.email,
        date: {
          from: dayjs(booking.date.from).format('YYYY/MM/DD HH:mm'),
          to: dayjs(booking.date.to).format('YYYY/MM/DD HH:mm'),
        },
        players: booking.players,
        shoeSizes: booking.shoeSizes,
        lanes: booking.lanes.map((lane) => `#${lane.number}`),
        total: booking.total,
      },
    },
  });
});

export const remove = controller(async (request, response) => {
  const { bookingNumber } = request.params;

  await bookingsService.removeBooking(bookingNumber);

  response.status(200).send({
    status: 'success',
    data: null,
  });
});
