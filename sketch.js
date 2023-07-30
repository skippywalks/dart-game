let chickenImg, dartboardImg;
let chickens = [];
let dartboard;
let draggingChicken = null;
let dartboardRadius = 150;

function preload() {
    chickenImg = loadImage('https://res.cloudinary.com/di2t8an4z/image/upload/v1690580573/chicken_vzyhhn.png');
    dartboardImg = loadImage('https://res.cloudinary.com/di2t8an4z/image/upload/v1690580079/dartboard_syzpbx.png');
}

function setup() {
    createCanvas(800, 600);
    imageMode(CENTER);

    for(let i=0; i<3; i++) {
        chickens.push({ x: width/4, y: height/2 + i*100, vx: 0, vy: 0 });
    }

    dartboard = { x: 3*width/4, y: height/2 };
}

function draw() {
    background(0);

    image(dartboardImg, dartboard.x, dartboard.y, dartboardRadius*2, dartboardRadius*2);

    chickens.forEach(chicken => {
        image(chickenImg, chicken.x, chicken.y, 90, 150);
        chicken.x += chicken.vx;
        chicken.y += chicken.vy;
        if(dist(chicken.x, chicken.y, dartboard.x, dartboard.y) < dartboardRadius) {
            chicken.vx = 0;
            chicken.vy = 0;
        }
    });
}

function mousePressed() {
    chickens.forEach(chicken => {
        if(dist(mouseX, mouseY, chicken.x, chicken.y) < 50) {
            draggingChicken = chicken;
        }
    });
}

function mouseReleased() {
    if(draggingChicken) {
        draggingChicken.vx = (draggingChicken.x - mouseX) / 20;
        draggingChicken.vy = (draggingChicken.y - mouseY) / 20;
        draggingChicken = null;
    }
}
