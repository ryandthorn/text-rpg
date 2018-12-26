'use strict';

const storyData = {
  chapter1: {
    scene5: {
      text: `
        <p>The troglodyte looks like it wants to fight.</p>
        <input class="btn--combat" type="button" value="Start Combat"/>
      `,
      enemy: {
        name: `Injured Troglodyte`,
        picture: "https://picsum.photos/100",
        alt: "This eyeless, misshapen creature has a deep gash in its shoulder.",
        attributes: {
          hp: 8,
          mp: 0,
          maxHP: 8,
          maxMP: 0,
          str: 6,
          agi: 8,
          mag: 6,
          con: 6
        },
        skills: {
          phyDamage: -1,
          phyResist: -1,
          accuracy: 0,
          evasion: 0,
          magDamage: -1,
          magResist: -1,
          fortitude: -1,
          damReduce: -1
        },
        actions: {
          attack: {
            text: [
              'The troglodyte lowers its spear...',
              'The troglodyte shifts its weight forward...',
              'The troglodyte hisses...'
            ],
            rollHit: () => getRandomIntInclusive(1, 20),
            rollDam: () => getRandomIntInclusive(1, 4)
          },
          defend: {
            text: [
              'The troglodyte takes a defensive stance...',
              'The troglodyte steps back...',
              'The troglodyte hesitates...'
            ],
            rollDam: () => getRandomIntInclusive(1, 4),
            defendBonus: 0
          }
        }
      },
      next: () => console.log('next scene')
    }
  }
}

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

function displayCombatScreen() {
  $('header').html(`
    <h1>Fight!</h1>
    <input class="btn--combat" type="button" value="Combat"/>
    <input class="btn--character" type="button" value="Character"/>
  `);
  $('main').html(`
    <section class="combat--character"></section>
    <section class="combat--log"></section>
    <section class="combat--enemy"></section>
  `);
}

function displayPlayerInfo(player) {
  $('.combat--character').html(`
    <div class="class">
      <h2>${player.class}</h2>
    </div>
    <div class="vitals">
      <h3>HP ${player.attributes.hp}</h3>
      <h3>MP ${player.attributes.mp}</h3>
    </div>
    <div class="actions">
      <form class="action-form">
        <fieldset>
          <legend>Choose an action</legend>
          <select name="action-menu" id="action-menu" required>
            <option value="attack">Attack</option>
            <option value="defend">Defend</option>
            <optgroup label="Cast Spell">
              <option value="missile">Missile</option>
            </optgroup>
          </select>
          <section class="action-info">
            <p>Select a combat action from the menu above.</p>
          </section>
          <input type="submit" class="btn--action-submit" value="Fight!">
        </fieldset>
      </form>
    </div>
  `);
}

