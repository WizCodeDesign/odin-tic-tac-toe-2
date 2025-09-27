 // --- 1. PLAYER FACTORY ---
    // FIX: Removed 'this' inside the arrow function, as 'this' behaves unexpectedly.
    const Player = (name, symbol) => {
        return { name, symbol };
    };

    // --- 2. GAME BOARD IIFE (MODEL - RULES & DATA) ---
    const gameBoard = (() => {
        let board = ["", "", "", "", "", "", "", "", ""];
        
        // This is private data, only used by checkWin/checkDraw
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6],
        ];

        // LOGIC: Checks if the symbol wins
        const checkWin = (symbol) => {
            return winConditions.some(condition =>
                condition.every(index => board[index] === symbol)
            );
        };

        // LOGIC: Checks if the board is full
        const checkDraw = () => {
            return board.every(cell => cell !== "");
        };

        // ACCESSOR: Get the board state
        const getBoard = () => board;

        // MANIPULATOR: Reset the board
        const resetBoard = () => {
            board = ["", "", "", "", "", "", "", "", ""];
        };
        
        // MANIPULATOR: Attempts to set a board spot
        // FIX: Removed the win/draw checks here. Game end checks belong to the
        // gameController, which orchestrates the flow *after* the move is made.
        const setBoard = (index, symbol) => {
            // Validate the move logic
            if (index >= 0 && index < 9 && board[index] === "") {
                board[index] = symbol;
                return true;
            }
            return false;
        };

        return { getBoard, resetBoard, setBoard, checkWin, checkDraw };
    })();

    // --- 3. GAME CONTROLLER IIFE (COORDINATOR - FLOW & INPUT) ---
    const gameController = (() => {
        const p1 = Player("Player 1", "X");
        const p2 = Player("Player 2", "O");
        let currentPlayer = p1;
        let gameActive = false; // State to control the game loop

        const renderBoard = () => {
            const board = gameBoard.getBoard();
            console.log(`
 ${board[0] || 1} | ${board[1] || 2} | ${board[2] || 3} 
---+---+---
 ${board[3] || 4} | ${board[4] || 5} | ${board[5] || 6} 
---+---+---
 ${board[6] || 7} | ${board[7] || 8} | ${board[8] || 9} 
            `);
        };

        const switchPlayer = () => {
            currentPlayer = currentPlayer === p1 ? p2 : p1;
        };
        
        // This is the main turn logic, executed when the player provides input
        const playRound = (index) => {
            // 1. Ask GameBoard to make the move
            if (gameBoard.setBoard(index, currentPlayer.symbol)) {
                renderBoard(); // Update the console display

                // 2. Check for Win/Draw *after* the successful move
                if (gameBoard.checkWin(currentPlayer.symbol)) {
                    console.log(`🎉 ${currentPlayer.name} (${currentPlayer.symbol}) wins! 🎉`);
                    gameActive = false;
                    return;
                }
                
                if (gameBoard.checkDraw()) {
                    console.log("It's a draw! 🤝");
                    gameActive = false;
                    return;
                }

                // 3. Switch turn and prompt next player
                switchPlayer();
                console.log(`\nIt's ${currentPlayer.name}'s turn (${currentPlayer.symbol})`);
                
            } else {
                console.log("Invalid move. Cell taken or index out of range. Try again.");
            }
        };

        // --- MISSING PIECE: The Input Loop ---
        const gameLoop = () => {
            if (!gameActive) {
                console.log("Game over. Refresh to play again.");
                return;
            }

            // In a console game, we use prompt() to get user input
            const input = prompt(`It's ${currentPlayer.name}'s turn (${currentPlayer.symbol}). Enter a number (1-9):`);
            
            // Check if the user cancelled the prompt
            if (input === null) {
                console.log("Game cancelled.");
                gameActive = false;
                return;
            }

            const index = parseInt(input) - 1; // Convert 1-9 to array index 0-8
            
            // Execute the round logic
            playRound(index);
            
            // Recursively call the loop to continue the game flow
            if (gameActive) {
                 // Use setTimeout to prevent blocking and allow console updates to render properly
                 setTimeout(gameLoop, 50); 
            }
        };

        const startGame = () => {
            gameBoard.resetBoard();
            currentPlayer = p1;
            gameActive = true;
            
            console.log("--- Tic-Tac-Toe Console Game Started ---");
            console.log("Player 1 is X, Player 2 is O. Enter numbers 1-9 to make a move.");
            
            renderBoard();
            console.log(`It's ${currentPlayer.name}'s turn (${currentPlayer.symbol})`);
            
            gameLoop(); // Start the input loop
        };

        return { startGame };
    })();

//start the game

document.addEventListener('DOMContentLoaded', () => {
    gameController.startGame();
});
