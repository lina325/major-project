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
let highScore;

let imageSize;
let skz;
let sleepwalkMVImage;
  
let chkChkBoom;
let sleepwalk;

let level0; 
let level1;
let tiles;

//temporary
let tile;

function preload() {
  chkChkBoom = loadSound("chk-chk-boom.mp3");
  sleepwalk = loadSound("sleepwalk.mp3");

  skz = loadImage("skz.png");
  sleepwalkMVImage = loadImage("sleepwalk.png");

  // Preload all levels
  level0 = loadStrings("chk-chk-boom.txt");
  level1 = loadStrings("sleepwalk.txt");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  numOfRows = height/CELL_SIZE;
  
  imageSize = width/2;

  songList = loadStrings("songs.txt");

  textAlign(CENTER);

  if (getItem("highscore")) {
    highScore = getItem("highscore");
  }

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
    // playLevel();

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
  let image1Size = width/2;
  let image2Size = width/2;

  // Expand images if mouse is on/near
  if (mouseX > 0 && mouseX < width/2) {
    if (image1Size <= width) {
      distance = dist(mouseX, mouseY, width/4, mouseY);
      if (distance < width/4) {
        image1Size = map(image1Size, 0, width/2, 0, width); //Need to make it gradual 
        image2Size -= 8;
      }
      else {
        image1Size = width/2;
        image2Size = width/2;
      }
    }
    // distance = dist(mouseX, mouseY, width/4, height/2);
  }
  else if (mouseX > width/2 && mouseX < width && mouseY > 0 && mouseY < height) {
    if (image2Size <= width) {
      image2Size += map(image2Size, 0, width/2, 0, width);
      image1Size -= 0;
    }
    // distance = dist(mouseX, mouseY, width/4 * 3, height/2);
  }

  // if (distance < width/4) {
  //   // imageSize = map(imageSize, 0, width/2, 0, width);
  // }
  // else {
  //   imageSize = width/2;
  // }

  // Display images
  image(skz, 0, 0, image1Size, height, 0, 0, image1Size, skz.height, COVER);
  image(sleepwalkMVImage, width/2, 0, image2Size, height, sleepwalkMVImage.width/2, 0, sleepwalkMVImage.width/2, sleepwalkMVImage.height, COVER);

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

function loadLevel() {
  let rows;
  let cols = 4;

  if (selection === 0) {
    array = level0;
    rows = level0.length; //running into issues with length 
  }
  else if (selection === 1) {
    array = level1;
    rows = level1.length;
  }
  
  tiles = createEmpty2DArray(rows, cols);
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let value = array[i][j];
      tiles[i][j] = value;
    }
  }

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

// function tranferTo2DArray(rows, cols, someArray) {
//   for (let i = 0; i < rows; i++) {
//     for (let j = 0; j < cols; j++) {
//       tiles[i][j] = someArray[i][j];
//     }
//   }
// }

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
  // Wait a few seconds before playing music --> Test
  setTimeout(() => {
    if (selection === 0) {
      chkChkBoom.play();
    }
    else if (selection === 1) {
      sleepwalk.play();
    }
  }, 3000);
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

function playLevel() {
  for (let i = 0; i < level.length; i++) {
    for (let j = 0; j < level[i].length; j++) {
      if (level[i][j] !== 0) {
        level[i][j].move();
        level[i][j].display();

        // Check each tile 
        let distFromLine = checkHit(dist(level[i][j].x, level[i][j].y, width/2 - CELL_SIZE*2 + CELL_SIZE*level[i][j].column, height - height/8)); 

        // if (key === "f" || key === "g" || key === "h" || key === "j") {
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
        // }
      }
    }
  }
}

function checkHit(distance) {
  if (keyIsPressed && (key === "f" || key === "g" || key === "h" || key === "j")) {
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
  else {
    text("Miss", width/2, height/3);
    return "miss";
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
  textSize(100);
  text("Good Job!", width/2, height/4);

  textSize(80);
  text(score, width/2, height/8 * 3);

  // Button to go back to selection?
  rect(width/2 - 300, height/7 * 5 - 50, 600, 100);
  textSize(30);
  text("Confirm", width/2, height/7 * 5);
  if (mouseX > width/2 - 300 && mouseX < width/2 + 300 && mouseY > height/7 * 5 - 50 && mouseY < height/7 * 5 + 50 && mouseIsPressed) {
    screenState = "selection";
    selection = "none";
  }
}

class Tile {
  constructor(column) {
    // this.tileSize = CELL_SIZE - 5; Maybe make tiles a bit thinner?
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
  constructor(column) {
    super(column);
    this.y = 0 - TILE_HEIGHT;
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