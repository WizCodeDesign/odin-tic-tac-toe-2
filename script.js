//factory functions for players
const Player = (name, marker) => {
    const getName = () => name;
    const getMarker = () => marker;
    const displayName = () => {
        const player_1_name = document.getElementById('player_1_Name');
        const player_2_name = document.getElementById('player_2_Name');
            if (marker === "X") {player_1_name.textContent = name;
            console.log(player_1_name.textContent);}
            else player_2_name.textContent = name;
    };
    return { getName, getMarker, displayName };
};

//IIFE for game board
const gameboard = (() => {
    //private board array
    const cells = document.querySelectorAll('.cells');
    const board = ["", "", "", "", "", "", "", "", ""];
    //public methods to access and modify the board
    const getBoard = () => board;
    //set marker when player makes a move
    
    //expose public methods
    return { getBoard}
})();

//form handling
const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const p1Name = document.getElementById('player1').value || "Player 1";
    const p2Name = document.getElementById('player2').value || "Player 2";
    const player1 = Player(p1Name, "X");
    const player2 = Player(p2Name, "O");
    console.log(player1.getName(), player1.getMarker());
    console.log(player2.getName(), player2.getMarker());
    player1.displayName();
    player2.displayName();
    //hide form and show game board
    const form_Container = document.querySelector('.form_Container');
    form_Container.style.display = 'none';
    document.querySelector('.content_Container').style.display = 'flex';
});

const resetButton = document.getElementById('clear_Form');
resetButton.addEventListener('click', (e) => {
    e.preventDefault();
    form.reset();
});

const game_Container = document.querySelector('.content_Container');
game_Container.querySelector("#restart_Button").addEventListener('click', (e) => {
        e.preventDefault();
        location.reload();
    });

game_Container.querySelector("#clear_Button").addEventListener('click', (e) => {
        e.preventDefault();
        //clear the board
        const cells = document.querySelectorAll('.cells');
        cells.forEach(cell => cell.textContent = "");
        //reset the game board array
        const board = gameboard.getBoard();
        for (let i = 0; i < board.length; i++) {
            board[i] = "";
        }
    });    
