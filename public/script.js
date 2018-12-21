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
    $.ajax({
      url: '/story',
      type: 'PUT',
      success: () => displayStory()
    });
  })
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

function startGame() {
  $('form').remove();
  $('header').html(`
    <h1>Chapter 1</h1>
    <input class="btn--story" type="button" value="Story" />
    <input class="btn--character" type="button" value="Character" />
  `);
  headerListener();
  startStory();
}

function loseGame() {
  $('header').html(`<h1>Defeated!</h1>`);
  $('main').html(`<button class="restart">Start new game</button>`);
  characterData.delete();
  $('button').click(event => {
    event.preventDefault();
    startGame();
  });
}

function selectCharacterHandler() {
  $('form').submit(event => {
    event.preventDefault();
    const selection = $('input[type=radio]:checked').val();
    $.post('/character/new?class=' + selection)
      .done(() => startGame());
  });
}

selectCharacterHandler();