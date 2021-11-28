class SudokuSolver {
  constructor(objBody){

    this.objRows = {
      'A':{ nn:0, pos: [0, 8], rowRegion: 1} , 
      'B': { nn: 1, pos: [9, 17] , rowRegion: 1 }, 
      'C': { nn: 2, pos: [18, 26], rowRegion: 1  }, 
      'D': { nn: 3, pos: [27, 35] , rowRegion: 2 }, 
      'E': { nn: 4, pos: [36, 44] , rowRegion: 2 }, 
      'F': { nn: 5, pos: [45, 53] , rowRegion: 2 }, 
      'G': { nn: 6, pos : [54, 62] , rowRegion: 3 }, 
      'H': { nn: 7, pos : [63, 71] , rowRegion: 3 }, 
      'I': { nn: 8, pos: [72, 80] , rowRegion: 3 }
    };

    this.objCols = {
      0: {colRegion: 1} ,
      1: {colRegion: 1} ,
      2: {colRegion: 1} ,
      3: {colRegion: 2} ,
      4: {colRegion: 2} ,
      5: {colRegion: 2} ,
      6: {colRegion: 3} ,
      7: {colRegion: 3} ,
      8: {colRegion: 3} 
    };

 }



  validate(objBody) {
    this.puzzle = objBody.puzzle;
    this.value = String(objBody.value);

    let validFields = this.puzzle &&  objBody.coordinate  && this.value;
    let validationResult = {};
    let  shortErr = !validFields  ? 'Required field(s) missing'  
      : !(/^([A-I])([1-9])$/.test(objBody.coordinate)) ? 'Invalid coordinate' 
      : !(this.puzzle.length == 81) ? 'Expected puzzle to be 81 characters long' 
      : !this.puzzle.split('').every(item => item > 0 && item < 10 || item == '.') ? 'Invalid characters in puzzle'  
      : !(objBody.value > 0 && this.value < 10) ? 'Invalid value'
      : false ; 

    if(!shortErr){

      this.rowLetter =  objBody.coordinate.match(/^([A-I])([1-9])$/)[1];
      this.column = objBody.coordinate.match(/^([A-I])([1-9])$/)[2];
      this.rowNum = this.objRows[this.rowLetter]['nn'];


      let collection = [
        {area: this.getRowArr().includes(this.value) , name: 'row'},
        {area: this.getColArr().includes(this.value), name: 'column'},
        {area: this.getRegionArr().includes(this.value), name: 'region'}
      ] ;

     if(this.getCleanAreasBool() || this.ifContainsTheSame()){
        validationResult.answer= {"valid": true};
     }else{
        let conflict = [];
          for(let elem of collection){
            if(elem.area) conflict.push(elem.name)
          }

      validationResult.answer = { "valid": false, "conflict": conflict };
      }

    }else{
      validationResult.error = shortErr;
    }
    return validationResult;
  }

  
  ifContainsTheSame(){
    let addrTd =  ((this.rowNum) * 9 + Number(this.column)) - 1;
    return this.puzzle[addrTd] == this.value;
  }


  getRowArr(){
   let rowArea = this.objRows[this.rowLetter]['pos'];
   let rowArr = []; 

   for(let i = rowArea[0]; i <= rowArea[1]; i++){
     rowArr.push(this.puzzle[i]) ;
   }
    return rowArr;
  }


  getColArr() {
   let columnArr = [];

   for(let j = this.column-1; j < this.puzzle.length; j += 9){ columnArr.push(this.puzzle[j]) } 
    return columnArr;
  }

  getRegionArr() {
    let region = [];
    
    for(let key in this.objRows){
      for(let otherKey in this.objCols){
        if(this.objRows[key]['rowRegion'] == this.objRows[this.rowLetter]['rowRegion'] && this.objCols[otherKey]['colRegion'] == this.objCols[this.column-1]['colRegion']){
          let positionReg = this.puzzle[ this.objRows[key]['nn'] * 9 + Number(otherKey)];
          region.push(positionReg);
        } } }
    return region;
  }

  getCleanAreasBool(){
    this.value = String(this.value);

    return  !(
      this.getRowArr().includes(this.value) || 
      this.getColArr().includes(this.value) || 
      this.getRegionArr().includes(this.value) 
  ) ? true : false;
  }

getCandidates(){
  let candidates = {};

    for(let i = 0; i < this.puzzle.length; i++){
      if(this.puzzle[i] === '.'){
        candidates[i] = [];
        this.getRowAndColByAddrTd(i);

        for(let key in this.objRows){
          if(this.objRows[key]['nn'] == this.rowNum){
            this.rowLetter = key;

            for(let j = 1; j <= 9; j++){
              this.value = j;
              
               if(this.getCleanAreasBool()){
                  candidates[i].push(j);
   } } } } } }
  return candidates;
}

  getRowAndColByAddrTd(addrTd){
    this.column = (addrTd % 9) + 1;
    this.rowNum = Math.floor(addrTd  / 9);
  }

  searchAreas(addrTd){
    let region = [];
    this.getRowAndColByAddrTd(addrTd);
    for(let keyLetter in this.objRows){
      if(this.objRows[keyLetter]['nn'] == this.rowNum){
        this.rowLetter = keyLetter;
      }
    }

    let fullListElems = {rowEl: this.getRowArr(), columnEl: this.getColArr(), regionEl: this.getRegionArr()};
   
    return fullListElems;
}


callFilter(value, index, self){
  return self.indexOf(value) === index || value == '.';
}


checkCollections(puzzle){
  let flag = true;
  
  for(let i = 0; i < puzzle.length; i++){
    let collection = this.searchAreas(i) ;
    let uniqueRow = collection.rowEl.filter(this.callFilter); 
    let uniqueCol = collection.columnEl.filter(this.callFilter); 
    let uniqueRegion = collection.regionEl.filter(this.callFilter); 


      if(uniqueRow.length != collection.rowEl.length || uniqueCol.length != collection.columnEl.length || uniqueRegion.length != collection.regionEl.length){
      flag = false;
      break;
    }
  }
  console.log(flag, 'checkColFlag')
  return flag;
  }


  repeatFuncCleaning(){
    let candidates = this.getCandidates();
    let puzzleArr = this.puzzle.split('');
    let flag = true;

      for(let key in candidates){
        if(candidates[key].length == 1){
          puzzleArr[key] = candidates[key][0];
          flag = false;
        }
      }

    this.puzzle = puzzleArr.join('')

    if(!flag){
      this.puzzle = this.repeatFuncCleaning(this.puzzle)
      return this.puzzle;

    }else{
      return this.puzzle; 
    }
    console.log(this.puzzle, 'puzzl')
  }


  solve(objBody) {
    let answer = {};

    if(objBody.hasOwnProperty('puzzle')){
      this.puzzle = objBody.puzzle;
      this.puzzle = this.repeatFuncCleaning(this.puzzle) ;
    }
   
    let err = !objBody.hasOwnProperty('puzzle')  ? 'Required field missing'  
      :  !(objBody.puzzle.length == 81) ? 'Expected puzzle to be 81 characters long' 
      : !objBody.puzzle.split('').every(item => item > 0 && item < 10 || item == '.') ? 'Invalid characters in puzzle'  
      : this.puzzle.indexOf('.') != -1 || !this.checkCollections(objBody.puzzle) ?  'Puzzle cannot be solved' 
      : false ; 

    if(!err){
      answer.solution = this.puzzle;
    }else{
      answer.error = err
      console.log(err, 'err')
    }
      console.log(answer, 'solution')

   return answer 
  }

}

module.exports = SudokuSolver;
