// mouvements possibles
const HAUT = "H";
const BAS = "B";
const DROITE = "D";
const GAUCHE = "G";

// nombre de cases par côté
var side = 4;

let etats = [];

// changement de style css en fonction de "side"
document.documentElement.style.setProperty("--side", side);

// retient l'état courant du taquin
var current_state = [];
// position de la case vide
const empty_cell = {i: 0, j:0};

// Initialisation de l'état courant
function setInitState () {
  current_state = [];     // on vide le tableau
  var l = side;           // l = nombre de cases par côté
  for (var i = 0; i < l; i++) {
    current_state[i] = [];
    for (var j = 0; j < l; j++) {
      if (i == l-1 && j == l-1) {
        val = 0;
      } else {
        val = i*l + j + 1;
      }
      current_state[i][j] = val;
    }
  }
  empty_cell.i = side-1;
  empty_cell.j = side-1;
}

function applyMove(state, ec, move) {

  let nextX = empty_cell.i;
  let nextY = empty_cell.j;

  switch (move) {
    case "H":
      nextY = empty_cell.j - 1;
      break;
    case "B":
      nextY = empty_cell.j + 1;
      break;
    case "D":
      nextX = empty_cell.i + 1;
      break;
    case "G":
      nextX = empty_cell.i -1;
      break;
  }

  if ( !(nextX > side -1 || nextX < 0 || nextY > side -1 || nextY < 0) ) {
    current_state[empty_cell.j][empty_cell.i] = current_state[nextY][nextX];

    empty_cell.j = nextY;
    empty_cell.i = nextX;

    current_state[nextY][nextX] = 0;
  }
  return current_state;
}


function displayState(tab) {
  $(".grid").empty();
  for (let i = 0; i < tab.length; i++) {
    for (let j = 0; j < tab[i].length; j++) {
      const elem = tab[i][j];
      if (elem) {
        const item = $(
          `<div data-i="${i}" data-j="${j}" class="item">${elem}</div>`
        );
        $(".grid").append(item);
      } else {
        $(".grid").append(`<div class="vide"></div>`);
      }
    }
  }
}

$(".check").click(function() {
  if (checkWin(current_state)) {
    displayWin();
  }
});

$(".reset").click(reset);

$(".shuffle").click(function() {
  current_state = shuffleArray(current_state, empty_cell);
  displayState (current_state);
});

// Solution pour resolution DFS
// $(".solution").click(function() {
//   etats = [];
//   etats.push(current_state);
//   dfsResolution().then(function () {
//     console.log("debut de la resolution auto");
//   }).then(function(){
//     reverseResolve(moves.reverse());
//   }).then(function () {
//     console.log("fin resolution");
//   })
// });

$(".solution").click(function() {
  bfs([current_state, []]);
  console.log(solution);
});

function dfsResolution(){
  return new Promise((resolve, reject) => {
    if(dfs(current_state, 0 , 11, empty_cell)){
      resolve("fin de la resolution auto");
    }
  })
}
function reverseResolve(movesList){

  let autoX = empty_cell.i;
  let autoY = empty_cell.j;

  let counter = 0;
  let maxTurn = movesList.length;

  let i = setInterval(function(){
    if(counter === maxTurn) {
      clearInterval(i);
    }
    switch (movesList[counter]) {
      case 'H':
        autoY = autoY -1;
        break;
      case 'B':
        autoY = autoY +1;
        break;
      case 'G':
        autoX = autoX -1;
        break;
      case 'D':
        autoX = autoX +1;
        break;
    }

    current_state[empty_cell.j][empty_cell.i] = current_state[autoY][autoX];
    current_state[autoY][autoX] = 0;
    empty_cell.j = autoY;
    empty_cell.i = autoX;

    displayState(current_state);
    counter++;
  }, 500);
}

// Pour augmenter / diminuer la taille d'un côté.
$(".plus").click(function() {
  document.documentElement.style.setProperty("--side", ++side);
  reset();
  console.log("Plus grand")
});

$(".minus").click(function() {
  document.documentElement.style.setProperty("--side", --side);
  reset();
  console.log("Plus petit")
});

// Ici on gere l'ajout dynamique de .item 
$(".grid").on('click', '.item', function(){
  console.log("J'existe et resisterai à ma mort dans un reset/ shuffle ",   
      "Valeur:", $(this).html(),
      "Position i:", $(this).attr("data-i"),
      "Position j:", $(this).attr("data-j")
  )
}); 

// Avec le code ci-dessous, j'ai des problèmes à chaque reset car les item sont 
// supprimés.
// Pas de gestion dynamique de .item 
// $(".item").click(function(){
//   console.log("Je n'existe que jusqu'à ma mort dans un reset/ shuffle")   
//

// Une jolie fenetre est prévue pour quand on gagne
var modal = document.getElementById("myModal");

