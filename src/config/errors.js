module.exports = {
  NOT_FOUND: 'notfound',
  ROUTE: {
    ROUTE_MALFORMED: 1 << 1,
    METHOD_NOT_EXISTS: 1 << 2,
  },
  CONTROLLER: {
    NO_ACTION: 1 << 1,
    CONTROLLER_FAILED: 1 << 2,
    ACTION_FAILED: 1 << 3,
  }
};