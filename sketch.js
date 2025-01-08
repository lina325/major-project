// Random Rhythm
// Angelina Zhu
// Jan 21, 2025
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

const CELL_SIZE = 127;
const TILE_HEIGHT = 60;

let screenState = "start";
let songList; 
let level;
let score = 0;
let highScore;

let skz;
let sleepwalkMVImage;
let levelBackground;

let duck;
let dragon;
let dragonMusic;

let chkChkBoom;
let sleepwalk;

let levels = [];
let level0; 
let level1;
let i = 0;


function preload() {
  chkChkBoom = loadSound("audios/chk-chk-boom.mp3");
  sleepwalk = loadSound("audios/sleepwalk.mp3");
  dragonMusic = loadSound("audios/driftveil-city-music.mp3");

  skz = loadImage("images/skz.png");
  sleepwalkMVImage = loadImage("images/sleepwalk.png");

  songList = loadStrings("txt-files/songs.txt"); //this might be useless now lol

  duck = loadImage("duck-dance.gif");

  dragon = createVideo(["party-dance.mp4"]); //Maybe change back to gif (just in case?)
  dragon.loop();
  dragon.hide();

  // Load all level txt files
  level0 = loadStrings("txt-files/chk-chk-boom.txt");
  level1 = loadStrings("txt-files/sleepwalk.txt");

  // Place into array
  levels.push(level0);
  levels.push(level1);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  numOfRows = height/CELL_SIZE;
  
  textAlign(CENTER);

  if (getItem("highscore")) {
    highScore = getItem("highscore");
  }

  for (let level of levels) {  
    let rows = level.length;
    let cols = 4;
    
    let tiles = transferToTilesArray(rows, cols, level);

    levels.shift();
    levels.push(tiles);
  }
}

function draw() {
  if (screenState === "start") {
    background(251);
    displayStartScreen();
  }
  else if (screenState === "selection") {
    background(100);
    displaySelectionScreen();
  }
  else if (screenState === "play") {
    background(200);
    setTimeout(() => {
      playMusic(); //Change screenstate at end of music
    }, 2000);
    
    playLevel();
    displayGrid();
  }
  else if (screenState === "score") {
    background(255);
    displayScore();
    updateScores();
  }
}

function createEmpty2DArray(rows, cols) { //Maybe not necessary lol
  let newArray = [];

  for (let i = 0; i < rows; i++) {
    newArray.push([]);
    for (let j = 0; j < cols; j ++) {
      newArray[i].push(0);
    }
  }

  return newArray;
}

function transferToTilesArray(rows, cols, array) {
  let someArray = [];

  for (let i = 0; i < rows; i ++) {
    for (let j = 0; j < cols; j ++) {
      let some = array[i][j];
      if (some !== "0") {
        some = new TapTile(j, i);
        someArray.push(some);
      }
    }
  }

  return someArray;
}

function displayStartScreen() {
  image(duck, width/2 - duck.width * (height/duck.height)/2, 0, duck.width * (height/duck.height), duck.height * (height/duck.height));

  fill(0);
  textSize(120);
  text("Random", width/2 - 30, height/6 * 2);
  text("Rhythm", width/2 + 60, height/6 * 3);

  textSize(30);
  text("A rhythm game of miscellaneous songs", width/2, height/7 * 4);

  textSize(60);
  text("Let's go!", width/2, height/8 * 6);

  if (mouseX > width/2 - 140 && mouseX < width/2 + 140 && mouseY > height/9 * 6 && mouseY < height/9 * 6 + 80) {
    fill(0, 0, 0, 0);
    rect(width/2 - 140, height/9 * 6, 280, 80);
    if (mouseIsPressed) {
      screenState = "selection";
    }
  }
}

function displaySelectionScreen() {
  image(skz, 0, 0, width/2, height, 0, 0, width/2, skz.height, COVER);
  image(sleepwalkMVImage, width/2, 0, width/2, height, sleepwalkMVImage.width/2, 0, sleepwalkMVImage.width/2, sleepwalkMVImage.height, COVER);

  // Darken images and display hover
  fill(0, 0, 0, 200);

  if (mouseX > 0 && mouseX < width/2 - 5 && mouseY > 0 && mouseY < height) { 
    rect(0, 0, width/2, height);

    fill(0, 0, 0, 230);
    rect(width/2, 0, width/2, height);
  }
  else if (mouseX > width/2 + 5 && mouseX < width && mouseY > 0 && mouseY < height) {
    rect(width/2, 0, width/2, height);

    fill(0, 0, 0, 230);
    rect(0, 0, width/2, height);
  }
  else {
    rect(0, 0, width, height);
  }

  // Text
  textSize(30);
  fill(220);
  text("Chk Chk Boom", width/4, height/2); 
  text("Sleepwalk", width/4 * 3, height/2);

  // Selection
  setTimeout(() => {
    if (mouseIsPressed) {
      if (mouseX > 0 && mouseX < width/2 && mouseY > 0 && mouseY < height) {
        level = levels[0];
        levelBackground = skz;
      }
      else if (mouseX > width/2 && mouseX < width && mouseY > 0 && mouseY < height) {
        level = levels[1];
        levelBackground = sleepwalkMVImage;
      }
      screenState = "play";
    }
  }, 500);
}

