import 'dotenv/config';
import build from '../utils/server';
import prisma from '../utils/database';
import logger from '../utils/logger';

const port: number = Number(process.env.port);

async function app() {
  const server = build();

  try {
    await prisma.$connect();
    await server.listen({ port });
    logger.info(`server is running at http://localhost:${port}`);
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
}

app();
