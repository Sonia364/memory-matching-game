localStorage.clear();
const imagePaths = [
    'images/img1.png',
    'images/img2.png',
    'images/img3.png',
    'images/img4.png',
    'images/img5.png',
    'images/img6.png',
    'images/img7.png',
    'images/img8.png',
];

// const shuffledImages = imagePaths.concat(imagePaths).sort(() => Math.random() - 0.5);
let shuffledImages = [];
let flippedTiles = [];
let matchedTiles = [];
const gameBoard = document.getElementById('gameBoard');
const gameInfo = document.querySelector('.game-info');
let moveCounter = 0;
let timeCounter = 0;
let timerInterval;
let playerName = '';
let leaderboard = [];

function startGame() {
    playerName = document.getElementById('playerName').value.trim();
    if (playerName) {
        shuffledImages = imagePaths.concat(imagePaths).sort(() => Math.random() - 0.5);
        timerInterval = setInterval(updateTimer, 1000);
        gameInfo.style.display = 'flex';
        updateMoveCounter();
        renderTiles();
        document.getElementById('playerInput').style.display = 'none';
        document.getElementById('restartButton').disabled = false;
        document.getElementById('restartButton').style.display = 'inline';
    }
}

function renderTiles() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    shuffledImages.forEach((imagePath, index) => {
        const tile = createTile(imagePath, index);
        gameBoard.appendChild(tile);
    });
}

function createTile(imagePath, index) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.dataset.index = index;
    const image = document.createElement('img');
    image.src = imagePath;
    tile.appendChild(image);
    tile.addEventListener('click', handleTileClick);
    return tile;
}

function handleTileClick() {
    const clickedTile = this;
    if (!flippedTiles.includes(clickedTile) && flippedTiles.length < 2) {
        flippedTiles.push(clickedTile);
        clickedTile.classList.add('flipped');
        const image = clickedTile.querySelector('img');
        image.style.display = 'block';

        if (flippedTiles.length === 2) {
            moveCounter++;
            updateMoveCounter();

            if (flippedTiles[0].querySelector('img').src === flippedTiles[1].querySelector('img').src) {
                matchedTiles = matchedTiles.concat(flippedTiles);
                flippedTiles = [];

                if (matchedTiles.length === shuffledImages.length) {
                    clearInterval(timerInterval); // Stop the timer
                    alert('Congratulations! You won!'); // Show winning message
                    updateLeaderboard(); // Update leaderboard
                    displayLeaderboard(); // Display leaderboard
                }
            } else {
                setTimeout(() => {
                    flippedTiles.forEach(tile => {
                        tile.classList.remove('flipped');
                        const image = tile.querySelector('img');
                        image.style.display = 'none';
                    });
                    flippedTiles = [];
                }, 1000);
            }
        }
    }
}


function updateMoveCounter() {
    document.getElementById('moveCounter').textContent = `Moves: ${moveCounter}`;
}

function updateTimer() {
    timeCounter++;
    document.getElementById('timeCounter').textContent = `Time: ${timeCounter} seconds`;
}

function restartGame() {
     leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

     const existingPlayer = leaderboard.find(entry => entry.moves === moveCounter && entry.time === timeCounter);
 
     if (!existingPlayer) {
         leaderboard.push({ name: playerName, moves: moveCounter, time: timeCounter });
     }
 
     leaderboard.sort((a, b) => {
         if (a.time === b.time) {
             return a.moves - b.moves;
         }
         return a.time - b.time;
     });
 
     localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
 
     displayLeaderboard();
 
    // Reset game variables
    document.getElementById('playerInput').style.display = 'flex'; // Show player input section
    document.getElementById('restartButton').disabled = true; // Disable restart button
    document.getElementById('restartButton').style.display = 'none';
    gameInfo.style.display = 'none';
    document.getElementById('playerName').value = ''; // Clear player name input
    document.getElementById('gameBoard').innerHTML = ''; // Clear game board
    document.getElementById('moveCounter').textContent = ''; // Clear move counter
    document.getElementById('timeCounter').textContent = ''; // Clear time counter
    shuffledImages = [];
    flippedTiles = [];
    matchedTiles = [];
    moveCounter = 0; 
    timeCounter = 0;
    playerName = '';
}

function displayLeaderboard() {
    const leaderList = document.getElementById('leaderList');
    leaderList.innerHTML = '';

    leaderboard.slice(0, 5).forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${entry.name} (Moves: ${entry.moves}, Time: ${entry.time} seconds)`;
        leaderList.appendChild(listItem);
    });
}

function updateLeaderboard() {
    leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

    const currentPlayerData = {
        name: playerName,
        moves: moveCounter,
        time: timeCounter
    };

    leaderboard.push(currentPlayerData);

    leaderboard.sort((a, b) => {
        if (a.time === b.time) {
            return a.moves - b.moves;
        }
        return a.time - b.time;
    });

    leaderboard = leaderboard.slice(0, 5);

    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}



document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('restartButton').addEventListener('click', restartGame);

// Display the leaderboard upon page load
displayLeaderboard();

