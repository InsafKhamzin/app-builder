module.exports = class ClientError extends Error {
    constructor(message, httpStatus) {
      super(message);
      this.httpStatus = httpStatus;
    }
  }