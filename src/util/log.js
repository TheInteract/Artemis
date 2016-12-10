const winston = require('winston')
const config = require('config')

const getLogConfig = () => {
    const options = {
        level: 'debug',
        colorize: true,
    }

    if (config.util.getEnv('NODE_ENV') === 'testing') {
        options.level = 'error'
    }

    return options
}

winston.remove(winston.transports.Console)
winston.add(winston.transports.Console, getLogConfig())
// TODO: streaming log file or store log to database.
