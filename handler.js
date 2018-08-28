'use strict';

exports.trackTicket = (event, context) => {
  console.log('Event:' + JSON.stringify(event, null, 2));
  context.succeed({
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: { success: true }
    }),
  });
};
