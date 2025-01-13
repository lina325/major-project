// Random Rhythm
// Angelina Zhu
// Jan 21, 2025
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

const CELL_SIZE = 127;
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

let duck;
let dragon;
let dragonMusic;

let chkChkBoom;
let sleepwalk;
let hit;

let levels = [];
let level0; 
let level1;


function preload() {
  chkChkBoom = loadSound("audios/chk-chk-boom.mp3");
  sleepwalk = loadSound("audios/sleepwalk.mp3");
  dragonMusic = loadSound("audios/driftveil-city-music.mp3");
  hit = loadSound("audios/tambourine.mp3"); //Not working for some reason... check if loading

  skz = loadImage("images/skz.png");
  sleepwalkMVImage = loadImage("images/sleepwalk.png");

  songList = loadStrings("txt-files/songs.txt"); //this might be useless now lol

  duck = loadImage("backgrounds/duck-dance.gif");

  dragon = loadImage("backgrounds/dragon-dance.gif");

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

  // Change array to level tiles only
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

    instructionsButton(0);
  }
  else if (screenState === "instructions") {
    // background(random(255), random(255), random(255)); //Make it not a strobe light LOL
    background(240);
    displayInstructions();
    backButton();
  }
  else if (screenState === "selection") {
    background(100);
    displaySelectionScreen();

    instructionsButton(240);
  }
  else if (screenState === "play") {
    background(200);
    setTimeout(() => {
      playMusic(); //Change screenstate at end of music
    }, 2000);
    
    displayGrid();
    playLevel();

    instructionsButton(240);
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
        // some = new TapTile(j, i);
        someArray.push(new TapTile(j, i));
      }
      else if (some === "h") {
        let length = 0;
        for (let n = i; n < rows; n++) {
          if(array[n][j] === "h") {
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

function instructionsButton(textColour) { //Looks a little funky
  stroke(textColour);
  fill(0, 0, 0, 0);
  rect(width - width/12 - 100, height/10 - 40, 200, 80, 10);

  noStroke();
  fill(textColour);
  textSize(20);
  text("Instructions", width - width/12, height/10);

  if (mouseX > width - width/12 - 100 && mouseX < width - width/12 + 100 && mouseY > height/10 - 40 && mouseY < height/10 + 40 && mouseIsPressed) {
    previousScreen = screenState;
    screenState = "instructions";
  }
}

function displayInstructions() {
  fill(0); 
  textSize(60);
  text("How To Play", width/2, height/10);

  textSize(40);
  text("Keys - f, g, h, j\nEach key corresponds to a column - press the\nright key at the right time to increase your score!\nThe closer to the target line you are,\nthe more points you'll get!", width/2, height/4); //Edit later
}

function backButton() {
  noStroke();
  fill(0);
  textSize(20);
  text("Ok!", width - width/2, height - height/8);

  if (mouseX > width - width/2 - 100 && mouseX < width - width/2 + 100 && mouseY > height/8 - 40 && mouseY < height/8 + 40) { 
    stroke(0);
    fill(0, 0, 0, 0);
    rect(width - width/2 - 100, height - height/8 - 40, 200, 80, 10);

    if (mouseIsPressed) {
      screenState = previousScreen; //Fix this
    }
  }
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
    rect(width/2 - 140, height/9 * 6, 280, 80, 10);
    if (mouseIsPressed) {
      screenState = "selection";
    }
  }
}

function displaySelectionScreen() { //Add artists
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
    chkChkBoom.onended(endLevel()); //Test it

    if (!chkChkBoom.isPlaying()) {
      chkChkBoom.play();
    }
  }
  else if (level === levels[1]) {
    sleepwalk.onended(endLevel());

    if (!sleepwalk.isPlaying()) {
      sleepwalk.play();
    }
  }
}

function endLevel() {
  textSize(80);
  text("Cleared!", width/2, height/2);

  setTimeout(() => {
    screenState = "score";
  }, 1000);
}

function displayGrid() {
  image(levelBackground, 0, 0, width, height, 0, 0, levelBackground.width, levelBackground.height, COVER);

  // Darken background
  noStroke();
  fill(0, 0, 0, 200);
  rect(0, 0, width, height);

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

  // Put score in corner
  textAlign(LEFT);
  textSize(40); //Check
  text(score, width/40, height/16);

  // Change alignment back
  textAlign(CENTER);
}

function playLevel() {
  for (let i = 0; i < level.length; i ++) {
    level[i].move();
    level[i].display();

    if ((key === "f" && level[i].column === 0 || key === "g" && level[i].column === 1 || key === "h" && level[i].column === 2 || key === "j" && level[i].column === 3) && keyIsPressed) { //Possible to just use y value
      let distFromLine = getDistance(dist(level[i].x, level[i].y, width/2 - CELL_SIZE*2 + CELL_SIZE*level[i].column, height  - height/8)); 
      text(distFromLine, width/2, height/3);
      checkHit(distFromLine); 
    }
    // else {
    // text("Miss", width/2, height/3); //Pause at start before text starts showing up //Change to sound effects
    // } 
    
    if (level[i].y >= height - height/8 + TILE_HEIGHT) {
      level.splice(i, 1);
    } 
  }
}

function getDistance(distance) {
  if (distance < 15) {
    return "Amazing";
  }
  else if (distance < 20 && mouseIsPressed) {
    return "Great";
  }
  else if (distance < 25 && mouseIsPressed) {
    return "Nice";
  }
  else if (distance < 30 && mouseIsPressed) {
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
  if (!dragonMusic.isPlaying()) { //Make it stop playing after leaving score page
    dragonMusic.loop();
  }

  image(dragon, width/2 - [dragon.width * (height/dragon.height)]/2, 0, dragon.width * (height/dragon.height), dragon.height * (height/dragon.height));

  textSize(100);
  text("Good Job!", width/2, height/4);

  textSize(80);
  text(score, width/2, height/8 * 3);

  // Button to go back to selection
  stroke(0);
  fill(0, 0, 0, 0);
  rect(width/2 - 300, height/7 * 5 - 50, 600, 100);

  textSize(30);
  fill(0);
  text("Confirm", width/2, height/7 * 5);
  if (mouseX > width/2 - 300 && mouseX < width/2 + 300 && mouseY > height/7 * 5 - 50 && mouseY < height/7 * 5 + 50 && mouseIsPressed) {
    screenState = "selection";
    dragonMusic.stop();
  }

  // Stop music after clicking instructions button
  if (mouseX > width - width/12 - 100 && mouseX < width - width/12 + 100 && mouseY > height/10 - 40 && mouseY < height/10 + 40 && mouseIsPressed) {
    dragonMusic.stop();
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
      this.y += 14; //Figure out slow or fast --> Change to do math for speed of each song instead
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

class HoldTile extends Tile { 
  constructor(column, row, tileLength) {
    super(column, row);
    this.tileHeight = TILE_HEIGHT*tileLength;
    this.y = 0 - this.tileHeight*(this.row + 1); //Double check this logic cuz ur delirious 
  }

  display() {
    super.display();
    rect(this.x, this.y, CELL_SIZE, this.tileHeight);
  }

  move() {
    super.move();
  }
}