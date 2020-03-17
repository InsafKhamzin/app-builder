const { createLogger, format, transports } = require('winston');
const { combine, colorize, timestamp, align, printf } = format;

const logFormat = combine(
    colorize(),
    timestamp(),
    align(),
    printf(info => `${info.timestamp} ${info.level} ${info.message}`)
);

const logger = createLogger({
    format: logFormat,
    //logs delivery: console, file, etc.
    transports: [
        new transports.Console()
    ]
});
module.exports = logger;