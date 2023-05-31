import { controller } from '../utils/controller.util';
import { bookingsService } from '../services/mod';

export const book = controller(async (request, response) => {
  const data = request.body;
  const booking = await bookingsService.createBooking(data);

  response.status(200).send({
    status: 'success',
    data: {
      booking: {
        number: booking.bookingNumber,
        total: booking.total,
      },
    },
  });
});
