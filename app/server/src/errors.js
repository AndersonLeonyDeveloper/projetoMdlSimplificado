export class HttpError extends Error {
  constructor(status, code, message, params) {
    super(message);
    this.status = status;
    this.code = code;
    this.params = params;
  }
}

export const badRequest = (message, code = 'VALIDATION_ERROR', params) => new HttpError(400, code, message, params);
export const unauthorized = (message = 'Authentication required', code = 'UNAUTHORIZED') =>
  new HttpError(401, code, message);
export const forbidden = (message = 'You do not have permission to perform this action') =>
  new HttpError(403, 'FORBIDDEN', message);
export const notFound = (message = 'Resource not found', code = 'NOT_FOUND') => new HttpError(404, code, message);
export const conflict = (message, code = 'CONFLICT', params) => new HttpError(409, code, message, params);
export const locked = (message, params) => new HttpError(423, 'ACCOUNT_LOCKED', message, params);
