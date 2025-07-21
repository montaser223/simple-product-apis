export interface ILogEntry {
    message: string;
    module: string;
    action: string;
    output: object;
    [key: string]: any; // Allow for additional context properties
}

export interface ILogger {
    debug(entry: ILogEntry): void;
    info(entry: ILogEntry): void;
    warn(entry: ILogEntry): void;
    error(entry: ILogEntry): void;
}
