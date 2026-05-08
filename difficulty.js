// Difficulty configuration module
const DifficultyConfig = {
    // Difficulty presets
    presets: {
        beginner: {
            width: 9,
            height: 9,
            mines: 10
        },
        intermediate: {
            width: 16,
            height: 16,
            mines: 40
        },
        expert: {
            width: 30,
            height: 16,
            mines: 99
        }
    },

    // Get configuration for a difficulty level
    getDifficulty(level) {
        if (!this.presets[level]) {
            console.warn(`Unknown difficulty level: ${level}. Using beginner.`);
            return this.presets.beginner;
        }
        return this.presets[level];
    },

    // Get all available difficulty levels
    getAvailableLevels() {
        return Object.keys(this.presets);
    },

    // Validate difficulty level
    isValidLevel(level) {
        return this.presets.hasOwnProperty(level);
    }
};
