import app from '../server/';
import supertest from 'supertest';
import { expect, should } from 'chai';

const temp = {};
const request = supertest.agent(app.listen());
should();

describe('POST api/authenticate', () => {
  it('should get all users', done => {
    request
      .post('/api/authenticate')
      .set('Accept', 'application/json')
      .send({
        password: 'password'
      })
      .expect(200, (err, res) => {
        temp.token = res.body.token;
        done();
      });
  });
});

describe('POST /user', () => {
  it('should add a user', done => {
    request
      .post('/api/users')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${temp.token}`)
      .send({
        name: 'Kiros',
        email: 'kiros.mata@gmail.com',
        country: 'Ukraine',
        zipCode: 1200
      })
      .expect(200, (err, res) => {
        temp.idUser = res.body._id;
        done();
      });
  });
});

describe('GET /users', () => {
  it('should get all users', done => {
    request
      .get('/api/users')
      .set('Authorization', `Bearer ${temp.token}`)
      .set('Accept', 'application/json')
      .expect(200, (err, res) => {
        expect(res.body.length).to.be.at.least(1);
        done();
      });
  });
});

describe('GET /users/:id', () => {
  it('should get a user', done => {
    request
      .get(`/api/users/${temp.idUser}`)
      .set('Authorization', `Bearer ${temp.token}`)
      .set('Accept', 'application/json')
      .expect(200, (err, res) => {
        res.body.name.should.equal('Kiros');
        res.body.email.should.equal('kiros.mata@gmail.com');
        res.body.country.should.equal('Ukraine');
        res.body.zipCode.should.equal(1200);
        res.body._id.should.equal(temp.idUser);
        done();
      });
  });
});

describe('PUT /users', () => {
  it('should update a user', done => {
    request
      .put(`/api/users/${temp.idUser}`)
      .set('Authorization', `Bearer ${temp.token}`)
      .set('Accept', 'application/json')
      .send({
        name: 'Tatiana',
        email: 'tatiana123@gmail.com',
        country: 'Ukraine',
        zipCode: 50000
      })
      .expect(200, (err, res) => {
        temp.idCity = res.body._id;
        done();
      });
  });

  it('should get updated user', done => {
    request
      .get(`/api/users/${temp.idCity}`)
      .set('Authorization', `Bearer ${temp.token}`)
      .set('Accept', 'application/json')
      .expect(200, (err, res) => {
        res.body.name.should.equal('Tatiana');
        res.body.email.should.equal('tatiana123@gmail.com');
        res.body.country.should.equal('Ukraine');
        res.body.zipCode.should.equal(50000);
        res.body._id.should.equal(temp.idCity);
        done();
      });
  });
});

describe('DELETE /users', () => {
  it('should delete a user', done => {
    request
      .delete(`/api/users/${temp.idUser}`)
      .set('Authorization', `Bearer ${temp.token}`)
      .set('Accept', 'application/json')
      .expect(200, (err, res) => {
        done();
      });
  });

  it('should get error', done => {
    request
      .get(`/api/users/${temp.idUser}`)
      .set('Accept', 'application/json')
      .expect(404, () => {
        done();
      });
  });
});
