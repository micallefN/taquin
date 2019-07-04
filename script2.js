const HAUT = "H";
const BAS = "B";
const DROITE = "D";
const GAUCHE = "G";

let side = 4;
let etats = [];

// changement de style css en fonction de "side"
document.documentElement.style.setProperty("--side", side);

let current_state = [];
const empty_cell = {i: 0, j:0};

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
$(".solution").click(function() {
    etats = [];
    etats.push(current_state);
    dfsResolution().then(function () {
        console.log("debut de la resolution auto");
    }).then(function(){
        reverseResolve(moves.reverse());
    }).then(function () {
        console.log("fin resolution");
    })
});

let modal = document.getElementById("myModal");
let span = document.getElementsByClassName("close")[0];

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

function setInitState () {
    current_state = [];     // on vide le tableau
    let l = side;           // l = nombre de cases par côté
    for (let i = 0; i < l; i++) {
        current_state[i] = [];
        for (let j = 0; j < l; j++) {
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
function displayWin () {
    //modal.style.display = "block";
}

function checkWin(current_array){

    let checkWinArray = deepCopy(current_array);
    let currentPos = 1;
    let win = true;

    checkWinArray.forEach(function (row) {
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

function deepCopy(arrayToBeCopied){
    let deepCopyArray = [];
    for(let i = 0; i < arrayToBeCopied.length; i++){
        deepCopyArray[i] = [];
        for(let j = 0; j < arrayToBeCopied[i].length; j++){
            deepCopyArray[i][j] = arrayToBeCopied[i][j];
        }
    }
    return deepCopyArray;
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

reset();