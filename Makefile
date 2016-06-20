.PHONY: cover

BIN_PATH:=node_modules/.bin/

all:	bitpay-push-notification-client.min.js

clean:
	rm bitpay-push-notification-client.js
	rm bitpay-push-notification-client.min.js

bitpay-push-notification-client.js: index.js lib/*.js
	${BIN_PATH}browserify $< > $@

bitpay-push-notification-client.min.js: bitpay-push-notification-client.js
	uglify  -s $<  -o $@

cover:
	./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha -- --reporter spec test
