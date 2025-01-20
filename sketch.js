// Random Rhythm
// Angelina Zhu
// Jan 21, 2025
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

const TILE_WIDTH = 127;
const TILE_HEIGHT = 60;

let screenState = "start";
let previousScreen;
let songList; 
let level;
let score = 0;
let highScore;

let skz;
let sleepwalkMVImage;
let levelBackground;
let back;
let colours = ["#d4fae6", "#e8d4fa", "#d6f8ff", "#ffebf8"];

let duck;
let dragon;
let dragonMusic;
let font;

let music;
let chkChkBoom;
let sleepwalk;
let hit;
let bpm;

let levels = [];
let level0; 
let level1;


function preload() {
  chkChkBoom = loadSound("audios/chk-chk-boom.mp3");
  sleepwalk = loadSound("audios/sleepwalk.mp3");

  dragonMusic = loadSound("audios/driftveil-city-music.mp3");
  hit = loadSound("audios/tambourine.mp3"); 

  skz = loadImage("images/skz.png");
  sleepwalkMVImage = loadImage("images/sleepwalk.png");
  back = loadImage("images/back.png");

  duck = loadImage("backgrounds/duck-dance.gif");
  dragon = loadImage("backgrounds/dragon-dance.gif");
  
  font = loadFont("morning.ttf")

  // Load level txt files
  level0 = loadStrings("txt-files/chk-chk-boom.txt");
  level1 = loadStrings("txt-files/sleepwalk.txt");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  numOfRows = height/TILE_WIDTH;
  
  textAlign(CENTER);
  textFont(font);

  if (getItem("highscore")) {
    highScore = getItem("highscore");
  }
  else {
    highScore = 0;
  }

  // Place levels into array
  levels.push(level0);
  levels.push(level1);

  // Change array to level tiles only

  // Set variable to avoid infinite loop
  let length = levels.length;

  for (let i = 0; i < length; i ++) {  
    let rows = levels[i].length;
    let cols = 4;
    
    let tiles = transferToTilesArray(rows, cols, levels[i]);

    levels.push(tiles);
  }

  // Remove original array of strings
  for (let i = 0; i < length; i ++) {
    levels.shift();
  }
}

function draw() {
  if (screenState === "start") {
    background(251);
    displayStartScreen();

    instructionsButton(0);
  }
  else if (screenState === "instructions") {
    if (frameCount % 120 === 0) {
      background(random(255), random(255), random(255));
    }
    fill(0, 0, 0, 100);

    displayInstructions();
  }
  else if (screenState === "selection") {
    background(100);
    displaySelectionScreen();

    instructionsButton(240);
  }
  else if (screenState === "play") {
    background(200);
    
    setTimeout(() => {
      playMusic(); 
    }, 2000);
    
    displayGrid();
    playLevel();

    instructionsButton(240);
    pauseButton();
  }
  else if (screenState === "pause") {
    displayGrid();

    displayPauseScreen();
  }
  else if (screenState === "score") {
    background(255);
    displayScore();
    updateScores();

    instructionsButton(0);
  }
}

function transferToTilesArray(rows, cols, array) {
  let someArray = [];

  for (let i = 0; i < rows; i ++) {
    for (let j = 0; j < cols; j ++) {
      let some = array[i][j];
      if (some === "t") {
        someArray.push(new TapTile(j, i));
      }
      else if (some === "h") {
        let length = 0;
        for (let n = i; n < rows; n++) {
          if (array[n][j] === "h") {
            length ++;
          }
          else {
            break;
          }
        }
        someArray.push(new HoldTile(j, i, length));
      }
    }
  }

  return someArray;
}

function displayStartScreen() {
  image(duck, width/2 - duck.width * (height/duck.height)/2, 0, duck.width * (height/duck.height), duck.height * (height/duck.height));
  
  fill(0);
  textSize(120);
  text("Random", width/2 - 30, height/3);
  text("Rhythm", width/2 + 60, height/2);
  
  textSize(30);
  text("A rhythm game of miscellaneous songs", width/2, height/5 * 3);
  
  textSize(60);
  text("Let's go!", width/2, height/14 * 11);

  if (mouseX > width/2 - 140 && mouseX < width/2 + 140 && mouseY > height/4 * 3 - 50 && mouseY < height/4 * 3 + 50) {
    stroke(0);
    fill(0, 0, 0, 0);
    rect(width/2 - 140, height/4 * 3 - 50, 280, 100, 10);
    
    if (mouseIsPressed) {
      screenState = "selection";
    }
  }
}

function instructionsButton(textColour) { 
  stroke(textColour);
  fill(0, 0, 0, 0);
  rect(width - width/12 - 100, height/10 - 40, 200, 80, 10);

  noStroke();
  fill(textColour);
  textSize(22);
  text("Instructions", width - width/12, height/9);
  
  if (mouseIsPressed) {
    instructionsButtonPressed();
  }
}

