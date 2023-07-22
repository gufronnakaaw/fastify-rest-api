import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  HookHandlerDoneFunction,
} from 'fastify';
import ResponseError from '../../errors/ResponseError';
import { create, getOne } from './product.service';
import Response from '../../types/Response';
import {
  ResponseCreateProductDTO,
  ResponseGetOneProductDTO,
} from './product.dto';
import { ResponseCreateProductSchema } from './product.schema';

declare module 'fastify' {
  export interface FastifyRequest {
    seller: {
      id: string;
    };
  }
}

async function preHandler(
  req: FastifyRequest,
  rep: FastifyReply,
  done: HookHandlerDoneFunction
) {
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

export default async function routes(fastify: FastifyInstance) {
  fastify.post(
    '/',
    {
      preHandler,
      schema: ResponseCreateProductSchema.schema,
    },
    async (req: FastifyRequest, rep: FastifyReply) => {
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
    }
  );

  fastify.get(
    '/:domain/:slug',
    async (
      req: FastifyRequest<{
        Params: {
          domain: string;
          slug: string;
        };
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = await getOne(req.params.domain, req.params.slug);

        const response: Response<ResponseGetOneProductDTO> = {
          success: true,
          data,
          errors: null,
        };

        return rep.code(201).send(response);
      } catch (error) {
        rep.send(error);
      }
    }
  );
}
