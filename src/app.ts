import 'dotenv/config';
import build from '../utils/server';

const port: number = Number(process.env.port);

async function app() {
  const server = build();

  try {
    await server.listen({ port });
    console.log(`server is running at http://localhost:${port}`);
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
}

app();