// Pour fermer la fenetre avec un "X"
var span = document.getElementsByClassName("close")[0];

// Pour afficher la fenetre quand on a gagné, appeler cette fonction
function displayWin () {
  modal.style.display = "block";
}

// Quand on clique sur <span> (x), on ferme
span.onclick = function() {
  modal.style.display = "none";
}
// On ferme aussi si on clique n'importe où
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Pour récupérer l'appui sur les flèches du clavier
document.onkeydown = checkKey;
function checkKey(e) {
    e = e || window.event;
    if (e.keyCode === 38) {
      // up arrow
      applyMove (current_state, empty_cell, HAUT);
    }
    else if (e.keyCode === 40) {
        // down arrow
      applyMove (current_state, empty_cell, BAS);
    }
    else if (e.keyCode === 37) {
       // left arrow
      applyMove (current_state, empty_cell, GAUCHE);
    }
    else if (e.keyCode === 39) {
       // right arrow
      applyMove (current_state, empty_cell, DROITE);
    }
  displayState(current_state);
  if (checkWin(current_state)) {
    displayWin();
  }
}

function checkWin(current_array){

  let deepCopyArray = [];

  for(let i = 0; i < current_array.length; i++){
    deepCopyArray[i] = [];
    for(let j = 0; j < current_array[i].length; j++){

      deepCopyArray[i][j] = current_array[i][j];
    }
  }

  let currentPos = 1;
  let win = true;

  deepCopyArray.forEach(function (row) {
   row.forEach(function(currentCase){

     if(currentPos === (side*side)){
       currentPos = 0;
     }
     if(currentCase !== currentPos){
       win = false;
     }
     currentPos++;
   })
 });
  return win;
}

function reset () {
  setInitState();
  displayState (current_state);
}

// Affichage initial : on fait un reset
reset();

let calls = 0;
let moves = [];

function dfs(e, p , m, emptyCell){

  const newEmptyCell = {
    i : emptyCell.i,
    j : emptyCell.j
  };

  calls++;
  console.log("nb calls " + calls);

  if(p > m){
    return false;
  }

  if (checkWin(e)) {
    displayWin();
    return true;
  }

  const mouvements_possible = [];

  if(emptyCell.j-1 >= 0){
    mouvements_possible.push(HAUT);
  }
  if(emptyCell.j + 1 <= side-1){
    mouvements_possible.push(BAS);
  }
  if(emptyCell.i-1 >= 0){
    mouvements_possible.push(GAUCHE);
  }
  if(emptyCell.i + 1 <= side-1){
    mouvements_possible.push(DROITE);
  }

  for(let i = 0; i <mouvements_possible.length; i++){
    const [nouvel_etat, newEmptyCell] = applyMoveAuto(e, emptyCell, mouvements_possible[i]);
    if(!searchForArray(etats, nouvel_etat)){
      etats.push(nouvel_etat);
      if(dfs(nouvel_etat, p+1, m, newEmptyCell)){
        moves.push(mouvements_possible[i]);
        return true;
      }
    }
  }

  return false;

}

// function applyMoveAuto(state, ec, move) {
//
//   let deepCopyArray = [];
//
//   for(let i = 0; i < state.length; i++){
//     deepCopyArray[i] = [];
//     for(let j = 0; j < state[i].length; j++){
//
//       deepCopyArray[i][j] = state[i][j];
//     }
//   }
//
//   let nextX = ec.i;
//   let nextY = ec.j;
//
//   switch (move) {
//     case "H":
//       nextY = ec.j - 1;
//       break;
//     case "B":
//       nextY = ec.j + 1;
//       break;
//     case "D":
//       nextX = ec.i + 1;
//       break;
//     case "G":
//       nextX = ec.i -1;
//       break;
//   }
//
//   deepCopyArray[ec.j][ec.i] = deepCopyArray[nextY][nextX];
//
//   deepCopyArray[nextY][nextX] = 0;
//
//   return [deepCopyArray,{i:nextX,j:nextY}] ;
// }
function applyMoveAutoBFS(state, move) {

  let autoBfsemptyCell = {};

  for(let j = 0; j < state.length; j++){
    for(let i = 0; i< state[j].length; i++){
      if(state[j][i] === 0){
        autoBfsemptyCell.i = i;
        autoBfsemptyCell.j = j;
      }
    }
  }

  let deepCopyArray = [];

  for(let i = 0; i < state.length; i++){
    deepCopyArray[i] = [];
    for(let j = 0; j < state[i].length; j++){

      deepCopyArray[i][j] = state[i][j];
    }
  }

  let nextX = autoBfsemptyCell.i;
  let nextY = autoBfsemptyCell.j;

  switch (move) {
    case "H":
      nextY = autoBfsemptyCell.j - 1;
      break;
    case "B":
      nextY = autoBfsemptyCell.j + 1;
      break;
    case "D":
      nextX = autoBfsemptyCell.i + 1;
      break;
    case "G":
      nextX = autoBfsemptyCell.i -1;
      break;
  }

  deepCopyArray[autoBfsemptyCell.j][autoBfsemptyCell.i] = deepCopyArray[nextY][nextX];

  deepCopyArray[nextY][nextX] = 0;

  return deepCopyArray ;
}

