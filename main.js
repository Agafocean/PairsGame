let startTime, currentTime, timeProgress;
let games = localStorage.getItem("games") ? JSON.parse(localStorage.getItem("games")) : 0;
let wins = localStorage.getItem("wins") ? JSON.parse(localStorage.getItem("wins")) : 0;

const startGame = document.getElementById("startGame");
const typeEls = document.getElementsByClassName("type");
const sizeEls = document.getElementsByClassName("size");
const timeEls = document.getElementsByClassName("time");
const buttonStart = document.getElementById("buttonStart");
const crDeck = document.getElementById("deck");
const messageEl = document.getElementById("message");
const rangeProgress = document.getElementById("range-progress");
const gamesEl = document.getElementById("games");
const winsEl = document.getElementById("wins");

const params = { size: 4, isPictures: false, timeLimit: 60000 };
let numberOfCards = Math.pow(params.size, 2);
let numberOfOpenedCards = 0;
let playMore = true;

let labelFlexBasis = "22%";
let labelHeight = labelFlexBasis/2; //"100px";
let labelFontSize = "50px";

let initDeck = [];
let shuffledDeck = [];
const card = [];

let firstPress = true;  // будем открывать первую из двух карт
let firstCardPressed = null; // номер первой нажатой карты из двух
let clickAllowed = true;

gamesEl.textContent = `${games}`;
winsEl.textContent = `${wins}`;

Array.prototype.map.call(sizeEls, (s, ind) => {
  s.addEventListener('click', () => {
    for (let i = 0; i < sizeEls.length; i++) {
      sizeEls[i].style.opacity = "0.3";
    }
    sizeEls[ind].style.opacity = "1";

    params.size = (ind + 2) * 2;
    numberOfCards = Math.pow(params.size, 2);
    // задаем размеры карточек в зависимости от количества строк/столбцов
    switch (params.size) {
      case 4:
        labelFlexBasis = "22%";
        labelHeight = labelFlexBasis/2;  //"100px";
        labelFontSize = "50px";
        break;
      case 6:
        labelFlexBasis = "14%";
        labelHeight = "60px";
        labelFontSize = "40px";
        break;
    };
    openPairsGame();
  })
});

Array.prototype.map.call(typeEls, (s, ind) => {
  s.addEventListener('click', () => {
    for (let i = 0; i < typeEls.length; i++) {
      typeEls[i].style.opacity = "0.3";
    }
    typeEls[ind].style.opacity = "1";

    params.isPictures = ind === 1 ? true : false;
  })
});

Array.prototype.map.call(timeEls, (s, ind) => {
  s.addEventListener('click', () => {
    for (let i = 0; i < timeEls.length; i++) {
      timeEls[i].style.opacity = "0.3";
    }
    timeEls[ind].style.opacity = "1";

    params.timeLimit = 30000 * (ind + 1);
  })
});

function turnBack(i, j) {
  card[i].cardLabel.style.transform = "rotateX(0deg)";
  card[j].cardLabel.style.transform = "rotateX(0deg)";
  card[i].labelDeck.style.cursor = "pointer";
  card[j].labelDeck.style.cursor = "pointer";
  clickAllowed = true;
}


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
    card[i].labelDeck.style = "outline: 3px solid darkblue";
    card[i].labelDeck.style.flexBasis = labelFlexBasis;
  //  card[i].labelDeck.style.height = labelHeight;
   // card[i].labelDeck.style.fontSize = labelFontSize;
  //  card[i].frontCard.style.lineHeight = labelHeight;
 //  card[i].backCard.style.lineHeight = labelHeight;

    card[i].inputLabel.type = 'checkbox';
    card[i].cardLabel.classList.add('card');
    card[i].frontCard.classList.add('front');
    card[i].backCard.classList.add('back');

    card[i].frontCard.textContent = '~~';

    card[i].labelDeck.append(card[i].inputLabel);
    card[i].cardLabel.append(card[i].frontCard);
    card[i].cardLabel.append(card[i].backCard);
    card[i].labelDeck.append(card[i].cardLabel);

    card[i].labelDeck.addEventListener('click', (e) => {
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
                clearInterval(timeProgress);
                games++; wins++;
                localStorage.setItem("games", JSON.stringify(games));
                localStorage.setItem("wins", JSON.stringify(wins));
                setTimeout(() => {
                  crDeck.style.cursor = "not-allowed";
                  card.map((c, i) => card[i].labelDeck.classList = "disabled");
                  messageEl.style.color = "green";
                  messageEl.textContent = "CONGRATULATIONS!";
                  startGame.classList.remove("disabled");
               //   buttonStart.classList.remove("disabled");
                }, 500)
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
    if (params.isPictures) {
      card[i].backCardImg.src = `https://picsum.photos/id/1${shuffledDeck[i]}/320/100`;
    //  card[i].backCardImg.style.height = labelHeight;
    }
    else {
      card[i].backCard.textContent = card[i].cardNumber;
    }

    card[i].backCardImg.onerror = () => {
      card[i].backCardImg.style.display = 'none';
      card[i].backCard.textContent = card[i].cardNumber;
    };

    card[i].backCard.append(card[i].backCardImg);
  }
}

function openPairsGame() {
  crDeck.innerHTML = "";
  messageEl.textContent = "";
  numberOfOpenedCards = 0;
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

  crDeck.style.cursor = "not-allowed";
  card.map((c, i) => card[i].labelDeck.classList = "disabled");
}

// нажатие на кнопку старт
buttonStart.addEventListener('click', () => {
  openPairsGame();
  console.log("params", params);
  startGame.classList.add("disabled");
 // buttonStart.classList.add("disabled");
  crDeck.style.cursor = "all";
  card.map((c, i) => card[i].labelDeck.classList = "");
  startTime = Date.now();
  timeProgress = setInterval(() => {
    currentTime = Date.now();
    const width = ((currentTime - startTime) / params.timeLimit) * 100;
    rangeProgress.style = `width: ${width}%`;

    if (width > 100) {
      games++;
      localStorage.setItem("games", JSON.stringify(games));
      clearInterval(timeProgress);
      crDeck.style.cursor = "not-allowed";
      card.map((c, i) => card[i].labelDeck.classList = "disabled");

      messageEl.style.color = "red";
      messageEl.textContent = "TIME is OVER";
      startGame.classList.remove("disabled");
    // buttonStart.classList.remove("disabled");
    };
  }, 50);
});

openPairsGame();
