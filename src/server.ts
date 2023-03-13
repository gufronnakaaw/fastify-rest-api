import fastify, {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
} from 'fastify';

import cors from '@fastify/cors';
import dotenv from 'dotenv';

dotenv.config();

const port = Number(process.env.port);

const server: FastifyInstance = fastify();

server.register(cors, {
  origin: '*',
});

server.get('/', (req: FastifyRequest, rep: FastifyReply) => {
  return rep.code(200).send({
    message: 'Welcome to Fastify REST API',
  });
});

const start = async () => {
  try {
    await server.listen({ port });
    console.log(`server is running at http://localhost:${port}`);
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
};

start();
