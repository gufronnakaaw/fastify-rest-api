import { z } from 'zod';
import { RouteShorthandOptions } from 'fastify';
import { CreateSellerSchema } from './seller.schema';

export type CreateSellerDTO = z.infer<typeof CreateSellerSchema>;

export const ResponseCreateSellerDTO: RouteShorthandOptions = {
  schema: {
    response: {
      201: {
        type: 'object',
        properties: {
          domain: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string', nullable: true },
          description: { type: 'string', nullable: true },
        },
      },
    },
  },
};
