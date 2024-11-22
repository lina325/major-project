// Project Title
// Angelina Zhu
// Jan 21, 2025
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

const NUM_OF_COLS = 4;
const NUM_OF_ROWS = 20;
let grid;

function setup() {
  createCanvas(windowWidth, windowHeight);

  grid = new Grid(NUM_OF_COLS, NUM_OF_ROWS);
  grid.generate();
}

function draw() {
  background(220);
  grid.display(grid);
}

class Grid {
  constructor(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.cellWidth = 127; //Think about values
    this.cellHeight = 40; 
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
