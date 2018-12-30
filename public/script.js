'use strict';

function startStory() {
  $.post('/story')
    .done(() => {
      displayStory();
    });
}

function displayStory() {
  $.get('/story')
    .done(story => {
      $('main').html(story.text);
      buttonListener();
    });
}

function displayCharacterInfo() {
  $.get('/character')
    .done(char => {
      $('main').html( `
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
      `);
    });
}

function buttonListener() {
  // Add data as query params
  // $('.btn--hit').click(event => {
  //   event.preventDefault();
  //   $.ajax({
  //     url: 'http://localhost:8080/character/update?hp=-2&mp=-1',
  //     type: 'PUT',
  //     // data: {hp: -2, mp: -1},
  //     // dataType: "json",
  //     success: () => displayCharacterInfo()
  //   });
  // });

  $('.btn--next').click(event => {
    event.preventDefault()
    const target = $( event.target );
    let parameters = '';

    if (target.is( '.13a' )) {
      parameters = '/choice?choice=A';
    } else if (target.is( '.13b' )) {
      parameters = '/choice?choice=B';
    }
    
    $.ajax({
      url: '/story' + parameters,
      type: 'PUT',
      success: () => displayStory()
    });
  });

  $('.btn--combat').click(event => {
    event.preventDefault();
    startCombat();
  });
}

function headerListener() {
  $('header').click(event => {
    event.preventDefault();
    const target = $( event.target );
    if (target.is( '.btn--story' )) {
      displayStory();
    } else if (target.is( '.btn--character' )) {
      displayCharacterInfo();
    }
  });
}

function startGame(player) {
  console.log(player);
  $('form').remove();
  $('header').html(`
    <h1>Chapter 1</h1>
    <input class="btn--story" type="button" value="Story" />
    <input class="btn--character" type="button" value="Character" />
  `);
  headerListener();
  startStory();
}

// function loseGame() {
//   $('header').html(`<h1>Defeated!</h1>`);
//   $('main').html(`<button class="restart">Start new game</button>`);
//   characterData.delete();
//   $('button').click(event => {
//     event.preventDefault();
//     startGame();
//   });
// }

function selectCharacterHandler() {
  $('form').submit(event => {
    event.preventDefault();
    const selection = $('input[type=radio]:checked').val();
    $.post('/character/new?class=' + selection)
      .done((player) => startGame(player));
  });
}

// Combat

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
    <section class="combat--log">
      <ul></ul>
    </section>
    <section class="combat--enemy"></section>
  `);
}

// Refactor to get player actions and descriptions dynamically
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
    <div class="picture">
      <img srcset="${enemy.imgSrcSet}" src="${enemy.imgSrc}" alt="${enemy.alt}">
    </div>
  `);
}

