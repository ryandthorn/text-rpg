'use strict';
const express = require('express');
const morgan = require('morgan');

const { characterData, storyData } = require('./mockDB');

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(morgan('common'));

// Character routes
app.post('/character/:new', (req, res) => {
  characterData['character'] = characterData.create(req.query.class);
  res.status(201).json(characterData.character);
});

app.get('/character', (req, res) => {
  const charState = characterData.read();
  res.status(200).json(charState);
});

app.put('/character/:update', (req, res) => {
  const updated = characterData.update({hp: req.query.hp, mp: req.query.mp});
  res.status(200).json(updated);
});

app.delete('/character', (req, res) => {
  characterData.delete();
  res.status(204).json({message: `Character deleted`});
})

// Story routes
app.get('/story', (req, res) => {
  res.status(200).json(storyData.bookmark);
});

app.post('/story', (req, res) => {
  storyData.begin();
  res.status(200).json(storyData.bookmark);
})

app.put('/story', (req, res) => {
  storyData.bookmark.next();
  res.status(200).json(storyData.bookmark);
});

app.put('/story/:choice', (req, res) => {
  storyData.bookmark.next(req.query.choice);
  res.status(200).json(storyData.bookmark);
});

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