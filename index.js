const cards = document.querySelectorAll(".card");
const restart = document.querySelector(".restart");
const starter = document.querySelector(".start");
const p = document.querySelector("p");
const timer = document.querySelector(".timer");
const popup = document.querySelector(".popup");
const list = document.querySelector(".list");
const nameInput = document.querySelector(".name-input");
const your = document.querySelector(".your");

let firstCard, secondCard;
let cardIsOpened = false;
let lockBoard = false;
let attempt = 0;
let checked = 0;

let minute = 0;
let second = 0;
let time;

const loadRecords = () => {
  list.innerHTML = "";
  const records = JSON.parse(localStorage.getItem("records")) || [];

  records.sort((a, b) => compareTime(a.time, b.time));

  records.forEach((record, index) => {
    const li = document.createElement("li");
    li.classList.add("item");
    if (index === 0) li.classList.add("best-record");

    const nameSpan = document.createElement("span");
    nameSpan.classList.add("name");
    nameSpan.textContent = record.name;

    const attemptSpan = document.createElement("span");
    attemptSpan.classList.add("attempt");
    attemptSpan.textContent = `attempts: ${record.attempt}`;

    const timeSpan = document.createElement("span");
    timeSpan.classList.add("time");
    timeSpan.textContent = record.time;

    li.appendChild(nameSpan);
    li.appendChild(attemptSpan);
    li.appendChild(timeSpan);
    list.appendChild(li);
  });
};

const timeToSeconds = (timeStr) => {
  const [minutes, seconds] = timeStr.split(":").map(Number);
  return minutes * 60 + seconds;
};

const compareTime = (timeA, timeB) =>
  timeToSeconds(timeA) - timeToSeconds(timeB);

function cardOpen() {
  if (lockBoard || this === firstCard) return;

  this.classList.add("open");

  if (!cardIsOpened) {
    cardIsOpened = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  cardIsOpened = false;
  checkCards();
}

const checkCards = () => {
  if (firstCard.dataset.animal === secondCard.dataset.animal) {
    checked++;
    firstCard.removeEventListener("click", cardOpen);
    secondCard.removeEventListener("click", cardOpen);

    setTimeout(() => {
      firstCard.classList.add("hide");
      secondCard.classList.add("hide");
    }, 500);

    attempt++;
    theEnd();
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove("open");
      secondCard.classList.remove("open");
      lockBoard = false;
    }, 1000);
    attempt++;
  }
};

const theEnd = () => {
  setTimeout(() => {
    if (checked === 31) {
      clearInterval(time);
      p.textContent = `${attempt} attempts`;
      timer.style.display = "none";
      restart.style.display = "block";
      popup.style.display = "block";
      your.textContent = `your time: ${timer.textContent}`;

      const name = nameInput.value.trim() || "Player";
      const finalTime = timer.textContent;
      const attempts = attempt;

      saveRecordToLocalStorage(name, attempts, finalTime);
      loadRecords();
    }
  }, 500);
};

const saveRecordToLocalStorage = (name, attempt, time) => {
  const records = JSON.parse(localStorage.getItem("records")) || [];
  records.push({ name, attempt, time });
  records.sort((a, b) => compareTime(a.time, b.time));
  localStorage.setItem("records", JSON.stringify(records));
};

const timing = () => {
  starter.style.display = "none";
  nameInput.style.display = "none";

  time = setInterval(() => {
    second++;
    if (second === 60) {
      minute++;
      second = 0;
    }

    const formattedTime = `${minute.toString().padStart(2, "0")}:${second
      .toString()
      .padStart(2, "0")}`;
    timer.textContent = formattedTime;
  }, 1000);

  cards.forEach((card) => card.addEventListener("click", cardOpen));
};

(function start() {
  cards.forEach((card) => {
    card.style.order = Math.floor(Math.random() * 24);
  });
})();

restart.addEventListener("click", () => location.reload());
starter.addEventListener("click", timing);

loadRecords();
