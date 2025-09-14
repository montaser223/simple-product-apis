

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    NO_CONTENT: 204,
};


export const ERROR_CODES = {
    VALIDATION_ERROR: {
        code: 'VALIDATION_ERROR',
        message: 'One or more validation errors occurred.',
        statusCode: HTTP_STATUS.BAD_REQUEST,
    },
    NOT_FOUND: {
        code: 'NOT_FOUND',
        message: 'Resource not found.',
        statusCode: HTTP_STATUS.NOT_FOUND,
    },
    INTERNAL_SERVER_ERROR: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected internal server error occurred.',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    },
    UNAUTHORIZED: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required or invalid credentials.',
        statusCode: HTTP_STATUS.UNAUTHORIZED,
    },
    FORBIDDEN: {
        code: 'FORBIDDEN',
        message: 'Access to this resource is forbidden.',
        statusCode: HTTP_STATUS.FORBIDDEN,
    },
    // Add more specific errors as needed
    PRODUCT_NOT_FOUND: {
        code: 'PRODUCT_NOT_FOUND',
        message: 'Product with the specified ID not found.',
        statusCode: HTTP_STATUS.NOT_FOUND,
    },
    ORDER_NOT_FOUND: {
        code: 'ORDER_NOT_FOUND',
        message: 'Order with the specified ID not found.',
        statusCode: HTTP_STATUS.NOT_FOUND,
    },
    AlgoliaError: {
        code: 'ALGOLIA_ERROR',
        message: 'An error occurred while interacting with Algolia service.',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    },
    DUPLICATE_DATA: {
        code: 'DUPLICATE_DATA',
        message: 'Duplicate data error.',
        statusCode: HTTP_STATUS.BAD_REQUEST,
    },
    INVALID_MODULE: {
        code: 'INVALID_MODULE',
        message: 'The specified module is invalid.',
        statusCode: HTTP_STATUS.BAD_REQUEST,
    },
    TOKEN_BOUND_DATA_MISMATCH: {
        code: 'TOKEN_BOUND_DATA_MISMATCH',
        message: 'The page_token given seems to be invalid or input param is added, altered, or deleted',
        statusCode: HTTP_STATUS.UNAUTHORIZED,
    },
    INVALID_DATA: {
        code: 'INVALID_DATA',
        message: 'The provided data is invalid or malformed.',
        statusCode: HTTP_STATUS.BAD_REQUEST,
    },
    REQUIRED_PARAM_MISSING: {
        code: 'REQUIRED_PARAM_MISSING',
        message: 'A required parameter is missing.',
        statusCode: HTTP_STATUS.BAD_REQUEST,
    },
    LIMIT_EXCEEDED: {
        code: 'LIMIT_EXCEEDED',
        message: 'Fields limit exceeded.',
        statusCode: HTTP_STATUS.BAD_REQUEST,
    },
    EXPIRED_VALUE: {
        code: 'EXPIRED_VALUE',
        message: 'The value provided has expired.',
        statusCode: HTTP_STATUS.BAD_REQUEST,
    },
    DISCRETE_PAGINATION_LIMIT_EXCEEDED: {
        code: 'DISCRETE_PAGINATION_LIMIT_EXCEEDED',
        message: 'You can only get the first 2000 records without using page_token param.',
        statusCode: HTTP_STATUS.BAD_REQUEST,
    },
    AMBIGUITY_DURING_PROCESSING: {
        code: 'AMBIGUITY_DURING_PROCESSING',
        message: 'You cannot use both cvid and sort_by, and page and page_token.',
        statusCode: HTTP_STATUS.BAD_REQUEST,
    },
    PAGINATION_LIMIT_EXCEEDED: {
        code: 'PAGINATION_LIMIT_EXCEEDED',
        message: 'You can only get up to first 100000 records using page_token param.',
        statusCode: HTTP_STATUS.BAD_REQUEST,
    },
    NO_PERMISSION: {
        code: 'NO_PERMISSION',
        message: 'You do not have permission to access this module or perform this action.',
        statusCode: HTTP_STATUS.FORBIDDEN,
    },
    NOT_SUPPORTED: {
        code: 'NOT_SUPPORTED',
        message: 'This API is supported only for admin users.',
        statusCode: HTTP_STATUS.FORBIDDEN,
    },
};
