'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, closeServer, runServer } = require('../server');

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
});