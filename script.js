// mouvements possibles
const HAUT = "H";
const BAS = "B";
const DROITE = "D";
const GAUCHE = "G";

// nombre de cases par côté
var side = 4;

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
  // à faire
  // console.log("Movement:", move)
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
  console.log("Is winning? ", checkWin(current_state));
  // TODO: penser à implémenter la fonction checkWin
});


$(".reset").click(reset);

$(".shuffle").click(function() {
  // pas le temps de faire le shuffle
  doRandomShuffle(current_state, empty_cell);
  displayState (current_state);
});

$(".solution").click(function() {
  console.log("Solution demandée par l'utilisateur·ice")
  findSolution(current_state, empty_cell);
});


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

    if (e.keyCode == 38) {
      // up arrow
      applyMove (current_state, empty_cell, HAUT);
    }
    else if (e.keyCode == 40) {
        // down arrow
      applyMove (current_state, empty_cell, BAS);
    }
    else if (e.keyCode == 37) {
       // left arrow
      applyMove (current_state, empty_cell, GAUCHE);
    }
    else if (e.keyCode == 39) {
       // right arrow
      applyMove (current_state, empty_cell, DROITE);
    }
  displayState(current_state);
  if (checkWin(current_state)) {
    displayWin();
  }
}



function reset () {
  setInitState();
  displayState (current_state);
}

// Affichage initial : on fait un reset
reset();
