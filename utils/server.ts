import fastify, {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
} from 'fastify';
import cors from '@fastify/cors';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import fastifyJwt from '@fastify/jwt';
import SellerRoutes from '../src/sellers/seller.route';
import ProductRoutes from '../src/products/product.route';
import ResponseError from '../errors/ResponseError';

function build() {
  const server: FastifyInstance = fastify();
  const secret: string = String(process.env.secretkey);

  server.register(cors, {
    origin: '*',
  });

  server.register(fastifyJwt, {
    secret,
    sign: {
      expiresIn: '1h',
    },
  });

  server.get('/', (req: FastifyRequest, rep: FastifyReply) => {
    return rep.code(200).send({
      message: 'Welcome to Fastify REST API',
    });
  });

  server.register(SellerRoutes, { prefix: 'sellers' });
  server.register(ProductRoutes, { prefix: 'products' });

  server.setErrorHandler((error, req, rep) => {
    if (error instanceof ResponseError) {
      return rep.code(error.code).send({
        success: false,
        errors: error.message,
      });
    }

    if (error instanceof ZodError) {
      const errors = error.issues.map((element) => {
        return {
          field: element.path[0],
          message: element.message,
        };
      });

      return rep.code(400).send({
        success: false,
        errors,
      });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return rep.code(500).send({
        success: false,
        errors: {
          code: error.code,
          message: error.message,
        },
      });
    }

    return rep.code(500).send({
      success: false,
      errors: error,
    });
  });

  return server;
}

export default build;
