'use strict';

const game = document.getElementById('game');

createMenuGame();

let fieldSizeX;
let fieldSizeY;
let field;
let snake;
let food;

let direction = 'right';
let steps = false;
let gameStop = false;
let pauseSwitch = false;
let inGame = false;
let score = 0;
let intervalSpeed = 320;
let speedUp = 0.9;
let interval;

document.addEventListener('submit', startGame);

document.addEventListener('keyup', navigation);

document.addEventListener('click', startGame);

function cleaning() {
  direction = 'right';
  steps = false;
  gameStop = false;
  pauseSwitch = false;
  score = 0;
  intervalSpeed = 350;
  speedUp = 0.95;

  clearInterval(interval);

  game.innerHTML = '';
}

function createMenuGame() {
  game.innerHTML = `
    <p>⬅ - Move left</p>
    <p>⬆ - Move up</p>
    <p>➡ - Move right</p>
    <p>⬇ - Move down</p>
    <p>SPACE - Pause</p>
    <p>ESC - Exit</p>
    <form id="form-game">
      <p>
        Fild:
        <input
          field-width
          type="number"
          min="5"
          max="50"
          value="12"
          required
        >
        to
        <input
          field-height
          type="number"
          min="5"
          max="50"
          value="10"
          required
        >
      </p>
      <button id="start-game">Start</button>
    </form>
  `;
}

function startGame(e) {
  if (e.target.id !== 'form-game' && e.target.id !== 'new-game') {
    return;
  }

  e.preventDefault();

  if (e.target.id === 'form-game') {
    [fieldSizeX, fieldSizeY] = [
      +game.querySelector('[field-width]').value,
      +game.querySelector('[field-height]').value,
    ];
  }

  cleaning();

  pauseSwitch = true;
  inGame = true;

  fieldBuilding();

  generateSnake();

  createFood();

  interval = setInterval(move, intervalSpeed);
}

function fieldBuilding() {
  field = document.createElement('div');

  field.classList.add('field');
  game.append(field);

  field.style.width = `${fieldSizeX * 25}px`;
  field.style.height = `${fieldSizeY * 25}px`;

  for (let i = 0; i < (fieldSizeX * fieldSizeY); i++) {
    const exc = document.createElement('div');

    field.append(exc);
    exc.classList.add('excel');
  }

  const excel = field.querySelectorAll('.excel');
  let x = 1;
  let y = fieldSizeY;

  for (let i = 0; i < excel.length; i++) {
    excel[i].setAttribute('posX', x);
    excel[i].setAttribute('posY', y);
    x += 1;

    if (x > fieldSizeX) {
      x = 1;
      y -= 1;
    }
  }

  return field;
}

function generateSnake() {
  const posX = Math.round(Math.random() * (fieldSizeX - 3) + 3);
  const posY = Math.round(Math.random() * (fieldSizeY - 1) + 1);
  const coordinatesSnake = [posX, posY];

  snake = [
    field.querySelector(
      `[posX = "${coordinatesSnake[0]}"][posY = "${coordinatesSnake[1]}"]`),
    field.querySelector(
      `[posX = "${coordinatesSnake[0] - 1}"][posY = "${coordinatesSnake[1]}"]`),
    field.querySelector(
      `[posX = "${coordinatesSnake[0] - 2}"][posY = "${coordinatesSnake[1]}"]`),
  ];

  snake.forEach(el => el.classList.add('snake-body'));
  snake[0].classList.add('snake-head');
}

function createFood() {
  function generateFood() {
    const posX = Math.floor(Math.random() * (fieldSizeX - 1 + 1)) + 1;
    const posY = Math.floor(Math.random() * (fieldSizeY - 1 + 1)) + 1;

    return [posX, posY];
  }

  let foodCoordinates = generateFood();

  food = field.querySelector(
    `[posX = "${foodCoordinates[0]}"][posY = "${foodCoordinates[1]}"]`);

  while (food.classList.contains('snake-body')) {
    foodCoordinates = generateFood();

    food = field.querySelector(
      `[posX = "${foodCoordinates[0]}"][posY = "${foodCoordinates[1]}"]`);
  }

  food.classList.add('food');
}

