// --- 1. PLAYER FACTORY ---
// Creates a new player object with a default score of 0
const Player = (name, symbol, score = 0) => {
    return { name, symbol, score };
};

// --- 2. GAME BOARD IIFE (MODEL - RULES & DATA) ---
const gameBoard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];
    
    // Private data for win checks (Encapsulation)
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ];

    // LOGIC: Checks if the given symbol has won
    const checkWin = (symbol) => {
        return winConditions.some(condition =>
            condition.every(index => board[index] === symbol)
        );
    };

    // LOGIC: Checks if the board is full (Draw)
    const checkDraw = () => {
        return board.every(cell => cell !== "");
    };

    // ACCESSOR: Get the board state
    const getBoard = () => board;

    // MANIPULATOR: Reset the board to empty state
    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };
    
    // MANIPULATOR: Attempts to set a board spot
    const setBoard = (index, symbol) => {
        // Validate the move logic: valid index and empty cell
        if (index >= 0 && index < 9 && board[index] === "") {
            board[index] = symbol;
            return true;
        }
        return false;
    };

    return { getBoard, resetBoard, setBoard, checkWin, checkDraw };
})();

// --- 3. GAME CONTROLLER IIFE (CONTROLLER - FLOW, INPUT, VIEW UPDATES) ---
const gameController = (() => {
    // --- Game State Variables ---
    let p1;
    let p2;
    let currentPlayer;
    let gameActive = false;

    // --- DOM REFERENCES (Matching your HTML IDs/Classes) ---
    const formContainer = document.querySelector('.form_Container');
    const contentContainer = document.querySelector('.content_Container');
    const playerForm = document.getElementById('player_Form');
    const cells = document.querySelectorAll('.cells');
    const statusDisplay = document.querySelector('.game_Status');
    const p1NameDisplay = document.getElementById('player_1_Name');
    const p2NameDisplay = document.getElementById('player_2_Name');
    const p1ScoreDisplay = document.querySelector('.player_1_Score');
    const p2ScoreDisplay = document.querySelector('.player_2_Score');
    const restartButton = document.getElementById('restart_Button');
    const clearButton = document.getElementById('clear_Button');


    // --- VIEW METHODS ---

    // Updates the HTML cells based on the model's board array
    const renderBoard = () => {
        const board = gameBoard.getBoard();
        cells.forEach((cell, index) => {
            const marker = board[index];
            cell.textContent = marker;
            
            // Toggle marker classes for specific styling from your external CSS
            cell.classList.remove('x-marker', 'o-marker');
            cell.removeAttribute('data-marker');

            if (marker === 'X') {
                cell.classList.add('x-marker');
                cell.setAttribute('data-marker', 'X');
            } else if (marker === 'O') {
                cell.classList.add('o-marker');
                cell.setAttribute('data-marker', 'O');
            }
        });
    };

    // Updates the status message in the HTML
    const renderStatus = (message) => {
        statusDisplay.textContent = message;
        // You can add logic here to apply specific CSS classes for win/draw colors
    };

    // Updates the score display
    const renderScores = () => {
        p1ScoreDisplay.textContent = p1.score;
        p2ScoreDisplay.textContent = p2.score;
    };

    // --- FLOW METHODS ---

    const switchPlayer = () => {
        currentPlayer = currentPlayer === p1 ? p2 : p1;
        renderStatus(`It's ${currentPlayer.name}'s turn (${currentPlayer.symbol})`);
    };

    // Handles the cell click event (The main game loop handler)
    const handleCellClick = (event) => {
        if (!gameActive) {
            renderStatus("Game is over or not started. Click Restart Round or Clear Board.");
            return;
        }
        
        const index = parseInt(event.target.dataset.index);

        // 1. Ask GameBoard to make the move
        if (gameBoard.setBoard(index, currentPlayer.symbol)) {
            
            // 2. Update the View
            renderBoard(); 

            // 3. Check for Win/Draw *after* the successful move
            if (gameBoard.checkWin(currentPlayer.symbol)) {
                // Update score on the Player object
                if (currentPlayer === p1) p1.score++;
                if (currentPlayer === p2) p2.score++;
                
                renderScores();
                renderStatus(`🎉 ${currentPlayer.name} (${currentPlayer.symbol}) WINS! 🎉`);
                gameActive = false; // Game over
                return;
            }
            
            if (gameBoard.checkDraw()) {
                renderStatus("It's a DRAW! 🤝");
                gameActive = false; // Game over
                return;
            }

            // 4. Continue the game flow
            switchPlayer();
            
        } else {
            renderStatus("Invalid move. Cell taken. Try again.");
        }
    };

    // Event handler for the form submission (Game Initialization)
    const handleFormSubmit = (event) => {
        event.preventDefault();

        const p1Name = document.getElementById('player1').value;
        const p2Name = document.getElementById('player2').value;

        // Initialize players (with current score if restarting game)
        if (!p1 || !p2) {
            p1 = Player(p1Name, "X");
            p2 = Player(p2Name, "O");
        } else {
            // Update names if form is submitted again mid-game
            p1.name = p1Name;
            p2.name = p2Name;
        }
        
        // Update the header display
        p1NameDisplay.textContent = p1.name;
        p2NameDisplay.textContent = p2.name;

        // Toggle UI visibility
        formContainer.classList.add('hide');
        contentContainer.classList.remove('hide');

        // Start the first round
        startNewRound();
    };

    // Resets the board, keeps scores and player names (for next round)
    const startNewRound = () => {
        gameBoard.resetBoard();
        currentPlayer = p1; // Always start with P1
        gameActive = true;
        renderBoard();
        renderScores();
        renderStatus(`Game ready! ${currentPlayer.name}'s turn (X)`);
    };
    
    // Clears the board and resets scores/names (New Game from scratch)
    const clearGame = () => {
        // Reset scores
        if (p1) p1.score = 0;
        if (p2) p2.score = 0;
        renderScores(); // Renders 0 if game started, or just current 0 values.
        
        // Go back to the form
        formContainer.
        contentContainer.classList.add('hide');
        gameActive = false; // Stop the game

        renderStatus("Enter player names to start!");
    };

    // --- INITIALIZATION ---
    const initializeGame = () => {
        // Attach event listeners
        playerForm.addEventListener('submit', handleFormSubmit);

        cells.forEach(cell => {
            cell.addEventListener('click', handleCellClick);
        });
        
        restartButton.addEventListener('click', startNewRound);
        clearButton.addEventListener('click', clearGame);

        // Ensure the content container is initially hidden until names are submitted
        contentContainer.classList.add('hide');

        renderStatus("Enter player names to start!");
    };

    return { initializeGame };
})();

// Start the application when the page is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    gameController.initializeGame();
});