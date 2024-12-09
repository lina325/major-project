// Project Title
// Angelina Zhu
// Jan 21, 2025
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

const CELL_SIZE = 127;
const TILE_HEIGHT = 60;

let screenState = "play";
let selection = 0;
let songList; 
let level;
let score = 0;

let chkChkBoom;
let sleepwalk;

let array;
let tile;

// function preload() {
//   chkChkBoom = loadSound();
//   sleepwalk = loadSound();
// }

function setup() {
  createCanvas(windowWidth, windowHeight);
  numOfRows = height/CELL_SIZE;

  songList = loadStrings("songs.txt");

  tile = new TapTile(0);
}

function draw() {
  if (screenState === "start") {
    background(50);
    displayStartScreen();
  }
  else if (screenState === "selection") {
    background(100);
    displaySelectionScreen();
  }
  else if (screenState === "play") {
    background(200);
    // playMusic();
    level = loadLevel();

    displayGrid();
    displayLevel();

    tile.move();
    tile.display();
  }
  else if (screenState === "score") {
    background(255);
    displayScore();
  }
}

function displayStartScreen() {
  // Button for start + look into smth more interesting than a solid bg
}

function displaySelectionScreen() {
  // Set images and text overtop
  text("Chk Chk Boom", width/4, height/2); //Maybe use loop/restructure later
  text("Placeholder", width/4 * 3, height/2);

  if (mouseIsPressed) {
    if (mouseX > 0 && mouseX < width/2 && mouseY > 0 && mouseY < height) {
      selection = 0;
    }
    else if (mouseX > width/2 && mouseX < width && mouseY > 0 && mouseY < height) {
      selection = 1;
    }
    // level = loadLevel();
    screenState = "play";
  }
}

function loadLevel() {
  array = loadStrings(`${songList[selection]}.txt`); //Maybe can turn this into a local variable 
  let cols = 4;
  let rows = array.length;

  array = tranferTo2DArray(rows, cols);
  let tiles;

  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      if (array[i][j] === "t") {
        someTile = new TapTile(j);
      }
      // else if (array[i][j] === Number) { //Different way to do hold tiles 
      //   someTile = new HoldTile(j, array[i][j]);
      // }
      // else {
      //   someTile = 0;
      // }
      tiles.push(someTile);
    }
  }

  return tiles;
}

function tranferTo2DArray(rows, cols) {
  let newArray = createEmpty2DArray(rows, cols);

  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      if (array[i][j] === "t") {
        newArray[i][j] === "t";
      }
    }
  }
}

function createEmpty2DArray(rows, cols) {
  let array = [];

  for (let i = 0; i < rows; i++) {
    array.push([]);
    for (let j = 0; j < cols; j ++) {
      array.push(0);
    }
  }
}

function playMusic() {
  if (selection === 0) {
    chkChkBoom.play();
  }
  else if (selection === 1) {
    sleepwalk.play();
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

function displayLevel() {
  for (let i = 0; i < level.length; i++) {
    for (let j = 0; j < level[i].length; j++) {
      if (level[i][j] !== 0) {
        level[i][j].move();
        level[i][j].display();
      }
    }
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

function checkHit(distance) {
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
}

class TapTile extends Tile {
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