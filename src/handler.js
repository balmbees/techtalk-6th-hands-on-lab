'use strict';

const fs = require('fs');
const path = require('path');

let cachedHTML = '';

exports.collect = (event, context, callback) => {
  callback(null, {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: { success: true },
    }),
  });
};

exports.index = (event, context, callback) => {
  callback(null, {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html; charset=UTF-8',
    },
    body: fs.readFileSync(path.join(__dirname, 'index.html'), { encoding: 'utf8' }),
  });
};
