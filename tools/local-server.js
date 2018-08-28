'use strict';

const debug = require('debug');
const getPort = require('get-port');
const opn = require('opn');
const URL = require('url');

const micro = require('micro');

const LOG_TAG = "server";
const log = debug(LOG_TAG);
log.enabled = true;

const handlers = require('../src/handler');

const server = micro((req, res) => {
  log(`${req.method} ${req.url}`);

  const url = URL.parse(req.url, true);
  return micro.text(req)
    .then((body) => {
      const handler = url.pathname === "/events" ? handlers.collect : handlers.index;

      return new Promise((resolve, reject) => {
        handler({
          resource: "Lambda Simulator",
          path: url.pathname,
          httpMethod: req.method,
          headers: req.headers,
          queryStringParameters: url.query,
          requestContext: {
            resourceId: "request-random-id",
          },
          body,
        }, {
          functionName: "some name",
          functionVersion: "v1.0",
          invokedFunctionArn: "arn",
          memoryLimitInMB: 1024,
          awsRequestId: "random id",
          logGroupName: "log group",
          logStreamName: "log stream",
          succeed: (res) => {
            resolve(res);
          },
          fail: (e) => {
            reject(e);
          },
          done: (e, res) => {
            if (e) { return reject(e); }

            resolve(res);
          },
          getRemainingTimeInMillis: () => options.timeout || 30 * 1000,
        }, (e, res) => {
          if (e) { return reject(e); }

          resolve(res);
        });
      });
    })
    .then((response) => {
      // set headers if specified
      const headers = transformResponseHeaders(response.headers || {});
      Object.keys(headers).forEach((fieldName) => {
        const value = headers[fieldName];

        res.setHeader(fieldName, value);
      });

      return micro.send(res, response.statusCode, response.body);
    });
});

getPort()
.then((AVAILABLE_PORT) => new Promise((resolve) => server.listen(AVAILABLE_PORT, () => resolve(AVAILABLE_PORT))))
.then((LISTENING_PORT) => opn(`http://www.lvh.me:${LISTENING_PORT}`));


function transformResponseHeaders(headers) {
  return Object.keys(headers)
    .reduce((hash, fieldName) => {
      const groupKey = fieldName.toLowerCase();
      const value = headers[fieldName];

      if (!hash[groupKey]) {
        hash[groupKey] = value;

        return hash;
      }

      if (typeof hash[groupKey] === "string") {
        const oldValue = hash[groupKey];

        hash[groupKey] = [ oldValue, value ];
        return hash;
      }

      if (hash[groupKey] instanceof Array) {
        const oldValue = hash[groupKey];
        oldValue.push(value);

        return hash;
      }

      return hash;
    }, {});
}
