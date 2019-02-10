'use strict';

function putRequest(endpoint, payload) {
  return fetch(endpoint, {
    method: 'PUT',
    headers: new Headers({
      'Authorization': 'Bearer ' + localStorage.authToken,
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(payload)
  });
}

function refreshJWT() {
  return fetch('/auth/refresh', {
    method: 'POST',
    headers: new Headers({
      'Authorization': 'Bearer ' + localStorage.authToken,
    })
  })
    .then(res => res.json())
    .then(token => token)
    .catch(err => console.error(err));
}

function generateMenuHeader() {
  return `
    <section class="navbar" role="navigation">
      <img src="./images/tree-logo.jpg" alt="Tree logo" id="img--nav-icon" />
      <h2 id="h2--nav-title">Dendrion</h2>
      <button class="btn--signout">Sign Out</button>
    </section>
  `
}

function generateNewUserForm() {
  return `
    <h1 id="h1--signup">Sign up for your free <span class="span--title">Dendrion</span> account!</h1>
    <form id="form--signup">
      <fieldset>
        <legend class="hidden">Please enter your information</legend>
        <div id="username-container" class="signup-container">
          <label for="username">Username</label>
          <input required type="text" name="username" id="username">
        </div>
        <div id="password-container" class="signup-container">
          <label for="password">Password</label>
          <input required type="password" name="password" id="password" placeholder="Minimum 6 characters">
        </div>
        <div id="confirm-password-container" class="signup-container">
          <label for="confirm-password">Re-enter password</label>
          <input required type="password" name="confirm-password" id="confirm-password">
        </div>
        <div id="email-container" class="signup-container">
          <label for="email">Email</label>
          <input required type="email" name="email" id="email">
        </div>
        <input type="submit" class="btn--push-large" value="Submit">
      </fieldset>
    </form>
  `
}

function generateLoginForm() {
  return `
    <h1 id="h1--login">Sign In</h1>
    <form id="form--login">
      <fieldset>
        <legend class="hidden">Please enter your information</legend>
        <div id="username-container" class="signup-container">
          <label for="username">Username</label>
          <input required type="text" name="username" id="username">
        </div>
        <div id="password-container" class="signup-container">
          <label for="password">Password</label>
          <input required type="password" name="password" id="password">
        </div>
        <input type="submit" class="btn--push-large" value="Enter">
      </fieldset>
    </form>
  `
}

function createNewUser(userInfo) {
  const options = {
    method: 'POST',
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(userInfo)
  }
  return fetch('/users', options);
}

function userLogin(userInfo) {
  const options = {
    method: 'POST',
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({
      username: userInfo.username,
      password: userInfo.password
    })
  }
  return fetch('/auth/login', options)
    .then(res => res.json())
    .then(token => token)
    .catch(err => console.error(err));
}

function updateUserCharacterId(character_id) {
  const options = {
    method: 'PUT',
    headers: new Headers({
      'Authorization': 'Bearer ' + localStorage.authToken,
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({
      characterId: character_id
    })
  }
  return fetch('/users', options);
}

function startGame(character) {
  generateStoryHeader();
  backgroundCheck(character.bookmark);
  if (!character) {
    setupChooseCharacter();
    return;
  }
  displayStory(character.bookmark);
}

function backgroundCheck(bookmark) {
  const bg1 = ['1-1', '1-2a', '1-2b'];
  const bg2 = ['1-a3', '1-b3', '1-a4', '1-b4', '1-a5a', '1-b5a', '1-a5b', '1-b5b', '1-aa6', '1-ab6a', '1-ab6b', '1-ba6', '1-bb6a', '1-bb6b'];
  const bg3 = ['1-aa7', '1-aba7', '1-bba7a', '1-bba7b', '1-ba7', '1-bba7', '1-abb7a', '1-abb7b', '1-bbb7a', '1-bbb7b'];
  if (bg1.some(scene => bookmark === scene)) {
    $('main').css('background-image', 'url(../images/bg/valley.jpg');
  }
  if (bg2.some(scene => bookmark === scene)) {
    $('main').css('background-image', 'url(../images/bg/river.gif');
  }
  if (bg3.some(scene => bookmark === scene)) {
    $('main').css('background-image', 'url(../images/bg/river-night.gif');
  }
}

function getCharacterObj() {
  const options = {
    headers: new Headers({
      'Authorization': 'Bearer ' + localStorage.authToken
    })
  };
  return fetch('/character', options)
}

/* Handlers */

function mainListener() {
  $('#frame').click(event => {
    const target = $( event.target );

    if (target.is( '.btn--next' )) {
      // Check for background change
      backgroundCheck(target.val());
      // Advance story based on button value
      advanceStory(target.val());
    };

    if (target.is( '.btn--combat' )) {
      let enemyName;
      if (target.val() === 'trog') {
        enemyName = 'Troglodyte';
      }
      if (target.val() === 'gobl') {
        enemyName = 'Goblin';
      }
      startCombat(enemyName);
    }

    if (target.is( '.btn--restart' )) {
      $('header').html(generateMenuHeader());
      $('main').css('background-image', 'url(../images/bg/bg1.jpg');
      fetch(`/character`, {
        headers: new Headers({
          'Authorization': 'Bearer ' + localStorage.authToken
        }),  
        method: 'DELETE'
      });
      setupChooseCharacter();
    }

    if (target.is( '#btn--enter' )) {
      const newUserForm = generateNewUserForm();
      $('#frame').html(newUserForm);
    }

    if (target.is( '.btn--end-combat' )) {
      $('#frame').removeClass('combat--screen');
      $('#frame').css('background-color', 'rgb(0,0,0,.80)');

      if (target.val() === '1-a3') {
        advanceStory('1-a4');
      } else if (target.val() === '1-b3') {
        advanceStory('1-b4');
      }

      if (target.val() === '1-a5a') {
        advanceStory('1-aa6');
      } else if (target.val() === '1-b5a') {
        advanceStory('1-ba6');
      }
    }
  });

  $('#frame').on('submit', '#js--action-form', function(event) {
      event.preventDefault();
      const player = JSON.parse(sessionStorage.getItem('player'));
      const enemy = JSON.parse(sessionStorage.getItem('enemy'));
      const enemyAction = sessionStorage.getItem('enemyAction');
      const playerAction = $('select option:selected').val();
      combat(player, enemy, playerAction, enemyAction);
  });

  $('#frame').on('submit', '#form--signup', function(event) {
    event.preventDefault();
    const userInfo = {
      username: $('#username').val(),
      password: $('#password').val(),
      confirmPassword: $('#confirm-password').val(),
      email: $('#email').val()
    };
    createNewUser(userInfo)
      .then(() => {
        userLogin(userInfo)
          .then(res => localStorage.setItem('authToken', res.authToken))
          .catch(err => console.error(err));
        setupChooseCharacter();
      })
      .catch(err => console.error(err));
  });

  $('#frame').on('submit', '#form--login', function(event) {
    event.preventDefault();
    const userInfo = {
      username: $('#username').val(),
      password: $('#password').val()
    };
    userLogin(userInfo)
      .then(res => {
        localStorage.setItem('authToken', res.authToken);
        getCharacterObj()
          .then(res => res.json())
          .then(character => startGame(character))
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  });
}

function headerListener() {
  $('header').click(event => {
    event.preventDefault();
    const target = $( event.target );

    if (target.is( '.btn--login' )) {
      if (localStorage.authToken) {
        refreshJWT()
          .then(res => {
            localStorage.setItem('authToken', res.authToken);
            getCharacterObj()
              .then(res => res.json())
              .then(character => startGame(character))
              .catch(err => {
                console.error(err);
                setupChooseCharacter();
              });
            })
          .catch(err => console.error(err));
      } else {
        const loginForm = generateLoginForm();
        $('#frame').html(loginForm);
      }
    }

    if (target.is( '.btn--story' )) {
      getCharacterObj()
        .then(res => res.json())
        .then(character => displayStory(character.bookmark))
        .catch(err => console.error(err));
    }
    
    if (target.is( '.btn--character' )) {
      displayCharacterInfo();
    }

    if (target.is( '.btn--signout' )) {
      localStorage.clear();
      location.reload();
    }

    if (target.is( '#img--menu' )) {
      $( '#nav--mobile-menu' ).toggleClass('hidden');
    }

    if (target.is( '#img--nav-icon' )) {
      location.reload();
    }
  });

  // Hide mobile menu when user clicks outside of it
  $('body').mouseup(event => {
    const menu = $('#nav--mobile-menu');
    if (!menu.is(event.target) // if the target of the click is neither the container...
    && menu.has(event.target).length === 0) // nor a descendant of the container
    {
      menu.addClass('hidden');
    }
  });
}

function chooseCharacterHandler() {
  $('#form--choose-character').change(event => {
    $('form label').removeClass('radio-selected');
    const target = $(event.target);
    target.next('label').addClass('radio-selected');

    const selection = $('input[type=radio]:checked').val();
    const newCharacterInfo = generateNewCharacterInfo(selection);
    $('#new-character-info').html(newCharacterInfo);
  });
  $('#form--choose-character').submit(event => {
    event.preventDefault();
    const selection = $('input[type=radio]:checked').val();
    fetch('/character/new?class=' + selection, {
      headers: new Headers({
        'Authorization': 'Bearer ' + localStorage.authToken,
      }),
      method: 'POST'
    })
      .then(res => res.json())
      .then(character => {
        updateUserCharacterId(character._id)
          .then(() => {
            refreshJWT()
              .then(res => {
                localStorage.setItem('authToken', res.authToken)
                startGame(character);
              })
              .catch(err => console.error(err));
          })
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  });
}

/* Choose character */

function setupChooseCharacter() {
  const chooseCharacter = generateNewCharacterForm();
  $('#frame').html(chooseCharacter);
  chooseCharacterHandler();
}

function generateNewCharacterForm() {
  return `
    <form id="form--choose-character">
      <fieldset>
        <legend align="center">Choose your character</legend>
        <input type="radio" name="character" id="mage" value="mage" required/>
        <label for="mage">Mage</label>
        <input type="radio" name="character" id="thief" value="thief" required/>
        <label for="thief">Thief</label>
        <input type="radio" name="character" id="warrior" value="warrior" required/>
        <label for="warrior">Warrior</label></br>
        <section id="new-character-info">
          <p>Select a character for more info</p>
        </section>
        <input id="btn--start" class="btn--push-large" type="submit" value="Start"/>
      </fieldset>
    </form>
  `
}

function generateNewCharacterInfo(selection) {
  if (selection === 'mage') {
    return `<p>Low strength and HP</p><p>High magic and MP.</p><p>Special ability: Missile - launch an unblockable bolt of magic energy</p>`
  } else if (selection === 'thief') {
    return `<p>Average strength, HP, and MP</p><p>High evasion and accuracy.</p><p>Special ability: Double Strike - attack twice in one turn</p>`
  } else {
    return `<p>High strength an HP</p><p>Low magic and MP.</p><p>Special ability: Smash - an unblockable rage-filled strike</p>`
  }
}

/* Story */

function generateStoryHeader() {
  $('header').html(`
    <section class="navbar">
      <img src="./images/tree-logo.jpg" alt="Tree logo" id="img--nav-icon" />
      <h2 id="h2--nav-title">Dendrion</h2>
      <img id="img--menu" src="./images/menu.png" alt="Menu - click for options" />
      <nav class="hidden" id="nav--mobile-menu">
        <ul>
          <li><button class="btn--story">Story</button></li>
          <li><button class="btn--character">Character</button></li>
          <li><button class="btn--signout">Sign out</button></li>
        </ul>
      </nav>
      <button class="btn--header btn--story">Story</button>
      <button class="btn--header btn--character">Character</button>
      <button class="btn--header btn--signout">Sign out</button>
    </section>
  `);
}

function displayStory(bookmark) {
  const options = {
    headers: new Headers({
      'Authorization': 'Bearer ' + localStorage.authToken
    })
  };
  fetch('/story', options)
    .then(res => res.json())
    .then(scene => {
      const chooseNextScene = scene.next.reduce((string, button) => string + button, '');
      $('#frame').html(scene.text);
      $('#frame').append(`
        <div class="button-container">
          ${chooseNextScene}
        </div>
      `);
    })
    .catch(err => console.error(err));
}

function displayCharacterInfo() {
  getCharacterObj()
    .then(res => res.json())
    .then(char => {
      $('#frame').html( `
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

function advanceStory(nextScene) {
  // Update bookmark and display next scene
  putRequest(`/character/bookmark`, {bookmark: nextScene})
    .then(() => {
      generateStoryHeader();
      displayStory(nextScene);
    })
    .catch(err => console.error(err));
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
    <h1 class="combat--h1">Combat</h1>
  `);
  $('#frame').addClass('combat--screen');
  $('#frame').css('background-color', 'black');
  $('#frame').html(`
    <div class="combat--container">
      <section class="combat--character"></section>
      <section class="combat--log">
        <ul></ul>
      </section>
      <section class="combat--enemy"></section>
    </div>
  `);
}

function displayPlayerInfo(player) {
  const actionsArray = Object.keys(player.actions);
  const optionString = generateOptionString(actionsArray);
  
  $('.combat--character').html(`
    <div class="icon">
      <img src="./images/characters/${player.class}-icon.gif" alt="${player.class} icon" />
    </div>
    <div class="vitals">
      <h3>HP: ${player.attributes.hp}</h3>
      <h3>MP: ${player.attributes.mp}</h3>
    </div>
    <div class="actions">
      <form class="action-form" id="js--action-form">
        <fieldset>
          <legend>Choose an action</legend>
          <select name="action-menu" id="action-menu" required>
            ${optionString}
          </select>
          <section class="action-info">
            <p>${player.actions[actionsArray[0]].info}</p>
          </section>
          <input type="submit" class="btn--action-submit" value="Fight">
        </fieldset>
      </form>
    </div>
  `);
}

function displayEnemyInfo(enemy) {
  const enemyActions = Object.keys(enemy.actions);
  const enemyActionsList = enemyActions.reduce((actionsList, _action, index) => {
    const action = _action.slice(0,1).toUpperCase() + _action.slice(1);
    const result = actionsList + `<p class="enemy-action block-centered">${action}</p>`;
    return result;
  }, '<h3>Actions</h3>');

  $('.combat--enemy').html(`
    <div class="icon">
      <img src="${enemy.imgSrc}" alt="${enemy.alt}">
    </div>
    <div class="vitals">
      <h3>HP: ${enemy.attributes.hp}</h3>
      <h3>MP: ${enemy.attributes.mp}</h3>
    </div>
    <div class="name">
      <h2>${enemy.name}</h2>
    </div>
    <div class="enemy-actions">
      ${enemyActionsList}
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

function startCombat(enemyName) {
  const options = {
    headers: new Headers({
      'Authorization': 'Bearer ' + localStorage.authToken
    })
  };
  getCharacterObj()
    .then(res => res.json())
    .then(player => {
      fetch(`/story/enemy/${enemyName}`, options)
        .then(res => res.json())
        .then(enemy => {
          displayCombatScreen();
          displayPlayerInfo(player);
          displayEnemyInfo(enemy);
          handleActionInfo(player);
          sessionStorage.setItem('player', JSON.stringify(player));
          sessionStorage.setItem('enemy', JSON.stringify(enemy));
          sessionStorage.setItem('enemyAction', determineEnemyAction(enemy));
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
 * 8) Check for victory/loss conditions
 * 9) Update player and enemy in storage
 * 10) Determine enemy action for next turn
*/

function combat(player, enemy, playerAction, enemyAction) {
  playerTurn(player, enemy, playerAction);
    if (enemy.attributes.hp <= 0) {return}
  enemyTurn(player, enemy, enemyAction);
    if (player.attributes.hp <= 0) {return}
  setScrollPosition();
  displayPlayerInfo(player);
  displayEnemyInfo(enemy);

  sessionStorage.setItem('player', JSON.stringify(player));
  sessionStorage.setItem('enemy', JSON.stringify(enemy));
  sessionStorage.setItem('enemyAction', determineEnemyAction(enemy));
  setScrollPosition();
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
      player.attributes.mp -= player.actions.dblStrike.mpCost;

      for (let i = 0; i < 2; i++) {
        playerAttack(player, enemy);
      }
      break;
    }
    case 'smash': {
      const smashString = generateHTML('li', player.class + ' becomes enraged!');
      appendHTML('.combat--log ul', smashString);

      const damage = calcPlayerDamage(player, enemy, 'smash');
      player.attributes.mp -= player.actions.smash.mpCost;
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
    $('.combat--log').append(`<p class="block-centered">You defeated ${enemy.name}!</p>`);
    $('.btn--action-submit').replaceWith(`<button type="button" class="btn--end-combat" id="${enemy.name}" value="${player.bookmark}">End Combat</button>`);
    setScrollPosition();

    // Update character hp and mp in DB
    const updateObj = {
      hp: player.attributes.hp,
      mp: player.attributes.mp
    };
    putRequest('/character', updateObj);

  } else if (condition === 'loss') {
    $('.combat--log').append(`<p class="block-centered">You have been slain by ${enemy.name}!</p><p>Start a new character and try another path!</p>`);
    $('.btn--action-submit').replaceWith('<button class="btn--restart" type="button" id="js--end-combat">New Character</button>');
    setScrollPosition();

    const updateObj = {
      hp: player.attributes.hp,
      mp: player.attributes.mp
    }
    putRequest('/character', updateObj);
  }
}

$(function() {
  mainListener();
  headerListener();
})