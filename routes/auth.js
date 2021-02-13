const jwt = require('express-jwt');
const config = require('config');

const getTokenFromHeaders = (req) => {
  const { headers: { authorization } } = req;

  if(authorization && authorization.split(' ')[0] === 'Bearer') {
    return authorization.split(' ')[1];
  }

  return null;
};

const auth = {
  required: jwt({
    algorithms: ['HS256'],
    secret: config.jwt.secret,
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
  }),
  optional: jwt({
    algorithms: ['HS256'],
    secret: config.jwt.secret,
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
  }),
};

module.exports = auth;