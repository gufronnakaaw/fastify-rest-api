import { RouteShorthandOptions } from 'fastify';

export const CreateSellerOptions: RouteShorthandOptions = {
  schema: {
    response: {
      201: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              domain: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
              phone: { type: 'string', nullable: true },
              description: { type: 'string', nullable: true },
            },
          },
          errors: { type: 'null' },
        },
      },
    },
  },
};

export const LoginSellerOptions: RouteShorthandOptions = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              token: { type: 'string' },
            },
          },
          errors: { type: 'null' },
        },
      },
    },
  },
};
