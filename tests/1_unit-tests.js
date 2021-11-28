const chai = require('chai');

const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const puzzleStrings = require('../controllers/puzzle-strings.js');
let solver = new Solver();

suite('UnitTests', () => {
  suite('solver.validate()', () => {

    let fieldsValid = {
      puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
      coordinate: 'A1',
      value: 7
    }


  test('valid Fields. Short puzzle', (done) => {
    let fieldsNoValid = {
      puzzle: '9......1945....4.37.4.3..6..',
      coordinate: 'A1',
      value: 7
    }

    assert.equal(solver.validate(fieldsNoValid).error, 'Expected puzzle to be 81 characters long' )
    done();
  })


  test('valid Fields. Wrong characters in puzzle', (done) => {
    let fieldsNoValid = {
      puzzle: '..9A.5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
      coordinate: 'A1',
      value: 7
    }

    assert.equal(solver.validate(fieldsNoValid).error, 'Invalid characters in puzzle'   )
    done();
  })


  test('valid Fields. Wrong coordinate', (done) => {
    let collectionMess = ['lkj', '1', 'S2', 'A', '11', 'Da']

    collectionMess.forEach(item => {

      let fieldsNoValid = {
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: item,
        value: 7
      }
      assert.equal(solver.validate(fieldsNoValid).error, 'Invalid coordinate' )

    })
    done();
  })

  test('valid Fields. Fields missing (no coordinates)', (done) => {
    let fieldsNoValid = {
      puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
      value: 7
    }

    assert.equal(solver.validate(fieldsNoValid).error, 'Required field(s) missing' )
    done();
  })


  test('valid Fields. Wrong value', (done) => {
    let collectionMess = ['lkj', ' ', 'S2', 'A', '11', 'Da']

    collectionMess.forEach(item => {
      let fieldsNoValid = {
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'A1',
        value: item 
      }
      assert.equal(solver.validate(fieldsNoValid).error, 'Invalid value' )
    })
    done();
  })



  test('valid Fields. Right fields, rigth position', (done) => {
    assert.equal(solver.validate(fieldsValid).answer.valid, true)
    done();
  })


  test('valid Fields. Right fields, wrong position', (done) => {
    let wrongPosition = {
      puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
      coordinate: 'A1',
      value: 8
    }

    assert.equal(solver.validate(wrongPosition).answer.valid, false)
    assert.equal(solver.validate(wrongPosition).answer.conflict[0], 'column');
    assert.equal(solver.validate(wrongPosition).answer.conflict[1], 'region');
    assert.isNotTrue(solver.validate(wrongPosition).answer.conflict[2] );
    done();
  })


  })   

  
  suite('solve()', () => {
   
    test('full answer (solution)', (done) => {
      puzzleStrings.puzzlesAndSolutions.forEach(item => {
        let objBody = {puzzle: item[0]}
      
        assert.equal(solver.solve(objBody).solution, item[1])
      })
      done();
    })
   
    test('empty puzzle field', (done) => {
        let objBody = {}
        assert.equal(solver.solve(objBody).error, 'Required field missing'  )
      done();
    })


    test('short puzzle', (done) => {
        let objBody = { puzzle: '9......1945....4.37.4.3..6..' }
        assert.equal(solver.solve(objBody).error, 'Expected puzzle to be 81 characters long' )
      done();
    })
 

    test('Invalid characters in puzzle'  , (done) => {
        let objBody = { puzzle: 'a.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', }

        assert.equal(solver.solve(objBody).error, 'Invalid characters in puzzle'   )
      done();
    })
    

    test('Puzzle cannot be solved', (done) => {
        let objBody = { puzzle: '..........5.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', }

        assert.equal(solver.solve(objBody).error, 'Puzzle cannot be solved'   )
      done();
    })
 
    test('Puzzle cannot be solved', (done) => {
        let objBody = {
          puzzle: '9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        }

        assert.equal(solver.solve(objBody).error, 'Puzzle cannot be solved'   )
      done();
    })
  
  })   
});