'use strict';
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { characterData } = require('./mockDB');

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(morgan('common'));

app.post('/character', (req, res) => {
  characterData['character'] = characterData.create('mage');
  res.status(201).json(characterData.character);
});

app.get('/character', (req, res) => {
  const charState = characterData.read();
  res.status(200).json(charState);
});

app.put('/character', (req, res) => {
  
  const updated = characterData.update(req.body);
  res.status(200).json(updated);
});

app.delete('/character', (req, res) => {
  characterData.delete();
  res.status(204).json({message: `Character deleted`});
})

let server;

function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app
      .listen(port, () => {
        console.log(`Text-RPG is listening on port ${port}`);
        resolve(server);
      })
      .on("error", err => {
        reject(err);
      })
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };