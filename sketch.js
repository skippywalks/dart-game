let chickenImg, dartboardImg;
let chickens = [];
let dartboard;
let draggingChicken = null;
let dartboardRadius = 150;
const numOfChickens = 3;
let resetButton;

function preload() {
  chickenImg = loadImage('assets/chicken.png');
  dartboardImg = loadImage('assets/dartboard.png');
}

function setup() {
  let canvas = createCanvas(windowWidth * 0.8, windowHeight * 0.8);
  canvas.parent("canvas-container");
  dartboard = new Dartboard(width - dartboardRadius - 50, height / 2, dartboardRadius);
  for (let i = 0; i < numOfChickens; i++) {
    chickens[i] = new Chicken(100, height - (i+1)*100, chickenImg);
  }
  resetButton = select('#resetButton');
  resetButton.mousePressed(resetGame);
}

function draw() {
  background(100);
  image(dartboardImg, dartboard.x - dartboardRadius, dartboard.y - dartboardRadius, dartboardRadius * 2, dartboardRadius * 2);
  for (let chicken of chickens) {
    chicken.update();
    chicken.display();
    if (dartboard.contains(chicken.x, chicken.y)) {
      noLoop();
    }
  }
}

function mousePressed() {
  for (let chicken of chickens) {
    if (dist(mouseX, mouseY, chicken.x, chicken.y) < 50) {
      draggingChicken = chicken;
    }
  }
}

function mouseDragged() {
  if (draggingChicken) {
    draggingChicken.drag(mouseX, mouseY);
  }
}

function mouseReleased() {
  if (draggingChicken) {
    draggingChicken.fly();
    draggingChicken = null;
  }
}

function resetGame() {
  chickens = [];
  for (let i = 0; i < numOfChickens; i++) {
    chickens[i] = new Chicken(100, height - (i+1)*100, chickenImg);
  }
  loop();
}

class Chicken {
  constructor(x, y, img) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.isFlying = false;
    this.dragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
    this.vx = 0;
    this.vy = 0;
  }

  display() {
    image(this.img, this.x, this.y, 50, 100);
  }

  drag(mx, my) {
    if (this.isFlying) return;
    let d = dist(mx, my, this.x, this.y);
    if (d < 50) {
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
    }
  }

  fly() {
    if (this.dragging) {
      this.isFlying = true;
      this.vx = (this.x - mouseX) * 0.05;
      this.vy = (this.y - mouseY) * 0.05;
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

  contains(x, y) {
    let d = dist(this.x, this.y, x, y);
    return d < this.r;
  }
}
