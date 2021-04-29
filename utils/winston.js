require('dotenv').config(); 
const { format, createLogger, transports } = require('winston');
const { timestamp, combine, printf, errors } = format;
const fs = require( 'fs' );
const path = require('path');
const logDir = './logs'; // directory path you want to set

if (!fs.existsSync( logDir ) ) {
    // Create the directory if it does not exist
    fs.mkdirSync( logDir );
}

const myFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp}: ${level}: ${stack || message}`;
});

// logging for server
const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        format.timestamp(),
        myFormat
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
      //
      // - Write all logs with level `error` and below to `error.log`
      // - Write all logs with level `info` and below to `combined.log`
      //
      new transports.File({filename: path.join(logDir, '/error.log'), level: 'error'}),
      new transports.File({filename: path.join(logDir, '/combined.log')}),
    ],
  });
  
  // If we're not in production then log to the `console` with the format:
  // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
  //
  if (process.env.NODE_ENV !== 'production') {
    console.log('development');
    logger.add(new transports.Console({
        format: combine(
            format.colorize(),
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            errors({ stack: true }),
            format.timestamp(),
            myFormat
        )
    }));
  }

module.exports = logger;