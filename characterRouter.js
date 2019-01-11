'use strict';
const express = require('express');
const router = express.Router();
router.use(express.json());
const { Character } = require('./models');

router.post('/:new', (req, res) => {
  const newCharacter = {};
  newCharacter.bookmark = {
    chapter: 'chapter1',
    scene: 'scene1',
    next: [
      {
        chapter: 'chapter1',
        scene: 'scene2'
      }
    ]
  };

  if (req.query.class === 'mage') {
    newCharacter.class = 'Mage';
    newCharacter.attributes = {
      hp: 8,
      mp: 12,
      maxHP: 8,
      maxMP: 12,
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
        info: `Physical attack for 1-6 damage`,
        damage: [1, 6]
      },
      defend: {
        info: `Take a defensive stance. +5 defense bonus vs enemy to-hit roll.`,
        damage: [1, 4],
        defendBonus: 0
      },
      missile: {
        info: `Shoot a magic missile at your opponent. 1-6 + 4 damage (-2 MP)`,
        damage: [1, 8, 4],
        mpCost: 2
      }
    };
  } else if (req.query.class === 'thief') {
    newCharacter.class = 'Thief',
    newCharacter.attributes = {
      hp: 10,
      mp: 10,
      maxHP: 10,
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
    newCharacter.actions = {
      attack: {
        info: `Physical attack for 1-6 damage`,
        damage: [1, 6]
      },
      defend: {
        info: `Take a defensive stance. +5 defense bonus vs enemy to-hit roll.`,
        damage: [1, 4],
        defendBonus: 0
      },
      dblStrike: {
        info: `Attack twice this turn (-2 MP)`,
        damage: [1, 6],
        mpCost: 2
      }
    };
  } else if (req.query.class === 'warrior') {
    newCharacter.class = 'Warrior';
    newCharacter.attributes = {
      hp: 12,
      mp: 8,
      maxHP: 12,
      maxMP: 8,
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
    newCharacter.actions = {
      attack: {
        info: `Physical attack for 1-6 damage`,
        damage: [1, 6]
      },
      defend: {
        info: `Take a defensive stance. +5 defense bonus vs enemy to-hit roll.`,
        damage: [1, 4],
        defendBonus: 0
      },
      smash: {
        info: `An unavoidable crushing blow. 3-5 + 4 damage (-2 MP)`,
        damage: [3, 5, 4],
        mpCost: 2
      }
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

router.get('/', (req, res) => {
  Character
    .findById(req.query.id)
    .then(character => res.status(200).json(character))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

router.get('/bookmark', (req, res) => {
  Character
    .findById(req.query.id)
    .then(character => {
      res.status(200).json(character.bookmark);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

router.put('/bookmark', (req, res) => {
  const toUpdate = {"bookmark": req.body.bookmark}
  Character
    .findOneAndUpdate({_id: req.query.id}, {$set: toUpdate}, {returnNewDocument: true})
    .then(response => {
      res.status(200).json(response);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

router.put('/', (req, res) => {
  // Update character attributes after combat resolves
  Character
    .findById(req.query.id)
    .then(character => {
      const updateableAttrs = ['hp', 'mp'];
      updateableAttrs.forEach(attr => {
        character.attributes[attr] = req.body[attr];
      })

      character.save(function (err, character) {
        if (err) {
          console.error(err);
          res.status(500).json({message: 'Internal server error'});
        }
        res.json(character);
      })
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

router.delete('/', (req, res) => {
  Character
    .findByIdAndDelete(req.query.id)
    .then(() => {
      res.status(204).end();
    })
    .catch(err => console.error(err));
})

module.exports = router;