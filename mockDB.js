'use strict';

const storyData = {
  begin: function() {
    this['bookmark'] = this.chapter1.scene1;
  },
  chapter1: {
    scene1: {
      text: `
        <p class="text--first-person">How long have I been in here? Days? ...Weeks?</p>

        <p>You'd heard the stories: people running out of the cave, stark raving mad and half-dead.
        All of them clutching at their burning eyes, screaming about unnatural beings deep within.</p>
        
        <p>You'd also heard the others: riches beyond belief. Ruins of an ancient civilization,
        artifacts capable of giving their masters untold power. A portal to heaven itself.</p>
        
        <p class="text--first-person">No chance now. Maybe I'm already gone.</p>
        <p class="text--first-person">Death... how could it be worse than this?</p>
        
        <input class="btn--next" type="button" value="Next" />
      `,
      next: () => storyData.bookmark = storyData.chapter1.scene2
    },
    scene2: {
      text: `
        <p>Your mind wanders into memories of the days before the darkness.</p>
        <p class="text--first-person">Slow... heavy. What moves like that?</p>

      `,
      next: () => storyData.bookmark = storyData.chapter1.scene3
    }
    scene3: {
      text: `
        <p><span class="text--first-person">Footsteps.</span></p> 
        <p>You feel your way back into a corner of the cell.</p>
        <p class="text--first-person">Slow... heavy. What moves like that?</p>
        <input class="btn--next 13a" type="button" value="Call for help" />
        <input class="btn--next 13b" type="button" value="Remain silent" />
      `,
      next: function() {
        console.log('end');
      }
    }
  },
};

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

module.exports = { characterData, storyData };