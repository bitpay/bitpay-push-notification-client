# bitpay-push-notification-client

[![NPM Package](https://img.shields.io/npm/v/bitpay-push-notification-client.svg?style=flat-square)](https://www.npmjs.org/package/bitpay-push-notification-client)
[![Build Status](https://img.shields.io/travis/bitpay/bitpay-push-notification-client.svg?branch=master&style=flat-square)](https://travis-ci.org/bitpay/bitpay-push-notification-client) 
[![Coverage Status](https://coveralls.io/repos/bitpay/bitpay-push-notification-client/badge.svg)](https://coveralls.io/r/bitpay/bitpay-push-notification-client)

A client library for the [BitPay's](https://bitpay.com) push notification service.

## Description

This package communicates with [BitPay's](https://bitpay.com) push notification service via a REST API.

## Get Started

You can start using bitpay-push-notification-client in any of these ways:

* via [Bower](http://bower.io/): by running `bower install bitpay-push-notification-client` from your console
* or via [NPM](https://www.npmjs.com/package/bitpay-push-notification-client): by running `npm install bitpay-push-notification-client` from your console.

### Installation

```
npm i bitpay-push-notification-client
```

# Global

* * *

## Class: API
ClientAPI constructor.

### API.send(opts, callback) 

Send a push notification.

**Returns**

On error:

- `Object` the status of the push request.

**Parameters**

Parameter | Type | Default | Description
--------- | ---- | ------- | -----------
`opts`     | `Object` | `{}` | An object describing relevant specific options.
`callback` | `Object` | `{}` | Function called when request is complete.

All available option attributes are described below.

Attribute | Type | Default | Description
--------- | ---- | ------- | -----------
`opts.users`   | `array`  | Push to all users | Optional. An array of previously subscribed users.
`opts.android` | `object` | | Attributes specific to push to Android users (see below).
`opts.ios`     | `object` | | Attributes specific to push to iOS users (see below).

- You can send push messages to Android or iOS devices, or both, by using the `android` and `ios` fields with appropriate options. See GCM and APN documentation for available options.

***Android attributes***

Attribute | Type | Default | Description
--------- | ---- | ------- | -----------
`android.data`         | `object` | | Attributes for Android push message.
`android.data.message` | `object` | | Message to Android user.

***iOS attributes***

Attribute | Type | Default | Description
--------- | ---- | ------- | -----------
`ios.badge` | `number` | | The numeric badge for the app icon.
`ios.alert` | `string` | | Message to iOS users.
`ios.sound` | `string` | | The sound to play on notification.

### API.subscribe(opts, callback) 

Subscribes the device to receive push notifications.

**Returns**

On error:

- `Object` the status of the subscribe request.

**Parameters**

Parameter | Type | Default | Description
--------- | ---- | ------- | -----------
`opts`    | `Object` | `{}` | An object describing relevant specific options.
`callback` | `Object` | `{}` | Function called when request is complete.

All available option attributes are described bellow.

Attribute | Type | Default | Description
--------- | ---- | ------- | -----------
`opts.user` | `string` | | A globally unique id used to identify a user (e.g., email address).
`opts.type`   | `string` | | The device type being subscribed, can be either `android` or `ios`.
`opts.token`  | `string` | | The device token (e.g., APNS/GCM registration ID, obtained from a third-party service) to be used for push notification.

### API.unsubscribe(opts, callback)

Unsubscribes the device from receiving push notifications.

**Returns**

On error:

- `Object` the status of the unsubscribe request.

**Parameters**

Parameter | Type | Default | Description
--------- | ---- | ------- | -----------
`opts`    | `Object` | `{}` | An object describing relevant specific options.
`callback` | `Object` | `{}` | Function called when request is complete.

All available option attributes are described bellow.

Attribute | Type | Default | Description
--------- | ---- | ------- | -----------
`opts.token` | `string` | | The device token (e.g., APNS/GCM registration ID, obtained from a third-party service) to be used for push notification.

### API.getUsers(callback)

Retrive a list of users.

**Returns**

On success:

All available option attributes are described below.

Attribute | Type | Default | Description
--------- | ---- | ------- | -----------
`users` | `array` | | Each user is listed, each as a string.

### API.getUserAssociations(opts, callback)

Retrieves the associations for a single user.

**Returns**

On success:

All available option attributes are described below.

Attribute | Type | Default | Description
--------- | ---- | ------- | -----------
`associations` | `array` | | A list of association objects.
`associations.user` | `string` | | The user.
`associations.type` | `string` | | The device type, either `ios` or `android`.
`associations.token` | `string` | | The device token registered for notification.

On error:

- `Object` the status of the request.

**Parameters**

Parameter | Type | Default | Description
--------- | ---- | ------- | -----------
`opts`    | `Object` | `{}` | An object describing relevant specific options.
`callback` | `Object` | `{}` | Function called when request is complete.

All available option attributes are described below.

Attribute | Type | Default | Description
--------- | ---- | ------- | -----------
`opts.user` | `string` | | The user for whom to retrive associations.

* * *

The MIT License

Copyright (c) 2016 BitPay

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
