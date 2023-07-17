import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ResponseCreateSellerDTO } from './seller.dto';
import { create } from './seller.service';

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
}
