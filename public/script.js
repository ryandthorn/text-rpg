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
    this.character.attributes.hp += updateObj.hp;
    this.character.attributes.mp += updateObj.mp;
    if (this.character.attributes.hp > this.character.attributes.maxHP) {
      this.character.attributes.hp = this.character.attributes.maxHP;
    }
    if (this.character.attributes.mp > this.character.attributes.maxMP) {
      this.character.attributes.mp = this.character.attributes.maxMP;
    }
    return this.character;
  },
  delete: function() {
    delete this.character;
  }
};

function displayStory() {
  return `
    <article class="story">
      <p>It was a dark and stormy night...</p>
    </article>
  `;
}

function displayCharacterInfo() {
  const char = characterData.character;
  return `
  <h2>${char.class}</h2>
  <h3>HP: ${char.attributes.hp} | MP: ${char.attributes.mp}</h3>
  <h3>Attributes</h3>
  <ul>
    <li>Strength: ${char.attributes.str}</li>
    <li>Agility: ${char.attributes.agi}</li>
    <li>Magic: ${char.attributes.mag}</li>
    <li>Constitution: ${char.attributes.con}</li>
  </ul>
  <h3>Skills</h3>
  <ul>
    <li>Phys. Damage: ${char.skills.phyDamage}</li>
    <li>Phys. Resist: ${char.skills.phyResist}</li>
    <li>Accuracy: ${char.skills.toHit}</li>
    <li>Evasion: ${char.skills.evasion}</li>
    <li>Mag. Damage: ${char.skills.magDamage}</li>
    <li>Mag. Resist: ${char.skills.magResist}</li>
    <li>Fortitude: ${char.skills.fortitude}</li>
    <li>Phys. Ignore: ${char.skills.damReduce}</li>
  </ul>
  `;
}

function mockDataListener() {
  $('.hit').click(event => {
    event.preventDefault();
    characterData.update({hp: -2, mp: 0});
    $('aside').html(displayCharacterInfo());
  });
  $('.recover').click(event => {
    event.preventDefault();
    characterData.update({hp: 2, mp: 1});
    $('aside').html(displayCharacterInfo());
  });
}

function startGame() {
  $('header').empty();
  $('main').empty();
  $('header').append(`<h1>Chapter 1</h1>`);
  $('main').append(displayStory());
  $('main').append(`
    <button class="hit">Take a hit</button>
    <button class="recover">Recover</button>
  `);
  $('aside').append(displayCharacterInfo());
  mockDataListener();
}

function selectCharacterHandler() {
  $('form').submit(function(event) {
    event.preventDefault();
    const selection = $('input[type=radio]:checked').val();
    characterData['character'] = characterData.create(selection);
    startGame();
  });
}

selectCharacterHandler();