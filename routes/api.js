'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  

  app.route('/api/check')
    .post((req, res) => {

      let solver = new SudokuSolver(req.body);
      let validate = solver.validate(req.body);

      console.log(req.body, 'req.body')
      console.log(validate, 'validate')

      if(validate.error){
        res.json({error: validate.error})
      }else{
        res.json(validate.answer)
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      let solver = new SudokuSolver(req.body);
      let solve = solver.solve(req.body);
      console.log(solve, 'solve')
      res.json(solve)

    });
};