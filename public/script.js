'use strict';

let character_id;

function putRequest(endpoint, payload) {
  return fetch(endpoint, {
    method: 'PUT',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(payload)
  });
}

function generateNewCharacterForm() {
  return `
    <form class="form--choose-character">
      <fieldset>
        <legend align="center">Choose your character</legend>
        <input type="radio" name="character" id="mage" value="mage" required/>
        <label for="mage">Mage</label>
        <input type="radio" name="character" id="thief" value="thief" required/>
        <label for="thief">Thief</label>
        <input type="radio" name="character" id="warrior" value="warrior" required/>
        <label for="warrior">Warrior</label></br>
        <input class="btn--start" type="submit" value="Begin"/>
      </fieldset>
    </form>
  `
}

/* Story functions */

function generateStoryHeader() {
  $('header').html(`
    <h1>Chapter 1</h1>
    <input class="btn--story" type="button" value="Story" />
    <input class="btn--character" type="button" value="Character" />
  `);
}

function displayStory(bookmark) {
  fetch('/story')
    .then(res => res.json())
    .then(story => {
      const currentScene = story[bookmark.chapter][bookmark.scene].text;
      $('main').html(currentScene);
    })
    .catch(err => console.error(err));
}

function displayCharacterInfo() {
  fetch(`/character?id=${character_id}`)
    .then(response => response.json())
    .then(char => {
      $('main').html( `
        <div class="char-info--container">
          <section class="char-info--vitals">
            <h2>${char.class}</h2>
            <h3>HP: ${char.attributes.hp} | MP: ${char.attributes.mp}</h3>
            <h3>Attributes</h3>
            <ul>
              <li>Strength: ${char.attributes.str}</li>
              <li>Agility: ${char.attributes.agi}</li>
              <li>Magic: ${char.attributes.mag}</li>
              <li>Constitution: ${char.attributes.con}</li>
            </ul>
          </section>
          <section class="char-info--skills">
            <h3>Skills</h3>
            <ul>
              <li>Phys. Damage: ${char.skills.phyDamage}</li>
              <li>Phys. Resist: ${char.skills.phyResist}</li>
              <li>Accuracy: ${char.skills.accuracy}</li>
              <li>Evasion: ${char.skills.evasion}</li>
              <li>Mag. Damage: ${char.skills.magDamage}</li>
              <li>Mag. Resist: ${char.skills.magResist}</li>
              <li>Fortitude: ${char.skills.fortitude}</li>
              <li>Phys. Ignore: ${char.skills.damReduce}</li>
            </ul>
          </section>
        </div>
      `);
    })
    .catch(err => console.error(err))
}

