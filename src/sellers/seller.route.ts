import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ResponseCreateSellerDTO, ResponseLoginSellerDTO } from './seller.dto';
import { create, login } from './seller.service';

export default async function routes(fastify: FastifyInstance) {
  fastify.post(
    '/register',
    ResponseCreateSellerDTO,
    async (req: FastifyRequest, rep: FastifyReply) => {
      try {
        const data = await create(req.body);

        return rep.code(201).send({
          success: true,
          data,
          errors: null,
        });
      } catch (error) {
        rep.send(error);
      }
    }
  );

  fastify.post(
    '/login',
    ResponseLoginSellerDTO,
    async (req: FastifyRequest, rep: FastifyReply) => {
      try {
        const { id } = await login(req.body);

        return rep.code(200).send({
          success: true,
          data: {
            token: fastify.jwt.sign({ id }),
          },
          errors: null,
        });
      } catch (error) {
        rep.send(error);
      }
    }
  );
}
