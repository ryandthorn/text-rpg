'use strict';

function startStory() {
  $.post('/story')
    .done(() => {
      displayStory();
      displayCharacterInfo();
    });
}

function displayStory() {
  $.get('/story')
    .done((story) => {
      $('main').html(story.text);
      buttonListener();
    });
}

function displayCharacterInfo() {
  $.get('/character')
    .done((char) => {
      $('aside').html( `
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
  $('.hit').click(event => {
    event.preventDefault();
    $.ajax({
      url: 'http://localhost:8080/character/update?hp=-2&mp=-1',
      type: 'PUT',
      // data: {hp: -2, mp: -1},
      // dataType: "json",
      success: function(data) {
        console.log('Update was performed.');
        console.log(data);
        displayCharacterInfo();
      }
    });
  });

  // $('.next-page').click(event => {
  //   event.preventDefault()
  //   // PUT => update bookmark and send next scene
  //   displayStory();
  // })

  // $('.recover').click(event => {
  //   event.preventDefault();
  //   characterData.update({hp: 2, mp: 1});
  //   $('aside').html(displayCharacterInfo());
  // });
}

function startGame() {
  $('form').remove();
  $('header').html(`<h1>Chapter 1</h1>`);
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
  $('form').submit(function(event) {
    event.preventDefault();
    const selection = $('input[type=radio]:checked').val();
    $.post('/character')
      .done((res) => {
        startGame();
      });
  });
}

selectCharacterHandler();