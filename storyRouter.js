'use strict';
const express = require('express');
const router = express.Router();
router.use(express.json());

const { Adventure, Enemy } = require('./models');

router.get('/', (req, res) => {
  Adventure // Hard-coded for now to find the only adventure in db
    .findOne() 
    .then(story => {
      res.status(200).json(story);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

router.get('/enemy/:enemyName', (req, res) => {
  Enemy // Hard-coded for now to find only enemy in db
    .findOne({"name": req.params.enemyName})
    .then(enemy => res.status(200).json(enemy))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
})

module.exports = router;