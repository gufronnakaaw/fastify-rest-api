import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import ResponseError from '../../errors/ResponseError';
import { create } from './product.service';
import Response from '../../types/Response';
import { ResponseCreateProductDTO } from './product.dto';

declare module 'fastify' {
  export interface FastifyRequest {
    seller: {
      id: string;
    };
  }
}

export default async function routes(fastify: FastifyInstance) {
  fastify.addHook(
    'preHandler',
    async (req: FastifyRequest, rep: FastifyReply, done) => {
      try {
        const { id }: { id: string } = await req.jwtVerify();

        req.seller = {
          id,
        };

        done();
      } catch (error) {
        throw new ResponseError(401, 'Unauthorized');
      }
    }
  );

  fastify.post('/', async (req: FastifyRequest, rep: FastifyReply) => {
    try {
      const data = await create(req.seller.id, req.body);

      const response: Response<ResponseCreateProductDTO> = {
        success: true,
        data,
        errors: null,
      };

      return rep.code(201).send(response);
    } catch (error) {
      rep.send(error);
    }
  });
}