function playMusic() {
  if (level === levels[0]) {
    if (!chkChkBoom.isPlaying()) {
      chkChkBoom.play();
    }
    // else if (chkChkBoom.onended()) {
    //   screenState = "score";
    // }
  }
  else if (level === levels[1]) {
    if (!sleepwalk.isPlaying()) {
      sleepwalk.play();
    }
  }
}

function displayGrid() {
  image(levelBackground, 0, 0, width, height, 0, 0, levelBackground.width, levelBackground.height, COVER);

  // Darken background
  fill(0, 0, 0, 200);
  rect(0, 0, width, height);

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

function playLevel() {
  for (let i = 0; i < level.length; i ++) {
    level[i].move();
    level[i].display();

  //   if ((key === "f" && level[i].column === 0 || key === "g" && level[i].column === 1 || key === "h" && level[i].column === 2 || key === "j" && level[i].column === 3) && keyIsPressed) { //Possible to just use y value
  //     let distFromLine = getDistance(dist(level[i].x, level[i].y, width/2 - CELL_SIZE*2 + CELL_SIZE*level[i].column, height  - height/8)); 
  //     checkHit(distFromLine);
  //   }
  //   else {
  //     text("Miss", width/2, height/3); //Pause at start before text starts showing up
  //   }
  }
  // i++;
}

function getDistance(distance) {
  if (distance < 10) {
    text("Amazing!", width/2, height/3);
    return "amazing";
  }
  else if (distance < 15 && mouseIsPressed) {
    text("Great!", width/2, height/3);
    return "great";
  }
  else if (distance < 20 && mouseIsPressed) {
    text("Nice", width/2, height/3);
    return "nice";
  }
  else if (distance < 25 && mouseIsPressed) {
    text("Good", width/2, height/3);
    return "good";
  }
}

function checkHit(distance) {
  if (distance === "amazing") {
    score += 100;
  }
  else if (distance === "great") {
    score += 80;
  }
  else if (distance === "nice") {
    score += 60;
  }
  else if (distance === "good") {
    score += 40;
  }
}

function updateScores() {
  // let topScores = loadStrings("top-scores.txt");
  // for (let aScore of topScores) {
  //   if (score > aScore) {
  //     aScore = score; //Editing txt file
  //   }
  // } 

  // Local storage method
  if (score > highScore) {
    highScore = score;
    storeItem("highscore", highScore);
  }
}

function displayScore() {
  if (!dragonMusic.isPlaying() && screenState === "score") { //Make it stop playing after leaving score page
    dragonMusic.loop();
  }
  else {
    dragonMusic.stop();
  }

  image(dragon, width/2 - [dragon.width * (height/dragon.height)]/2, 0, dragon.width * (height/dragon.height), dragon.height * (height/dragon.height));

  textSize(100);
  text("Good Job!", width/2, height/4);

  textSize(80);
  text(score, width/2, height/8 * 3);

  // Button to go back to selection
  rect(width/2 - 300, height/7 * 5 - 50, 600, 100);
  textSize(30);
  text("Confirm", width/2, height/7 * 5);
  if (mouseX > width/2 - 300 && mouseX < width/2 + 300 && mouseY > height/7 * 5 - 50 && mouseY < height/7 * 5 + 50 && mouseIsPressed) {
    screenState = "selection";
  }
}

class Tile {
  constructor(column, row) {
    // this.tileSize = CELL_SIZE - 5; Maybe make tiles a bit thinner?
    this.row = row; 
    this.column = column;
    this.x = this.column * CELL_SIZE + (width/2 - CELL_SIZE*2);
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
  constructor(column, row) {
    super(column, row);
    this.y = 0 - TILE_HEIGHT*(this.row + 1);
  }

  display() {
    super.display();
    rect(this.x, this.y, CELL_SIZE, TILE_HEIGHT);
  }

  move() {
    super.move();
  }
}

class HoldTile extends Tile { //Work on this
  constructor(column, tileLength) {
    super(column);
    this.tileHeight = TILE_HEIGHT*tileLength;
    this.y = 0 - this.tileHeight;
  }

  display() {
    super.display();
    rect(this.x, this.y, CELL_SIZE, this.tileHeight);
  }

  move() {
    super.move();
  }
}