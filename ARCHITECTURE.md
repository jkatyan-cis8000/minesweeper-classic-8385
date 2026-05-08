# Minesweeper Architecture

## Modules

### 1. GameCore (Game Logic)
**Responsibility:** Core game mechanics, board state, mine placement, win/loss conditions

**Exposed Interfaces:**
- `GameCore(boardWidth, boardHeight, mineCount)` - Constructor
- `initializeBoard()` - Set up board with mines
- `revealCell(x, y)` - Uncover a cell, return game state
- `flagCell(x, y)` - Toggle flag on a cell
- `getCell(x, y)` - Get cell state
- `isGameOver()` - Check if game ended
- `isWin()` - Check if player won
- `getAdjacentMineCount(x, y)` - Count mines around a cell
- `getBoardState()` - Get full board state

**Data Structures:**
- Cell: `{ revealed: boolean, flagged: boolean, hasMine: boolean, adjacentCount: number }`
- Board: 2D array of cells

### 2. DifficultyConfig (Difficulty Settings)
**Responsibility:** Define and provide difficulty presets

**Exposed Interfaces:**
- `getDifficulty(level)` - Return { width, height, mineCount } for level
- Supported levels: 'beginner', 'intermediate', 'expert'

### 3. UIController (User Interface)
**Responsibility:** Render board, handle user input, display game status

**Exposed Interfaces:**
- `renderBoard(board, onCellClick, onFlagClick)` - Create board DOM
- `updateCell(x, y, cell)` - Update single cell display
- `updateStatus(message)` - Update game status text
- `showGameOver(win, minesFound)` - Show game over screen
- `resetGame()` - Reset UI for new game

### 4. InputHandler (Input Management)
**Responsibility:** Handle mouse events and user interactions

**Exposed Interfaces:**
- `bindCellClick(callback)` - Register cell click handler
- `bindFlagClick(callback)` - Register flag toggle handler
- `bindResetClick(callback)` - Register reset button handler
- `getDifficulty()` - Get currently selected difficulty

### 5. App (Main Application)
**Responsibility:** Wire all modules together, manage game lifecycle

**Exposed Interfaces:**
- `init()` - Initialize the game
- `startNewGame(difficulty)` - Start a new game with given difficulty

## File Structure

```
/workspace/minesweeper-classic-8385/
├── index.html          # Main HTML file with board container
├── styles.css          # CSS for board, cells, flags, game states
├── game-core.js        # GameCore module
├── difficulty.js       # DifficultyConfig module
├── ui.js               # UIController module
├── input.js            # InputHandler module
└── app.js              # App module (main entry point)
```

## Game Flow

1. User selects difficulty → App creates GameCore with config
2. GameCore initializes board with random mine placement
3. UI renders board with cells
4. User clicks cells:
   - If mine: Game over
   - If empty: Reveal cell and recursively reveal adjacent empty cells
   - If number: Show count
5. User can flag suspected mines
6. Win condition: All non-mine cells revealed

## CSS States

- `.cell` - Default cell style
- `.cell.revealed` - Uncovered cell
- `.cell.mine` - Cell with mine (game over)
- `.cell.flagged` - Flagged cell
- `.cell-number-{1-8}` - Numbered cells with colors