function move() {
  const snakeHeadCoordinates = [
    snake[0].getAttribute('posX'),
    snake[0].getAttribute('posY'),
  ];

  snake[0].classList.remove('snake-head');
  snake[snake.length - 1].classList.remove('snake-body');
  snake.pop();

  switch (direction) {
    case 'right':
      if (snakeHeadCoordinates[0] < fieldSizeX) {
        snake.unshift(field.querySelector(
          `[posX = "${
            +snakeHeadCoordinates[0] + 1
          }"][posY = "${
            snakeHeadCoordinates[1]
          }"]`));
      } else {
        snake.unshift(field.querySelector(
          `[posX = "${1}"][posY = "${snakeHeadCoordinates[1]}"]`));
      }
      break;
    case 'up':
      if (snakeHeadCoordinates[1] < fieldSizeY) {
        snake.unshift(field.querySelector(
          `[posX = "${
            snakeHeadCoordinates[0]
          }"][posY = "${
            +snakeHeadCoordinates[1] + 1
          }"]`));
      } else {
        snake.unshift(field.querySelector(
          `[posX = "${snakeHeadCoordinates[0]}"][posY = "${1}"]`));
      }
      break;
    case 'left':
      if (snakeHeadCoordinates[0] > 1) {
        snake.unshift(field.querySelector(
          `[posX = "${
            +snakeHeadCoordinates[0] - 1
          }"][posY = "${
            snakeHeadCoordinates[1]
          }"]`));
      } else {
        snake.unshift(field.querySelector(
          `[posX = "${fieldSizeX}"][posY = "${snakeHeadCoordinates[1]}"]`));
      }
      break;
    case 'down':
      if (snakeHeadCoordinates[1] > 1) {
        snake.unshift(field.querySelector(
          `[posX = "${
            snakeHeadCoordinates[0]
          }"][posY = "${
            +snakeHeadCoordinates[1] - 1
          }"]`));
      } else {
        snake.unshift(field.querySelector(
          `[posX = "${snakeHeadCoordinates[0]}"][posY = "${fieldSizeY}"]`));
      }
      break;
  }

  if (snake[0].getAttribute('posX') === food.getAttribute('posX')
    && snake[0].getAttribute('posY') === food.getAttribute('posy')) {
    food.classList.remove('food');

    const xPosNewElemet = snake[snake.length - 1].getAttribute('posX');
    const yPosNewElemet = snake[snake.length - 1].getAttribute('posY');

    snake.push(field.querySelector(
      `[posX = "${xPosNewElemet}"][posY = "${yPosNewElemet}"]`));

    score += 1;

    if (score % 3 === 0) {
      intervalSpeed *= speedUp;
      clearInterval(interval);
      interval = setInterval(move, intervalSpeed);
    }

    createFood();
  }

  if (snake[0].classList.contains('snake-body')) {
    clearInterval(interval);
    gameOver();
  }

  snake[0].classList.add('snake-head');
  snake[0].classList.add('snake-body');

  steps = true;
}

function navigation(e) {
  if (steps === true) {
    if (e.keyCode === 37 && direction !== 'right') {
      direction = 'left';
      steps = false;
    } else if (e.keyCode === 38 && direction !== 'down') {
      direction = 'up';
      steps = false;
    } else if (e.keyCode === 39 && direction !== 'left') {
      direction = 'right';
      steps = false;
    } else if (e.keyCode === 40 && direction !== 'up') {
      direction = 'down';
      steps = false;
    }
  }

  if (e.keyCode === 27 && inGame) {
    inGame = false;
    cleaning();
    createMenuGame();
  }

  if (pauseSwitch) {
    if (e.keyCode === 32 && !gameStop) {
      clearInterval(interval);
      gameStop = true;
    } else if (e.keyCode === 32 && gameStop) {
      interval = setInterval(move, intervalSpeed);
      gameStop = false;
    }
  }
}

function gameOver() {
  game.innerHTML = `
    <p class="paragraph">Score: ${score}</p>
    <button id="new-game">Ok</button>
  `;
}
