const gridContainer = document.getElementById('grid');
const scoreElement = document.getElementById('score');

const size = 4;
let grid = [];
let score = 0;

function initGrid() {
    grid = [];
    for (let i = 0; i < size; i++) {
        grid[i] = [];
        for (let j = 0; j < size; j++) {
            grid[i][j] = 0;
        }
    }
    addRandomTile();
    addRandomTile();
    updateGrid();
}

function updateGrid() {
    gridContainer.innerHTML = '';
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            if (grid[i][j] !== 0) {
                cell.textContent = grid[i][j];
                cell.setAttribute('data-value', grid[i][j]);
            }
            gridContainer.appendChild(cell);
        }
    }
}

function addRandomTile() {
    let emptyTiles = [];
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (grid[i][j] === 0) {
                emptyTiles.push({ i, j });
            }
        }
    }

    if (emptyTiles.length > 0) {
        const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        grid[randomTile.i][randomTile.j] = Math.random() < 0.9 ? 2 : 4;
    }
}

function moveLeft() {
    let moved = false;
    for (let i = 0; i < size; i++) {
        let row = grid[i].filter(x => x !== 0);
        let newRow = [];
        for (let j = 0; j < row.length; j++) {
            if (row[j] === row[j + 1]) {
                newRow.push(row[j] * 2);
                score += row[j] * 2;
                j++;
            } else {
                newRow.push(row[j]);
            }
        }
        while (newRow.length < size) {
            newRow.push(0);
        }
        if (JSON.stringify(newRow) !== JSON.stringify(grid[i])) {
            moved = true;
        }
        grid[i] = newRow;
    }
    return moved;
}

function moveRight() {
    grid.forEach(row => row.reverse());
    let moved = moveLeft();
    grid.forEach(row => row.reverse());
    return moved;
}

function moveUp() {
    grid = rotateGrid(grid);
    let moved = moveLeft();
    grid = rotateGrid(grid);
    grid = rotateGrid(grid);
    grid = rotateGrid(grid);
    return moved;
}

function moveDown() {
    grid = rotateGrid(grid);
    let moved = moveRight();
    grid = rotateGrid(grid);
    grid = rotateGrid(grid);
    grid = rotateGrid(grid);
    return moved;
}

function rotateGrid(grid) {
    return grid[0].map((_, colIndex) => grid.map(row => row[colIndex]));
}

function handleKeyPress(event) {
    let moved = false;
    if (event.key === 'ArrowLeft') {
        moved = moveLeft();
    } else if (event.key === 'ArrowRight') {
        moved = moveRight();
    } else if (event.key === 'ArrowUp') {
        moved = moveUp();
    } else if (event.key === 'ArrowDown') {
        moved = moveDown();
    }

    if (moved) {
        addRandomTile();
        updateGrid();
        scoreElement.textContent = score;
    }
}

document.addEventListener('keydown', handleKeyPress);

initGrid();
