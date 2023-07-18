import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import {
  ResponseCreateSellerSchema,
  ResponseLoginSellerSchema,
} from './seller.schema';
import { create, login } from './seller.service';
import Response from '../../types/Response';
import { ResponseCreateSellerDTO, ResponseLoginSellerDTO } from './seller.dto';

export default async function routes(fastify: FastifyInstance) {
  fastify.post(
    '/register',
    ResponseCreateSellerSchema,
    async (req: FastifyRequest, rep: FastifyReply) => {
      try {
        const data = await create(req.body);

        const result: Response<ResponseCreateSellerDTO> = {
          success: true,
          data,
          errors: null,
        };

        return rep.code(201).send(result);
      } catch (error) {
        rep.send(error);
      }
    }
  );

  fastify.post(
    '/login',
    ResponseLoginSellerSchema,
    async (req: FastifyRequest, rep: FastifyReply) => {
      try {
        const { id } = await login(req.body);

        const result: Response<ResponseLoginSellerDTO> = {
          success: true,
          data: {
            token: fastify.jwt.sign({ id }),
          },
          errors: null,
        };

        return rep.code(200).send(result);
      } catch (error) {
        rep.send(error);
      }
    }
  );
}
