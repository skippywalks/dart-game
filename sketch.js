let chickenImg, dartboardImg;
let chickens = [];
let dartboard;
let draggingChicken = null;
let dartboardRadius = 200;
const numOfChickens = 3;

function preload() {
  chickenImg = loadImage('assets/chicken.png');
  dartboardImg = loadImage('assets/dartboard.png'); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);

  for (let i = 0; i < numOfChickens; i++) {
  chickens[i] = new Chicken((width / 4) + i * 75, height - 400);
}

  dartboard = new Dartboard(width - dartboardRadius - 50, dartboardRadius + 50, dartboardRadius); 

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
      chicken.rotate();
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
    chickens[i] = new Chicken((width / 4) + i * 75, height - 400);
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
    this.strength = 0.5; 
    this.maxRange = 200; 
    this.landed = false;
    this.pullBackDist = 0;
    this.landDistance = 0;
    this.rotation = -PI / 2;
    this.hasRotated = false; // The rotation flag
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    image(chickenImg, 0, 0, 100, 100);
    pop();

    if (this.landed) {
      fill(255);
      textSize(16);
      text(this.score, this.x, this.y);
    }
  }

  drag(mx, my) {
    if (this.isFlying || this.landed) return;
    let d = dist(mx, my, this.x, this.y);
    if (d < 50) {
      this.dragging = true;
      this.offsetX = this.x - mx;
      this.offsetY = this.y - my;
      this.pullBackDist = dist(mx, my, this.x, this.y);
    }
  }

  update() {
  if (this.dragging) {
    this.x = mouseX + this.offsetX;
    this.y = mouseY + this.offsetY;
  } else if (this.isFlying && !this.landed) {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.25;

    let spikeX = this.x + 50 * cos(this.rotation + PI / 2);
    let spikeY = this.y - 50 * sin(this.rotation + PI / 2);

    if (dartboard.contains(spikeX, spikeY)) {
   this.landing = true;
}

    if (this.isFlying && !this.landed && dist(this.startX, this.startY, spikeX, spikeY) >= this.landDistance) {
      this.landed = true;
      this.vx = 0;
      this.vy = 0;
      this.score = dartboard.getScore(spikeX, spikeY);
      console.log(`Chicken landed in: ${this.score}`);
    }
  }
}

  fly() {
    if (this.dragging && !this.landed) {
      this.isFlying = true;
      this.vx = (this.startX - this.x) * this.strength;
      this.vy = (this.startY - this.y) * this.strength;
      this.vx *= this.pullBackDist / 200;
      this.vy *= this.pullBackDist / 200;
      this.landDistance = dist(this.startX, this.startY, dartboard.x, dartboard.y) + this.pullBackDist / 2;
    }
    this.dragging = false;
  }

  rotate() {
    if (!this.hasRotated) {
      this.rotation += PI / 4;
      this.hasRotated = true;
    }
  }
}

class Dartboard {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = 200;
    this.segments = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];
  }

  contains(x, y) {
    return dist(this.x, this.y, x, y) <= this.r;
  }

  getScore(x, y) {
  // Only proceed if the dart has landed on the board
  if (this.contains(x, y)) {
    let angle = atan2(y - this.y, x - this.x);
    let distance = dist(x, y, this.x, this.y);

    // Apply rotation offset
    let rotationOffset = -PI / 2 + PI / 180;
    angle = angle - rotationOffset;

    if (angle < 0) {
      angle = TWO_PI + angle;
    }

    let segment = floor((angle / TWO_PI) * 20);
    segment = segment % this.segments.length;
    let score = this.segments[segment];
    
    //... other code remains the same
    return score;
  } else {
    // If the dart didn't land on the board, return 0 or some other non-scoring value
    return 0;
  }
}

}