function instructionsButtonPressed() {
  if (mouseX > width - width/12 - 100 && mouseX < width - width/12 + 100 && mouseY > height/10 - 40 && mouseY < height/10 + 40 && mouseIsPressed) {
    if (music === chkChkBoom || music === sleepwalk) {
      music.stop();
    }

    previousScreen = screenState;
    screenState = "instructions";
    background(random(255), random(255), random(255));
  }
}

function displayInstructions() {
  noStroke();
  fill(255); 
  textSize(65);
  text("How To Play", width/2, height/5);

  textSize(35);
  text("Press the right key at the right time to increase your score!\nThe closer to the target line you are,\nthe more points you'll get!\n\nThere are tap tiles (press once) and hold tiles (hold down the key).\nMake sure you know which key to press!", width/2, height/10*3); //Edit later
  textSize(20);
  text("Keys - d (left column)\ng (middle-left column)\nh (right-middle column)\nk (right column)", width/2, height/14 * 9);

  backButton();
}

function backButton() {
  noStroke();
  fill(0);
  textSize(35);
  text("Ok!", width - width/2, height - height/8);

  if (mouseX > width/2 - 100 && mouseX < width/2 + 100 && mouseY > height - height/8 - 40 && mouseY < height - height/8 + 40) { 
    stroke(0);
    fill(0, 0, 0, 0);
    rect(width/2 - 100, height - height/8 - 50, 200, 80, 10);

    if (mouseIsPressed) {
      screenState = previousScreen;
    }
  }
}

function displaySelectionScreen() { 
  noStroke();

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
  textSize(40);
  fill(220);
  text("Chk Chk Boom", width/4, height/2); 
  text("Sleepwalk", width/4 * 3, height/2);

  textSize(20);
  text("Stray Kids", width/4, height/12 * 7);
  text("natori", width/4 * 3, height/12 * 7);

  // Selection
  setTimeout(() => {
    if (mouseIsPressed) {
      if (mouseX > 0 && mouseX < width/2 && mouseY > 0 && mouseY < height) {
        level = levels[0];
        bpm = 102;
        levelBackground = skz;
        music = chkChkBoom;
      }
      else if (mouseX > width - width/12 - 100 && mouseX < width - width/12 + 100 && mouseY > height/10 - 40 && mouseY < height/10 + 40) {
        instructionsButtonPressed();
        return;
      }
      else if (mouseX > width/2 && mouseX < width && mouseY > 0 && mouseY < height) {
        level = levels[1];
        bpm = 114;
        levelBackground = sleepwalkMVImage;
        music = sleepwalk;
      }
      screenState = "play";
    }
  }, 500);
}

function playMusic() {
  if (!music.isPlaying()) {
    music.play();
  }
  
  if (screenState === "play") {
    music.onended(screenState = "score");
  }
}

function displayGrid() {
  image(levelBackground, 0, 0, width, height, 0, 0, levelBackground.width, levelBackground.height, COVER);

  // Darken background
  noStroke();
  fill(0, 0, 0, 200);
  rect(0, 0, width, height);

  fill(255);
  rect(width/2 - TILE_WIDTH*2, 0, TILE_WIDTH * 4, height);
    
  for (let i = 0; i < 5; i++) {
    strokeWeight(1);
    stroke(200);
    line(i * TILE_WIDTH + (width/2 - TILE_WIDTH*2), 0, i * TILE_WIDTH + (width/2 - TILE_WIDTH*2), height);
  }

  // Draw target line
  stroke(200);
  let keys = ["d", "g", "h", "k"];

  for (let i = 0; i < 4; i++) {
    fill(colours[i]); 
    rect(i * TILE_WIDTH + (width/2 - TILE_WIDTH*2), height - height/8, TILE_WIDTH, TILE_HEIGHT);

    fill(0);
    text(keys[i], i * TILE_WIDTH + (width/2 - TILE_WIDTH*2) + TILE_WIDTH/2, height - height/8);
  }

  // Put score in corner
  noStroke();
  fill(255);
  textAlign(LEFT);
  textSize(35); 
  text(score, width/40, height/16);

  // Change alignment back --> Maybe move to next function that runs
  textAlign(CENTER);
}

function playLevel() {
  for (let i = 0; i < level.length; i ++) {
    level[i].move();
    level[i].display();

    if ((key === "d" && level[i].column === 0 || key === "g" && level[i].column === 1 || key === "h" && level[i].column === 2 || key === "k" && level[i].column === 3) && keyIsPressed) {
      let distFromLine = getDistance(abs(dist(level[i].x, level[i].y, width/2 - TILE_WIDTH*2 + TILE_WIDTH*level[i].column, height  - height/8))); 
      checkHit(distFromLine); 
    }
    
    if (level[i].y >= height + TILE_HEIGHT) {
      level.shift();
    } 
  }
}

function pauseButton() {
  stroke(255);
  fill(0, 0, 0, 20);

  circle(width - width/16, height/4, 80);
  image(back, width - width/16 - back.width/20, height/4 - back.height/20, back.width/10, back.height/10);

  if (dist(mouseX, mouseY, width - width/16, height/4) < 40 && mouseIsPressed) {
    music.stop();
    screenState = "pause";
  }
}

