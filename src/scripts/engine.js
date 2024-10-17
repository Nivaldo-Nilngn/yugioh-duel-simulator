const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-cards"),
        computer: document.getElementById("computer-field-cards"),
    },
    playerSides: {
        player1: "player-cards",
        player1BOX: document.getElementById("player-cards"),
        computer: "computer-cards",
        computerBOX: document.getElementById("computer-cards"),
    },
    actions: {
        button: document.getElementById("next-duel"),
    },
};

const pathImages = "./src/assets/icons/";

const cardData = [
    { id: 0, name: "Blue Eyes White Dragon", type: "Paper", img: `${pathImages}dragon.png`, winOf: [1], loseOf: [2] },
    { id: 1, name: "Dark Magician", type: "Rock", img: `${pathImages}magician.png`, winOf: [2], loseOf: [0] },
    { id: 2, name: "Exodia", type: "Scissors", img: `${pathImages}exodia.png`, winOf: [0], loseOf: [1] },
];

function getRandomCardId() {
    return Math.floor(Math.random() * cardData.length);
}

function createCardImage(idCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.height = 100;
    cardImage.src = "./src/assets/icons/card-back.png";
    cardImage.dataset.id = idCard;
    cardImage.classList.add("card");

    if (fieldSide === state.playerSides.player1) {
        cardImage.addEventListener("mouseover", () => drawSelectCard(idCard));
        cardImage.addEventListener("click", () => setCardsField(idCard));
    }
    return cardImage;
}

async function setCardsField(cardId) {
    await removeAllCardsImages();

    const computerCardId = getRandomCardId();
    toggleFieldCardsVisibility(true);
    clearCardDetails();
    drawCardsInField(cardId, computerCardId);

    const duelResults = checkDuelResults(cardId, computerCardId);
    updateScore();
    drawButton(duelResults);
}

function drawCardsInField(playerCardId, computerCardId) {
    state.fieldCards.player.src = cardData[playerCardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

function toggleFieldCardsVisibility(isVisible) {
    const displayStyle = isVisible ? "block" : "none";
    state.fieldCards.player.style.display = displayStyle;
    state.fieldCards.computer.style.display = displayStyle;
}

function clearCardDetails() {
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
}

function drawButton(text) {
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";
}

function checkDuelResults(playerCardId, computerCardId) {
    const playerCard = cardData[playerCardId];
    let result = "DRAW";

    if (playerCard.winOf.includes(computerCardId)) {
        result = "WIN";
        state.score.playerScore++;
    } else if (playerCard.loseOf.includes(computerCardId)) {
        result = "LOSE";
        state.score.computerScore++;
    }

    playAudio(result);
    return result;
}

function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

function removeAllCardsImages() {
    const { computerBOX, player1BOX } = state.playerSides;
    
    [computerBOX, player1BOX].forEach(box => {
        box.querySelectorAll("img").forEach(img => img.remove());
    });

    toggleFieldCardsVisibility(true);
}

function drawSelectCard(index) {
    const card = cardData[index];
    state.cardSprites.avatar.src = card.img;
    state.cardSprites.name.innerText = card.name;
    state.cardSprites.type.innerText = `Attribute: ${card.type}`;
}

function drawCards(cardsNumber, fieldSide) {
    for (let i = 0; i < cardsNumber; i++) {
        const randomIdCard = getRandomCardId();
        const cardImage = createCardImage(randomIdCard, fieldSide);
        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

function resetDuel() {
    removeAllCardsImages();
    clearCardDetails();
    state.actions.button.style.display = "none";
    toggleFieldCardsVisibility(false);
    init();
}

function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play().catch(() => {});
}

function init() {
    toggleFieldCardsVisibility(false);
    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);
    
    const bgm = document.getElementById("bgm");
    bgm.play();
}

init();
