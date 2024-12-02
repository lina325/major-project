// Project Title
// Angelina Zhu
// Jan 21, 2025
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// const NUM_OF_COLS = 4;
// const NUM_OF_ROWS = 20;
// let numOfRows;
// let grid;
const CELL_SIZE = 127;
const TILE_HEIGHT = 60;

let screenState = "play";
let selection;
let songList; 
let level;

function setup() {
  createCanvas(windowWidth, windowHeight);
  numOfRows = height/CELL_SIZE;
  
  // grid = new Grid(NUM_OF_COLS, numOfRows);
  // gridArray = grid.generate();

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
    displayGrid();

    tile.move();
    tile.display();

    // grid.display(gridArray);
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

function loadSong() {
  if (selection === 0) {
    // Load song and map
    level = loadStrings(`${songList[choice]}.txt`);
  }
  else if (selection === 1) { //And so on

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

function keyPressed() {
  if (key === "f") {
    tile.checkHit(dist(tile.x, tile.y, width/2 - CELL_SIZE*2, height - height/8)); //If it'll be in array, this will be easier --> Store values
  }
  if (key === "g") {
    
  }
  if (key === "h") {
    
  }
  if (key === "j") {
    
  }
}

function displayScore() {
  // Could use local stoarge 
  // But what if you just update a file to keep top 10?
}

// class Grid {
//   constructor(cols, rows) {
//     this.cols = cols;
//     this.rows = rows;
//     // this.cellHeight = 40; 
//   }

//   generate() {
//     let newGrid = [];

//     for (let x = 0; x < this.cols; x++) {
//       newGrid.push([]);
//       for (let y = 0; y < this.rows; y++) {
//         newGrid[x].push(0);
//       }
//     }
//     return newGrid;
//   }

//   display() {
//     noStroke();
//     rect(width/2 - CELL_SIZE*2, 0, CELL_SIZE * 4, height);

//     for (let i = 0; i < 5; i++) {
//       strokeWeight(1);
//       stroke(200);
//       line(i * CELL_SIZE + (width/2 - CELL_SIZE*2), 0, i * CELL_SIZE + (width/2 - CELL_SIZE*2), height);
//     }

//     // Draw the target line --> Maybe change to something that looks nicer
//     strokeWeight(3);
//     stroke(0);
//     rect(width/2 - CELL_SIZE*2, height - height/8, CELL_SIZE * 4, 60); //Try to remove the number
//   }
// }

class TapTile {
  constructor(column) {
    this.x = column * CELL_SIZE + (width/2 - CELL_SIZE*2);
    this.y = 0 - TILE_HEIGHT;
  }

  display() {
    strokeWeight(1);
    fill(210);
    rect(this.x, this.y, CELL_SIZE, TILE_HEIGHT);
  }

  move() {
    if (this.y < height + TILE_HEIGHT) {
      this.y += 6;
    }
  }

  checkHit(distance) {
    if (distance < 10) {
      text("Amazing!", width/2, height/3);
    }
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