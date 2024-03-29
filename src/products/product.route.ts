import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { create, getOne, remove } from './product.service';
import Response from '../../types/Response';
import {
  ResponseCreateProductDTO,
  ResponseGetOneProductDTO,
} from './product.dto';
import { CreateProductOptions, RemoveProductOptions } from './product.schema';
import logger from '../../utils/logger';

declare module 'fastify' {
  export interface FastifyRequest {
    seller: {
      id: string;
    };
  }
}

interface DeleteProduct {
  domain: string;
  slug: string;
}

export default async function routes(fastify: FastifyInstance) {
  fastify.post(
    '/',
    CreateProductOptions,
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

        return rep.code(200).send(response);
      } catch (error) {
        rep.send(error);
      }
    }
  );

  fastify.delete(
    '/:domain/:slug',
    RemoveProductOptions,
    async (req: FastifyRequest, rep: FastifyReply) => {
      try {
        const { domain, slug } = req.params as DeleteProduct;

        await remove(req.seller.id, domain, slug);

        return rep.code(200).send({
          success: true,
          errors: null,
        });
      } catch (error) {
        rep.send(error);
      }
    }
  );
}
