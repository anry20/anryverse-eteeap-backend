import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export const unknownRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const err = new Error('Unknown Route');
  (err as AppError).status = 404;
  next(err);
};
