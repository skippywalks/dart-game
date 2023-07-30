let chickens = [];
let dartboard;
let resetButton;
const numOfChickens = 3;

function setup() {
  createCanvas(windowWidth, windowHeight);
  resetButton = createButton('Reset');
  resetButton.position(20, 20);
  resetButton.mousePressed(resetGame);
  resetButton.id('resetButton');
  for (let i = 0; i < numOfChickens; i++) {
    chickens[i] = new Chicken(random(width), height / 2);
  }
  dartboard = new Dartboard(width - 200, height / 2, 150);
}

function draw() {
  background(100);
  for (let chicken of chickens) {
    chicken.update();
    chicken.display();
    if (dartboard.contains(chicken.x, chicken.y)) {
      noLoop();
    }
  }
  dartboard.display();
}

function mouseDragged() {
  for (let chicken of chickens) {
    chicken.drag(mouseX, mouseY);
  }
}

function mouseReleased() {
  for (let chicken of chickens) {
    chicken.fly();
  }
}

function resetGame() {
  chickens = [];
  for (let i = 0; i < numOfChickens; i++) {
    chickens[i] = new Chicken(random(width), height / 2);
  }
  loop();
}

// ... rest of the Chicken and
