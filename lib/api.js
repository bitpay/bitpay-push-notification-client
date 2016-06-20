'use strict';

var _ = require('lodash');
var util = require('util');
var url = require('url');

var request;
if (process && !process.browser) {
  request = require('request');
} else {
  request = require('browser-request');
}

var Common = require('./common');
var Constants = Common.Constants;
var Defaults = Common.Defaults;
var Utils = Common.Utils;

var log = require('./log');
var Package = require('../package.json');
var Errors = require('./errors');

var BASE_URL = 'http://localhost:8000';

/**
 * @desc ClientAPI constructor.
 *
 * @param {Object} opts
 * @constructor
 */
function API(opts) {
  opts = opts || {};

  this.verbose = !!opts.verbose;
  this.request = opts.request || request;
  this.baseUrl = opts.baseUrl || BASE_URL;
  var parsedUrl = url.parse(this.baseUrl);
  this.basePath = parsedUrl.path;
  this.baseHost = parsedUrl.protocol + '//' + parsedUrl.host;
  this.timeout = opts.timeout || 50000;

  if (this.verbose) {
    log.setLevel('debug');
  } else {
    log.setLevel('info');
  }
};

API.prototype.initialize = function(opts, cb) {
  var self = this;
  return cb();
};

/**
 * Send a push message.
 * @param {Object} opts
 * @param {String} opts.users - Optional. An array of previously subscribed users.
 * @param {String} opts.android - Optional. Attributes specific to push to Android users.
 * @param {String} opts.android.data - Android push data.
 * @param {String} opts.android.data.message - Android push message.
 * @param {String} opts.ios - Optional. Attributes specific to push to iOS users.
 * @param {String} opts.ios.badge - The numeric badge for the app icon.
 * @param {String} opts.ios.alert - Message to iOS users.
 * @param {String} opts.ios.sound - The sound to play on notification.
 * @returns {Object} response - Status of the send.
 */
API.prototype.send = function(opts, cb) {
  var url = '/send/';
  this._doPostRequest(url, opts, function(err, response) {
    if (err) return cb(err);
    return cb(null, response);
  });
};

/**
 * Subscribes a user.
 * @param {Object} opts
 * @param {String} opts.user - User to subscribe.
 * @param {String} opts.type - Device type (ios or android).
 * @param {String} opts.token - Device token.
 * @returns {Object} response - Status of subscription.
 */
API.prototype.subscribeToNotifications = function(opts, cb) {
  var url = '/subscribe/';
  this._doPostRequest(url, opts, function(err, response) {
    if (err) return cb(err);
    return cb(null, response);
  });
};

/**
 * Unsubscribes a user.
 * @param {Object} opts
 * @param {String} opts.token - Device token.
 * @return {Callback} cb - Status of unsubscription.
 */
API.prototype.unsubscribeFromNotifications = function(opts, cb) {
  var url = '/unsubscribe/';
  this._doPostRequest(url, opts, function(err, response) {
    if (err) return cb(err);
    return cb(null, response);
  });
};

/**
 * Returns a list of subscribed users.
 * @return {Callback} cb - An array of users.
 */
API.prototype.getUsers = function(cb) {
  var url = '/users/';
  this._doGetRequest(url, function(err, response) {
    if (err) return cb(err);
    return cb(null, response);
  });
};

/**
 * Returns a users associations.
 * @param {Object} opts
 * @param {String} opts.user - The user for whom to retrive associations..
 * @return {Callback} cb - An array of users.
 */
API.prototype.getUserAssociations = function(opts, cb) {
  opts.user = opts.user || '';
  var url = '/users/' + opts.user + '/associations/';
  this._doGetRequest(url, function(err, response) {
    if (err) return cb(err);
    return cb(null, response);
  });
};

/**
 * Parse errors
 * @private
 * @static
 * @memberof Client.API
 * @param {Object} body
 */
API._parseError = function(body) {
  if (_.isString(body)) {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {
        error: body
      };
    }
  }
  var ret;
  if (body && body.code) {
    if (Errors[body.code]) {
      ret = new Errors[body.code];
    } else {
      ret = new Error(body.code);
    }
  } else if (body && body.errors) {
    var msg = '';
    for (var i = 0; i < body.errors.length; i++) {
      switch (body.errors[i].error) {
        case 'Missing required parameter.':
          msg += body.errors[i].error + ': ' + body.errors[i].param + '\n';
          break;
        default:
          msg += body.errors[i].error + '\n';
          break;
      }
    }
    ret = new Error(msg);
  } else {
    ret = new Error(body.error || body);
  }
  log.error(ret);
  return ret;
};

API.prototype._getHeaders = function(method, url, args) {
  var headers = {
  };
  return headers;
}

/**
 * Do an HTTP request
 * @private
 *
 * @param {Object} method
 * @param {String} url
 * @param {Object} args
 * @param {Callback} cb
 */
API.prototype._doRequest = function(method, url, args, cb) {
  var absUrl = this.baseUrl + url;
  var newArgs = {
    // relUrl: only for testing with `supertest`
    relUrl: this.basePath + url,
    headers: this._getHeaders(method, url, args),
    method: method,
    url: absUrl,
    body: args,
    json: true,
    timeout: this.timeout,
  };

  log.debug('Request Args', util.inspect(args, {
    depth: 10
  }));

  this.request(newArgs, function(err, res, body) {
    log.debug(util.inspect(body, {
      depth: 10
    }));
    if (!res) {
      return cb(new Errors.CONNECTION_ERROR);
    }

    if (res.statusCode !== 200) {
      if (res.statusCode === 404)
        return cb(new Errors.NOT_FOUND);

      if (!res.statusCode)
        return cb(new Errors.CONNECTION_ERROR);

      return cb(API._parseError(body));
    }

    if (body === '{"error":"read ECONNRESET"}')
      return cb(new Errors.ECONNRESET_ERROR(JSON.parse(body)));

    return cb(null, body, res.header);
  });
};

/**
 * Do a POST request
 * @private
 *
 * @param {String} url
 * @param {Object} args
 * @param {Callback} cb
 */
API.prototype._doPostRequest = function(url, args, cb) {
  return this._doRequest('post', url, args, cb);
};

API.prototype._doPutRequest = function(url, args, cb) {
  return this._doRequest('put', url, args, cb);
};

/**
 * Do a GET request
 * @private
 *
 * @param {String} url
 * @param {Callback} cb
 */
API.prototype._doGetRequest = function(url, cb) {
  url += url.indexOf('?') > 0 ? '&' : '?';
  url += 'r=' + _.random(10000, 99999);
  return this._doRequest('get', url, {}, cb);
};

/**
 * Do a DELETE request
 * @private
 *
 * @param {String} url
 * @param {Callback} cb
 */
API.prototype._doDeleteRequest = function(url, cb) {
  return this._doRequest('delete', url, {}, cb);
};

module.exports = API;
