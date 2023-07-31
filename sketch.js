let chickenImg, dartboardImg;
let chickens = [];
let dartboard;
let draggingChicken = null;
let dartboardRadius = 150;
const numOfChickens = 3;

function preload() {
  chickenImg = loadImage('assets/chicken.png');
  dartboardImg = loadImage('assets/dartboard.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  
  for (let i = 0; i < numOfChickens; i++) {
    chickens[i] = new Chicken(width / 4, height - 400 - i * 50);
  }
  
  dartboard = new Dartboard(width - 200, 200, dartboardRadius);
  
  let resetButton = select('#resetButton');
  resetButton.mousePressed(resetGame);
}

function draw() {
  background(100);
  image(dartboardImg, dartboard.x, dartboard.y, dartboardRadius * 2, dartboardRadius * 2);
  for (let chicken of chickens) {
    chicken.update();
    chicken.display();
  }

  fill(255);
  textSize(16);
}

function mousePressed() {
  for (let chicken of chickens) {
    if (dist(mouseX, mouseY, chicken.x, chicken.y) < 50 && !chicken.isFlying && !chicken.landed) {
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
    chickens[i] = new Chicken(width / 4, height - 400 - i * 50);
  }
}

class Chicken {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;
    this.isFlying = false;
    this.dragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
    this.vx = 0;
    this.vy = 0;
    this.strength = 0.3; 
    this.maxRange = 200; 
    this.landed = false;
  }

  display() {
    if (this.dragging) {
      let pullBackDist = dist(this.startX, this.startY, this.x, this.y);
      let lineColor = color(0, 255, 0);
      if (pullBackDist > this.maxRange) {
        lineColor = color(255, 0, 0);
      }
      stroke(lineColor);
      line(this.startX, this.startY, this.x, this.y);
    }
    image(chickenImg, this.x, this.y, 100, 100);
    if (this.landed) {
      fill(255);
      textSize(16);
      try {
        text(this.score, this.x, this.y);
      } catch (err) {
        console.log('Error displaying score:', err);
      }
    }
  }

  drag(mx, my) {
    if (this.isFlying || this.landed) return;
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
    } else if (this.isFlying && !this.landed) {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.25; // gravity
      if (dartboard.contains(this.x, this.y)) {
        this.landed = true;
        this.vx = 0; // stop horizontal movement
        this.vy = 0; // stop vertical movement
        this.score = dartboard.getScore(this.x, this.y);
        console.log(`Chicken landed in: ${this.score}`);
      }
    }
  }


  fly() {
    if (this.dragging && !this.landed) {
      this.isFlying = true;
      this.vx = (this.startX - this.x) * this.strength;
      this.vy = (this.startY - this.y) * this.strength;
    }
    this.dragging = false;
  }
}

class Dartboard {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.scores = [6, 13, 4, 18, 1, 20, 5, 12, 9, 14, 11, 8, 16, 7, 19, 3, 17, 2, 15, 10];
  }

  contains(x, y) {
    return dist(this.x, this.y, x, y) < this.r;
  }

  getScore(x, y) {
    let d = dist(this.x, this.y, x, y);
    let angle = atan2(y - this.y, x - this.x);
    if (angle < 0) {
      angle += TWO_PI;
    }
    let sector = floor(angle / (TWO_PI / 20));

    let normalizedD = d / this.r;
    let multiplier;

    if (normalizedD <= 4 / this.r) {
      multiplier = 50;
    } else if (normalizedD <= 8 / this.r) {
      multiplier = 25;
    } else if (normalizedD <= 31.8 / this.r) {
      multiplier = 2;
    } else if (normalizedD <= 81 / this.r) {
      multiplier = 1;
    } else if (normalizedD <= 107 / this.r) {
      multiplier = 3;
    } else {
      multiplier = 1;
    }

    let baseScore = this.scores[sector];
    return baseScore * multiplier;
  }
}
