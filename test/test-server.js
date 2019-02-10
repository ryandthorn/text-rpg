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

function seedUserData() {
  console.info('Seeding user data');
  return User
    .hashPassword(userData.password)
    .then(hash => {
      return User.create({
        username: userData.username,
        password: hash,
        email: userData.email
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
    })
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

    it('should wait a second so the next test passes consistently', function() {
      // This test prevents a race condition between
      // the previous test and the next.
      return chai.request(app)
        .post('/auth/login')
        .send(loginInfo)
        .then(function(res) {
          // This token is not stored
          expect(res).to.have.status(200);
          expect(res.body).to.have.key('authToken');
        })
        .catch(function(err) {throw err});
    });

    it("should refresh a valid JWT on POST /refresh", function() {
      return chai.request(app)
        .post('/auth/refresh')
        .set('Authorization', 'Bearer ' + storedToken)
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res.body).to.have.key('authToken');
          expect(res.body.authToken).to.not.equal(storedToken);
        })
        .catch(function(err) {throw err});
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

    it("should update user's characterId field on PUT /", function() {
      return seedUserData()
        .then(() => {
          return chai.request(app)
          .post('/auth/login')
          .send(loginInfo)
          .then(function(res) {
            expect(res).to.have.status(200);
            return chai.request(app)
              .put('/users')
              .set('Authorization', 'Bearer ' + res.body.authToken)
              .send({characterId: "5c5f04796b2bf800174515c3"})
              .then(function(res) {
                expect(res).to.have.status(204);
              })
              .catch(function(err) {throw err});
          });  
        })
        .catch(err => console.error(err));
    });
  });

  // describe('/character endpoint', function() {
  //   beforeEach(function() {
  //     return seedCharacterData();
  //   });
  //   afterEach(function() {
  //     return tearDownDb();
  //   });

  //   it('should create a new character on POST /', function() {
  //     return chai.request(app)
  //       .post('/character/new?class=mage')
  //       .then(function(res) {
  //         expect(res).to.have.status(201);
  //         expect(res.body).to.be.a('object');
  //         expect(res.body).to.have.keys('_id', '__v', 'bookmark', 'actions', 'class', 'attributes', 'skills');
  //         expect(res.body.class).to.equal('Mage');
  //       });
  //   });
  
  //   it('should return the character object on GET ?id=', function() {
  //     return chai.request(app)
  //       .post('/character/new?class=mage')
  //       .then(function(res) {
  //         expect(res).to.have.status(201);
  //         expect(res.body).to.be.a('object');
  //         expect(res.body).to.have.keys('_id', '__v', 'bookmark', 'actions', 'class', 'attributes', 'skills');
  //         expect(res.body.class).to.equal('Mage');

  //         const queryID = res.body._id;
  //         return chai.request(app)
  //           .get(`/character?id=${queryID}`)
  //           .then(function(res) {
  //             expect(res).to.have.status(200);
  //             expect(res.body).to.be.a('object');
  //             expect(res.body._id).to.equal(queryID);
  //             expect(res.body).to.have.keys('_id', '__v', 'bookmark', 'actions', 'class', 'attributes', 'skills');
  //           });
  //       });
  //   });

  //   it("should return the character's bookmark object on GET /bookmark?id=", function() {
  //     return chai.request(app)
  //       .post('/character/new?class=mage')
  //       .then(function(res) {
  //         expect(res).to.have.status(201);
  //         expect(res.body).to.be.a('object');
  //         expect(res.body).to.have.keys('_id', '__v', 'bookmark', 'actions', 'class', 'attributes', 'skills');
  //         expect(res.body.class).to.equal('Mage');

  //         const queryID = res.body._id;
  //         return chai.request(app)
  //           .get(`/character/bookmark?id=${queryID}`)
  //           .then(function(res) {
  //             expect(res).to.have.status(200);
  //             expect(res.body).to.be.a('object');
  //             expect(res.body).to.have.keys('chapter', 'scene', 'next');
  //           });
  //     });
  //   });

  //   it("should update the character's bookmark object on PUT /bookmark?id=", function() {
  //     return chai.request(app)
  //       .post('/character/new?class=mage')
  //       .then(function(res) {
  //         expect(res).to.have.status(201);
  //         expect(res.body).to.be.a('object');
  //         expect(res.body).to.have.keys('_id', '__v', 'bookmark', 'actions', 'class', 'attributes', 'skills');
  //         expect(res.body.class).to.equal('Mage');
  //         return res.body;
  //       })
  //       .then(function(character) {
  //         return chai.request(app)
  //           .put(`/character/bookmark?id=${character._id}`)
  //           .set('Content-Type', 'application/json')
  //           .send(JSON.stringify({
  //             bookmark: {
  //               chapter: "chapter1",
  //               scene: "scene2",
  //               next: [
  //                 {
  //                   chapter: "chapter1",
  //                   scene: "scene3"
  //                 }
  //               ]
  //             }
  //           }));
  //       })
  //       .then(function(res) {
  //         expect(res).to.have.status(200);
  //         const bookmark = res.body.bookmark;
  //         expect(bookmark).to.be.a('object');
  //         expect(bookmark.chapter).to.equal('chapter1');
  //         expect(bookmark.scene).to.equal('scene2');
  //         expect(bookmark.next).to.be.a('array');
  //         expect(bookmark.next[0]).to.have.keys('chapter', 'scene');
  //         expect(bookmark.next[0].chapter).to.equal('chapter1');
  //         expect(bookmark.next[0].scene).to.equal('scene3');    
  //       });
  //   });
  
  //   it('should update the character object on PUT ?id=', function() {
  //     return chai.request(app)
  //       .post('/character/new?class=mage')
  //       .then(function(res) {
  //         expect(res).to.have.status(201);
  //         expect(res.body).to.be.a('object');
  //         expect(res.body).to.have.keys('_id', '__v', 'bookmark', 'actions', 'class', 'attributes', 'skills');
  //         expect(res.body.class).to.equal('Mage');
  //         return res.body;
  //       })
  //       .then(function(character) {
  //         return chai.request(app)
  //           .put(`/character?id=${character._id}`)
  //           .set('Content-Type', 'application/json')
  //           .send({"hp": 4, "mp": 5});
  //       })
  //       .then(function(res) {
  //         expect(res).to.have.status(200);
  //         const character = res.body;
  //         expect(character.attributes.hp).to.equal(4);
  //         expect(character.attributes.mp).to.equal(5);
  //       });
  //   });

  //   it('should delete the character object on DELETE ?id=', function() {
  //     return chai.request(app)
  //       .post('/character/new?class=mage')
  //       .then(function(res) {
  //         expect(res).to.have.status(201);
  //         expect(res.body).to.be.a('object');
  //         expect(res.body).to.have.keys('_id', '__v', 'bookmark', 'actions', 'class', 'attributes', 'skills');
  //         expect(res.body.class).to.equal('Mage');

  //         const queryID = res.body._id;
  //         return chai.request(app)
  //           .delete(`/character?id=${queryID}`)
  //           .then(function(res) {
  //             expect(res).to.have.status(204);
  //           });
  //       });
  //   });
  // });

  // describe('/story endpoint', function() {
  //   beforeEach(function() {
  //     return seedStoryData();
  //   });
  //   afterEach(function() {
  //     return tearDownDb();
  //   })
  //   it('should get the story object on GET /', function() {
  //     return chai.request(app)
  //       .get('/story')
  //       .then(function(res) {
  //         expect(res).to.have.status(200);
  //         expect(res.body).to.be.a('object');
  //         expect(res.body).to.haveOwnProperty('chapter1');
  //       });
  //   });

  //   it ('should get an enemy object on GET /enemy', function() {
  //     seedEnemyData();
  //     return chai.request(app)
  //       .get('/story/enemy')
  //       .then(function(res) {
  //         expect(res).to.have.status(200);
  //         expect(res.body).to.be.a('object');
  //         expect(res.body.name).to.equal('Troglodyte');
  //       });
  //   });
  // });
});