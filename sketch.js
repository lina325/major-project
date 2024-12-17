// Project Title
// Angelina Zhu
// Jan 21, 2025
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

const CELL_SIZE = 127;
const TILE_HEIGHT = 60;

let screenState = "selection";
let selection;
let songList; 
let level;
let score = 0;

let imageSize;
let skz;
let sleepwalkMVImage;
  
let chkChkBoom;
let sleepwalk;

//temporary
let array;
let tile;

function preload() {
  chkChkBoom = loadSound("chk-chk-boom.mp3");
  sleepwalk = loadSound("sleepwalk.mp3");

  skz = loadImage("skz.png");
  sleepwalkMVImage = loadImage("sleepwalk.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  numOfRows = height/CELL_SIZE;
  
  imageSize = width/2;

  songList = loadStrings("songs.txt");

  textAlign(CENTER);

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

    // noLoop();
    // loadLevel();
  }
  else if (screenState === "play") {
    background(200);
    // playMusic();

    displayGrid();
    // displayLevel();

    // tile.move();
    // tile.display();
  }
  else if (screenState === "score") {
    background(255);
    displayScore();
    updateScores();
  }
}

function displayStartScreen() {
  // Button for start + look into smth more interesting than a solid bg
}

function displaySelectionScreen() {
  let distance; 

  // Expand images if mouse is on/near
  if (mouseX > 0 && mouseX < width/2 && mouseY > 0 && mouseY < height) {
    // imageSize = map(imageSize, 0, width/2, 0, width);
    distance = dist(mouseX, mouseY, width/4, height/2);
  }
  else if (mouseX > width/2 && mouseX < width && mouseY > 0 && mouseY < height) {
    // imageSize = map(imageSize, 0, width/2, 0, width);
    distance = dist(mouseX, mouseY, width/4 * 3, height/2);
  }

  if (distance < width/4) {
    // imageSize = map(imageSize, 0, width/2, 0, width);
  }
  else {
    imageSize = width/2;
  }

  // Display images
  image(skz, 0, 0, imageSize, height, 0, 0, width, height, COVER);
  image(sleepwalkMVImage, width/2, 0, imageSize, height, sleepwalkMVImage.width/2, 0, sleepwalkMVImage.width/2, sleepwalkMVImage.height, COVER);

  // Darken images
  fill(0, 0, 0, 200);
  rect(0, 0, width, height);

  // Text
  textSize(30);
  fill(220);
  text("Chk Chk Boom", width/4, height/2); //Maybe use loop/restructure later
  text("Sleepwalk", width/4 * 3, height/2);

  // Selection
  if (mouseIsPressed) {
    if (mouseX > 0 && mouseX < width/2 && mouseY > 0 && mouseY < height) {
      selection = 0;
    }
    else if (mouseX > width/2 && mouseX < width && mouseY > 0 && mouseY < height) {
      selection = 1;
    }
    // loadLevel();
    screenState = "play";
  }
}

let transferredArray; //Temporary
let tiles;
let randomArray;

function loadLevel() {
  array = loadStrings(`${songList[selection]}.txt`); //Maybe can turn this into a local variable 

  let rows = 18;
  let cols = 4;

  transferredArray = createEmpty2DArray(rows, cols); 
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let value = array[i][j];
      transferredArray[i][j] = value;
    }
  }

  tiles = [];

  // for (let i = 0; i < array.length; i++) {
  //   for (let j = 0; j < array[i].length; j++) {
  //     if (array[i][j] === "t") {
  //       // Maybe store the properties instead? 
  //       someTile = new TapTile(j);
  //     }
  //     else if (array[i][j] === Number) { //Different way to do hold tiles 
  //       someTile = new HoldTile(j, array[i][j]);
  //     }
  //     else {
  //       someTile = 0;
  //     }
  //     tiles.push(someTile);
  //   }
  // }

  level = tiles;
}

function tranferTo2DArray(rows, cols, someArray) {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      transferredArray[i][j] = someArray[i][j];
    }
  }
}

function createEmpty2DArray(rows, cols) {
  let newArray = [];

  for (let i = 0; i < rows; i++) {
    newArray.push([]);
    for (let j = 0; j < cols; j ++) {
      newArray[i].push(0);
    }
  }

  return newArray;
}

function playMusic() {
  // Wait a few seconds before playing music 
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

function updateScores() {
  let topScores = loadStrings("top-scores.txt");
  for (let aScore of topScores) {
    if (score > aScore) {
      aScore = score; //Editing txt file
    }

  }
}

function displayScore() {
  text("Good Job!", width/2, height/4);
  text(score, width/2, height/3);

  // Button to go back to selection?
  rect(width/2 - 30, height/7 * 5 - 15, 60, 30);
  text("Confirm", width/2 - 30, height/7 * 5 - 15);
  if (mouseX > width/2 - 30 && mouseX < width/2 + 30 && mouseY > height/7 * 5 - 15 && mouseY < height/7 * 5 + 15 && mouseIsPressed) {
    screenState = "selection";
  }
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