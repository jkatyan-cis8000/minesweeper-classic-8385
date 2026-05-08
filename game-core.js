// Game Core module - Handles game logic and state
class GameCore {
    constructor(width, height, mineCount) {
        this.width = width;
        this.height = height;
        this.mineCount = mineCount;
        this.board = [];
        this.flagsPlaced = 0;
        this.gameOver = false;
        this.gameWon = false;
        this.firstReveal = true;
        this.revealedCount = 0;
    }

    // Initialize the game board
    initializeBoard() {
        this.board = [];
        this.flagsPlaced = 0;
        this.gameOver = false;
        this.gameWon = false;
        this.firstReveal = true;
        this.revealedCount = 0;

        // Create empty board
        for (let y = 0; y < this.height; y++) {
            const row = [];
            for (let x = 0; x < this.width; x++) {
                row.push({
                    x: x,
                    y: y,
                    hasMine: false,
                    revealed: false,
                    flagged: false,
                    adjacentCount: 0
                });
            }
            this.board.push(row);
        }

        // Place mines (after first reveal to ensure first click is safe)
        // We'll place them randomly now, but the actual game logic
        // should defer mine placement until first click
    }

    // Place mines after first reveal (to prevent first click being a mine)
    placeMines(excludeX, excludeY) {
        let minesPlaced = 0;
        
        while (minesPlaced < this.mineCount) {
            const x = Math.floor(Math.random() * this.width);
            const y = Math.floor(Math.random() * this.height);

            // Don't place mine at first click position or if already has mine
            if (!this.board[y][x].hasMine && (x !== excludeX || y !== excludeY)) {
                this.board[y][x].hasMine = true;
                minesPlaced++;
            }
        }

        // Calculate adjacent mine counts
        this.calculateAdjacentCounts();
    }

    // Calculate adjacent mine counts for all cells
    calculateAdjacentCounts() {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.board[y][x].hasMine) continue;

                let count = 0;
                for (const [dx, dy] of directions) {
                    const nx = x + dx;
                    const ny = y + dy;
                    if (this.isValidPosition(nx, ny) && this.board[ny][nx].hasMine) {
                        count++;
                    }
                }
                this.board[y][x].adjacentCount = count;
            }
        }
    }

    // Check if position is valid
    isValidPosition(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    // Reveal a cell
    revealCell(x, y) {
        if (this.gameOver || this.gameWon || this.board[y][x].revealed || this.board[y][x].flagged) {
            return { success: false };
        }

        // Place mines on first reveal (safe start)
        if (this.firstReveal) {
            this.firstReveal = false;
            this.placeMines(x, y);
        }

        const cell = this.board[y][x];
        cell.revealed = true;
        this.revealedCount++;

        const result = {
            success: true,
            hitMine: cell.hasMine,
            won: false
        };

        if (cell.hasMine) {
            this.gameOver = true;
            this.revealAllMines();
            return result;
        }

        // Flood fill for empty cells
        if (cell.adjacentCount === 0) {
            this.floodFill(x, y);
        }

        // Check win condition
        if (this.revealedCount === (this.width * this.height - this.mineCount)) {
            this.gameWon = true;
            this.gameOver = true;
            result.won = true;
        }

        return result;
    }

    // Flood fill to reveal connected empty cells
    floodFill(startX, startY) {
        const stack = [[startX, startY]];
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];

        while (stack.length > 0) {
            const [x, y] = stack.pop();
            const cell = this.board[y][x];

            for (const [dx, dy] of directions) {
                const nx = x + dx;
                const ny = y + dy;

                if (this.isValidPosition(nx, ny)) {
                    const neighbor = this.board[ny][nx];
                    if (!neighbor.revealed && !neighbor.flagged) {
                        neighbor.revealed = true;
                        this.revealedCount++;

                        if (neighbor.adjacentCount === 0) {
                            stack.push([nx, ny]);
                        }
                    }
                }
            }
        }
    }

    // Toggle flag on a cell
    flagCell(x, y) {
        if (this.gameOver || this.board[y][x].revealed) {
            return { success: false };
        }

        const cell = this.board[y][x];
        cell.flagged = !cell.flagged;
        this.flagsPlaced += cell.flagged ? 1 : -1;

        return { success: true, flagged: cell.flagged };
    }

    // Reveal all mines when game is over
    revealAllMines() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.board[y][x].hasMine) {
                    this.board[y][x].revealed = true;
                }
            }
        }
    }

    // Get board state
    getBoardState() {
        return this.board;
    }

    // Get cell at position
    getCell(x, y) {
        return this.board[y][x];
    }

    // Check if game is over
    isGameOver() {
        return this.gameOver;
    }

    // Check if game is won
    isGameWon() {
        return this.gameWon;
    }

    // Get mine count
    getMineCount() {
        return this.mineCount;
    }

    // Get flags placed
    getFlagsPlaced() {
        return this.flagsPlaced;
    }

    // Get revealed count
    getRevealedCount() {
        return this.revealedCount;
    }
}
