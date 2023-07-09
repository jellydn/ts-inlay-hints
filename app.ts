import fastify from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';

import { counterService } from './counter.service';

const app = fastify({ logger: true });

app.register(fastifySwagger, {
  swagger: {
    info: {
      title: 'Counter API',
      description: 'Counter API Documentation',
      version: '0.1.0'
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here'
    },
    host: 'localhost:3000',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json']
  },
});
await app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false
  },
  staticCSP: true,
  transformSpecificationClone: true
})

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
