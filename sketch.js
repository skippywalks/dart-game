let chickenImg, dartboardImg;
let chickens = [];
let dartboard;
let resetButton;
const numOfChickens = 3;
const chickenWidth = 50;
const chickenHeight = 75;

function preload() {
  chickenImg = loadImage('https://res.cloudinary.com/di2t8an4z/image/upload/v1690580573/chicken_vzyhhn.png');
  dartboardImg = loadImage('https://res.cloudinary.com/di2t8an4z/image/upload/v1690580079/dartboard_syzpbx.png');
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
    image(chickenImg, this.x, this.y, chickenWidth, chickenHeight);
  }

  drag(mx, my) {
    if (this.isFlying) return;
    let d = dist(mx, my, this.x, this.y);
    if (d < chickenWidth / 2) {
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
  createCanvas(windowWidth * 0.8, windowHeight * 0.8);
  resetButton = createButton('Reset');
  resetButton.position(20, 20);
  resetButton.mousePressed(resetGame);
  resetButton.id('resetButton');
  for (let i = 0; i < numOfChickens; i++) {
    chickens[i] = new Chicken(width / 4, (i * (chickenHeight + 20)) + chickenHeight);
  }
  dartboard = new Dartboard(width * 0.8, height / 2, 150);
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
    chicken.drag(mx, my);
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
    chickens[i] = new Chicken(width / 4, (i * (chickenHeight + 20)) + chickenHeight);
  }
  loop();
}
