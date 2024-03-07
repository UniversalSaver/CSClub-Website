// WHITE is white space, 'red' is red space, 'yellow' is yellow space
const YELLOW = 'yellow'
const RED = 'red'
const WHITE = 'white'

const boardMatrix = [];
let turn = 1;
let finish = false;

function createBoard() {
    for (let i = 0; i < 6; i++) {
        const row = [];
        for (let j = 0; j < 7; j++) {
            row.push(WHITE);
        }
        boardMatrix.push(row);
    }
}
createBoard();

function updateBoard(x, y, colour){
    const table = document.querySelector('.board table');
    const cell = table.rows[y].cells[x];
    cell.firstElementChild.style.backgroundColor = colour;
}

function findAvailableCells(matrix){
    let availableCells = [];
    for(let j = 0 ; j < matrix[0].length; j++) {
        for (let i = matrix.length-1; i >=0 ; i--) {
                if (matrix[i][j] == WHITE) {
                    availableCells.push([i, j]);
                    break;
                }
            }
    }
    return availableCells;
}

function addPoint(coll_num){
    if(!finish){
        let colour;
        let messageDiv = document.querySelector('.message')
        if(turn % 2 == 0){
            colour = RED;
        }
        else{
            colour = YELLOW;
        }

        const avCells = findAvailableCells(boardMatrix);
        const coords = avCells.find(e => e[1] == coll_num)

        // ! Cell filling logic
        if(coords){
            boardMatrix[coords[0]][coords[1]] = colour;
            updateBoard(coords[1], coords[0], colour);
            if(checkWin(boardMatrix, colour, coords)){
                messageDiv.innerHTML = `${(turn % 2 == 0 ? 'Red' : 'Yellow')} Player Wins!`;
                finish = true;
                setTimeout(() => {
                    location.reload();
                }, 5000);
            }else{
                // ! Change the turn
                turn++;
                messageDiv.innerHTML = `${(turn % 2 == 0 ? 'Red' : 'Yellow')} Player's turn!`;
                messageDiv.style.textDecoration = `underline ${turn % 2 == 0 ? 'red' : 'yellow'}`;
            }
        }else{
            // Error answer
            if(turn > 42){
                messageDiv.innerHTML = "Draw";
                document.addEventListener("dblclick", function() {
                    location.reload();
                });
            }else{
                messageDiv.innerHTML = "Move is not possible (Make other move)";
                const timeout = setTimeout(() => {
                    document.addEventListener("click", function() {
                        // Remove the message div when clicked anywhere on the document
                        messageDiv.innerHTML = `${(turn % 2 == 0 ? 'Red' : 'Yellow')} Player's turn!`;
                        messageDiv.style.textDecoration = `underline ${turn % 2 == 0 ? 'red' : 'yellow'}`;
                        
                    })}, 100);
                clearTimeout(timeout);
            }
        }
    }
}

function checkWin(matrix, colour, point){
    const directions = [[0,1], [1,0], [1,1], [1,-1]];
    for (let i = 0; i < directions.length; i++) {
        const direction = directions[i];
        let count = 0;
        // check for one side of the direction (ex. right of the current ponit)
        for (let j = 0; j < 4; j++) {
            const x = point[0] + j * direction[0];
            const y = point[1] + j * direction[1];
            if (x >= 0 && x < matrix.length && y >= 0 && y < matrix[0].length && matrix[x][y] == colour) {
                count++;
            }else{
                break;
            }
        }
        // check for other side of the direction (ex. left of the current ponit)
        for (let j = 1; j < 4; j++) {
            const x = point[0] - j * direction[0];
            const y = point[1] - j * direction[1];
            if (x >= 0 && x < matrix.length && y >= 0 && y < matrix[0].length && matrix[x][y] == colour) {
                count++;
            }else{
                break;
            }
        }
        if(count >= 4){
            return true;
        }
    }
    return false;
}


