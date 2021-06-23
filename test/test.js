const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./../server/index.js');

const { expect } = require('chai');

chai.use(chaiHttp);
describe("MBTI Perspective Test", () => {
  it('Submit result', () => {
    return chai.request(app)
      .post('/result')
      .set('Content-Type', 'application/json')
      .send({
        '0': 1,
        '1': 2,
        '2': 3,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 5,
        '7': 6,
        '8': 7,
        '9': 5,
        mbtiScore: 'ESTP',
        email: 'johndoe@email.com'
      })
      .then(res => {
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('mbtiscore');
        expect(res.body).to.have.property('id');
    });
  });
});