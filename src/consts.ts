

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
};
