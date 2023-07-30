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
}

function mousePressed() {
  for (let chicken of chickens) {
    if (dist(mouseX, mouseY, chicken.x, chicken.y) < 50 && !chicken.isFlying) {
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
  loop();
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
    this.strength = 0.3; // this controls the strength of the throw
    this.maxRange = 200; // Maximum effective pull back distance
  }

  display() {
  // Draw pull back line
  if (this.dragging) {
    let pullBackDist = dist(this.startX, this.startY, this.x, this.y);
    let lineColor = color(0, 255, 0); // Start with green color for line
    if (pullBackDist > this.maxRange) {
      lineColor = color(255, 0, 0); // If pull back is too far, make the line red
    }
    stroke(lineColor);
    line(this.startX, this.startY, this.x, this.y);
  }
  // Draw the chicken
  image(chickenImg, this.x, this.y, 100, 100);
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
      let newPosX = mouseX + this.offsetX;
      let newPosY = mouseY + this.offsetY;
      let pullBackDist = dist(this.startX, this.startY, newPosX, newPosY);

      if (pullBackDist <= this.maxRange) {
        this.x = newPosX;
        this.y = newPosY;
      } else {
        // Calculate the angle of pull back
        let pullBackAngle = atan2(this.startY - newPosY, this.startX - newPosX);
        // Update the chicken's position to the maximum range in the same direction of pull back
        this.x = this.startX - this.maxRange * cos(pullBackAngle);
        this.y = this.startY - this.maxRange * sin(pullBackAngle);
      }
    } else if (this.isFlying) {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.25; // gravity
      if (dartboard.contains(this.x, this.y)) {
        this.isFlying = false;
      }
    }
  }

  fly() {
    if (this.dragging) {
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
  }

  contains(x, y) {
    let d = dist(this.x, this.y, x, y);
    return d < this.r;
  }
}

