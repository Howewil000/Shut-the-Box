// Global Variables
// Elements
const die1Img = document.getElementById('die1');
const die2Img = document.getElementById('die2');

const startBtn = document.getElementById('startBtn');
const rollBtn = document.getElementById('rollBtn');
const individualBtn = document.getElementById('individualBtn');
const sumBtn = document.getElementById('sumBtn');
const endTurnBtn = document.getElementById('endTurnBtn');

const p1Input = document.getElementById('player1Name');
const p2Input = document.getElementById('player2Name');

// Boxes array [0 is points for round, others represent number spaces 1 to 9]
const boxes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

// Let variables
let currentPlayer = 1;      // 1 or 2
let currentRound = 1;       // from 1 to 5
let die1 = 0;
let die2 = 0;
let p1Name = '';
let p2Name = '';
let p1TotalPoints = 0;
let p2TotalPoints = 0;

// Other Elements references
const playersSection = document.getElementById('players');
const gameBoardSection = document.getElementById('gameBoardSection');
const scorecardSection = document.getElementById('scorecard');
const winnerSection = document.querySelector('.winner');
const currentPlayerDisplay = document.getElementById('currentPlayerDisplay');
const currentRoundDisplay = document.getElementById('currentRoundDisplay');
const scoreTbody = document.getElementById('scoreTbody');

// Initialize
function init() {
  // Hide game sections initially
  gameBoardSection.style.display = 'none';
  scorecardSection.style.display = 'none';
  winnerSection.style.display = 'none';

  // Disable buttons that shouldn't be active yet
  rollBtn.disabled = true;
  individualBtn.disabled = true;
  sumBtn.disabled = true;
  endTurnBtn.disabled = true;
}

// Random number generator for dice
function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

// Add event listeners
startBtn.addEventListener('click', startGame);
rollBtn.addEventListener('click', handleRoll);
individualBtn.addEventListener('click', handleIndividual);
sumBtn.addEventListener('click', handleSum);
endTurnBtn.addEventListener('click', handleEndTurn);

// Start Button Logic
function startGame() {
  const p1Val = p1Input.value.trim();
  const p2Val = p2Input.value.trim();

  if (p1Val === '' || p2Val === '') {
    alert("Please enter both player names.");
    p1Input.focus();
    return;
  }

  p1Name = p1Val;
  p2Name = p2Val;

  currentPlayer = 1;
  currentRound = 1;
  p1TotalPoints = 0;
  p2TotalPoints = 0;
  resetBoard();

  // Show/hide sections
  playersSection.style.display = 'none';
  gameBoardSection.style.display = 'block';
  scorecardSection.style.display = 'block';
  winnerSection.style.display = 'none';

  updateDisplays();

  rollBtn.disabled = false;
  individualBtn.disabled = true;
  sumBtn.disabled = true;
  endTurnBtn.disabled = true;

  // Clear any previous score rows
  scoreTbody.innerHTML = '';
}

// Update the text display for current player and round
function updateDisplays() {
  currentPlayerDisplay.textContent = (currentPlayer === 1) ? p1Name : p2Name;
  currentRoundDisplay.textContent = currentRound;
}

// Roll Button Logic
function handleRoll() {
  die1 = rollDice();
  die2 = rollDice();

  // Update dice images
  die1Img.src = `images/dice${die1}.png`;
  die2Img.src = `images/dice${die2}.png`;

  // Determine which buttons to enable/disable
  const isSame = (die1 === die2);
  const isBoxDie1Shut = (boxes[die1] === 'X');
  const isBoxDie2Shut = (boxes[die2] === 'X');

  individualBtn.disabled = isSame || isBoxDie1Shut || isBoxDie2Shut;

  const sum = die1 + die2;
  const isSumTooLarge = sum > 9;
  const isSumBoxShut = (boxes[sum] === 'X');

  sumBtn.disabled = isSumTooLarge || isSumBoxShut;

  endTurnBtn.disabled = !(individualBtn.disabled && sumBtn.disabled);

  rollBtn.disabled = true;
}

