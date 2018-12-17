'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, closeServer, runServer } = require('../server');
const { characterData, storyData } = require('./test-data');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Text RPG', function() {
  before(function() {
    runServer();
  });
  after(function() {
    closeServer();
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
    it('should create a new character on POST', function() {
      expect(characterData.character).to.be.undefined;
      return chai.request(app)
        .post('/character')
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys('class', 'attributes', 'skills');
        })
    });
  
    it('should return the character object on GET', function() {
      return chai.request(app)
        .get('/character')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys('class', 'attributes', 'skills');
        })
    });
  
    it('should update the character object on PUT', function() {
      let prevHP, prevMP;
      return chai.request(app)
        .get('/character')
        .then(function(res) {
          prevHP = res.body.attributes.hp;
          prevMP = res.body.attributes.mp;
          const update = {hp: -2, mp: -1};
          return chai.request(app)
            .put('/character')
            .send(update);
        })
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res.body.attributes.hp).to.equal(prevHP - 2);
          expect(res.body.attributes.mp).to.equal(prevMP - 1);
        });
    });
  
    it('should delete the character object on DELETE', function() {
      return chai.request(app)
        .delete('/character')
        .then(function(res) {
          expect(res).to.have.status(204);
        })
    });
  });

  describe('/story endpoint', function() {
    it('should set bookmark to 1:1 on POST', function() {
      expect(storyData.bookmark).to.be.undefined;
      return chai.request(app)
        .post('/story')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('string');
          expect(res.body).to.equal(storyData.chapter1.scene1);
        })
    })
  });
});