import * as log4js from 'log4js';
import { config } from '@/config';
import { ILogger, ILogEntry } from '@/interfaces/ILogger';
import { injectable } from 'inversify';

// Configure log4js with the custom JSON layout
log4js.addLayout("json", function (_layoutConfig) {
    return function (logEvent) {
        const { message, module, action, output, ...rest } = logEvent.data[0];
        const logObject: ILogEntry = {
            timestamp: logEvent.startTime.toISOString(),
            level: logEvent.level.levelStr,
            message,
            module,
            action,
            output,
            ...rest,
        };
        return JSON.stringify(logObject);
    };
});

// Apply the log4js configuration from the config file
log4js.configure(config.log4js);

@injectable()
export class Logger implements ILogger {
    private readonly log4jsLogger: log4js.Logger;

    constructor() {
        this.log4jsLogger = log4js.getLogger();
    }

    debug(entry: ILogEntry): void {
        this.log4jsLogger.debug(entry);
    }

    info(entry: ILogEntry): void {
        this.log4jsLogger.info(entry);
    }

    warn(entry: ILogEntry): void {
        this.log4jsLogger.warn(entry);
    }

    error(entry: ILogEntry): void {
        this.log4jsLogger.error(entry);
    }
}
