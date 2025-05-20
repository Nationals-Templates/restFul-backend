const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Parking Management System API',
      version: '1.0.0',
      description: 'API for managing vehicle parking slots',
    },
    servers: [{ url: 'http://localhost:5000/' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        BookingInput: {
          type: 'object',
          required: ['plateNumber', 'slotId'],
          properties: {
            plateNumber: {
              type: 'string',
              example: 'ABC123',
            },
            slotId: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
          },
        },
        Booking: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            plateNumber: {
              type: 'string',
              example: 'ABC123',
            },
            slotId: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            status: {
              type: 'string',
              enum: ['active', 'completed', 'cancelled'],
              example: 'active',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-05-01T10:00:00Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-05-01T10:00:00Z',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            username: {
              type: 'string',
              example: 'johndoe',
            },
            email: {
              type: 'string',
              example: 'johndoe@example.com',
            },
            role: {
              type: 'string',
              example: 'user',
            },
          },
        },
        Payment: {                       // <-- Added Payment schema here
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            bookingId: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            amount: {
              type: 'number',
              format: 'float',
              example: 12.5,
            },
            paidAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-05-01T10:00:00Z',
            },
            method: {
              type: 'string',
              example: 'credit_card',
            },
            status: {
              type: 'string',
              enum: ['pending', 'paid', 'failed'],
              example: 'paid',
            },
          },
          required: ['id', 'bookingId', 'amount', 'paidAt', 'status'],
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js', './controllers/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
