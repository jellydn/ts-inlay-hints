import fastify from 'fastify';
import { counterService } from './counter.service';

const app = fastify({ logger: true });

// Register your service
counterService(app);

// Start the server
const start = async () => {
  try {
    await app.listen({ port: 3000 })
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
