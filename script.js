const board = document.getElementById('game-board');
const scoreDisplay = document.getElementById("score");
const restartButton = document.getElementById("restart-button");
const themeToggleBtn = document.getElementById("theme-toggle");

let score = 0;
let tiles = [];

function initializeGame() {
  score = 0;
  tiles = [];
  board.innerHTML = '';
  for (let i = 0; i < 16; i++) {
    let tile = document.createElement("div");
    tile.classList.add('tile');
    tile.dataset.value = 0;
    tiles.push(tile);
    board.appendChild(tile);
  }

  addRandomTile();
  addRandomTile();
  updateBoard();
}

function addRandomTile() {
  const emptyTiles = tiles.filter(tile => tile.dataset.value == 0);
  if (emptyTiles.length === 0) return;
  const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
  randomTile.dataset.value = Math.random() < 0.9 ? 2 : 4;
  randomTile.classList.add('tile');
}

function updateBoard() {
  tiles.forEach(tile => {
    const value = parseInt(tile.dataset.value);
    tile.textContent = value > 0 ? value : '';
    tile.className = 'tile';
    if (value > 0) tile.classList.add(`tile-${value}`);
  });

  scoreDisplay.textContent = score;
}

function move(direction) {
  let moved = false;

  for (let i = 0; i < 4; i++) {
    let line = [];

    for (let j = 0; j < 4; j++) {
      const index = direction === "up" || direction === "down" ? i + j * 4 : j + i * 4;
      const value = parseInt(tiles[index].dataset.value);
      if (value !== 0) line.push(value);
    }

    if (direction === "right" || direction === "down") line.reverse();

    let mergedLine = mergeLine(line);
    if (direction === "right" || direction === "down") mergedLine.reverse();

    for (let j = 0; j < 4; j++) {
      const index = direction === "up" || direction === "down" ? i + j * 4 : j + i * 4;
      const newValue = mergedLine[j] || 0;

      if (tiles[index].dataset.value != newValue) {
        tiles[index].dataset.value = newValue;
        moved = true;
      }
    }
  }

  if (moved) {
    addRandomTile();
    updateBoard();
  }
}

function mergeLine(line) {
  for (let i = 0; i < line.length - 1; i++) {
    if (line[i] === line[i + 1]) {
      line[i] *= 2;
      score += line[i];
      line.splice(i + 1, 1);
    }
  }

  while (line.length < 4) line.push(0);
  return line;
}

// Arrow key movement
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp": move("up"); break;
    case "ArrowDown": move("down"); break;
    case "ArrowLeft": move("left"); break;
    case "ArrowRight": move("right"); break;
  }
});

// Touch support
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

document.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, false);

document.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  touchEndY = e.changedTouches[0].screenY;
  handleGesture();
}, false);

function handleGesture() {
  const dx = touchEndX - touchStartX;
  const dy = touchEndY - touchStartY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 30) move("right");
    else if (dx < -30) move("left");
  } else {
    if (dy > 30) move("down");
    else if (dy < -30) move("up");
  }
}

// Button Events
restartButton.addEventListener("click", initializeGame);
themeToggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
});

initializeGame();
