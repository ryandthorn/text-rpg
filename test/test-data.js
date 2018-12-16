'use strict';

const characterData = {
  create: function(selection) {
    const newCharacter = {};
    if (selection === 'mage') {
      newCharacter.class = 'Mage';
      newCharacter.attributes = {
        hp: 10,
        mp: 18,
        str: 6,
        agi: 10,
        mag: 12,
        con: 8
      };
      newCharacter.skills = {
        phyDamage: -1,
        phyResist: -1,
        toHit: 1,
        evasion: 1,
        magDamage: 2,
        magResist: 2,
        fortitude: 0,
        damReduce: 0
      };
    } else if (selection === 'thief') {
      newCharacter.class = 'Thief',
      newCharacter.attributes = {
        hp: 14,
        mp: 10,
        str: 8,
        agi: 12,
        mag: 8,
        con: 10
      };
      newCharacter.skills = {
        phyDamage: 0,
        phyResist: 0,
        toHit: 2,
        evasion: 2,
        magDamage: 0,
        magResist: 0,
        fortitude: 1,
        damReduce: 1
      };
    } else if (selection === 'warrior') {
      newCharacter.class = 'Warrior';
      newCharacter.attributes = {
        hp: 18,
        mp: 6,
        str: 10,
        agi: 8,
        mag: 6,
        con: 12
      },
      newCharacter.skills = {
        phyDamage: 1,
        phyResist: 1,
        toHit: 0,
        evasion: 0,
        magDamage: -1,
        magResist: -1,
        fortitude: 2,
        damReduce: 2
      };
    }
    return newCharacter;      
  },
  read: function(){
    return this.character;
  },
  update: function(updateObj) {
    this.character.attributes.hp += updateObj.hp;
    this.character.attributes.mp += updateObj.mp;
    return this.character;
  },
  delete: function() {
    delete this.character;
  }
};

module.exports = { characterData }; 