function searchForArray(listOfEtats, currentEtat){

  let retour  = false;

  let a = JSON.stringify(listOfEtats);
  let b = JSON.stringify(currentEtat);

  let c = a.indexOf(b);
  if(c !== -1){ //check si etat deja present dans la liste
    retour = true;
  }

  return retour;
}
function searchForArrayQueue(listOfQueuedEtats, currentEtat){

  let retour  = false;

  let deepCopyArray = [];

  for(let i = 0; i < listOfQueuedEtats.length; i++){
    deepCopyArray[i] = listOfQueuedEtats[i][0][0];

  }

  let pureEtat = [];
  for(let i = 0; i < deepCopyArray.length; i++){
    pureEtat[i] = deepCopyArray[i];
  }
  
  let a = JSON.stringify(pureEtat);
  let b = JSON.stringify(currentEtat);

  let c = a.indexOf(b);
  if(c !== -1){ //check si etat deja present dans la liste
    retour = true;
  }

  return retour;
}

function shuffleArray(lastState, lastEmptyCell) {

  let shuffledArray = [];
  for(let i = 0; i < lastState.length; i++){
    shuffledArray[i] = [];
    for(let j = 0; j < lastState[i].length; j++){

      shuffledArray[i][j] = lastState[i][j];
    }
  }

  let randomChoice = 0;

  for (let i = 0; i < 10; i++){
    randomChoice = (Math.floor((4)*Math.random()+1));

    let nextShuffleX = lastEmptyCell.i;
    let nextShuffleY = lastEmptyCell.j;

    switch (randomChoice) {
      case 1:
        nextShuffleY = empty_cell.j - 1;
        break;
      case 2:
        nextShuffleY = empty_cell.j + 1;
        break;
      case 3:
        nextShuffleX = empty_cell.i + 1;
        break;
      case 4:
        nextShuffleX = empty_cell.i -1;
        break;
    }

    if ( !(nextShuffleX > side -1 || nextShuffleX < 0 || nextShuffleY > side -1 || nextShuffleY < 0) ) {
      shuffledArray[lastEmptyCell.j][lastEmptyCell.i] = shuffledArray[nextShuffleY][nextShuffleX];

      lastEmptyCell.j = nextShuffleY;
      lastEmptyCell.i = nextShuffleX;

      shuffledArray[nextShuffleY][nextShuffleX] = 0;
    }
  }

  return shuffledArray;
}
let visitedState = [];
let queueState = [];
let solution = [];
let nbTour = 0;
function bfs(etat, mouv){

  // doit retrouver position case vide
  let bfsEmptyCell = {};

  for(let j = 0; j < etat[0].length; j++){
    for(let i = 0; i< etat[0][j].length; i++){
      if(etat[0][j][i] === 0){
        bfsEmptyCell.i = i;
        bfsEmptyCell.j = j;
      }
    }
  }

  //hard copy pour eviter les shadow
  let moves = [];
  for(let i = 0; i <  etat[1].length; i++){
    moves[i] = etat[1][i];
  }
  moves.push(mouv);
  etat[1] = moves;

  nbTour++;
  console.log(nbTour);

  queueState.shift();

  if (checkWin(etat[0])) {
    //displayWin();

    console.log("etat final ");
    console.log(etat);
    return true;
  }

  visitedState.push(etat[0]);

  const mouvements_possible = [];

  if(bfsEmptyCell.j-1 >= 0){
    mouvements_possible.push(HAUT);
  }
  if(bfsEmptyCell.j + 1 <= side-1){
    mouvements_possible.push(BAS);
  }
  if(bfsEmptyCell.i-1 >= 0){
    mouvements_possible.push(GAUCHE);
  }
  if(bfsEmptyCell.i + 1 <= side-1){
    mouvements_possible.push(DROITE);
  }

  for(let i = 0; i <mouvements_possible.length; i++){
    let nouvel_etat = applyMoveAutoBFS(etat[0], mouvements_possible[i]);
    if(!searchForArray(visitedState, nouvel_etat) && !searchForArrayQueue(queueState, nouvel_etat)){

      queueState.push([[nouvel_etat, moves], mouvements_possible[i]]);
    }
  }
  if(queueState.length> 0){
    if(bfs(queueState[0][0], queueState[0][1])){
      return true;
    }
  }
  return false;
}