import { NextFunction, Request } from 'express';

import { ApiResponse } from '../types/api.type';
import { ApiError, ApiFail } from '../errors/api.error';

function errorHandler(
  error: Error,
  request: Request,
  response: ApiResponse,
  next: NextFunction
) {
  if (error instanceof ApiFail) {
    response.status(error.code).json({
      status: 'fail',
      data: error.data,
    });
  } else if (error instanceof ApiError) {
    response.status(error.code).send({
      status: 'error',
      message: error.message,
      // code: error.code, // this and data are optional keys in jsend spec.
      ...(error.data && { data: error.data }),
    });
  } else if (error instanceof Error) {
    response.status(400).send({
      status: 'error',
      message: error.message,
    });
  } else {
    response.status(500).send({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
}

function notFound(request: Request, response: ApiResponse) {
  const error = new ApiError(404, {
    message: `Route ${request.method}: ${request.path} not found`,
  });

  errorHandler(error, request, response, () => {});
}

export const errors = [errorHandler, notFound];
