// Project Title
// Angelina Zhu
// Jan 21, 2025
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

const CELL_SIZE = 127;
const TILE_HEIGHT = 60;

let screenState = "play";
let selection;
let songList; 
let level;
let score = 0;

let chkChkBoom;
let sleepwalk;

let tile;
let tile2;

function preload() {
  chkChkBoom = loadSound();
  sleepwalk = loadSound();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  numOfRows = height/CELL_SIZE;

  songList = loadStrings("songs.txt");

  // tile = new TapTile(0);
  // tile2 = new HoldTile(1, 3);
}

function draw() {
  if (screenState === "start") {
    background(50);
    displayStartScreen();
  }
  else if (screenState === "selection") {
    background(100);
    displaySelectionScreen();

    // Load song
    level = loadStrings(`${songList[selection]}.txt`);
  }
  else if (screenState === "play") {
    background(200);
    displayGrid();

    playMusic();

    // Test tiles
    // tile.move();
    // tile.display();

    // tile2.move();
    // tile2.display();
  }
  else if (screenState === "score") {
    background(255);
    displayScore();
  }
}

function displayStartScreen() {

}

function displaySelectionScreen() {
  // Set images and text overtop
  text("Placeholder", width/4, height/2);
  text("Placeholder", width/4 * 3, height/2);

  if (mouseX > 0 && mouseX < width/2 && mouseY > 0 && mouseY < height && mouseIsPressed) {
    selection = 0;
    screenState = "play";
  }
  else if (mouseX > width/2 && mouseX < width && mouseY > 0 && mouseY < height && mouseIsPressed) {
    selection = 1;
    screenState = "play";
  }
}

function displayGrid() {
  noStroke();
  fill(255);
  rect(width/2 - CELL_SIZE*2, 0, CELL_SIZE * 4, height);
    
  for (let i = 0; i < 5; i++) {
    strokeWeight(1);
    stroke(200);
    line(i * CELL_SIZE + (width/2 - CELL_SIZE*2), 0, i * CELL_SIZE + (width/2 - CELL_SIZE*2), height);
  }
  
  // Draw the target line --> Maybe change to something that looks nicer later
  strokeWeight(3);
  stroke(0);
  rect(width/2 - CELL_SIZE*2, height - height/8, CELL_SIZE * 4, TILE_HEIGHT); 
}

function playMusic() {
  if (selection === 0) {
    chkChkBoom.play();
  }
}

function keyPressed() { //Possible to combine the two types of tile checks?
  let distFromLine = checkHit(dist(tile.x, tile.y, width/2 - CELL_SIZE*2 + CELL_SIZE*column, height - height/8)); //Have to consider all columns
  if (key === "f" || key === "g" || key === "h" || key === "j") {
    if (distFromLine === "amazing") {
      score += 100;
    }
    else if (distFromLine === "great") {
      score += 80;
    }
    else if (distFromLine === "nice") {
      score += 60;
    }
    else if (distFromLine === "good") {
      score += 40;
    }
  }
}

function updateScore() {
  let topScores = loadStrings("top-scores.txt");
  for (let aScore of topScores) {
    if (score > aScore) {
      aScore = score; //Editing txt file
    }

  }
}

function displayScore() {
  // Could use local stoarge 
  // But what if you just update a file to keep top 10?
}

class Tile {
  constructor(column) {
    // this.tileSize = CELL_SIZE - 5; Maybe make tiles a bit thinner?
    this.x = column * CELL_SIZE + (width/2 - CELL_SIZE*2);
  }

  display() {
    strokeWeight(1);
    fill(210);
  }

  move() { //Maybe change movement later
    if (this.y < height + TILE_HEIGHT) {
      this.y += 6;
    }
  }

  checkHit(distance) {
    if (distance < 10) {
      text("Amazing!", width/2, height/3);
      return "amazing";
    }
    else if (distance < 15) {
      text("Great!", width/2, height/3);
      return "great";
    }
    else if (distance < 20) {
      text("Nice", width/2, height/3);
      return "nice";
    }
    else if (distance < 25) {
      text("Good", width/2, height/3);
      return "good";
    }
    else {
      text("Miss", width/2, height/3);
      return "miss";
    }
  }
}

class TapTile  extends Tile {
  constructor(column) {
    super(column);
    this.y = 0 - TILE_HEIGHT;
  }

  display() {
    super.display();
    rect(this.x, this.y, CELL_SIZE, TILE_HEIGHT);
  }
}

class HoldTile extends Tile {
  constructor(column, tileLength) {
    super(column);
    this.tileHeight = TILE_HEIGHT*tileLength;
    this.y = 0 - this.tileHeight;
  }

  display() {
    super.display();
    rect(this.x, this.y, CELL_SIZE, this.tileHeight);
  }

  // Can use keyIsPressed for this? or keyIsDown
}