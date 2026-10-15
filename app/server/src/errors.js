export class HttpError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export const badRequest = (message, code = 'VALIDATION_ERROR') => new HttpError(400, code, message);
export const unauthorized = (message = 'Authentication required') => new HttpError(401, 'UNAUTHORIZED', message);
export const forbidden = (message = 'You do not have permission to perform this action') =>
  new HttpError(403, 'FORBIDDEN', message);
export const notFound = (message = 'Resource not found') => new HttpError(404, 'NOT_FOUND', message);
export const conflict = (message, code = 'CONFLICT') => new HttpError(409, code, message);
export const locked = (message) => new HttpError(423, 'ACCOUNT_LOCKED', message);
