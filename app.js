// Main application module - Ties everything together
class MinesweeperApp {
    constructor() {
        this.gameCore = null;
        this.uiController = new UIController();
        this.inputHandler = new InputHandler();
        this.currentDifficulty = 'beginner';
        this.difficultyConfig = DifficultyConfig;
    }

    // Initialize the application
    init() {
        // Initialize UI
        this.uiController.init('game-board', 'status-display', 'mine-count');

        // Initialize input handlers
        this.inputHandler.init('difficulty-select', 'reset-button');

        // Bind handlers
        this.inputHandler.bindDifficultyChange((difficulty) => this.startNewGame(difficulty));
        this.inputHandler.bindResetClick(() => this.startNewGame(this.currentDifficulty));

        // Show initial message
        this.uiController.updateStatus('Select a difficulty to start playing!');
    }

    // Start a new game with the given difficulty
    startNewGame(difficulty) {
        this.currentDifficulty = difficulty;

        const config = this.difficultyConfig.getDifficulty(difficulty);
        this.gameCore = new GameCore(config.width, config.height, config.mines);
        this.gameCore.initializeBoard();

        // Render board
        this.uiController.renderBoard(this.gameCore, (x, y) => this.handleCellClick(x, y), (x, y) => this.handleFlagClick(x, y));

        // Update display
        this.uiController.updateStatus(`Difficulty: ${this.capitalize(difficulty)}`);
        this.uiController.updateMineCount(this.gameCore.getMineCount(), 0);

        console.log(`New game started: ${difficulty} (${config.width}x${config.height}, ${config.mines} mines)`);
    }

    // Handle cell reveal click
    handleCellClick(x, y) {
        if (!this.gameCore) return;

        const result = this.gameCore.revealCell(x, y);

        if (result.success) {
            this.uiController.updateCell(this.gameCore.getCell(x, y));

            if (result.hitMine) {
                this.gameOver(false);
            } else if (result.won) {
                this.gameOver(true);
            } else {
                this.uiController.updateMineCount(
                    this.gameCore.getMineCount(),
                    this.gameCore.getFlagsPlaced()
                );
            }
        }
    }

    // Handle flag toggle
    handleFlagClick(x, y) {
        if (!this.gameCore) return;

        const result = this.gameCore.flagCell(x, y);

        if (result.success) {
            this.uiController.updateCell(this.gameCore.getCell(x, y));
            this.uiController.updateMineCount(
                this.gameCore.getMineCount(),
                this.gameCore.getFlagsPlaced()
            );
        }
    }

    // Handle game over
    gameOver(win) {
        this.uiController.showGameOver(win);
        this.uiController.updateStatus(this.gameCore.isGameOver() ? 
            (win ? '🎉 You won! All safe cells revealed!' : '💥 Game Over!') : 
            '');
    }

    // Utility: Capitalize first letter
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.gameApp = new MinesweeperApp();
    window.gameApp.init();
});