function advanceStory(target) {
  // Get bookmark and story from db
  fetch(`/character/bookmark?id=${character_id}`)
    .then(res => res.json())
    .then(bookmark => {
      fetch('/story')
        .then(res => res.json())
        .then(story => {
          // Determine next scene
          let index = 0;
          if (bookmark.next.length > 1) {
            if (target.is( '.13b' )) {
              index = 1;
            }
          }
          const nextScene = bookmark.next[index];

          // Display next scene
          generateStoryHeader();
          displayStory(nextScene);

          // Update bookmark
          const nextBookmark = {
            chapter: nextScene.chapter,
            scene: nextScene.scene,
            next: story[nextScene.chapter][nextScene.scene].next
          }
          putRequest(`/character/bookmark?id=${character_id}`, {bookmark: nextBookmark})
        })
        .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
}

function mainListener() {
  $('main').click(event => {
    const target = $( event.target );

    if (target.is( '.btn--next' )) {
      advanceStory(target);
    };

    if (target.is( '.btn--combat' )) {
      startCombat();
    }

    if (target.is('.btn--restart')) {
      fetch(`/character?id=${character_id}`, {
        method: 'DELETE'
      });
      location.reload();
    }

    if (target.is( '#btn--new-game')) {
      console.log(target);
      const chooseCharacter = generateNewCharacterForm();
      $('main').html(chooseCharacter);
      selectCharacter();
    }
  });
}

function headerListener() {
  $('header').click(event => {
    event.preventDefault();
    const target = $( event.target );
    if (target.is( '.btn--story' )) {
      fetch(`/character/bookmark?id=${character_id}`)
        .then(res => res.json())
        .then(bookmark => {
          displayStory(bookmark);
        })
        .catch(err => console.error(err));
    } else if (target.is( '.btn--character' )) {
      displayCharacterInfo();
    }
  });
}

function selectCharacter() {
  $('form').change(event => {
    $('form label').removeClass('radio-selected');
    const target = $(event.target);
    target.next('label').addClass('radio-selected');
  });
  $('form').submit(event => {
    event.preventDefault();
    const selection = $('input[type=radio]:checked').val();
    $.post('/character/new?class=' + selection)
      .done((player) => startGame(player));
  });
}

function startGame(player) {
  character_id = player._id;
  $('form').remove();
  $('body').css('background-image', 'none');
  generateStoryHeader();
  displayStory(player.bookmark);
  headerListener();
  mainListener();
}

/* Combat functions */

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rollD20() {
  return getRandomIntInclusive(1, 20);
}

function rollDam(damArray) {
  // Expects array [min, max(, modifier)]
  let damage = getRandomIntInclusive(damArray[0], damArray[1]);
  if (damArray.length > 2) {
    damage += damArray[2];
  }
  return damage;
}

function calcPlayerDamage(player, enemy, action) {
  let damage = rollDam(player.actions[action].damage);
  damage += player.skills.phyDamage - enemy.skills.phyResist - enemy.skills.damReduce;
  if (damage < 0) {
    damage = 0;
  }
  return damage;
}

function calcEnemyDamage(player, enemy, action) {
  let damage = rollDam(enemy.actions[action].damage);
  damage += enemy.skills.phyDamage - player.skills.phyResist - player.skills.damReduce;
  if (damage < 0) {
    damage = 0;
  }
  return damage;
}

function setScrollPosition() {
  $('.combat--log').scrollTop(999999999);
}

function displayCombatScreen() {
  $('header').html(`
    <h1 class=".combat--h1">Combat!</h1>
  `);
  $('main').html(`
    <section class="combat--character"></section>
    <section class="combat--log">
      <ul></ul>
    </section>
    <section class="combat--enemy"></section>
  `);
}

function displayPlayerInfo(player) {
  const actionsArray = Object.keys(player.actions);
  const optionString = generateOptionString(actionsArray);
  
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
            ${optionString}
          </select>
          <section class="action-info">
            <p>${player.actions[actionsArray[0]].info}</p>
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
    <div class="picture">
      <img srcset="${enemy.imgSrcSet}" src="${enemy.imgSrc}" alt="${enemy.alt}">
    </div>
  `);
}

function handleActionInfo(player) {
  $('select').change(() => {
    const selection = $('select option:selected').val();
    $('.action-info').html(`
      <p>${player.actions[selection].info}</p>
    `);
  });
}

function generateOptionString(actionsArray) {
  return actionsArray.reduce((string, action) => {
    const displayName = action.charAt(0).toUpperCase() + action.slice(1);
    return string + `<option value="${action}" label=${displayName}>${displayName}</option>`;
  }, actionsArray[0]);
}

function determineEnemyAction(enemy) {
  const actions = Object.keys(enemy.actions);
  const roll = getRandomIntInclusive(0, actions.length - 1);
  const enemyAction = actions[roll];
  const actionText = rollEnemyActionText(enemy, enemyAction);
  const actionString = generateHTML('li', actionText);
  appendHTML('.combat--log ul', actionString);
  return enemyAction;
}

function rollEnemyActionText(enemy, enemyAction) {
  const textOptions = enemy.actions[enemyAction].text;
  const roll = getRandomIntInclusive(0, textOptions.length - 1);
  return textOptions[roll];
} 

function generateHTML(element, text, attributes) {
  let firstElement = element;
  if (attributes) {
    firstElement += ' ' + attributes;
  }
  if (element === 'input') {
    return `<${firstElement}/>`;
  }

  return `<${firstElement}>${text}</${element}>`;
}

function appendHTML(selector, entry) {
  $(`${selector}`).append(entry);
}

function startCombat() {
  fetch(`/character?id=${character_id}`)
    .then(res => res.json())
    .then(player => {
      fetch('/story/enemy')
        .then(res => res.json())
        .then(enemy => {
          displayCombatScreen();
          displayPlayerInfo(player);
          displayEnemyInfo(enemy);
          handleActionInfo(player);
          combat(player, enemy);
        })
        .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
}

/*** Combat ***
 * 1) Determine enemy action
 * 2) Display enemy action choice hint
 * 3) Player turn - player selects action
 * 4) Roll hit & evade for player action
 * 5) Compare player vs enemy rolls, handle results
 * 6) Check for victory/loss conditions
 * 7) Enemy turn - resolve determined enemy action
 * 8) Recurse for next turn
*/

function combat(player, enemy) {
  let enemyAction = determineEnemyAction(enemy);
  setScrollPosition();
  $('form').submit(event => {
    event.preventDefault();
    const playerAction = $('select option:selected').val();
    playerTurn(player, enemy, playerAction);
    enemyTurn(player, enemy, enemyAction);
    setScrollPosition();
    displayPlayerInfo(player);
    displayEnemyInfo(enemy);
    $('form').off('submit');
    handleActionInfo(player);
    if (player.attributes.hp <= 0 || enemy.attributes.hp <= 0) {
      return;
    }
    combat(player, enemy);
  });
}

function playerAttack(player, enemy) {
  const initialMessage = generateHTML('li', player.class + ' attacks!');
  appendHTML('.combat--log ul', initialMessage);

  const playerHitRoll = rollD20();
  const playerHitCalc = playerHitRoll + player.attributes.agi + player.skills.accuracy;
  const enemyEvadeRoll = rollD20();
  const enemyEvadeCalc = enemyEvadeRoll + enemy.attributes.agi + enemy.skills.evasion + (enemy.actions.defend.defendBonus || 0);

  if (playerHitCalc > enemyEvadeCalc) {
    const damage = calcPlayerDamage(player, enemy, 'attack');
    enemy.attributes.hp -= damage;
  
    const hitString = generateHTML('li', player.class + ' HITS for ' + damage + ' damage [roll' + playerHitRoll + ' + agi' + player.attributes.agi + ' + acc' + player.skills.accuracy + 
      ' (' + playerHitCalc + ') vs (' + enemyEvadeCalc + ') roll' + enemyEvadeRoll + ' + agi' + enemy.attributes.agi + ' + eva' + enemy.skills.evasion + ' + defBonus' + enemy.actions.defend.defendBonus + ']'
    );
    appendHTML('.combat--log ul', hitString);
    displayEnemyInfo(enemy);

  } else {
    const missString = generateHTML('li', player.class + ' MISSES [roll' + playerHitRoll + ' + agi' + player.attributes.agi + ' + acc' + player.skills.accuracy + 
      ' (' + playerHitCalc + ') vs (' + enemyEvadeCalc + ') roll' + enemyEvadeRoll + ' + agi' + enemy.attributes.agi + ' + eva' + enemy.skills.evasion + ' + defBonus' + enemy.actions.defend.defendBonus + ']'
    );
    appendHTML('.combat--log ul', missString);
  }
}

function playerTurn(player, enemy, playerAction) {
  switch(playerAction) {
    case 'attack': {
      playerAttack(player, enemy);
      break;
    }
    case 'defend': {
      player.actions.defend.defendBonus = 5;
      const defendString = generateHTML('li', player.class + ' defends (+5 defBonus for 1 turn)');
      appendHTML('.combat--log ul', defendString);
      break;
    }
    case 'missile': {
      const missileString = generateHTML('li', player.class + ' casts missile!');
      appendHTML('.combat--log ul', missileString);

      const damage = calcPlayerDamage(player, enemy, 'missile');
      player.attributes.mp -= player.actions.missile.mpCost;
      enemy.attributes.hp -= damage;
      
      const damageString = generateHTML('li', 'Missile does ' + damage + ' damage to ' + enemy.name);
      appendHTML('.combat--log ul', damageString);
      displayPlayerInfo(player);
      displayEnemyInfo(enemy);
      break;
    }
    case 'dblStrike': {
      const dblStrikeString = generateHTML('li', player.class + ' focuses...')
      appendHTML('.combat--log ul', dblStrikeString);

      for (let i = 0; i < 2; i++) {
        playerAttack(player, enemy);
      }
      break;
    }
    case 'smash': {
      const smashString = generateHTML('li', player.class + ' becomes enraged!');
      appendHTML('.combat--log ul', smashString);

      const damage = calcPlayerDamage(player, enemy, 'smash');
      enemy.attributes.hp -= damage;

      const damageString = generateHTML('li', player.class + ' HITS ' + enemy.name + ' for ' + damage + ' damage');
      appendHTML('.combat--log ul', damageString);
      displayEnemyInfo(enemy);
      break;
    }
  }
  endTurn(player, enemy, 'player');
}

function enemyTurn(player, enemy, enemyAction) {
  if (enemy.attributes.hp <= 0) {
    return;
  }
  switch(enemyAction) {
    case 'attack': {
      const attackString = generateHTML('li', enemy.name + ' attacks!');
      appendHTML('.combat--log ul', attackString);

      const enemyHitRoll = rollD20()
      const enemyHitCalc = enemyHitRoll + enemy.attributes.agi + enemy.skills.accuracy;
      const playerEvadeRoll = rollD20();
      const playerEvadeCalc = playerEvadeRoll + player.attributes.agi + player.skills.evasion + (player.actions.defend.defendBonus || 0);

      if (enemyHitCalc > playerEvadeCalc) {
        const damage = calcEnemyDamage(player, enemy, 'attack');
        player.attributes.hp -= damage;

        const hitString = generateHTML('li', enemy.name + ' HITS for ' + damage + ' damage [roll' + enemyHitRoll + ' + agi' + enemy.attributes.agi + ' + acc' + enemy.skills.accuracy + 
          ' (' + enemyHitCalc + ') vs (' + playerEvadeCalc + ') roll' + playerEvadeRoll + ' + agi' + player.attributes.agi + ' + eva' + player.skills.evasion + ' + defBonus' + player.actions.defend.defendBonus + ']');
        appendHTML('.combat--log ul', hitString);

      } else {
        const missString = generateHTML('li', enemy.name + ' MISSES [roll' + enemyHitRoll + ' + agi' + enemy.attributes.agi + ' + acc' + enemy.skills.accuracy + 
          ' (' + enemyHitCalc + ') vs (' + playerEvadeCalc + ') roll' + playerEvadeRoll + ' + agi' + player.attributes.agi + ' + eva' + player.skills.evasion + ' + defBonus' + player.actions.defend.defendBonus + ']');
        appendHTML('.combat--log ul', missString);
      }
      break;
    }
    case 'defend': {
      enemy.actions.defend.defendBonus = 5;
      const defendString = generateHTML('li', enemy.name + ' defends (+5 defBonus for 1 turn)');
      appendHTML('.combat--log ul', defendString);
      break;
    }
  }
  endTurn(player, enemy, 'enemy');
}

function endTurn(player, enemy, turn) {
  if (turn === 'player') {
    if (enemy.attributes.hp <= 0) {
      const condition = 'win';
      return endCombat(player, enemy, condition);
    }
    if (enemy.actions.defend.defendBonus > 0) {
      enemy.actions.defend.defendBonus = 0;
    }
  } else if (turn === 'enemy') {
    if (player.attributes.hp <= 0) {
      const condition = 'loss';
      return endCombat(player, enemy, condition);
    }
    if (player.actions.defend.defendBonus > 0) {
      player.actions.defend.defendBonus = 0;
    }
  }
}

function endCombat(player, enemy, condition) {
  if (condition === 'win') {
    // Append win message
    let winMessage = generateHTML('p', 'You defeated ' + enemy.name + '!');
    winMessage += generateHTML('input', '', 'class="btn--next" type="button" value="End Combat"');
    appendHTML('.combat--log', winMessage);
    setScrollPosition();

    // Update character hp and mp in DB
    const updateObj = {
      hp: player.attributes.hp,
      mp: player.attributes.mp
    }
    putRequest(`/character?id=${character_id}`, updateObj);

  } else if (condition === 'loss') {
    let lossMessage = generateHTML('p', 'You have been slain by ' + enemy.name);
    lossMessage += generateHTML('input', '', 'class="btn--restart" type="button" value="New Character"');
    appendHTML('.combat--log', lossMessage);
    setScrollPosition();
  }
}

mainListener();