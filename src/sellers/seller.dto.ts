import { RouteShorthandOptions } from 'fastify';
import { CreateSellerSchemaType } from './seller.schema';

export type CreateSellerDTO = { id: string } & Omit<
  CreateSellerSchemaType,
  'password'
>;

export const ResponseCreateSellerDTO: RouteShorthandOptions = {
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

export type LoginSellerDTO = {
  id: string;
};

export const ResponseLoginSellerDTO: RouteShorthandOptions = {
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
