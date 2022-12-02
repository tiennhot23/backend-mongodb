const HttpStatus = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const urlExpiredTime = 60 * 60 * 1000;
const serverUrl = 'http://127.0.0.1:3000/';

export {
  HttpStatus,
  urlExpiredTime,
  serverUrl,
};
