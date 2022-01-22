'use strict';

const HELPER_BASE = process.env.HELPER_BASE || process.env.DEFAULT_HELPER_BASE;
const Response = require(HELPER_BASE + 'response');

exports.handler = async (event, context, callback) => {
  console.log('Hello World');
};
