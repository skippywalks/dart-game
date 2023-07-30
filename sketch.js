let chickenImg, dartboardImg;
let chickens = [];
let dartboard;
let resetButton;
const numOfChickens = 3;

function preload() {
    chickenImg = loadImage('assets/chicken.png');
    dartboardImg = loadImage('assets/dartboard.png');
}

class Chicken {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.isFlying = false;
    this.dragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
    this.vx = 0;
    this.vy = 0;
  }

  display() {
    image(chickenImg, this.x, this.y, 60, 100);
  }

  drag(mx, my) {
    if (this.isFlying) return;
    let d = dist(mx, my, this.x, this.y);
    if (d < 30) {
      this.dragging = true;
      this.offsetX = this.x - mx;
      this.offsetY = this.y - my;
    }
  }

  update() {
    if (this.dragging) {
      this.x = mouseX + this.offsetX;
      this.y = mouseY + this.offsetY;
    } else if (this.isFlying) {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.25; // gravity
    } else {
      this.vx = 0;
      this.vy = 0;
    }
  }

  fly() {
    if (this.dragging) {
      this.isFlying = true;
      this.vx = (this.x - mouseX) * 0.5;
      this.vy = (this.y - mouseY) * 0.5;
    }
    this.dragging = false;
  }
}

class Dartboard {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }

  display() {
    image(dartboardImg, this.x, this.y, this.r * 2, this.r * 2);
  }

  contains(x, y) {
    let d = dist(this.x, this.y, x, y);
    return d < this.r;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  resetButton = createButton('Reset');
  resetButton.position(20, 20);
  resetButton.mousePressed(resetGame);
  resetButton.id('resetButton');
  for (let i = 0; i < numOfChickens; i++) {
    chickens[i] = new Chicken(windowWidth / 4, windowHeight - 100 * i);
  }
  dartboard = new Dartboard(windowWidth - 200, windowHeight / 4, 150);
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
    chickens[i] = new Chicken(windowWidth / 4, windowHeight - 100 * i);
  }
  loop();
}
