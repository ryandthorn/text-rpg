'use strict';
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);

const { PORT, DATABASE_URL } = require('./config');
const jwtAuth = passport.authenticate('jwt', { session: false });

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(morgan('common'));

const characterRouter = require('./characterRouter');
const storyRouter = require('./storyRouter');
const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');
app.use('/character', jwtAuth, characterRouter);
app.use('/story', jwtAuth, storyRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);

passport.use(localStrategy);
passport.use(jwtStrategy);

let server;

function runServer(databaseUrl, port = PORT) {
  
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, { useNewUrlParser: true }, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect()
    .then(() => {
      return new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };