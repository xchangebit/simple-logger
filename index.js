'use strict';
var tracer = require('tracer'),
    winston = require('winston')

let defaultConfig = {
    level: 'debug',
    timestamp: function(){
        let d = new Date()
        
        function pad(n){
            return n < 10 ? '0' + n : n
        }

        return `${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}.${pad(d.getMilliseconds())}Z`
    },
    formatter: function(options) {
        return `level:${options.level}\ttime:${options.timestamp()}\tmessage:${options.message ? options.message : ''} ${(options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta).slice(1,-1) : '' )}`;
    },
    console: {
        name: "default-console-log",
        handleExceptions: true,
        colorize: true,
        prettyPrint: true
    }
}


module.exports = function (options = { }){
    let config = Object.assign({}, defaultConfig, options)

    if (global.logger) {
        return global.logger
    }

    let transports = []

    if (config.console) {
        
        config.console.timestamp = config.timestamp

        config.console.formatter = config.formatter

        transports.push(new (winston.transports.Console)(config.console))
    }

    if (config.file) {

        config.file.timestamp = config.timestamp

        config.file.formatter = config.formatter

        transports.push(new winston.transports.File(config.file))
    }   

    //create custom winston Logger
    let appLogger = new (winston.Logger)({
        transports: transports
    })


    let logger = tracer.console({
        level: config.level,
        transport: [
            function (data) {
                let message
                
                switch (data.title) {
                    case 'error':
                        message = `${JSON.stringify(data.args[1]).slice(1,-1)}\tstack-trace:${data.stack}\tfile:${data.file}\tline-number:${data.line}\tcursor:${data.pos}`
                        break
                    case 'warn':
                        message = `${JSON.stringify(data.args[1]).slice(1,-1)}\tfile:${data.file}\tline-number:${data.line}\tcursor:${data.pos}`
                        break
                    default:
                        message = JSON.stringify(data.args[1]).slice(1,-1) || ''
                        break
                }

                appLogger.log(data.title, `${data.args[0]} ${message}`)
            }
        ]
    })
    logger._winston = appLogger
    global.logger = logger

    return global.logger
}