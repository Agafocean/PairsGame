const timeLimit = 60000;

const startGame = document.getElementById("startGame");
const startGameInput = document.getElementById("startGameInput");
const buttonStart = document.getElementById("buttonStart");
const crDeck = document.getElementById("deck");
const timeOver = document.getElementById("timeover");

const images = document.getElementById("images");

let numberOfColumns = startGameInput.value;
let numberOfCards = Math.pow(numberOfColumns, 2);
let numberOfOpenedCards = 0;
let playMore = true;

let labelFlexBasis = "20%";
let labelHight = "100px";
let labelFontSize = "50px";

let initDeck = [];
let shuffledDeck = [];
const card = [];

let firstPress = true;  // будем открывать первую из двух карт
let firstCardPressed = null; // номер первой нажатой карты из двух
let clickAllowed = true;

startGameInput.addEventListener('input', function () {
  console.log(startGameInput.value);
  if (startGameInput.value != 0) {
    numberOfColumns = startGameInput.value;
    numberOfCards = Math.pow(numberOfColumns, 2);
    // задаем размеры карточек в зависимости от количества строк/столбцов
    switch (numberOfColumns) {
      case "2":
      case "4":
        labelFlexBasis = "20%";
        labelHight = "100px";
        labelFontSize = "50px";
        break;
      case "6":
        labelFlexBasis = "15%";
        labelHight = "60px";
        labelFontSize = "40px";
        break;
      case "8":
        labelFlexBasis = "11%";
        labelHight = "45px";
        labelFontSize = "30px";
        break;
      case "10":
        labelFlexBasis = "9%";
        labelHight = "35px";
        labelFontSize = "25px";
        break;
    }
  }
});

function turnBack(i, j) {
  card[i].cardLabel.style.transform = "rotateX(0deg)";
  card[j].cardLabel.style.transform = "rotateX(0deg)";
  card[i].labelDeck.style.cursor = "pointer";
  card[j].labelDeck.style.cursor = "pointer";
  clickAllowed = true;
}

// нажатие на кнопку старт
buttonStart.addEventListener('click', function () {
  startGame.style.display = "none";
  // открываем игровое поле
  crDeck.style.display = "flex";
  openPairsGame();
  // если время истекло (timeLimit)
  setTimeout(() => {
    console.log("Время истекло");
    crDeck.style.display = "none";
    timeOver.style.display = "block";
    buttonMore.style.display = "block";
    buttonMore.addEventListener('click', function () {
      location.reload();
      buttonMore.style.display = "none";
    });
  }, timeLimit);
});

class Card {
  open = false;  // карта открыта или нет
  labelDeck = document.createElement("label");
  inputLabel = document.createElement("input");
  cardLabel = document.createElement("div");
  frontCard = document.createElement("div");
  backCard = document.createElement("div");

  constructor(cardNumber) {
    this.cardNumber = cardNumber;
  }

  formCard(i) {
    card[i].labelDeck.style.flexBasis = labelFlexBasis;
    card[i].labelDeck.style.height = labelHight;
    card[i].labelDeck.style.fontSize = labelFontSize;
    card[i].frontCard.style.lineHeight = labelHight;
    card[i].backCard.style.lineHeight = labelHight;

    card[i].inputLabel.type = 'checkbox';
    card[i].cardLabel.classList.add('card');
    card[i].frontCard.classList.add('front');
    card[i].backCard.classList.add('back');

    card[i].frontCard.textContent = '~~~~~~';

    card[i].labelDeck.append(card[i].inputLabel);
    card[i].cardLabel.append(card[i].frontCard);
    card[i].cardLabel.append(card[i].backCard);
    card[i].labelDeck.append(card[i].cardLabel);

    card[i].labelDeck.addEventListener('click', function (e) {
      e.preventDefault();

      if (!card[i].open && clickAllowed) {
        card[i].cardLabel.style.transform = "rotateX(180deg)";
        card[i].labelDeck.style.cursor = "not-allowed";

        if (firstPress) {
          // запоминаем первую открытую карту
          firstPress = false;
          firstCardPressed = i;
        }
        else {
          // смотрим на вторую открытую карту
          if (i != firstCardPressed) {
            firstPress = true;
            if (shuffledDeck[i] != shuffledDeck[firstCardPressed]) {
              // закрываем несовпавшие карты
              clickAllowed = false;
              setTimeout(turnBack, 1200, i, firstCardPressed);
            }
            else {
              // оставляем одинаковые карты открытыми
              card[i].open = true; card[firstCardPressed].open = true;
              card[i].labelDeck.style.cursor = "not-allowed";
              card[firstCardPressed].labelDeck.style.cursor = "not-allowed";
              numberOfOpenedCards = numberOfOpenedCards + 2;
              // если открыты все карты
              if (numberOfOpenedCards == numberOfCards) {
                setTimeout(function () {
                  buttonMore.style.display = "block";
                  buttonMore.addEventListener('click', function () {
                    location.reload();
                    buttonMore.style.display = "none";
                  });
                }, 1000)
              }
            }
          }
        }
      }
    });
    crDeck.append(card[i].labelDeck);
  }
}

class AmazingCard extends Card {
  backCardImg = document.createElement("img");

  formAmCard(i) {
    if (images.checked) {
      card[i].backCardImg.src = `https://picsum.photos/id/1${shuffledDeck[i]}/320/100`;
    }
    else {
      card[i].backCard.textContent = card[i].cardNumber;
    }

    card[i].backCardImg.onerror = function () {
      card[i].backCardImg.style.display = 'none';
      card[i].backCard.textContent = card[i].cardNumber;
    };
    card[i].backCardImg.style.height = labelHight;
    card[i].backCard.append(card[i].backCardImg);
  }
}

function openPairsGame() {
  // начальная колода
  initDeck = [];
  for (let i = 1; i <= numberOfCards / 2; i++) {
    initDeck.push(i); initDeck.push(i);
  }

  // Тасуем колоду
  shuffledDeck = [];
  for (let i = 0; i < numberOfCards; i++) {
    shuffledDeck.push(initDeck[i]);
  }

  for (let i = numberOfCards - 1; i > 0; i--) {
    let j = Math.round(Math.random() * i);
    let temp = shuffledDeck[i];
    shuffledDeck[i] = shuffledDeck[j];
    shuffledDeck[j] = temp;
  }

  for (let i = 0; i < numberOfCards; i++) {
    card[i] = new AmazingCard(shuffledDeck[i]);
    card[i].formCard(i);
    card[i].formAmCard(i);
  }
}
