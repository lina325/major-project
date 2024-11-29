// Project Title
// Angelina Zhu
// Jan 21, 2025
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

const NUM_OF_COLS = 4;
// const NUM_OF_ROWS = 20;
let numOfRows;
let grid;
let cellSize = 127;

let screenState = "play";
let selection;
let songList; 
let level;

function setup() {
  createCanvas(windowWidth, windowHeight);
  numOfRows = height/cellSize;
  
  grid = new Grid(NUM_OF_COLS, numOfRows);
  gridArray = grid.generate();

  songList = loadStrings("songs.txt");
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
    grid.display(gridArray);

    // loadSong();
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

  if (mouseX > 0 && mouseX < width/2 && mouseY > 0 && mouseY < height && mouseIsPressed) {
    selection = 0;
    screenState = "play";
  }
  else if (mouseX > width/2 && mouseX < width && mouseY > 0 && mouseY < height && mouseIsPressed) {
    selection = 1;
    screenState = "play";
  }
}

function loadSong() {
  if (selection === 1) {
    // Load song and map
    level = loadStrings(`${songList[choice]}.txt`);
  }
  else if (selection === 2) { //And so on

  }
}

function displayScore() {

}

class Grid {
  constructor(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    // this.cellHeight = 40; 
  }

  generate() {
    let newGrid = [];

    for (let x = 0; x < this.cols; x++) {
      newGrid.push([]);
      for (let y = 0; y < this.rows; y++) {
        newGrid[x].push(0);
      }
    }
    return newGrid;
  }

  display(array) {
    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y ++) {
        if (array[x][y] === 0) {
          noStroke();
          square(x * cellSize + (width/2 - cellSize*2), y * cellSize, cellSize);
        }

        stroke(200);
        line(x * cellSize + (width/2 - cellSize*2), 0, x * cellSize + (width/2 - cellSize*2), height);
      }
    }
    // Make up for missing line on right side
    line(4 * cellSize + (width/2 - cellSize*2), 0, 4 * cellSize + (width/2 - cellSize*2), height);

    // Draw the target line
    stroke(0);
    rect(width/2 - cellSize*2, height - height/8, cellSize * 4, 60); //Try to remove the number
  }
}

class TapTile {
  constructor(x) {
    this.tileHeight = 42;
    this.x = x;
    this.y = 0 - this.tileHeight;
  }

  display() {
    rect(this.x, this.y, cellSize, this.tileHeight);
  }

  moveTile() {
    if (this.y < height + this.tileHeight) {
      this.y ++;
    }
  }

  keyPressed() {
    if (key === "f") {
      
    }
    if (key === "g") {
      
    }
    if (key === "h") {
      
    }
    if (key === "j") {
      
    }
  }

  checkHit() {
    // Use dist ?
  }
}

class HoldTile {
  constructor(tileLength) {
    this.tileHeight = tileLength;
    this.x = x;
    this.y = 0 - this.tileHeight;
  }


  // Can use keyIsPressed for this? 
}