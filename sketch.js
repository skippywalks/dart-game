let chickenImg, dartboardImg;
let chickens = [];
let dartboard;
let resetButton;
let aimLineVisible = false;

function preload() {
    chickenImg = loadImage('assets/chicken.png');
    dartboardImg = loadImage('assets/dartboard.png');
}

class Chicken {
    constructor(x, y) {
        this.initialX = x;
        this.initialY = y;
        this.x = x;
        this.y = y;
        this.dragging = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.vx = 0;
        this.vy = 0;
    }

    display() {
        image(chickenImg, this.x, this.y, 70, 120);
    }

    drag(mx, my) {
        let d = dist(mx, my, this.x, this.y);
        if (d < 35) {
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
        // Chicken is not flying and is not being dragged
        this.vx = 0;
        this.vy = 0;
    }
}
    }

    fly() {
        if (this.dragging) {
            this.vx = (this.x - mouseX) * 0.2;
            this.vy = (this.y - mouseY) * 0.2;
        }
        this.dragging = false;
    }

    reset() {
        this.x = this.initialX;
        this.y = this.initialY;
        this.vx = 0;
        this.vy = 0;
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
    let canvas = createCanvas(800, 600);
    canvas.parent('canvas-container');
    resetButton = select('#resetButton');
    resetButton.mousePressed(resetGame);
    resetGame();
}

function draw() {
    background(255);
    dartboard.display();
    for (let chicken of chickens) {
        chicken.update();
        chicken.display();
        if (chicken.dragging) {
            stroke(255, 0, 0);
            line(chicken.x, chicken.y, mouseX, mouseY);
        }
    }
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
    for (let i = 0; i < 3; i++) {
        chickens[i] = new Chicken(width / 3, height / 2 + i * 80);
    }
    dartboard = new Dartboard(3 * width / 4, height / 4, 150);
}
