let darts = [];
let resetButton;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 3; i++) {
    darts.push(new Dart(width / 4, height / 2 + i * 100));
  }
  dartboard = new Dartboard(3 * width / 4, height / 4, 300);

  // Create the reset button
  resetButton = createButton('Reset');
  resetButton.position(20, 20);
  resetButton.mousePressed(resetGame);
}

function draw() {
  background(39, 39, 39);
  dartboard.show();

  for (let dart of darts) {
    dart.show();
    dart.update();
    dart.collide(dartboard);
  }
}

function mousePressed() {
  for (let dart of darts) {
    dart.clicked(mouseX, mouseY);
  }
}

function mouseReleased() {
  for (let dart of darts) {
    dart.stopDragging();
  }
}

// The function that resets the game
function resetGame() {
  for (let i = 0; i < darts.length; i++) {
    darts[i] = new Dart(width / 4, height / 2 + i * 100);
  }
}
