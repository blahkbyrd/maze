// canvas setup

let maze = document.querySelector(".maze");
let ctx = maze.getContext("2d");

let current;

class Maze {
    constructor(size, rows, cols, widhtLine) {
        this.size = size;
        this.rows = rows;
        this.cols = cols;
        this.widthLine = widhtLine;
        this.grid = [];
        this.stack = [];
    }

    // create the grid by pushing up the rows and cols numbers
    setUp() {
        for (let i = 0; i < this.rows; i++) {
            let row = [];
            for (let j = 0; j < this.cols; j++) {
                //  create a new cell for each element in the array
                let cell = new Cell(i, j, this.grid, this.size, this.widthLine)
                row.push(cell);
            }
            this.grid.push(row);
        }
        console.log(this.grid);
        current = this.grid[0][0];
    }


    draw() {
        // draw the canvas & place the cells on it
        maze.width = this.size;
        maze.height = this.size;
        maze.style.background = "lightgreen";


        current.visited = true; // first cell

        
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let grid = this.grid;
                grid[i][j].show(this.size, this.rows, this.cols);
            }
        }

        
        let next = current.checkNeighbours();
        if (next) {
            next.visited = true;
            this.stack.push(current);
            current.hightlight(this.rows, this.cols);
            current.removeWall(current, next);
            current = next;
        }
        else if(this.stack.length>0){
            let cell = this.stack.pop();
            current = cell;
            current.hightlight(this.rows, this.cols);
        }

        if(this.stack.length===0){
            return;
        }

        window.requestAnimationFrame(()=>{
            this.draw();
        });
    }

}

class Cell {
    constructor(rowNumber, colNumber, parentGrid, parentSize, widhtLine) {
        this.rowNumber = rowNumber;
        this.colNumber = colNumber;
        this.parentGrid = parentGrid;
        this.parentSize = parentSize;
        this.widht = widhtLine;
        this.visited = false;
        this.walls = {
            topWall: true,
            rightWall: true,
            bottomWall: true,
            leftWall: true,
        };
    }

    checkNeighbours() {
        let grid = this.parentGrid;
        let row = this.rowNumber;
        let col = this.colNumber;
        let neighbours = [];


        // add  neightbours cells in the neighbours array
        let top = row !== 0 ? grid[row - 1][col] : undefined;
        let left = col !== 0 ? grid[row][col - 1] : undefined;
        let bottom = row !== grid.length - 1 ? grid[row + 1][col] : undefined;
        let right = col !== grid.length - 1 ? grid[row][col + 1] : undefined;

        if (top && !top.visited) {
            neighbours.push(top)
        }
        if (left && !left.visited) {
            neighbours.push(left)
        }
        if (bottom && !bottom.visited) {
            neighbours.push(bottom)
        }
        if (right && !right.visited) {
            neighbours.push(right)
        }

        // choose a neighbours randomly
        if (neighbours.length !== 0) {
            let random = Math.floor(Math.random() * neighbours.length);
            return neighbours[random];
        }
        else {
            return undefined;
        }
    }

    drawTopWall(x, y, size, cols, rows) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + size / cols, y)
        ctx.stroke();
    }

    drawRightWall(x, y, size, cols, rows) {
        ctx.beginPath();
        ctx.moveTo(x + size / cols, y);
        ctx.lineTo(x + size / cols, y + size / rows)
        ctx.stroke();
    }
    drawBottomWall(x, y, size, cols, rows) {
        ctx.beginPath();
        ctx.moveTo(x, y + size / rows);
        ctx.lineTo(x + size / cols, y + size / rows)
        ctx.stroke();
    }

    drawLeftWall(x, y, size, cols, rows) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + size / rows)
        ctx.stroke();

    }

    hightlight(rows, cols){
        // hightlight the current cell
        let x = this.colNumber * this.parentSize / cols + 1;
        let y = this.rowNumber * this.parentSize /rows +1

        ctx.fillStyle = 'red';
        ctx.fillRect(x,y, this.parentSize/cols - this.widht, this.parentSize/cols - this.widht);
    }
    removeWall(cell1, cell2) {
        // construct the maze by removing walls in the grid
        let x = (cell1.colNumber - cell2.colNumber);
        let y = (cell1.rowNumber - cell2.rowNumber);

        if (x === 1) {
            cell1.walls.leftWall = false;
            cell2.walls.rightWall = false;
        }
        else if (x === -1) {
            cell1.walls.rightWall = false;
            cell2.walls.leftWall = false;
        }

        if (y === -1) {
            cell1.walls.bottomWall = false;
            cell2.walls.topWall = false;
        }
        else if (y === 1) {
            cell1.walls.topWall = false;
            cell2.walls.bottomWall = false;
        }
    }

    show(size, rows, cols) {

        // draw the cells

        let x = (this.colNumber * size) / cols;
        let y = (this.rowNumber * size) / rows;

        ctx.strokeStyle = "black";
        //ctx.fillStyle = "green";
        ctx.lineWidth = this.widht;

        if (this.walls.topWall) {
            this.drawTopWall(x, y, size, cols, rows)
        }

        if (this.walls.rightWall) {
            this.drawRightWall(x, y, size, cols, rows)
        }

        if (this.walls.bottomWall) {
            this.drawBottomWall(x, y, size, cols, rows)
        }
        if (this.walls.leftWall) {
            this.drawLeftWall(x, y, size, cols, rows)
        }
        if (this.visited) {
            ctx.fillRect(x + 1, y + 1, size / cols - this.widht, size / rows - this.widht);
        }



    }
}


let myMaze = new Maze(600, 20, 20, 2.5);
myMaze.setUp();
myMaze.draw();