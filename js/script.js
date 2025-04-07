// Global variables for DOM elementst
const numberOfPlayersForm = document.getElementById('number-of-players-form');
const numberOfPlayersInput = document.getElementById('number-of-players');
const playerNamesForm = document.getElementById('player-names-form');
const playerInfoDisplay = document.getElementById('player-info');
const turnInfo = document.getElementById('turn-info');
const btnThrowDice = document.getElementById('btn-throw-dice');
const btnFreezeScore = document.getElementById('btn-freeze-score');
const btnNewGame = document.getElementById('btn-new-game');
const diceImg = document.getElementById('img-game');
const roundInfo = document.getElementById('round-info');
// Global game variables
let players = [];
let currentPlayerIndex = 0;
let roundScore = 0;
let gameActive = false;

  // Creates a label element for a player name input
  function createPlayerLabel(i) {
    const label = document.createElement('label');
    label.textContent = `Player ${i + 1}:`;
    label.classList.add('player-input');
    return label;
  }

  // Creates an input field for entering a players name
  function createPlayerInput(i) {
    const input = document.createElement('input');
    input.type = 'text';
    input.required = true;
    input.name = `player-${i}`;
    input.placeholder = `Name`;
    return input;
  }

  // Creates the "Start game" button
  function createStartButton() {
    const startBtn = document.createElement('button');
    startBtn.type = 'submit';
    startBtn.textContent = 'Start game';
    return startBtn;
  }

  // Displays name input fields and start button based on number of players
  function showPlayerNameInputs(numberOfPlayers) {
    playerNamesForm.innerHTML = '';   
    for (let i = 0; i < numberOfPlayers; i++) {
      const label = createPlayerLabel(i); 
      const input = createPlayerInput(i);   
      playerNamesForm.appendChild(label);
      playerNamesForm.appendChild(input);
      playerNamesForm.appendChild(document.createElement('br'));
    }  
    const startBtn = createStartButton(); 
    playerNamesForm.appendChild(startBtn);
    playerNamesForm.classList.remove('display-none'); 
  }

  // Collects all player names from input fields and creates player objects
  function getPlayerData() {
    const inputs = playerNamesForm.querySelectorAll('input');
    return Array.from(inputs).map((input, index) => ({
      name: input.value,
      totalScore: 0,
      rounds: 0,
      index
    }));
  }

  // Creates a table header row with given column names
  function createTableHeader(headers) {
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headers.forEach(headerText => {
      const th = document.createElement('th');
      th.innerText = headerText;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    return thead;
  }
  
  // Creates a table row with player data (name, total score, rounds)
  function createPlayerRow(player) {
    const row = document.createElement('tr');
    const nameCell = document.createElement('td');
    nameCell.innerText = player.name;    
    const totalCell = document.createElement('td');
    totalCell.innerText = player.totalScore;    
    const roundsCell = document.createElement('td');
    roundsCell.innerText = player.rounds;    
    row.appendChild(nameCell);
    row.appendChild(totalCell);
    row.appendChild(roundsCell);    
    return row;
  }
  
  // Creates a table of all players using their data
  function createPlayerTable(players) {
    const table = document.createElement('table');
    const headers = ['Player', 'Total', 'Rounds'];    
    table.appendChild(createTableHeader(headers));    
    const tbody = document.createElement('tbody');
    players.forEach(player => {
      tbody.appendChild(createPlayerRow(player));
    });    
    table.appendChild(tbody);    
    return table;
  }
  
  // Clears and updates the player info section with the latest table
  function updatePlayerInfo() {
    playerInfoDisplay.innerHTML = ''; 
    const table = createPlayerTable(players); 
    playerInfoDisplay.appendChild(table); 
  }
  
  // Updates the UI to show whose turn it is
  function updateTurnInfo() {
    turnInfo.innerText = `${players[currentPlayerIndex].name}'s turn`;
  }
  
  // Sets up the game state and UI at the start of a new game
  function initializeGame() {
    gameActive = true;
    roundScore = 0;
    currentPlayerIndex = 0;
    updatePlayerInfo();
    updateTurnInfo();
    btnThrowDice.classList.remove('display-none');
    playerNamesForm.classList.add('display-none');
    numberOfPlayersForm.classList.add('display-none');
    turnInfo.classList.remove('display-none');
  }  

  // Switches to the next player in the list
  function nextPlayer() {
    roundScore = 0;
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    updateTurnInfo();
  }

  // Shows dice rolling animation and enables the freeze button
  function showDiceAnimation() {
    diceImg.src = './img/moving-dice.gif';
    diceImg.style.display = 'block';
    btnFreezeScore.style.display = 'block';
    btnFreezeScore.disabled = false;
  }
  
  // Updates the dice image based on the rolled number
  function updateDiceImage(dice) {
    diceImg.src = `./img/${dice}.png`;
  }
  
  // Handles the case when the player rolls a 1 
  // (the score becomes 0 and one round is added to the players result)
  function handleDiceOne(player) {
    roundScore = 0;
    player.rounds++;
    updatePlayerInfo();
    roundInfo.innerText = `${player.name} rolled a 1 – round score reset!`;
    btnFreezeScore.disabled = true;
    nextPlayer();
  }
  
  // Adds the rolled dice value to the round score
  function updateRoundScore(dice) {
    roundScore += dice;
    roundInfo.innerText = `Round score: ${roundScore}`;
  }
  
  // Decides what to do based on the dice result (1 or other)
  function handleDiceResult(dice) {
    let player = players[currentPlayerIndex];
    if (dice === 1) {
      handleDiceOne(player);  
    } else {
      updateRoundScore(dice);  
    }
  }

  // Adds the current round score to the players total and updates info
  function updatePlayerScore() {
    let player = players[currentPlayerIndex];
    player.totalScore += roundScore;
    player.rounds++;
    updatePlayerInfo();
  }

  // Ends the game and updates the UI accordingly
  function stopGame() {
    gameActive = false;
    btnThrowDice.disabled = true;
    btnFreezeScore.style.display = 'none';
    btnNewGame.style.display = 'block';
    turnInfo.innerText = '';
  }
  
  // Displays the winner message in the "round info" area
  function showWinner() {
    roundInfo.innerText = `${players[currentPlayerIndex].name} wins!`;
    roundInfo.style.fontSize = '35px';
  }
  
  // Sorts players by score and by fewest rounds if tied
  function sortPlayers() {
    players.sort((a, b) => {
      if (b.totalScore === a.totalScore) {
        return a.rounds - b.rounds;
      }
      return b.totalScore - a.totalScore;
    });
  }
  
  // Shows all players ranked by score and rounds played
  function displayResults() {
    playerInfoDisplay.innerHTML = ''; 
    players.forEach((player, i) => {
      const h3 = document.createElement('h3');
      h3.innerText = `#${i + 1} ${player.name} - ${player.totalScore} points, ${player.rounds} rounds`;
      playerInfoDisplay.appendChild(h3);
    });
  }
  
  // Changes dice image to a celebratory winner animation
  function updateDiceImageForWinner() {
    diceImg.src = './img/winner.gif';
    diceImg.style.width = '150px';
    diceImg.style.height = 'auto';
  }
  
  // Handles all steps when a player wins the game
  function gameOver() {
    stopGame();
    showWinner();
    sortPlayers();
    displayResults();
    updateDiceImageForWinner();
  }

  // Checks if current player has won; if not, moves to next player
  function checkGameOver() {
    let player = players[currentPlayerIndex];
    if (player.totalScore >= 100) {
      gameOver();
    } else {
      roundInfo.innerText = `${player.name} froze score - ${roundScore} points added!`;
      nextPlayer();
    }
  }

  // Resets game-related data to initial state
  function resetGameStatus() {
    players = [];
    currentPlayerIndex = 0;
    roundScore = 0;
    gameActive = false;
  }
  
  // Clears and hides all dynamic UI elements
  function resetUIComponents() {
    playerInfoDisplay.innerHTML = '';
    turnInfo.innerText = '';
    roundInfo.innerText = '';
    roundInfo.style.cssText = '';
    diceImg.style.display = 'none';
    diceImg.style.width = '';
    diceImg.style.height = '';
    btnFreezeScore.style.display = 'none';
    btnThrowDice.classList.add('display-none');
    btnNewGame.style.display = 'none';
    turnInfo.classList.add('display-none');
    playerNamesForm.classList.add('display-none');
  }

  // Resets the input forms and re-displays the "number of players" form
  function resetFormsAndInfo() {
    numberOfPlayersForm.classList.remove('display-none');
    numberOfPlayersForm.reset();
    playerNamesForm.innerHTML = '';
    playerInfoDisplay.innerHTML = '';
    roundInfo.innerText = '';
  }

  // Handles the form submission for selecting number of players
  numberOfPlayersForm.addEventListener('submit', function (e) {
    e.preventDefault(); 
    const numberOfPlayers = numberOfPlayersInput.value;
    showPlayerNameInputs(numberOfPlayers); 
  });

  // Handles the form submission for entering player names
  playerNamesForm.addEventListener('submit', function (e) {
    e.preventDefault();
    players = getPlayerData();
    initializeGame();        
  });  

  // Handles the dice throw when the "Throw Dice" button is clicked
  btnThrowDice.addEventListener('click', function () {
    this.disabled = true;
    const dice = Math.floor(Math.random() * 6) + 1;
    showDiceAnimation();
    setTimeout(() => {
      updateDiceImage(dice);
      handleDiceResult(dice);  
      this.disabled = false;   
    }, 2000);
  });

  // Handles the "Freeze Score" button click
  btnFreezeScore.addEventListener('click', function () {
    updatePlayerScore();
    this.disabled = true;
    checkGameOver();
  });

  // Handles the "New Game" button click
  btnNewGame.addEventListener('click', function () {
    resetGameStatus();
    resetUIComponents();
    resetFormsAndInfo();
    btnThrowDice.disabled = false;
  });