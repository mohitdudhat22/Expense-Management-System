import {createLogger, format, transports} from 'winston';
import {combine, timestamp, printf} from 'winston/lib/winston/utils';

const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        printf(({level, message, timestamp}) => `${timestamp} ${level}: ${message}`)
    ),
    transports: [
        new transports.Console(),
        new transports.File({filename: 'logs/error.log', level: 'error'}),
        new transports.File({filename: 'logs/combined.log'})
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
      format: format.simple(),
    }));
}

export default logger;
