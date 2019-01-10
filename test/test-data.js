'use strict';

const storyData = {
  chapter1: {
    scene1: {
      text: "<p class=\"text--first-person\">How long have I been in here? Days? ...Weeks?</p><p>You'd heard the stories: people running out of the cave, stark raving mad and half-dead.All of them clutching at their burning eyes, screaming about unnatural beings deep within.</p><p>You'd also heard the others: riches beyond belief. Ruins of an ancient civilization, artifacts capable of giving their masters untold power. A portal to heaven itself.</p><p class=\"text--first-person\">What do stories mean to me anymore? Maybe I'm already gone.</p><p class=\"text--first-person\">Death... how could it be worse than this?</p><input class=\"btn--next\" type=\"button\" value=\"Continue\"/>",
      next: [
        {
          chapter: "chapter1",
          scene: "scene2"
        }
      ]
    },
    scene2: {
      text: "<p>Your mind wanders into memories of the days before the darkness.</p><p class=\"text--first-person\">A cool breeze... the moon and stars... the sweet kiss of daylight...</p><p class=\"text--first-person\">I'll never take the light for granted again.</p><p>The darkness overwhelms you.</p><input class=\"btn--next\" type=\"button\" value=\"Continue\"/>",
      next: [
        {
          chapter: "chapter1",
          scene: "scene3"
        }
      ]
    },
    scene3: {
      text: "<p><span class=\"text--first-person\">Footsteps.</span></p><p>You feel your way back into a corner of the cell.</p><p class=\"text--first-person\">Slow... heavy. What moves like that?</p><input class=\"btn--next 13a\" type=\"button\" value=\"Call for help\" /><input class=\"btn--next 13b\" type=\"button\" value=\"Remain silent\"/>",
      next: [
        {
          chapter: "chapter1",
          scene: "scene4a"
        },
        {
          chapter: "chapter1",
          scene: "scene4b"
        }
      ]
    },
    scene4a: {
      text: "<p>Whatever is out there can't be worse than living in this darkness.</p><p>You call out: \"You there!! Please, HELP!!\"</p><input class=\"btn--next\" type=\"button\" value=\"Continue\"/>",
      next: [
        {
          chapter: "chapter1",
          scene: "scene5a"
        }
      ]
    },
    scene4b: {
      text: "<p>It might be your captor. You decide to wait and see how this plays out.</p><input class=\"btn--next\" type=\"button\" value=\"Continue\"/>",
      next: [
        {
          chapter: "chapter1",
          scene: "scene5b"
        }
      ]
    },
    scene5a: {
      text: "<p>You hear the whoosh of fire and a piercing hiss. Something large drops to the floor.</p><p class=\"text--first-person\">What the hell is out there??</p><p>Your cell door swings open. The blinding flash of light from the fire dazes you.</p><p>Just as your eyes adjust, you make out a grotesque, lizard-like creature. Its spear point tips toward you.</p><input class=\"btn--next\" type=\"button\" value=\"Continue\"/>",
      next: [
        {
          chapter: "chapter1",
          scene: "scene6"
        }
      ]
    },
    scene5b: {
      text: "<p>You hear a soft thud outside the cell door, soon followed by sharp, metallic scrapes.</p><p>Through a crack at the bottom of the door, you see the first glorious rays of light you've seen in who knows how long.</p><p>You hear keys at the door.</p><p class=\"text--first-person\">Rescue! Finally!!</p><p>As the door swings open, you see a grotesque, lizard-like creature. Its spear point tips toward you.</p><input class=\"btn--next\" type=\"button\" value=\"Continue\"/>",
      next: [
        {
          chapter: "chapter1",
          scene: "scene6"
        }
      ]
    },
    scene6: {
      text: "<p>The creature looks like it wants to fight.</p><input class=\"btn--combat\" type=\"button\" value=\"Start Combat\"/>",
      enemy: "Troglodyte",
      next: [
        {
          chapter: "chapter1",
          scene: "scene7"
        }
      ]
    },
    scene7: {
      text: "<p>You gaze back at the dead creature on the floor of your cell, and you quickly decide to take this chance to escape.</p><p>Stepping out of your cell, you look towards the light and discover...</p><p class=\"text--first-person\">A corpse. Burnt. The smell... I've got to get out of here.</p><p>You pick up the lit torch beside the charred cadaver.</p><p class=\"text--first-person\">As long as I live, this light will not go out.</p><input class=\"btn--restart\" type=\"button\" value=\"New Character\"/>",
      next: [
        {
          chapter: "chapter2",
          scene: "scene1"
        }
      ]
    }
  }
};

