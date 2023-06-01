import { z } from 'zod';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { NUMBER_OF_LANES, MAX_PLAYERS_PER_LANE } from '../misc/constants.misc';

dayjs.extend(customParseFormat);

export const book = z
  .object({
    body: z.object({
      email: z.string().email(),
      dateTime: z
        .string() // the refines should be replaced with a superRefine
        .refine((data) => dayjs(data, 'YYYY-MM-DD HH:mm', true).isValid(), {
          message: `Please use the following format: 'YYYY-MM-DD HH:mm'`,
        })
        .refine((data) => dayjs(data).minute() % 30 === 0, {
          message: `Only whole and half-hours are allowed`,
        })
        .refine((data) => dayjs(data).isAfter(dayjs()), {
          message: `Please provide a future date and time`,
        }),
      players: z
        .number()
        .int()
        .min(1)
        .max(NUMBER_OF_LANES * MAX_PLAYERS_PER_LANE),
      lanes: z.number().int().min(1).max(NUMBER_OF_LANES),
      shoeSizes: z.array(z.number().min(34).max(50).multipleOf(0.5)),
    }),
  })
  .refine((data) => data.body.players === data.body.shoeSizes.length, {
    path: ['body', 'shoeSizes'],
    message: `Array must contain the same amount of element(s) as the number of players`,
  })
  .refine(
    (data) => data.body.players <= MAX_PLAYERS_PER_LANE * data.body.lanes,
    {
      path: ['body', 'players'],
      message: `The number of players exceeds the maximum player count (${MAX_PLAYERS_PER_LANE}) per lane.`,
    }
  )
  .transform((data) => data.body);

export const schedule = z.object({
  query: z
    .object({
      from: z
        .string()
        .refine((data) => dayjs(data, 'YYYY-MM-DD', true).isValid(), {
          message: `Please use the following format: 'YYYY-MM-DD'`,
        })
        .optional(),
      to: z
        .string()
        .refine((data) => dayjs(data, 'YYYY-MM-DD', true).isValid(), {
          message: `Please use the following format: 'YYYY-MM-DD'`,
        })
        .optional(),
    })
    .optional(),
});
