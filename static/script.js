const gridContainer = document.getElementById('grid');
const scoreElement = document.getElementById('score');

const size = 4;
let grid = [];
let score = 0;

function initGrid() {
    grid = Array.from({ length: size }, () => Array(size).fill(0));
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
    scoreElement.textContent = score;
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
        const { i, j } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        grid[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
}

function compress(row) {
    return row.filter(num => num !== 0).concat(Array(size).fill(0)).slice(0, size);
}

function merge(row) {
    for (let i = 0; i < size - 1; i++) {
        if (row[i] !== 0 && row[i] === row[i + 1]) {
            row[i] *= 2;
            score += row[i];
            row[i + 1] = 0;
        }
    }
    return row;
}

function moveLeft() {
    let moved = false;
    for (let i = 0; i < size; i++) {
        let newRow = compress(grid[i]); 
        newRow = merge(newRow);
        newRow = compress(newRow);
        if (JSON.stringify(grid[i]) !== JSON.stringify(newRow)) {
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

function rotateGrid(times = 1) {
    for (let t = 0; t < times; t++) {
        grid = grid[0].map((_, colIndex) => grid.map(row => row[colIndex])).reverse();
    }
}

function moveUp() {
    rotateGrid(1);
    let moved = moveLeft();
    rotateGrid(3);
    return moved;
}

function moveDown() {
    rotateGrid(3);
    let moved = moveLeft();
    rotateGrid(1);
    return moved;
}

function handleKeyPress(event) {
    let moved = false;
    switch (event.key) {
        case 'ArrowLeft': moved = moveLeft(); break;
        case 'ArrowRight': moved = moveRight(); break;
        case 'ArrowUp': moved = moveUp(); break;
        case 'ArrowDown': moved = moveDown(); break;
    }

    if (moved) {
        addRandomTile();
        updateGrid();
    }
}

document.addEventListener('keydown', handleKeyPress);

initGrid();
document.getElementById("up").addEventListener("click", () => handleMove("Up"));
document.getElementById("down").addEventListener("click", () => handleMove("Down"));
document.getElementById("left").addEventListener("click", () => handleMove("Left"));
document.getElementById("right").addEventListener("click", () => handleMove("Right"));

function handleMove(direction) {
    let moved = false;
    if (direction === "ArrowLeft") {
        moved = moveLeft();
    } else if (direction === "ArrowRight") {
        moved = moveRight();
    } else if (direction === "ArrowUp") {
        moved = moveUp();
    } else if (direction === "ArrowDown") {
        moved = moveDown();
    }

    if (moved) {
        addRandomTile();
        updateGrid();
        scoreElement.textContent = score;
    }
}
