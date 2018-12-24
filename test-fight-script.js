'use strict';

const characterData = {
  create: function(selection) {
    const newCharacter = {};
    if (selection === 'mage') {
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
          info: `Take a defensive stance. +5 vs enemy toHit, ` +
                `counterattack for 1d4 on successful defense.`,
          rollDam: () => getRandomIntInclusive(1, 4)
        },
        spells: {
          missile: {
            info: `Shoot a bolt of kinetic energy at your opponent. ` +
                  `1d8 + 4 damage, -2 MP`,
            rollDam: () => getRandomIntInclusive(1, 8) + 4
          }
        }
      };
    } else if (selection === 'thief') {
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
    } else if (selection === 'warrior') {
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
    return newCharacter;      
  },
  read: function(){
    return this.character;
  },
  update: function(updateObj) {
    this.character.attributes.hp += Number(updateObj.hp);
    this.character.attributes.mp += Number(updateObj.mp);
    if (this.character.attributes.hp > this.character.attributes.maxHP) {
      this.character.attributes.hp = this.character.attributes.maxHP;
    }
    if (this.character.attributes.mp > this.character.attributes.maxMP) {
      this.character.attributes.mp = this.character.attributes.maxMP;
    }
    if (this.character.attributes.hp <= 0) {
      loseGame();
    }
    return this.character;
  },
  delete: function() {
    delete this.character;
  }
};

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setScrollPosition() {
  $('.combat--log').scrollTop(999999999);
}

function handleActionInfo() {
  $('select').change(() => {
    const selection = $('select option:selected').val();
    let selectionInfo;
    switch(selection) {
      case 'attack':
        selectionInfo = characterData.character.actions.attack.info;
        break;
      case 'defend':
        selectionInfo = characterData.character.actions.defend.info;
        break;
      case 'missile':
        selectionInfo = characterData.character.actions.spells.missile.info;
        break;
    }
    $('.action-info').html(`
      <p>${selectionInfo}</p>
    `);
  });
}

$('.btn--character').click(event => {
  event.preventDefault();
})

$('.btn--combat').click(event => {
  event.preventDefault();
})

characterData['character'] = characterData.create('mage');
handleActionInfo();