'use strict';

const debug = require('debug')('node-angular');
const http = require('http');
const app = require('./src/app');
const terminate = require('./src/terminate');

const newVar = 'This is a new variable';

const anotherVar = 'This is another variable';

const normalizePort = (val) => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? 'pipe ' + port : 'port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = async () => {
  const addr = server.address();

  const bind = typeof addr === 'string' ? 'pipe ' + port : 'port ' + port;

  console.log('Listening on ' + bind);
  debug('Listening on ' + bind);
};

const port = normalizePort(process.env.PORT || process.env.DEV_PORT);
app.set('port', port);

const server = http.createServer(app);

const exitHandler = terminate(server, {
  coredump: false,
  timeout: 500,
});

process.on('uncaughtException', exitHandler(1, 'Unexpected Error'));
process.on('unhandledRejection', exitHandler(1, 'Unhandled Promise'));
process.on('SIGTERM', exitHandler(0, 'SIGTERM'));
process.on('SIGINT', exitHandler(0, 'SIGINT'));
server.on('error', onError);
server.on('listening', onListening);
server.listen(port);
