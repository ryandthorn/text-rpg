'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const expect = chai.expect;

const { TEST_DATABASE_URL } = require('../config');
const { app, closeServer, runServer } = require('../server');
const { Character, Enemy, Adventure } = require('../models');
const { storyData, enemyData, characterData } = require('./test-data');

chai.use(chaiHttp);

function seedCharacterData() {
  console.info('Seeding character data');
  return Character
    .create(characterData.mage, characterData.thief, characterData.warrior);
}
function seedStoryData() {
  console.info('Seeding story data');
  return Adventure.create(storyData);
}
function seedEnemyData() {
  console.info('Seeding enemy data');
  return Enemy.create(enemyData);
}

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('Text RPG', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });
  beforeEach(function() {
    return seedStoryData();
  });
  beforeEach(function() {
    return seedEnemyData();
  });
  // beforeEach(function() {
  //   return seedCharacterData();
  // });
  afterEach(function() {
    return tearDownDb();
  })
  after(function() {
    return closeServer();
  });

  it('should serve index from public folder', function() {
    return chai
      .request(app)
      .get('/')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });

  describe('/character endpoint', function() {
    it('should create a new character on POST /', function() {
      return chai.request(app)
        .post('/character/new?class=mage')
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys('_id', '__v', 'bookmark', 'actions', 'class', 'attributes', 'skills');
          expect(res.body.class).to.equal('Mage');
        });
    });
  
    it('should return the character object on GET ?id=', function() {
      return chai.request(app)
        .post('/character/new?class=mage')
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys('_id', '__v', 'bookmark', 'actions', 'class', 'attributes', 'skills');
          expect(res.body.class).to.equal('Mage');

          const queryID = res.body._id;
          return chai.request(app)
            .get(`/character?id=${queryID}`)
            .then(function(res) {
              expect(res).to.have.status(200);
              expect(res.body).to.be.a('object');
              expect(res.body._id).to.equal(queryID);
              expect(res.body).to.have.keys('_id', '__v', 'bookmark', 'actions', 'class', 'attributes', 'skills');
            });
        });
    });

    // it('should return the character's bookmark object on GET /bookmark?id=', function() {});
    // it('should update the character's bookmark object on PUT /bookmark?id=', function() {});
  
    it('should update the character object on PUT ?id=', function() {
      return chai.request(app)
        .post('/character/new?class=mage')
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys('_id', '__v', 'bookmark', 'actions', 'class', 'attributes', 'skills');
          expect(res.body.class).to.equal('Mage');
          return res.body;
        })
        .then(function(character) {
          return chai.request(app)
            .put(`/character?id=${character._id}`)
            .set('Content-Type', 'application/json')
            .send({"hp": 4, "mp": 5})
        })
        .then(function(res) {
          expect(res).to.have.status(200);
          const character = res.body;
          expect(character.attributes.hp).to.equal(4);
          expect(character.attributes.mp).to.equal(5);
        });
    });

    it('should delete the character object on DELETE ?id=', function() {
      return chai.request(app)
        .post('/character/new?class=mage')
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys('_id', '__v', 'bookmark', 'actions', 'class', 'attributes', 'skills');
          expect(res.body.class).to.equal('Mage');

          const queryID = res.body._id;
          return chai.request(app)
            .delete(`/character?id=${queryID}`)
            .then(function(res) {
              expect(res).to.have.status(204);
            });
    });
  });

  describe('/story endpoint', function() {
    it('should get the story object on GET /', function() {
      return chai.request(app)
        .get('/story')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.haveOwnProperty('chapter1');
        });
    });

    it ('should get an enemy object on GET /enemy', function() {
      return chai.request(app)
        .get('/story/enemy')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body.name).to.equal('Troglodyte');
        });
    });

    // it('should set bookmark to 1:1 on POST', function() {
    //   expect(storyData.bookmark).to.be.undefined;
    //   return chai.request(app)
    //     .post('/story')
    //     .then(function(res) {
    //       expect(res).to.have.status(200);
    //       expect(res.body).to.be.a('object');
    //       expect(res.body.text).to.equal(storyData.chapter1.scene1.text);
    //     })
    // });

    // it('should get bookmark on GET', function() {
    //   return chai.request(app)
    //     .get('/story')
    //     .then(function(res) {
    //       expect(res).to.have.status(200);
    //       expect(res.body).to.be.a('object');
    //     });
    // });

    // it('should update bookmark position on PUT', function() {
    //   storyData.bookmark = storyData.chapter1.scene1;
    //   return chai.request(app)
    //     .put('/story')
    //     .then(function(res) {
    //       expect(res).to.have.status(200);
    //       expect(res.body).to.be.a('object');
    //       expect(res.body.text).to.equal(storyData.chapter1.scene2.text);
    //     });
    // });

    // it('should update bookmark position with options on PUT', function() {
    //   return chai.request(app)
    //     .put('/story')
    //     .then(function() {
    //       return chai.request(app)
    //       .put('/story/choice?choice=A')
    //       .then(function(res) {
    //         expect(res).to.have.status(200);
    //         expect(res.body).to.be.a('object');
    //         expect(res.body.text).to.equal(storyData.chapter1.scene4.a.text);
    //       });
    //     });
    });
  });
});