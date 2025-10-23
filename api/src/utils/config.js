'use strict';

const yargs = require('yargs');
const dotenv = require('dotenv');
const assert = require('assert');

const env = !yargs.argv.env ? 'dev' : yargs.argv.env;
dotenv.config({ path: `.env.${env}` });

console.log(`The app is running on ${env.toUpperCase()} environment`);

const { PORT, ODBC_CONNECTION_STRING, TABLE } = process.env;

assert(PORT, 'PORT is required');

module.exports = {
  port: PORT,
  db: ODBC_CONNECTION_STRING,
  file: TABLE,
};