// Shut function
function shut(boxNumber) {
  const boxEl = document.getElementById(`box${boxNumber}`);
  boxEl.classList.add('shut');
  boxEl.textContent = 'X';
}

// Individual Button Logic
function handleIndividual() {
  shut(die1);
  shut(die2);

  boxes[die1] = 'X';
  boxes[die2] = 'X';

  const sum = die1 + die2;
  boxes[0] += sum;

  individualBtn.disabled = true;
  sumBtn.disabled = true;
  rollBtn.disabled = false;
  endTurnBtn.disabled = true;
}

// Sum Button Logic
function handleSum() {
  const sum = die1 + die2;

  shut(sum);
  boxes[sum] = 'X';

  boxes[0] += sum;

  individualBtn.disabled = true;
  sumBtn.disabled = true;
  rollBtn.disabled = false;
  endTurnBtn.disabled = true;
}

// End Turn Logic
function handleEndTurn() {
  const pointsForThisTurn = 45 - boxes[0];
  if (currentPlayer === 1) {
    p1TotalPoints += pointsForThisTurn;
    const row = buildRow(currentRound, pointsForThisTurn);
    scoreTbody.appendChild(row);
    currentPlayer = 2;
  } else {
    p2TotalPoints += pointsForThisTurn;
    const roundRow = document.getElementById(`round${currentRound}`);
    roundRow.querySelector('.p2Pts').textContent = pointsForThisTurn;

    currentPlayer = 1;
    currentRound++;
  }

  resetBoard();
  updateDisplays();

  if (currentRound > 5) {
    gameOver();
    return;
  }

  endTurnBtn.disabled = true;
  rollBtn.disabled = false;
}

// Build row function
function buildRow(roundNumber, p1Points) {
  const tr = document.createElement('tr');
  tr.id = `round${roundNumber}`;
  const th = document.createElement('th');
  th.textContent = `Round ${roundNumber}`;

  const p1Td = document.createElement('td');
  p1Td.classList.add('p1Pts');
  p1Td.textContent = p1Points;

  const p2Td = document.createElement('td');
  p2Td.classList.add('p2Pts');
  p2Td.textContent = '';

  tr.appendChild(th);
  tr.appendChild(p1Td);
  tr.appendChild(p2Td);

  return tr;
}

// Reset board function
function resetBoard() {
  boxes.fill(0);
  for (let i = 1; i <= 9; i++) {
    const boxEl = document.getElementById(`box${i}`);
    boxEl.classList.remove('shut');
    boxEl.textContent = i;
  }
}

// Game over function
function gameOver() {
  playersSection.style.display = 'none';
  gameBoardSection.style.display = 'none';
  scorecardSection.style.display = 'block';
  winnerSection.style.display = 'block';

  let winnerMsg = '';
  if (p1TotalPoints < p2TotalPoints) {
    winnerMsg = `${p1Name} wins with ${p1TotalPoints} points vs ${p2TotalPoints}`;
  } else if (p2TotalPoints < p1TotalPoints) {
    winnerMsg = `${p2Name} wins with ${p2TotalPoints} points vs ${p1TotalPoints}`;
  } else {
    winnerMsg = `It's a tie with both at ${p1TotalPoints} points!`;
  }

  winnerSection.textContent = winnerMsg;

  const playAgainBtn = document.createElement('button');
  playAgainBtn.textContent = "Play Again";
  playAgainBtn.addEventListener('click', playAgain);
  winnerSection.appendChild(playAgainBtn);
}

// Play again function
function playAgain() {
  p1TotalPoints = 0;
  p2TotalPoints = 0;
  currentRound = 1;
  currentPlayer = 1;

  playersSection.style.display = 'block';
  gameBoardSection.style.display = 'none';
  scorecardSection.style.display = 'none';
  winnerSection.style.display = 'none';

  rollBtn.disabled = true;
  individualBtn.disabled = true;
  sumBtn.disabled = true;
  endTurnBtn.disabled = true;

  p1Input.value = '';
  p2Input.value = '';
  p1Input.focus();
}

// Initialize on load
init();
