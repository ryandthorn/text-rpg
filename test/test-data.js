'use strict';

const storyData = [
  {
    scene: '1-1',
    text: 'Chapter 1, Scene 1',
    next: [
      '1-2'
    ]
  },
  {
    scene: '1-2',
    text: 'Chapter 1, Scene 2',
    next: [
      '1-3a',
      '1-3b'
    ]
  }
];

const enemyData = {
  name: "Troglodyte",
  imgSrc: "images/grzyb-troglodyte-full.jpg",
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

const characterData = {
  class: 'Mage',
  bookmark: '1-1',
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
};

const userData = {
  username: "testy",
  password: "password",
  email: "test@test.com"
};

module.exports = { storyData, enemyData, characterData, userData }; 