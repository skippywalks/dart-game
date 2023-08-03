let chickenImg, dartboardImg, scoringImg;
let chicken; // Here
let chickens = [];
let dartboard;
let draggingChicken = null;
let dartboardRadius = 200;
const numOfChickens = 3;
let wind = -.1; // Change this to the strength of wind you want
let missSound;



function preload() {
  chickenImg = loadImage('assets/chicken.png');
  dartboardImg = loadImage('assets/dartboard.png');
  scoringImg = loadImage('assets/scoring.png');
  scoringImg.loadPixels();
  missSound = loadSound('assets/missSound.mp3');
  pepeSound = loadSound('assets/pepe.mp3'); // Add this line
  pepeloveyouSound = loadSound('assets/pepeloveyou.mp3'); // Add this line
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);

  for (let i = 0; i < numOfChickens; i++) {
    chickens[i] = new Chicken((width / 8) + i * 75, height - 400);
    if (i === 0) {
      chicken = chickens[i]; // Here
    }
  }

  dartboard = new Dartboard(width - dartboardRadius - 50, dartboardRadius + 50, dartboardRadius); 

  let resetButton = select('#resetButton');
  resetButton.mousePressed(resetGame);
}

function draw() {
  background(100);
  
  image(dartboardImg, dartboard.x, dartboard.y, dartboard.r*2, dartboard.r*2); // Display the dartboard image

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
    chickens[i] = new Chicken((width / 8) + i * 75, height - 400);
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
    this.strength = 0.03; 
    this.maxRange = 200; 
    this.landed = false;
    this.pullBackDist = 0;
    this.landDistance = 0;
    this.rotation = -PI / 2;
    this.hasRotated = false;
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
    
    // Prevent the chicken from being dragged over the dartboard
    if (dist(this.x, this.y, dartboard.x, dartboard.y) < dartboard.r + 400) {
      let angle = atan2(this.y - dartboard.y, this.x - dartboard.x);
      this.x = dartboard.x + (dartboard.r + 400) * cos(angle);
      this.y = dartboard.y + (dartboard.r + 400) * sin(angle);
    }
  
  } else if (this.isFlying && !this.landed) {
    this.vx += wind; // Add wind
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
      if (this.score === 0) {
        missSound.play();
      }
    }
  }
}

 fly() {
  if (this.dragging && !this.landed) {
    this.isFlying = true;

    // Calculate the angle at which the chicken is pulled back
    let pullbackAngle = atan2(this.startY - this.y, this.startX - this.x);

    // Normalize the pullback angle to a value between 0 and 1
    let normalizedAngle = map(pullbackAngle, -PI, PI, 0, 1);

    // Use the normalized angle to determine a sector on the dartboard
    let sector = floor(normalizedAngle * dartboard.segments.length);
    let segmentAngle = map(sector, 0, dartboard.segments.length, 0, TWO_PI);

    // Use the pullback distance to determine the radius within the dartboard
    let normalizedDistance = map(this.pullBackDist, 0, this.maxRange, 0, 1);
    let radius = dartboard.r * normalizedDistance;

    // Now, calculate the landing spot on the dartboard
    let landX = dartboard.x + radius * cos(segmentAngle);
    let landY = dartboard.y + radius * sin(segmentAngle);

    // Calculate the velocity needed to reach the landing spot
    let landVX = (landX - this.startX) * this.strength;
    let landVY = (landY - this.startY) * this.strength;

    this.vx = landVX;
    this.vy = landVY;

    this.landDistance = dist(this.startX, this.startY, landX, landY);
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
    this.r = r;
    this.segments = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];
  }

  contains(x, y) {
    return dist(this.x, this.y, x, y) <= this.r;
  }

getScore(x, y) {
  // Normalize the coordinates relative to the image
  let normalizedX = map(x, this.x - this.r, this.x + this.r, 0, scoringImg.width);
  let normalizedY = map(y, this.y - this.r, this.y + this.r, 0, scoringImg.height);

  // Get the pixel color from the scoring image
  let c = scoringImg.get(normalizedX, normalizedY);

  // Call getColorScore() with the color of the pixel
  let score = this.getColorScore(c);

  // Play the appropriate sound based on the score
  if (score === 50 || score === 25) { // inner or outer bullseye
    pepeloveyouSound.play();
  } else if (score === 20 || score === 19 || score === 18 || score === 17 || score === 16 || score === 15) { // any other score
    pepeSound.play();
  } else if (score === 0) { // Missed dartboard
    missSound.play();
  }

  return score;
}

getColorScore(color) {
  let r = red(color);
  let g = green(color);
  let b = blue(color);

  if (r === 250 && g === 0 && b === 250) {
    pepeloveyouSound.play(); // Inner bullseye
    return 50; 
  } else if (r === 0 && g === 250 && b === 250) {
    pepeloveyouSound.play(); // Outer bullseye
    return 25; 
  } else if (r === 250 && g === 0 && b === 0) {
    missSound.play(); // Missed dartboard
    return 0; 
  } else {
    let singleScores = [20, 19, 18, 17, 16, 15];
    if (r > 0 && g === 0 && b === 0) {
      if (singleScores.includes(r / 10)) { // Single of special numbers
        pepeSound.play();
      }
      return r / 10; // Single
    } else if (g > 0 && r === 0 && b === 0) {
      pepeSound.play(); // Double
      return g / 10 * 2; 
    } else if (b > 0 && r === 0 && g === 0) {
      pepeSound.play(); // Triple
      return b / 10 * 3; 
    } 
  }
  return 0;
}
}
