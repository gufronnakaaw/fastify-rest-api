import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { PrismaClient, Prisma } from '@prisma/client';
import { CreateSellerDTO, ResponseCreateSellerDTO } from './seller.dto';
import { CreateSellerSchema } from './seller.schema';
import { SellerEntity } from './seller.entity';
import { hashpassword } from '../../utils/hashandcheck';

const prisma = new PrismaClient();

export default async function routes(fastify: FastifyInstance) {
  fastify.post(
    '/register',
    ResponseCreateSellerDTO,
    async (req: FastifyRequest, rep: FastifyReply) => {
      try {
        const result: CreateSellerDTO = CreateSellerSchema.parse(req.body);

        // convert to entity
        const create: SellerEntity = {
          domain: result.domain,
          name: result.name,
          email: result.email,
          phone: result.phone,
          description: result.description,
          password: await hashpassword(result.password),
        };

        // do create
        await prisma.seller.create({
          data: create,
        });

        return rep.code(201).send(result);
      } catch (error) {
        if (error instanceof ZodError) {
          return rep.code(400).send({ error: error.issues });
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          return rep.code(500).send({
            error: {
              code: error.code,
              message: error.message,
            },
          });
        }

        return rep.code(500).send({ error });
      }
    }
  );
}
