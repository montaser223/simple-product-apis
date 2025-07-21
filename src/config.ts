export const config = {
    port: process.env.PORT || 3000,
    database: {
        storage: process.env.DATABASE_STORAGE || './database.sqlite',
        logging: process.env.DATABASE_LOGGING === "true", // Convert string to boolean
        forceSync: process.env.DATABASE_FORCE_SYNC === 'true', // Convert string to boolean
    },
    environment: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'info',
    log4js: {
        appenders: {
            out: { type: 'stdout', layout: { type: 'json'} },
        },
        categories: {
            default: { appenders: ['out'], level: process.env.LOG_LEVEL || 'debug' },
        },
    },
};
