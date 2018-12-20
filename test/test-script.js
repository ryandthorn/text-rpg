'use strict';

function generateStory() {
  $('main').html(`
    <p>It was a dark and stormy lorem</p>
    <button class="next-page">Next page</button>
    <button class="hit">-2HP -1MP</button>
  `);
}

function generateCharacter() {
  $('main').html(`
    <section class="display-character" id="display-character">
      <h2>Warrior</h2>
      <h3>HP: 20 | MP: 5</h3>
      <h3>Attributes</h3>
      <ul>
        <li>Strength: 16</li>
        <li>Agility: 10</li>
        <li>Magic: 6</li>
        <li>Constitution: 12</li>
      </ul>
      <h3>Skills</h3>
      <ul>
        <li>Phys. Damage: 14</li>
        <li>Phys. Resist: 14</li>
        <li>Accuracy: 10</li>
        <li>Evasion: 10</li>
        <li>Mag. Damage: 6</li>
        <li>Mag. Resist: 6</li>
        <li>Fortitude: 12</li>
        <li>Phys. Ignore: 12</li>
      </ul>
    </section>
  `);
}

$('header').click(event => {
  event.preventDefault();
  const target = $( event.target );
  if (target.is( '.btn-story' )) {
    generateStory();
  } else if (target.is( '.btn-character' )) {
    generateCharacter();
  }
});