const characterData = {
  mage: {
    bookmark: {
      chapter: 'chapter1',
      scene: 'scene1',
      next: [
        {
          chapter: 'chapter1',
          scene: 'scene2'
        }
      ]
    },
    class: 'Mage',
    attributes: {
      hp: 8,
      mp: 12,
      maxHP: 8,
      maxMP: 12,
      str: 6,
      agi: 10,
      mag: 12,
      con: 8
    },
    skills: {
      phyDamage: -1,
      phyResist: -1,
      accuracy: 1,
      evasion: 1,
      magDamage: 2,
      magResist: 2,
      fortitude: 0,
      damReduce: 0
    },
    actions: {
      attack: {
        info: `Physical attack for 1-6 damage`,
        damage: [1, 6]
      },
      defend: {
        info: `Take a defensive stance. +5 defense bonus vs enemy to-hit roll.`,
        damage: [1, 4],
        defendBonus: 0
      },
      missile: {
        info: `Shoot a magic missile at your opponent. 1-6 + 4 damage (-2 MP)`,
        damage: [1, 8, 4],
        mpCost: 2
      }
    }
  },
  thief: {
    bookmark: {
      chapter: 'chapter1',
      scene: 'scene1',
      next: [
        {
          chapter: 'chapter1',
          scene: 'scene2'
        }
      ]
    },
    class: 'Thief',
    attributes: {
      hp: 10,
      mp: 10,
      maxHP: 10,
      maxMP: 10,
      str: 8,
      agi: 12,
      mag: 8,
      con: 10
    },
    skills: {
      phyDamage: 0,
      phyResist: 0,
      accuracy: 2,
      evasion: 2,
      magDamage: 0,
      magResist: 0,
      fortitude: 1,
      damReduce: 1
    },
    actions: {
      attack: {
        info: `Physical attack for 1-6 damage`,
        damage: [1, 6]
      },
      defend: {
        info: `Take a defensive stance. +5 defense bonus vs enemy to-hit roll.`,
        damage: [1, 4],
        defendBonus: 0
      },
      dblStrike: {
        info: `Attack twice this turn (-2 MP)`,
        damage: [1, 6],
        mpCost: 2
      }
    }
  },
  warrior: {
    bookmark: {
      chapter: 'chapter1',
      scene: 'scene1',
      next: [
        {
          chapter: 'chapter1',
          scene: 'scene2'
        }
      ]
    },
    class: 'Warrior',
    attributes: {
      hp: 12,
      mp: 8,
      maxHP: 12,
      maxMP: 8,
      str: 10,
      agi: 8,
      mag: 6,
      con: 12
    },
    skills: {
      phyDamage: 1,
      phyResist: 1,
      accuracy: 0,
      evasion: 0,
      magDamage: -1,
      magResist: -1,
      fortitude: 2,
      damReduce: 2
    },
    actions: {
      attack: {
        info: `Physical attack for 1-6 damage`,
        damage: [1, 6]
      },
      defend: {
        info: `Take a defensive stance. +5 defense bonus vs enemy to-hit roll.`,
        damage: [1, 4],
        defendBonus: 0
      },
      smash: {
        info: `An unavoidable crushing blow. 3-5 + 4 damage (-2 MP)`,
        damage: [3, 5, 4],
        mpCost: 2
      }
    }
  }
};

const enemyData = {
  name: "Troglodyte",
  imgSrc: "images/grzyb-troglodyte-full.jpg",
  imgSrcSet: "images/grzyb-troglodyte-tiny.jpg 300w, images/grzyb-troglodyte-small.jpg 600w, images/grzyb-troglodyte-full.jpg 900w",
  alt: "This eyeless, misshapen creature wields a sharp spear.",
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
    phyDam: -1,
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
        "The troglodyte lowers its spear...",
        "The troglodyte shifts its weight forward...",
        "The troglodyte hisses..."
      ],
      damage: [
        1,
        4
      ]
    },
    defend: {
      text: [
        "The troglodyte takes a defensive stance...",
        "The troglodyte steps back...",
        "The troglodyte hesitates..."
      ],
      defendBonus: 0
    }
  }
}

module.exports = { characterData, storyData, enemyData }; 