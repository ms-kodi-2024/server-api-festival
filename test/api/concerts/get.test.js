// WARNING: These tests must not modify the remote database!
// Only safe GET requests are used.

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../../server');
const expect = chai.expect;

chai.use(chaiHttp);

describe('GET /api/concerts', () => {
  it('should return all concerts', async function () {
    this.timeout(5000);
    const res = await chai.request(app).get('/api/concerts');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('should return one concert by :id if exists', async () => {
    const knownId = '67f2a42b216996bb09b7123a';
    const res = await chai.request(app).get(`/api/concerts/${knownId}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body._id).to.equal(knownId);
  });
});
