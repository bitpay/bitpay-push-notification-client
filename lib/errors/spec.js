'use strict';

var errorSpec = [{
  name: 'CONNECTION_ERROR',
  message: 'connection error'
}, {
  name: 'NOT_FOUND',
  message: 'not found'
}, {
  name: 'ECONNRESET_ERROR',
  message: 'ECONNRESET, body: {0}'
} ];

module.exports = errorSpec;
