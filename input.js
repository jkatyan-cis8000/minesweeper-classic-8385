// Input Handler module - Manages user input and UI events
class InputHandler {
    constructor() {
        this.difficultySelect = null;
        this.resetButton = null;
        this.onDifficultyChange = null;
        this.onCellClick = null;
        this.onResetClick = null;
    }

    // Initialize input handlers
    init(difficultySelectId, resetButtonId) {
        this.difficultySelect = document.getElementById(difficultySelectId);
        this.resetButton = document.getElementById(resetButtonId);

        // Bind difficulty change
        if (this.difficultySelect) {
            this.difficultySelect.addEventListener('change', () => {
                if (this.onDifficultyChange) {
                    this.onDifficultyChange(this.difficultySelect.value);
                }
            });
        }

        // Bind reset button
        if (this.resetButton) {
            this.resetButton.addEventListener('click', () => {
                if (this.onResetClick) {
                    this.onResetClick();
                }
            });
        }
    }

    // Bind cell click handler
    bindCellClick(callback) {
        this.onCellClick = callback;
    }

    // Bind flag toggle handler
    bindFlagClick(callback) {
        this.onFlagClick = callback;
    }

    // Bind difficulty change handler
    bindDifficultyChange(callback) {
        this.onDifficultyChange = callback;
    }

    // Bind reset button handler
    bindResetClick(callback) {
        this.onResetClick = callback;
    }

    // Get current difficulty
    getDifficulty() {
        return this.difficultySelect ? this.difficultySelect.value : 'beginner';
    }

    // Get all available difficulty levels
    getAvailableDifficulties() {
        if (!this.difficultySelect) return [];
        
        const options = [];
        for (let i = 0; i < this.difficultySelect.options.length; i++) {
            options.push(this.difficultySelect.options[i].value);
        }
        return options;
    }
}
