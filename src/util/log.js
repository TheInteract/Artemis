const winston = require('winston')

const logConfig = {
    level: 'debug',
    colorize: true,
}

winston.remove(winston.transports.Console)
winston.add(winston.transports.Console, logConfig)
