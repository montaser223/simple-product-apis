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
    algolia: {
        applicationId: process.env.ALGOLIA_APP_ID || 'YourApplicationID',
        apiKey: process.env.ALGOLIA_API_KEY || 'YourAdminAPIKey',
    },
    zoho: {
        dataCenter: process.env.ZOHO_DC || 'sa',
        clientId: process.env.ZOHO_CLIENT_ID || '',
        clientSecret: process.env.ZOHO_CLIENT_SECRET || '',
        soid: process.env.ZOHO_SOID || '',
        scopes: process.env.ZOHO_SCOPES || 'ZohoCRM.modules.ALL,ZohoCRM.settings.ALL',
        endpoints: {
            accountsBase: process.env.ZOHO_ACCOUNTS_BASE || 'https://accounts.zoho.sa',
            crmApiBase: process.env.ZOHO_CRM_API_BASE || 'https://www.zohoapis.sa',
        }
    }
};
