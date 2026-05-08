// UI Controller module - Handles board rendering and display
class UIController {
    constructor() {
        this.boardElement = null;
        this.statusElement = null;
        this.mineCountElement = null;
        this.onCellClick = null;
        this.onFlagClick = null;
    }

    // Initialize UI with game container element
    init(gameContainerId, statusId, mineCountId) {
        this.boardElement = document.getElementById(gameContainerId);
        this.statusElement = document.getElementById(statusId);
        this.mineCountElement = document.getElementById(mineCountId);
    }

    // Render the game board
    renderBoard(gameCore, onCellClick, onFlagClick) {
        this.onCellClick = onCellClick;
        this.onFlagClick = onFlagClick;

        this.boardElement.innerHTML = '';
        this.boardElement.className = 'minesweeper-board';

        const board = gameCore.getBoardState();
        const rows = board.length;
        const cols = board[0].length;

        // Set board dimensions
        this.boardElement.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
        this.boardElement.style.gridTemplateRows = `repeat(${rows}, 30px)`;

        // Create cells
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const cell = board[y][x];
                const cellDiv = this.createCellElement(cell);
                this.boardElement.appendChild(cellDiv);
            }
        }

        this.updateStatus('');
        this.updateMineCount(gameCore.getMineCount(), 0);
    }

    // Create a single cell DOM element
    createCellElement(cell) {
        const cellDiv = document.createElement('div');
        cellDiv.className = 'cell';
        cellDiv.dataset.x = cell.x;
        cellDiv.dataset.y = cell.y;

        // Add click handler for revealing
        cellDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.onCellClick) {
                this.onCellClick(cell.x, cell.y);
            }
        });

        // Add context menu handler for flagging
        cellDiv.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (this.onFlagClick) {
                this.onFlagClick(cell.x, cell.y);
            }
        });

        return cellDiv;
    }

    // Update a single cell's display
    updateCell(cell) {
        const selector = `.cell[data-x="${cell.x}"][data-y="${cell.y}"]`;
        const cellDiv = this.boardElement.querySelector(selector);
        if (!cellDiv) return;

        // Update class based on cell state
        cellDiv.className = 'cell';
        if (cell.revealed) {
            cellDiv.classList.add('revealed');
            if (cell.hasMine) {
                cellDiv.classList.add('mine');
                cellDiv.innerHTML = '💣';
            } else if (cell.adjacentCount > 0) {
                cellDiv.classList.add(`cell-number-${cell.adjacentCount}`);
                cellDiv.textContent = cell.adjacentCount;
            }
        } else if (cell.flagged) {
            cellDiv.classList.add('flagged');
            cellDiv.innerHTML = '🚩';
        }
    }

    // Update game status display
    updateStatus(message) {
        if (this.statusElement) {
            this.statusElement.textContent = message;
        }
    }

    // Update mine count display (total mines - flags)
    updateMineCount(totalMines, flagsPlaced) {
        if (this.mineCountElement) {
            this.mineCountElement.textContent = totalMines - flagsPlaced;
        }
    }

    // Show game over screen
    showGameOver(win, minesFound = 0) {
        if (win) {
            this.updateStatus('🎉 Congratulations! You won! 🎉');
            this.boardElement.classList.add('win');
        } else {
            this.updateStatus('💥 Game Over! Better luck next time!');
            this.boardElement.classList.add('gameover');
        }
    }

    // Reset UI for new game
    resetUI() {
        this.boardElement.innerHTML = '';
        this.boardElement.className = 'minesweeper-board';
        this.boardElement.classList.remove('win', 'gameover');
        this.updateStatus('Select a difficulty to start playing!');
    }

    // Clear board (for resizing)
    clearBoard() {
        this.boardElement.innerHTML = '';
    }
}