function displayPauseScreen() {
  noStroke();
  fill(0, 0, 0, 20);
  rect(0, 0, width, height);

  stroke(0);
  fill(0, 0, 0, 80);
  rect(width/12, height/10, width/12 * 10, height/10 * 8, 10);

  noStroke();
  fill(255);
  textSize(80);
  text("Level paused", width/2, height/3);

  // Button back to selection screen 
  stroke(255);
  fill(0, 0, 0, 0);
  rect(width/2 - 150, height/2 - 50, 300, 80);

  fill(255);
  textSize(30);
  text("Back to Selection Screen", width/2, height/2);


  // Button to continue 
  fill(0, 0, 0, 0);
  rect(width/2 - 100, height/10 * 7 - 50, 200, 80);

  fill(255);
  text("Continue", width/2, height/10 * 7);

  if (mouseIsPressed) {
    resumeButtonCheck();
  }
}

function resumeButtonCheck() {
  // Go back to selection screen
  if (mouseX > width/2 - 100 && mouseX < width/2 + 100 && mouseY > height/2 - 50 && mouseY < height/2 + 30) {
    screenState = "selection";
  }

  // Resume the level
  else if (mouseX > width/2 - 100 && mouseX < width/2 + 100 && mouseY > height/10 * 7 - 50 && mouseY < height/10 * 7 + 30) {
    screenState = "play";
  }
}


function getDistance(distance) {
  if (distance < 15) {
    hit.play();
    return "Amazing";
  }
  else if (distance < 20) {
    hit.play();
    return "Great";
  }
  else if (distance < 25) {
    hit.play();
    return "Nice";
  }
  else if (distance < 30) {
    hit.play();
    return "Good";
  }
  else {
    return "Miss";
  }
}

function checkHit(distance) {
  if (distance === "Amazing") {
    score += 100;
  }
  else if (distance === "Great") {
    score += 80;
  }
  else if (distance === "Nice") {
    score += 60;
  }
  else if (distance === "Good") {
    score += 40;
  }
}

function updateScores() {
  // Local storage method
  if (score > highScore) {
    highScore = score;
    storeItem("highscore", highScore);
  }
}

function displayScore() {
  if (!dragonMusic.isPlaying()) {
    dragonMusic.loop();
  }

  image(dragon, width/2 - [dragon.width * (height/dragon.height)]/2, 0, dragon.width * (height/dragon.height), dragon.height * (height/dragon.height));

  noStroke();
  textSize(100);
  text("Good Job!", width/2, height/4);

  textSize(80);
  text(score, width/2, height/8 * 3);

  textSize(60);
  text('High Score: ${highScore}', width/8, height/6); //Check placement later

  // Button to go back to selection  
  noStroke();
  textSize(50);
  fill(0);
  text("Confirm", width/2, height/7 * 5);
  
  if (mouseX > width/2 - 300 && mouseX < width/2 + 300 && mouseY > height/7 * 5 - 60 && height/7 * 5 + 40) {
    stroke(0);
    fill(0, 0, 0, 0);
    rect(width/2 - 300, height/7 * 5 - 50, 600, 100, 10);

    if (mouseIsPressed) {
      screenState = "selection";
      dragonMusic.stop();
    }
  }    

  // Stop music after clicking instructions button
  if (mouseX > width - width/12 - 100 && mouseX < width - width/12 + 100 && mouseY > height/10 - 40 && mouseY < height/10 + 40 && mouseIsPressed) {
    dragonMusic.stop();
  }
}

class Tile {
  constructor(column, row) {
    this.row = row; 
    this.column = column;
    this.x = this.column * TILE_WIDTH + (width/2 - TILE_WIDTH*2);
    this.colour = colours[this.column];
  }

  display() {
    noStroke();
    fill(this.colour);
    rect(this.x, this.y, TILE_WIDTH, this.tileHeight, 10);
  }

  move() { 
    if (this.y < height + TILE_HEIGHT) {
      let secPerBeat = 60/bpm;
      let pxPerSec = 60/(1/8 * secPerBeat);
      let pxPerFrame = pxPerSec/60;

      this.y += pxPerFrame; 
    }
  }
}

class TapTile extends Tile {
  constructor(column, row) {
    super(column, row);
    this.y = 0 - TILE_HEIGHT*(this.row + 1);
    this.tileHeight = TILE_HEIGHT;
  }

  display() {
    super.display();
    // rect(this.x, this.y, TILE_WIDTH, this.tileHeight, 10);
  }

  move() {
    super.move();
  }
}

class HoldTile extends Tile { 
  constructor(column, row, tileLength) {
    super(column, row);
    this.tileHeight = TILE_HEIGHT*tileLength;
    this.y = 0 - TILE_HEIGHT*(this.row + 1) - this.tileHeight; //Double check this logic cuz ur delirious 
  }

  display() {
    super.display();
    // rect(this.x, this.y, TILE_WIDTH, this.tileHeight, 10);
  }

  move() {
    super.move();
  }
}