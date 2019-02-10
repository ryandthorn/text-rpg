'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const expect = chai.expect;

const { TEST_DATABASE_URL } = require('../config');
const { app, closeServer, runServer } = require('../server');
const { Character, Enemy, Adventure } = require('../models');
const { User } = require('../users/models');
const { storyData, enemyData, characterData, userData } = require('./test-data');

chai.use(chaiHttp);

function seedStoryData() {
  console.info('Seeding story data');
  return Adventure.create(storyData);
}

function seedEnemyData() {
  console.info('Seeding enemy data');
  return Enemy.create(enemyData);
}

function seedCharacterData() {
  console.info('Seeding character data');
  return Character.create(characterData);
}

function seedUserData(charId) {
  console.info('Seeding user data');
  return User
    .hashPassword(userData.password)
    .then(hash => {
      return User.create({
        username: userData.username,
        password: hash,
        email: userData.email,
        characterId: charId
      })
    })
    .catch(err => console.error(err));
}

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

const userInfo = {
  username: "testy",
  password: "password",
  confirmPassword: "password",
  email: "testy@email.com"
};

const loginInfo = {
  username: "testy",
  password: "password"
};

let storedToken;

function loginAndStoreToken() {
  return chai.request(app)
    .post('/auth/login')
    .send(loginInfo)
    .then(function(res) {
      storedToken = res.body.authToken;
      return;
    })
    .catch(function(err) {throw err});
}

describe('Text RPG', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });
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

  describe('/auth endpoint', function() {
    beforeEach(function() {
      return seedUserData();
    });
    it("should return a valid JWT on login to POST /login", function() {
      return chai.request(app)
        .post('/auth/login')
        .send(loginInfo)
        .then(function(res) {
          storedToken = res.body.authToken;
          expect(res).to.have.status(200);
          expect(res.body).to.have.key('authToken');
        })
        .catch(function(err) {throw err});
    });

    it("should refresh a valid JWT on POST /refresh", function() {
      // Because each token is generated using the user's username and characterId,
      // we have to update the characterId before generating the new token.
      
      // This prevents a race condition through which the test sometimes fails
      // when two identical tokens are produced.
      
      return loginAndStoreToken()
        .then(() => {
          return chai.request(app)
            .put('/users')
            .set('Authorization', 'Bearer ' + storedToken)
            .send({characterId: "5c5f04796b2bf800174515c3"})
            .then(function(res) {
              expect(res).to.have.status(204);
              return chai.request(app)
                .post('/auth/refresh')
                .set('Authorization', 'Bearer ' + storedToken)
                .then(function(res) {
                  expect(res).to.have.status(200);
                  expect(res.body).to.have.key('authToken');
                  expect(res.body.authToken).to.not.equal(storedToken);
                })
                .catch(function(err) {throw err}); 
            })
            .catch(function(err) {throw err});
        })
        .catch(err => {throw err});
    });
  });

  describe('/users endpoint', function() {
    it('should create a new user on POST /', function() {
      return chai.request(app)
        .post('/users')
        .send(userInfo)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res.body.username).to.equal('testy');
        })
        .catch(function(err) {throw err});
    });

    it("should assign a characterId to the user on PUT /", function() {
      // A characterId is the object ID generated on character creation
      // and is used for retrieving that character from the DB.
      
      return seedUserData()
        .then(() => loginAndStoreToken())
        .then(() => {
          return chai.request(app)
            .put('/users')
            .set('Authorization', 'Bearer ' + storedToken)
            .send({characterId: "5c5f04796b2bf800174515c3"})
            .then(function(res) {
              expect(res).to.have.status(204);
            })
            .catch(function(err) {throw err});
        })
        .catch(err => console.error(err));
    });
  });

  describe('/character endpoint', function() {
    beforeEach(function() {
      return seedCharacterData()
        .then(function(character) {
          return seedUserData(character._id)
            .then(function() {
              return seedStoryData();
            })
            .then(function() {
              return loginAndStoreToken();
            });
        });
    });

    it('should create a new character on POST /', function() {
      return chai.request(app)
        .post('/character/new?class=mage')
        .set('Authorization', 'Bearer ' + storedToken)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys('_id', '__v', 'bookmark', 'actions', 'class', 'attributes', 'skills');
          expect(res.body.class).to.equal('Mage');
        });
    });
  
    it("should get the user's character on GET /", function() {
      return chai.request(app)
        .get('/character')
        .set('Authorization', 'Bearer ' + storedToken)
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys('_id', '__v', 'bookmark', 'actions', 'class', 'attributes', 'skills');
        });
    });

    it("should update the character's bookmark on PUT /bookmark", function() {
      return chai.request(app)
        .put('/character/bookmark')
        .set('Authorization', 'Bearer ' + storedToken)
        .send({"bookmark": "1-2"})
        .then(function(res) {
          expect(res).to.have.status(204);
          return chai.request(app)
            .get('/character')
            .set('Authorization', 'Bearer ' + storedToken)
            .then(function(res) {
              expect(res).to.have.status(200);
              expect(res.body.bookmark).to.equal('1-2');
            })
            .catch(function(err) {throw err});
        })
        .catch(function(err) {throw err});
    });
  
    it("should update the character's stats on PUT /", function() {
      return chai.request(app)
        .put('/character')
        .set('Authorization', 'Bearer ' + storedToken)
        .send({"hp": 4, "mp": 5})
        .then(function(res) {
          expect(res).to.have.status(200);
          const character = res.body;
          expect(character.attributes.hp).to.equal(4);
          expect(character.attributes.mp).to.equal(5);
        })
        .catch(function(err) {throw err})
    });

    it('should delete the character object on DELETE /', function() {
      return chai.request(app)
        .delete('/character')
        .set('Authorization', 'Bearer ' + storedToken)
        .then(function(res) {
          expect(res).to.have.status(204);
        });
    });
  });

  describe('/story endpoint', function() {
    beforeEach(function() {
      return seedCharacterData()
        .then(function(character) {
          return seedUserData(character._id)
            .then(function() {
              return seedStoryData();
            })
            .then(function() {
              return seedEnemyData();
            })
            .then(function() {
              return loginAndStoreToken();
            });
        });
    });

    it("should get the current scene using the character's bookmark on GET /", function() {
      return chai.request(app)
        .get('/story')
        .set('Authorization', 'Bearer ' + storedToken)
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
        });
    });

    it ('should get an enemy by name on GET /enemy/:enemyName', function() {
      return chai.request(app)
        .get('/story/enemy/Troglodyte')
        .set('Authorization', 'Bearer ' + storedToken)
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body.name).to.equal('Troglodyte');
        });
    });
  });
});