'use strict';
const express = require('express');
const router = express.Router();
router.use(express.json());

const { Adventure, Enemy, Character } = require('./models');

router.get('/', (req, res) => {
  Character
    .findById(req.user.characterId)
    .then(character => {
      Adventure
        .findOne({scene: character.bookmark})
        .then(scene => res.status(200).json(scene))
        .catch(err => {
          console.error(err);
          res.status(500).json({message: 'Error: scene not found'});
        })
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Error: character not found'})
    })
});

router.get('/enemy/:enemyName', (req, res) => {
  Enemy 
    .findOne({name: req.params.enemyName})
    .then(enemy => res.status(200).json(enemy))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
})

module.exports = router;