'use strict';
const mongoose = require('mongoose');

const characterSchema = mongoose.Schema({
  class: {type: String, required: true},
  attributes: {
    hp: {type: Number, required: true},
    mp: {type: Number, required: true},
    maxHP: {type: Number, required: true},
    maxMP: {type: Number, required: true},
    str: {type: Number, required: true},
    agi: {type: Number, required: true},
    mag: {type: Number, required: true},
    con: {type: Number, required: true}
  },
  skills: {
    phyDamage: {type: Number, required: true},
    phyResist: {type: Number, required: true},
    accuracy: {type: Number, required: true},
    evasion: {type: Number, required: true},
    magDamage: {type: Number, required: true},
    magResist: {type: Number, required: true},
    fortitude: {type: Number, required: true},
    damReduce: {type: Number, required: true}
  },
  actions: {type: Object, required: true},
  bookmark: {
    chapter: String,
    scene: String,
    next: Array
  }
});

const enemySchema = mongoose.Schema({
  name: {type: String, required: true},
  imgSrc: {type: String, required: true},
  alt: {type: String, required: true},
  attributes: {
    hp: {type: Number, required: true},
    mp: {type: Number, required: true},
    maxHP: {type: Number, required: true},
    maxMP: {type: Number, required: true},
    str: {type: Number, required: true},
    agi: {type: Number, required: true},
    mag: {type: Number, required: true},
    con: {type: Number, required: true}
  },
  skills: {
    phyDam: {type: Number, required: true},
    phyResist: {type: Number, required: true},
    accuracy: {type: Number, required: true},
    evasion: {type: Number, required: true},
    magDamage: {type: Number, required: true},
    magResist: {type: Number, required: true},
    fortitude: {type: Number, required: true},
    damReduce: {type: Number, required: true}
  },
  actions: {type: Object, required: true}
});

const adventureSchema = mongoose.Schema({
  chapter1: Object
});

const Character = mongoose.model('Character', characterSchema);
const Enemy = mongoose.model('Enemy', enemySchema);
const Adventure = mongoose.model('Adventure', adventureSchema);

module.exports = {Character, Enemy, Adventure}