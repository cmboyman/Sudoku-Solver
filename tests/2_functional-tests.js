const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  suite('Routing Tests', () => {

   suite('post api/check', function() {

    test('Valid data', function(done) {

      let fieldsValid = {
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'A1',
        value: 7
      }

       chai.request(server)
        .post('/api/check')
        .send(fieldsValid)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, true);

          done();
        });
      });


    test('Valid data, wrong position', function(done) {
      let fieldsValid = {
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'A1',
        value: 9
      }

       chai.request(server)
        .post('/api/check')
        .send(fieldsValid)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          assert.sameOrderedMembers(res.body.conflict, [ "row", "region" ]);

          done();
        });
      });

    test('Invalid value', function(done) {
      let fieldsValid = {
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'A1',
        value: '7d' 
      }

       chai.request(server)
        .post('/api/check')
        .send(fieldsValid)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { "error": "Invalid value" });

          done();
        });
      });

    test('Invalid coordinate', function(done) {
      let fieldsValid = {
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'A10',
        value: '7' 
      }

       chai.request(server)
        .post('/api/check')
        .send(fieldsValid)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { "error": "Invalid coordinate" });

          done();
        });
      });



    test('Missed required fields', function(done) {
      let fieldsValid = {
        coordinate: 'A10',
        value: '7' 
      }

       chai.request(server)
        .post('/api/check')
        .send(fieldsValid)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { "error": "Required field(s) missing" });

          done();
        });
      });


    test('Short puzzle', function(done) {
      let fieldsValid = {
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.',
        coordinate: 'A1',
        value: '7' 
      }

       chai.request(server)
        .post('/api/check')
        .send(fieldsValid)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { "error": "Expected puzzle to be 81 characters long" });

          done();
        });
      });


    test('Wrong chars in puzzle', function(done) {
      let fieldsValid = {
        puzzle: 'A.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'A1',
        value: '7' 
      }

       chai.request(server)
        .post('/api/check')
        .send(fieldsValid)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { "error": "Invalid characters in puzzle" });

          done();
        });
      });


  })




   suite('post /api/solve', function() {
 
    test('solution', function(done) {
      let fieldsValid = { puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..' }

       chai.request(server)
        .post('/api/solve')
        .send(fieldsValid)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.solution, '769235418851496372432178956174569283395842761628713549283657194516924837947381625');

          done();
        });
      });
 
    test('field missing', function(done) {
      //let fieldsValid = { puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..' }
      let fieldsValid = {}

       chai.request(server)
        .post('/api/solve')
        .send(fieldsValid)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { "error": "Required field missing" });

          done();
        });
      });
 
    test('Wrong chars in puzzle', function(done) {
      let fieldsValid = { puzzle: 'A.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..' }

       chai.request(server)
        .post('/api/solve')
        .send(fieldsValid)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { "error": "Invalid characters in puzzle" });

          done();
        });
      });

  test('Wrong chars in puzzle', function(done) {
      let fieldsValid = { puzzle: ',.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..' }

       chai.request(server)
        .post('/api/solve')
        .send(fieldsValid)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { "error": "Invalid characters in puzzle" });

          done();
        });
      });


    test('Short puzzle', function(done) {
      let fieldsValid = { puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62' }

       chai.request(server)
        .post('/api/solve')
        .send(fieldsValid)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { "error": "Expected puzzle to be 81 characters long" });

          done();
        });
      });

  
    test('Cannot be solved', function(done) {
      let fieldsValid = { puzzle: '..........5.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', }

       chai.request(server)
        .post('/api/solve')
        .send(fieldsValid)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { "error": 'Puzzle cannot be solved'  });

          done();
        });
      });


    test('Cannot be solved', function(done) {
      let fieldsValid = { puzzle: '9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..' }
      let objBody = { puzzle: '..........5.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', }

       chai.request(server)
        .post('/api/solve')
        .send(fieldsValid)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { "error": 'Puzzle cannot be solved'  });

          done();
        });
      });

    
});

});
});
