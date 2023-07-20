import { RouteShorthandOptions } from 'fastify';

export const ResponseCreateProductSchema: RouteShorthandOptions = {
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
              name: { type: 'string' },
              slug: { type: 'string' },
              description: { type: 'string' },
              stock: { type: 'number' },
              price: { type: 'number' },
              seller_id: { type: 'string' },
            },
          },
          errors: { type: 'null' },
        },
      },
    },
  },
};