function handleActionInfo(player) {
  $('select').change(() => {
    const selection = $('select option:selected').val();
    let selectionInfo;
    switch(selection) {
      case 'attack':
        selectionInfo = player.actions.attack.info;
        break;
      case 'defend':
        selectionInfo = player.actions.defend.info;
        break;
      case 'missile':
        selectionInfo = player.actions.spells.missile.info;
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
        $('.combat--log ul').append(`<li>Mage attacks!</li>`);
        const playerHitRoll = player.actions.attack.rollHit();
        const playerHitCalc = playerHitRoll + player.attributes.agi + player.skills.accuracy;
        const enemyEvadeRoll = getRandomIntInclusive(1, 20);
        const enemyEvadeCalc = enemyEvadeRoll + enemy.attributes.agi + enemy.skills.evasion + (enemy.actions.defend.defendBonus || 0);
        if (playerHitCalc > enemyEvadeCalc) {
          const damage = player.actions.attack.rollDam();
          $('.combat--log ul').append(`
            <li>Mage HITS for ${damage} damage [roll${playerHitRoll} + agi${player.attributes.agi} + acc${player.skills.accuracy} ` + 
              `(${playerHitCalc}) vs (${enemyEvadeCalc}) roll${enemyEvadeRoll} + agi${enemy.attributes.agi} + eva${enemy.skills.evasion} + defBonus${enemy.actions.defend.defendBonus}]</li>
          `);
          enemy.attributes.hp -= damage;
          displayEnemyInfo(enemy);
        } else {
          $('.combat--log ul').append(`
            <li>Mage MISSES [roll${playerHitRoll} + agi${player.attributes.agi} + acc${player.skills.accuracy} (${playerHitCalc}) vs ` + 
              `(${enemyEvadeCalc}) roll${enemyEvadeRoll} + agi${enemy.attributes.agi} + eva${enemy.skills.evasion} + defBonus${enemy.actions.defend.defendBonus}]</li>
          `);
        }
        break;
      case 'defend':
        player.actions.defend.defendBonus = 5;
        $('.combat--log ul').append(`
          <li>${player.class} defends (+5 eva for 1 turn)</li>
        `)
        break;
      case 'missile':
        const damage = player.actions.spells.missile.rollDam();
        player.attributes.mp -= 2;
        enemy.attributes.hp -= damage;
        $('.combat--log ul').append(`
          <li>Mage casts missile!</li>
          <li>Missile does ${damage} damage to ${enemy.name}</li>
        `);
        displayPlayerInfo(player);
        displayEnemyInfo(enemy);
        break;
    }
    if (enemy.attributes.hp <= 0) {
      $('.combat--log ul').append(`
        <p>You defeated ${enemy.name}!</p>
        <input class="btn--next" type="button" value="End Combat"/>
      `)
      setScrollPosition();
      return;
    }
    if (player.attributes.hp <= 0) {
      $('.combat--log ul').append(`<p>Placeholder: you lose!</p>`)
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
      $('.combat--log ul').append(`<li>${enemy.name} attacks!</li>`);
      if (enemyHitCalc > playerEvadeCalc) {
        const damage = enemy.actions.attack.rollDam();
        $('.combat--log ul').append(`
          <li>${enemy.name} HITS for ${damage} damage ` + 
          `[roll${enemyHitRoll} + agi${enemy.attributes.agi} + acc${enemy.skills.accuracy} (${enemyHitCalc}) ` +
          `vs (${playerEvadeCalc}) roll${playerEvadeRoll} + agi${player.attributes.agi} + eva${player.skills.evasion} + defBonus${player.actions.defend.defendBonus}]</li>
        `);
        player.attributes.hp -= damage;
      } else {
        $('.combat--log ul').append(`
          <li>${enemy.name} MISSES ` + 
          `[roll${enemyHitRoll} + agi${enemy.attributes.agi} + acc${enemy.skills.accuracy} (${enemyHitCalc}) ` +
          `vs (${playerEvadeCalc}) roll${playerEvadeRoll} + agi${player.attributes.agi} + eva${player.skills.evasion} + defBonus${player.actions.defend.defendBonus}]</li>
        `);
      }
      if (player.actions.defend.defendBonus > 0) {
        player.actions.defend.defendBonus = 0;
      }
      break;
    case 'defend':
      enemy.actions.defend.defendBonus = 5;
      $('.combat--log ul').append(`
        <li>${enemy.name} defends (+5 eva for 1 turn)</li>
      `)
  }
}

function determineEnemyAction(enemy) {
  const actions = Object.keys(enemy.actions);
  const roll = getRandomIntInclusive(0, actions.length - 1);
  const enemyAction = actions[roll];
  const actionText = rollEnemyActionText(enemy, enemyAction);
  $('.combat--log ul').append(`<li>${actionText}</li>`);
  return enemyAction;
}

function rollEnemyActionText(enemy, enemyAction) {
  const textOptions = enemy.actions[enemyAction].text;
  const roll = getRandomIntInclusive(0, textOptions.length - 1);
  return textOptions[roll];
} 

function startCombat() {
  $.get('/character')
    .done(character => {
      const player = character;
      $.get('/story')
        .done(bookmark => {
          const enemy = bookmark.enemy;
          displayCombatScreen()
          displayPlayerInfo(player);
          displayEnemyInfo(enemy);
          handleActionInfo(player);
          combat(player, enemy); 
        });
    });
}

selectCharacterHandler();