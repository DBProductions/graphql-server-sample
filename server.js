const PORT = 3000;
const restify = require('restify');
const jwt = require('jsonwebtoken');
const { graphqlRestify, graphiqlRestify } = require('graphql-server-restify');
const { schema } = require('./schema');

const tokenSecret = '1234567890';

const server = restify.createServer({
  name: 'graphqlapi',
  version: '1.0.0',
});

server.use(restify.plugins.queryParser({ mapParams: true }));
server.use(restify.plugins.bodyParser({ mapParams: true }));

const graphQLOptions = {
  schema,
  debug: true,
};

server.use((req, res, next) => {
  let token = null;
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    [, token] = req.headers.authorization.split(' ');
  } else if (req.query && req.query.token) {
    ({ token } = req.query);
  }
  jwt.verify(token, tokenSecret, (err, decoded) => {
    if (err) {
      res.status(401);
      return res.send({
        message: 'Failed to authenticate token',
      });
    }
    if (!decoded.id) {
      res.status(401);
      return res.send({
        message: 'Token payload is wrong',
      });
    }
    req.tokenId = decoded.id;
    return next();
  });
});

server.post('/graphql', graphqlRestify((req) => {
  graphQLOptions.context = { req };
  return graphQLOptions;
}));

server.get('/graphql', graphqlRestify((req) => {
  graphQLOptions.context = { req };
  return graphQLOptions;
}));

server.get('/graphiql', graphiqlRestify({ endpointURL: '/graphql' }));

server.listen(PORT, () => {});
