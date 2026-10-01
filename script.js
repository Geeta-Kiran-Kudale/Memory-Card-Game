const gridContainer = document.getElementById("game-grid");
const scoreDisplay = document.getElementById("score");
const restartBtn = document.getElementById("restart-btn");

// 8 unique emojis duplicated to form 8 matching pairs (16 cards total)
const cardIcons = ['🐶', '🐱', '🦊', '🦁', '🐸', '🐵', '🦉', '🦄', '🐶', '🐱', '🦊', '🦁', '🐸', '🐵', '🦉', '🦄'];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let score = 0;

// Initialize the game
function initGame() {
    gridContainer.innerHTML = "";
    score = 0;
    scoreDisplay.innerText = score;
    firstCard = null;
    secondCard = null;
    lockBoard = false;

    // Shuffle the card array
    const shuffledCards = shuffle(cardIcons);

    // Dynamically build individual card elements
    shuffledCards.forEach(icon => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.icon = icon; // Store identifier data attribute

        card.innerHTML = `
            <div class="card-back">?</div>
            <div class="card-front">${icon}</div>
        `;

        card.addEventListener("click", flipCard);
        gridContainer.appendChild(card);
    });
}

// Fisher-Yates Shuffle algorithm
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

// Flip logic triggered on element click
function flipCard() {
    if (lockBoard) return; // Ignore input if board processing validation
    if (this === firstCard) return; // Prevent clicking the exact same open card twice

    this.classList.add("flipped");

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    checkMatch();
}

// Compare both picked card elements
function checkMatch() {
    let isMatch = firstCard.dataset.icon === secondCard.dataset.icon;
    isMatch ? disableCards() : unflipCards();
}

// Keep matching cards flipped up
function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    
    score += 10;
    scoreDisplay.innerText = score;

    resetTurn();
    checkWinCondition();
}

// Turn mismatched pairs back over after a short duration
function unflipCards() {
    lockBoard = true; // Freeze interaction during animation delay

    setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetTurn();
    }, 1000);
}

// Clear round track variables
function resetTurn() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

// Check if all elements are cleared out
function checkWinCondition() {
    const totalFlipped = document.querySelectorAll(".card.flipped").length;
    if (totalFlipped === cardIcons.length) {
        setTimeout(() => {
            alert(`🎉 Success! Game complete. Final Score: ${score}`);
        }, 500);
    }
}

restartBtn.addEventListener("click", initGame);

// Load UI board layout immediately upon initialization
initGame();
