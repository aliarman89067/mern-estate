export const errorHandler = (statusCode, messages) => {
  const error = new Error();
  error.statusCode = statusCode;
  error.message = message;
  return error;
};
