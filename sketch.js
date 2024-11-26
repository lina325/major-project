// Project Title
// Angelina Zhu
// Jan 21, 2025
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

const NUM_OF_COLS = 4;
const NUM_OF_ROWS = 20;
let grid;

let screenState = "selection";

function setup() {
  createCanvas(windowWidth, windowHeight);

  grid = new Grid(NUM_OF_COLS, NUM_OF_ROWS);
  grid = grid.generate();
}

function draw() {
  if (screenState === "start") {

  }
  else if (screenState === "selection") {
    displaySelectionScreen();
  }
  else if (screenState === "play") {
    background(220);
    // grid.display(grid);
    display(grid);
  }
  else if (screenState === "score") {

  }
}

function displaySelectionScreen() {
  let songList = loadStrings("songs.txt");
  let selection;
  
  // Set images and text overtop
  text();

  if (mouseX > 0 && mouseX < width/2 && mouseY > 0 && mouseY < height && mouseIsPressed) {
    selection = 0;
  }
  else if (mouseX > width/2 && mouseX < width && mouseY > 0 && mouseY < height && mouseIsPressed) {
    selection = 1;
  }
  
  return songList[selection];
}

function display(array) { //Temporary until you figure out what's wrong (rip)
  for (let x = 0; x < 4; x++) {
    for (let y = 0; y < 20; y ++) {
      if (array[x][y] === 0) {
        rect(x * 127, y * 127, 127, 127);
      }
    }
  }
}

class Grid {
  constructor(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.cellSize = height/20; //Think about values
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
          rect(x * this.cellWidth, y * this.cellHeight, this.cellWidth, this.cellHeight);
        }
      }
    }
  }
}