function displayEnemyInfo(enemy) {
  $('.combat--enemy').html(`
    <div class="name">
      <h2>${enemy.name}</h2>
    </div>
    <div class="vitals">
      <h3>HP ${enemy.attributes.hp}</h3>
      <h3>MP ${enemy.attributes.mp}</h3>
    </div>
    <div class="actions">
      <h3>Actions</h3>
      <p>Attack</p>
      <p>Defend</p>
    </div>
    <div class="picture">
      <img src="${enemy.picture}" alt="${enemy.alt}">
    </div>
  `);
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

function combat(player, enemy) {
  let enemyAction = determineEnemyAction(enemy);
  setScrollPosition();
  $('form').submit(event => {
    event.preventDefault();
    const selection = $('select option:selected').val();
    switch(selection) {
      case 'attack':
        $('.combat--log').append(`<p>Mage attacks!</p>`);
        const playerHitRoll = player.actions.attack.rollHit();
        const playerHitCalc = playerHitRoll + player.attributes.agi + player.skills.accuracy;
        const enemyEvadeRoll = getRandomIntInclusive(1, 20);
        const enemyEvadeCalc = enemyEvadeRoll + enemy.attributes.agi + enemy.skills.evasion + (enemy.actions.defend.defendBonus || 0);
        if (playerHitCalc > enemyEvadeCalc) {
          const damage = player.actions.attack.rollDam();
          $('.combat--log').append(`
            <p>Mage HITS for ${damage} damage [roll${playerHitRoll} + agi${player.attributes.agi} + acc${player.skills.accuracy} ` + 
              `(${playerHitCalc}) vs (${enemyEvadeCalc}) roll${enemyEvadeRoll} + agi${enemy.attributes.agi} + eva${enemy.skills.evasion} + defBonus${enemy.actions.defend.defendBonus}]</p>
          `);
          enemy.attributes.hp -= damage;
          displayEnemyInfo(enemy);
        } else {
          $('.combat--log').append(`
          <p>Mage MISSES [roll${playerHitRoll} + agi${player.attributes.agi} + acc${player.skills.accuracy} (${playerHitCalc}) vs ` + 
            `(${enemyEvadeCalc}) roll${enemyEvadeRoll} + agi${enemy.attributes.agi} + eva${enemy.skills.evasion} + defBonus${enemy.actions.defend.defendBonus}]</p>
          `);
        }
        break;
      case 'defend':
        player.actions.defend.defendBonus = 5;
        $('.combat--log').append(`
          <p>${player.class} defends (+5 eva for 1 turn)</p>
        `)
        break;
      case 'missile':
        const damage = player.actions.spells.missile.rollDam();
        player.attributes.mp -= 2;
        enemy.attributes.hp -= damage;
        $('.combat--log').append(`
          <p>Mage casts missile!</p>
          <p>Missile does ${damage} damage to ${enemy.name}</p>
        `);
        displayPlayerInfo(player);
        displayEnemyInfo(enemy);
        break;
    }
    if (enemy.attributes.hp <= 0) {
      $('.combat--log').append(`
        <p>You defeated ${enemy.name}!</p>
        <input class="btn--next" type="button" value="End Combat"/>
      `)
      setScrollPosition();
      return;
    }
    if (player.attributes.hp <= 0) {
      $('.combat--log').append(`<p>Placeholder: you lose!</p>`)
      setScrollPosition();
      return;
    }
    if (enemy.actions.defend.defendBonus > 0) {
      enemy.actions.defend.defendBonus = 0;
    }
    enemyTurn(player, enemy, enemyAction);
    setScrollPosition();
    displayPlayerInfo(player);
    displayEnemyInfo(enemy);
    $('form').off('submit');
    combat(player, enemy);
  });
}

function enemyTurn(player, enemy, enemyAction) {
  switch(enemyAction) {
    case 'attack': 
      const enemyHitRoll = enemy.actions.attack.rollHit();
      const enemyHitCalc = enemyHitRoll + enemy.attributes.agi + enemy.skills.accuracy;
      const playerEvadeRoll = getRandomIntInclusive(1, 20);
      const playerEvadeCalc = playerEvadeRoll + player.attributes.agi + player.skills.evasion + (player.actions.defend.defendBonus || 0);
      $('.combat--log').append(`<p>${enemy.name} attacks!</p>`);
      if (enemyHitCalc > playerEvadeCalc) {
        const damage = enemy.actions.attack.rollDam();
        $('.combat--log').append(`
          <p>${enemy.name} HITS for ${damage} damage ` + 
          `[roll${enemyHitRoll} + agi${enemy.attributes.agi} + acc${enemy.skills.accuracy} (${enemyHitCalc}) ` +
          `vs (${playerEvadeCalc}) roll${playerEvadeRoll} + agi${player.attributes.agi} + eva${player.skills.evasion} + defBonus${player.actions.defend.defendBonus}]
        `);
        player.attributes.hp -= damage;
      } else {
        $('.combat--log').append(`
          <p>${enemy.name} MISSES ` + 
          `[roll${enemyHitRoll} + agi${enemy.attributes.agi} + acc${enemy.skills.accuracy} (${enemyHitCalc}) ` +
          `vs (${playerEvadeCalc}) roll${playerEvadeRoll} + agi${player.attributes.agi} + eva${player.skills.evasion} + defBonus${player.actions.defend.defendBonus}]
        `);
      }
      if (player.actions.defend.defendBonus > 0) {
        player.actions.defend.defendBonus = 0;
      }
      break;
    case 'defend':
      enemy.actions.defend.defendBonus = 5;
      $('.combat--log').append(`
        <p>${enemy.name} defends (+5 eva for 1 turn)</p>
      `)
  }
}

function determineEnemyAction(enemy) {
  const actions = Object.keys(enemy.actions);
  const roll = getRandomIntInclusive(0, actions.length - 1);
  const enemyAction = actions[roll];
  const actionText = rollEnemyActionText(enemy, enemyAction);
  $('.combat--log').append(`<p>${actionText}</p>`);
  return enemyAction;
}

function rollEnemyActionText(enemy, enemyAction) {
  const textOptions = enemy.actions[enemyAction].text;
  const roll = getRandomIntInclusive(0, textOptions.length - 1);
  return textOptions[roll];
} 

$('.btn--character').click(event => {
  event.preventDefault();
})

$('.btn--combat').click(event => {
  event.preventDefault();
})

function combatListener() {
  $('.btn--combat').click(event => {
    event.preventDefault();
    startCombat();
  });
}

function startCombat() {
  const player = characterData['character'];
  const enemy = storyData.bookmark.enemy;
  displayCombatScreen()
  displayPlayerInfo(player);
  displayEnemyInfo(enemy);
  handleActionInfo();
  combat(player, enemy);
}

characterData['character'] = characterData.create('mage');
storyData['bookmark'] = storyData.chapter1.scene5;
$('main').html(storyData.bookmark.text);
combatListener();