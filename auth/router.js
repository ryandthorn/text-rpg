'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');

const jwt = require('jsonwebtoken');

const config = require('../config');
const router = express.Router();

const {User} = require('../users/models');

const createAuthToken = function(user) {
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

const localAuth = passport.authenticate('local', {session: false});
router.use(bodyParser.json());

// The user provides a username and password to login
router.post('/login', localAuth, (req, res) => {
  const authToken = createAuthToken(req.user.serialize());
  res.status(200).json({authToken});
});

const jwtAuth = passport.authenticate('jwt', {session: false});

// The user exchanges a valid JWT for a new one 
// with updated info and a later expiration
router.post('/refresh', jwtAuth, (req, res) => {
  User
    .findOne({username: req.user.username})
    .then(user => {
      const authToken = createAuthToken(user.serialize());
      res.status(200).json({authToken});
    })
    .catch(err => {
      console.error(err);
      res.status(500).send({message: 'Internal server error'});
    });
});

module.exports = {router};