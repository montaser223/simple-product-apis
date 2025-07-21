import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Products API',
      version: '1.0.0',
      description: 'A simple Express API for managing products and orders.',
    },
    servers: [
      {
        url: 'http://localhost:3000/', // Adjust this based on your API base path
        description: 'Development server',
      },
    ],
    paths: {
      '/products': {
        get: {
          summary: 'Retrieve a list of products',
          tags: ['Products'],
          parameters: [
            {
              in: 'query',
              name: 'page',
              schema: {
                type: 'integer',
                default: 1,
              },
              description: 'Page number for pagination',
            },
            {
              in: 'query',
              name: 'limit',
              schema: {
                type: 'integer',
                default: 10,
              },
              description: 'Number of items per page',
            },
          ],
          responses: {
            200: {
              description: 'A list of products.',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Product',
                    },
                  },
                },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        post: {
          summary: 'Create a new product',
          tags: ['Products'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Product',
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Product created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Product',
                  },
                },
              },
            },
            400: {
              description: 'Invalid input',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/products/{id}': {
        get: {
          summary: 'Retrieve a single product by ID',
          tags: ['Products'],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: {
                type: 'integer',
              },
              description: 'ID of the product to retrieve',
            },
          ],
          responses: {
            200: {
              description: 'Product retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Product',
                  },
                },
              },
            },
            404: {
              description: 'Product not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        put: {
          summary: 'Update an existing product',
          tags: ['Products'],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: {
                type: 'integer',
              },
              description: 'ID of the product to update',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Product',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Product updated successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Product',
                  },
                },
              },
            },
            400: {
              description: 'Invalid input',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Product not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        delete: {
          summary: 'Delete a product by ID',
          tags: ['Products'],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: {
                type: 'integer',
              },
              description: 'ID of the product to delete',
            },
          ],
          responses: {
            204: {
              description: 'Product deleted successfully',
            },
            404: {
              description: 'Product not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/orders': {
        post: {
          summary: 'Create a new order',
          tags: ['Orders'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Order',
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Order created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/OrderResponse',
                  },
                },
              },
            },
            400: {
              description: 'Invalid input',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/orders/{userId}': {
        get: {
          summary: 'Retrieve orders by user ID',
          tags: ['Orders'],
          parameters: [
            {
              in: 'path',
              name: 'userId',
              required: true,
              schema: {
                type: 'integer',
              },
              description: 'ID of the user to retrieve orders for',
            },
          ],
          responses: {
            200: {
              description: 'A list of orders for the specified user.',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/OrderResponse',
                    },
                  },
                },
              },
            },
            404: {
              description: 'User not found or no orders for this user',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/orders/details/{orderId}': {
        get: {
          summary: 'Retrieve a single order by ID',
          tags: ['Orders'],
          parameters: [
            {
              in: 'path',
              name: 'orderId',
              required: true,
              schema: {
                type: 'integer',
              },
              description: 'ID of the order to retrieve',
            },
          ],
          responses: {
            200: {
              description: 'Order retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/OrderResponse',
                  },
                },
              },
            },
            404: {
              description: 'Order not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/orders/status/{orderId}': {
        put: {
          summary: 'Update the status of an order',
          tags: ['Orders'],
          parameters: [
            {
              in: 'path',
              name: 'orderId',
              required: true,
              schema: {
                type: 'integer',
              },
              description: 'ID of the order to update',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      description: 'New status of the order',
                    },
                  },
                  required: ['status'],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Order status updated successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/OrderResponse',
                  },
                },
              },
            },
            400: {
              description: 'Invalid input',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Order not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/orders/{orderId}': {
        put: {
          summary: 'Update an existing order',
          tags: ['Orders'],
          parameters: [
            {
              in: 'path',
              name: 'orderId',
              required: true,
              schema: {
                type: 'integer',
              },
              description: 'ID of the order to update',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    quantity: {
                      type: 'integer',
                      description: 'New quantity of the product in the order',
                    },
                  },
                  required: ['quantity'],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Order updated successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/OrderResponse',
                  },
                },
              },
            },
            400: {
              description: 'Invalid input',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            404: {
              description: 'Order not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        delete: {
          summary: 'Delete an order by ID',
          tags: ['Orders'],
          parameters: [
            {
              in: 'path',
              name: 'orderId',
              required: true,
              schema: {
                type: 'integer',
              },
              description: 'ID of the order to delete',
            },
          ],
          responses: {
            204: {
              description: 'Order deleted successfully',
            },
            404: {
              description: 'Order not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Products',
        description: 'Product management and retrieval',
      },
      {
        name: 'Orders',
        description: 'Order management and retrieval',
      },
    ],
    components: {
      schemas: {
        Product: {
          type: 'object',
          required: ['name', 'description', 'price', 'stock'],
          properties: {
            name: {
              type: 'string',
              description: 'The name of the product',
            },
            description: {
              type: 'string',
              description: 'The description of the product',
            },
            price: {
              type: 'number',
              format: 'float',
              description: 'The price of the product',
            },
            stock: {
              type: 'integer',
              description: 'The stock quantity of the product',
            }
          },
          example: {
            name: 'Laptop',
            description: 'Powerful laptop for gaming and work',
            price: 1200.00,
            stock: 50
          },
        },
        Order: {
          type: 'object',
          required: ['userId', 'productId', 'quantity'],
          properties: {
            userId: {
              type: 'integer',
              description: 'The ID of the user who placed the order',
            },
            productId: {
              type: 'integer',
              description: 'The ID of the product ordered',
            },
            quantity: {
              type: 'integer',
              description: 'The quantity of the product ordered',
            }
          },
          example: {
            userId: 1,
            productId: 1,
            quantity: 2
          },
        },
        OrderResponse: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'The auto-generated ID of the order',
            },
            userId: {
              type: 'integer',
              description: 'The ID of the user who placed the order',
            },
            productId: {
              type: 'integer',
              description: 'The ID of the product ordered',
            },
            quantity: {
              type: 'integer',
              description: 'The quantity of the product ordered',
            },
            totalPrice: {
              type: 'number',
              format: 'float',
              description: 'The total price of the order',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date and time the order was created',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date and time the order was last updated',
            },
          },
          example: {
            id: 1,
            userId: 1,
            productId: 1,
            quantity: 2,
            totalPrice: 2400.00,
            createdAt: '2023-01-01T12:00:00Z',
            updatedAt: '2023-01-01T12:00:00Z',
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
            },
            statusCode: {
              type: 'integer',
              description: 'HTTP status code',
            },
          },
          example: {
            message: 'Resource not found',
            statusCode: 404,
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis:[]
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
