// attaches screen variable to HTML Canvas through id
const screen = document.getElementById("screenDisplay");
const screenCTX = screen.getContext("2d");

// creates the background
function newCanvas() {
  screenCTX.fillStyle = "darkgray";
  screenCTX.strokestyle = "black";
  screenCTX.fillRect(0, 0, screenDisplay.width, screenDisplay.height);
  screenCTX.strokeRect(0, 0, screenDisplay.width, screenDisplay.height);
};

let score = 0;

let food_x;
let food_y;

//horizontal velocity
let dx = 10;
//vertical velocity
let dy = 0;

// the snake is an array of objects, depicted as cells on the canvas, the tuples are x and y coordinates
const snake = [
  { x: 200, y: 200 },
  { x: 190, y: 200 },
  { x: 180, y: 200 },
  { x: 170, y: 200 },
  { x: 160, y: 200 }
];
//start the game
main();
generateFood();

document.addEventListener("keydown", direction);
// creates a snake, each chonk x & y are coordinates of where the block location is respectively.
// the 10, 10 in 3rd and 4th places are the diameter of each cell of the snake
function drawSnekChonk(chonk) {
  screenCTX.fillStyle = 'green';
  screenCTX.strokestyle = 'lightgreen';
  screenCTX.fillRect(chonk.x, chonk.y, 10, 10);
  screenCTX.strokeRect(chonk.x, chonk.y, 10, 10)
}
// loops over snake and then utilizes draw function to create chonks(cells)
function drawSnek() {
  snake.forEach(drawSnekChonk);
}
function main() {

  if (enderGame()) return;

  setTimeout(function onTick() {
    newCanvas();
    move_snake();
    drawSnek();
    drawFood();
    main();
  }, 100)
}

// creates new head and removes tail, this is how parts 'shift' for movement
function move_snake() {
  //generates new head
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  // adds the head into position
  snake.unshift(head);
  const hasEatenFood = (snake[0].x === food_x && snake[0].y === food_y);
  if (hasEatenFood) {
    //increase score
    score += 10
    document.getElementById('score').innerHTML = score;
    generateFood();
  } else {
    snake.pop();
  }
}

// function to control direction with arrow keys via keyCodes
function direction(event) {
  const leftKey = 37;
  const rightKey = 39;
  const upKey = 38;
  const downKey = 40;

  // each key has a keycode when pressed.
  const keyPressed = event.keyCode;

  //evaluates to true if condition is met, this is for conflict check
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;

  //checks for directional conflict IE: if going up already, can't go down
  if (keyPressed === leftKey && !goingRight) {
    dx = -10;
    dy = 0;
  }
  if (keyPressed === upKey && !goingDown) {
    dx = 0;
    dy = -10;
  }
  if (keyPressed === rightKey && !goingLeft) {
    dx = 10;
    dy = 0;
  }
  if (keyPressed === downKey && !goingUp) {
    dx = 0;
    dy = 10;
  }
};

function enderGame() {
  for (let i = 4; i < snake.length; i++) {
    // head collides with tail
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
  }
  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > screen.width - 10;
  const hitTopWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > screen.height - 10;
  return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall
}

function randomFood(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}
// creates the food and checks if food is consumed.
function generateFood() {
  food_x = randomFood(0, screen.width - 10);
  food_y = randomFood(0, screen.height - 10);
  snake.forEach(function hasSnakeEatenFood(chonk) {
    const hasEaten = chonk.x == food_x && chonk.y == food_y;
    if (hasEaten) generateFood();
  });
}

function drawFood() {
  screenCTX.fillStyle = 'red';
  screenCTX.strokestyle = 'red';
  screenCTX.fillRect(food_x, food_y, 10, 10);
  screenCTX.strokeRect(food_x, food_y, 10, 10)
}
