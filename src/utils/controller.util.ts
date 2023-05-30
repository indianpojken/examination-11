import { NextFunction, Request } from 'express';
import { ApiResponse } from '../types/api.type';

interface ControllerBody {
  (request: Request, response: ApiResponse): Promise<void>;
}

export function controller(body: ControllerBody) {
  return async (
    request: Request,
    response: ApiResponse,
    next: NextFunction
  ) => {
    try {
      await body(request, response);
    } catch (error) {
      next(error);
    }
  };
}
