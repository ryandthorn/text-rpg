'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, closeServer, runServer } = require('../server');
const { characterData } = require('./test-data');

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

  it('should create a new character on user input', function() {
    expect(characterData.character).to.be.undefined;
    characterData['character'] = characterData.createCharacter('mage');
    expect(characterData.character).to.be.a('object');
    expect(characterData.character).to.have.keys('class', 'attributes', 'skills');
  });
});