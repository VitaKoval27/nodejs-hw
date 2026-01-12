import { HttpError } from 'http-errors';

const isProduction = process.env.NODE_ENV === 'production';

// error - 500
export const errorHandler = (err, req, res, next) => {
  console.log('Error Middleware:', err);

  if (err instanceof HttpError) {
    return res.status(err.status).json({
      message: err.message || err.name,
    });
  }

  res.status(500).json({
    message: isProduction ? 'Something went wrong' : err.message,
  });
};
