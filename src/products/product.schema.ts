import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import ResponseError from '../../errors/ResponseError';

export const CreateProductOptions: RouteShorthandOptions = {
  onRequest: async (req: FastifyRequest, rep: FastifyReply) => {
    try {
      const { id }: { id: string } = await req.jwtVerify();

      req.seller = {
        id,
      };
    } catch (error) {
      throw new ResponseError(401, 'Unauthorized');
    }
  },
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
