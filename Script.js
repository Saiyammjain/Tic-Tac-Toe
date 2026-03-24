/* ── STEP 1: Generate star field ── */
const starsEl = document.getElementById('stars');
for (let i = 0; i < 80; i++) {
  const s = document.createElement('div');
  s.className = 'star';
  s.style.cssText = `
    left:${Math.random()*100}%;
    top:${Math.random()*100}%;
    --d:${2 + Math.random()*4}s;
    --delay:${Math.random()*4}s;
    width:${Math.random()<0.2 ? 3 : 2}px;
    height:${Math.random()<0.2 ? 3 : 2}px;
  `;
  starsEl.appendChild(s);
}

/* ── STEP 2: Game state ── */
const WIN_COMBOS = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // cols
  [0,4,8],[2,4,6]          // diagonals
];

let board      = Array(9).fill(null);
let current    = 'X';     // whose turn
let gameOver   = false;
let scores     = { X: 0, O: 0, D: 0 };

/* ── STEP 3: Render board cells ── */
const boardEl  = document.getElementById('board');
const turnEl   = document.getElementById('turn');
const statusEl = document.getElementById('status');

function buildBoard() {
  boardEl.innerHTML = '';
  board.forEach((val, i) => {
    const cell = document.createElement('div');
    cell.className = 'cell' + (val ? ' taken' : '') + (gameOver ? ' game-over' : '');
    cell.dataset.index = i;
    if (val) {
      cell.dataset.val = val;
      cell.textContent = val;
    }
    cell.addEventListener('click', handleClick);
    boardEl.appendChild(cell);
  });
}

/* ── STEP 4: Handle click ── */
function handleClick(e) {
  const idx = +e.currentTarget.dataset.index;
  if (gameOver || board[idx]) return;

  // Place mark
  board[idx] = current;
  buildBoard();

  // STEP 5: Check winner
  const winner = checkWinner();
  if (winner) {
    highlightWin(winner.combo, winner.player);
    statusEl.textContent = `PLAYER ${winner.player} WINS!`;
    statusEl.className = `status ${winner.player === 'X' ? 'x-wins' : 'o-wins'}`;
    turnEl.textContent = '';
    turnEl.className = 'turn';
    scores[winner.player]++;
    updateScores();
    gameOver = true;
    return;
  }

  // STEP 6: Check draw
  if (board.every(v => v)) {
    statusEl.textContent = 'DRAW!';
    statusEl.className = 'status draw';
    turnEl.textContent = '';
    turnEl.className = 'turn';
    scores.D++;
    updateScores();
    gameOver = true;
    return;
  }

  // STEP 7: Switch player
  current = current === 'X' ? 'O' : 'X';
  updateTurn();
}

/* ── STEP 5: Win detection ── */
function checkWinner() {
  for (const combo of WIN_COMBOS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { player: board[a], combo };
    }
  }
  return null;
}

/* ── STEP 6: Highlight winning cells ── */
function highlightWin(combo, player) {
  const cells = boardEl.querySelectorAll('.cell');
  combo.forEach(idx => {
    cells[idx].classList.add(player === 'X' ? 'win-x' : 'win-o');
  });
}

/* ── STEP 7: Update turn display ── */
function updateTurn() {
  turnEl.textContent = `PLAYER ${current}'S TURN`;
  turnEl.className = `turn ${current.toLowerCase()}`;
  statusEl.textContent = '';
  statusEl.className = 'status';
}

/* ── STEP 8: Update scores ── */
function updateScores() {
  document.getElementById('scoreX').textContent    = scores.X;
  document.getElementById('scoreO').textContent    = scores.O;
  document.getElementById('scoreDraw').textContent = scores.D;
}

/* ── STEP 9: Reset game ── */
document.getElementById('resetBtn').addEventListener('click', () => {
  board    = Array(9).fill(null);
  current  = 'X';
  gameOver = false;
  updateTurn();
  buildBoard();
});

/* ── Initialize ── */
buildBoard();
updateTurn();