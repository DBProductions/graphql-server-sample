const config = require('config');
const fastify = require('fastify');
const jwt = require('jsonwebtoken');
const { graphiqlFastify, graphqlFastify } = require('fastify-graphql');
// eslint-disable-next-line import/no-dynamic-require
const { schema } = require(`${process.cwd()}/src/schema`);

const app = fastify({ logger: { level: 'info' } });

app.addHook('preHandler', (request, reply, next) => {
  let token;
  let response;
  if (request.raw.url === ('/service-worker.js' || '/favicon.ico')) {
    return reply.code(404).send({});
  }
  if (request.headers.authorization && request.headers.authorization.split(' ')[0] === 'Bearer') {
    [, token] = request.headers.authorization.split(' ');
  } else if (request.query && request.query.token) {
    ({ token } = request.query);
  }
  try {
    const decoded = jwt.verify(token, config.get('tokenSecret'));
    if (decoded.id) {
      app.uid = decoded.id;
      request.log.info(`User ${app.uid} is requesting`);
      response = next();
    } else {
      response = reply.code(401).send({
        message: 'Token payload is wrong',
      });
    }
  } catch (err) {
    response = reply.code(401).send({
      message: 'Failed to authenticate token',
    });
  }
  return response;
});

app.register(graphqlFastify, {
  prefix: '/graphql',
  graphql: {
    schema,
    context: app,
  },
});

app.register(graphiqlFastify, {
  prefix: '/graphiql',
  graphiql: {
    endpointURL: '/graphql',
  },
});

app.listen(config.get('service.port'), (err) => {
  if (err) {
    app.log.error(err);
  }
});
