'use strict';
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL, TEST_DATABASE_URL} = require('./config');
const { Character, Adventure, Enemy } = require('./models');
// const { characterData, storyData } = require('./mockDB');

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(morgan('common'));

// Character routes
app.post('/character/:new', (req, res) => {
  // characterData['character'] = characterData.create(req.query.class);
  // res.status(201).json(characterData.character);
  const newCharacter = {};
  if (req.query.class === 'mage') {
    newCharacter.class = 'Mage';
    newCharacter.attributes = {
      hp: 10,
      mp: 18,
      maxHP: 10,
      maxMP: 18,
      str: 6,
      agi: 10,
      mag: 12,
      con: 8
    };
    newCharacter.skills = {
      phyDamage: -1,
      phyResist: -1,
      accuracy: 1,
      evasion: 1,
      magDamage: 2,
      magResist: 2,
      fortitude: 0,
      damReduce: 0
    };
    newCharacter.actions = {
      attack: {
        info: `Physical attack for 1d6 damage`,
        rollDam: () => getRandomIntInclusive(1, 6),
        rollHit: () => getRandomIntInclusive(1, 20)
      },
      defend: {
        info: `Take a defensive stance. +5 defense bonus vs enemy to-hit roll.`,
        rollDam: () => getRandomIntInclusive(1, 4),
        defendBonus: 0
      },
      spells: {
        missile: {
          info: `Shoot a bolt of kinetic energy at your opponent. ` +
                `1d8 + 4 damage, -2 MP`,
          rollDam: () => getRandomIntInclusive(1, 8) + 4
        }
      }
    };
  } else if (req.query.class === 'thief') {
    newCharacter.class = 'Thief',
    newCharacter.attributes = {
      hp: 14,
      mp: 10,
      maxHP: 14,
      maxMP: 10,
      str: 8,
      agi: 12,
      mag: 8,
      con: 10
    };
    newCharacter.skills = {
      phyDamage: 0,
      phyResist: 0,
      accuracy: 2,
      evasion: 2,
      magDamage: 0,
      magResist: 0,
      fortitude: 1,
      damReduce: 1
    };
  } else if (req.query.class === 'warrior') {
    newCharacter.class = 'Warrior';
    newCharacter.attributes = {
      hp: 18,
      mp: 6,
      maxHP: 18,
      maxMP: 6,
      str: 10,
      agi: 8,
      mag: 6,
      con: 12
    },
    newCharacter.skills = {
      phyDamage: 1,
      phyResist: 1,
      accuracy: 0,
      evasion: 0,
      magDamage: -1,
      magResist: -1,
      fortitude: 2,
      damReduce: 2
    };
  }

  Character
    .create(newCharacter)
    .then(character => res.status(201).json(character))
    .catch((err)=> {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    }); 
});

app.get('/character', (req, res) => {
  // const charState = characterData.read();
  // res.status(200).json(charState);
  // Character
  //   .
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
  runServer(TEST_DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };