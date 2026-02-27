import { Response } from 'express';

export const sendSuccess = (res: Response, statusCode: number, data: any = null) => {
  return res.status(statusCode).json({
    success: true,
    data,
    error: null,
  });
};

export const sendError = (res: Response, statusCode: number, error: any) => {
  return res.status(statusCode).json({
    success: false,
    data: null,
    error: error.message || 'An unknown error occurred.',
  });
};