import { controller } from '../utils/controller.util';

export const exampleOne = controller(async (request, response) => {
  response.status(200).send({
    status: 'success',
    data: null,
  });
});

export const exampleTwo = controller(async (request, response) => {
  const { text } = request.body;

  response.status(200).send({
    status: 'success',
    data: { text },
  });
});
