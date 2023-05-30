import { Response } from 'express';

export type ApiData = object | null;

// Types for JSend specification (JSON-responses).
export interface ApiResultSuccess {
  status: 'success';
  data: ApiData;
}

export interface ApiResultFail {
  status: 'fail';
  data: ApiData;
}

export interface ApiResultError {
  status: 'error';
  message: string;
  code?: number;
  data?: ApiData;
}

export type ApiResult = ApiResultSuccess | ApiResultFail | ApiResultError;

export type ApiResponse = Response<ApiResult>;
