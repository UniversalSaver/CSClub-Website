class Direction {
    static Up = new Direction('Up');
    static Down = new Direction('Down');
    static Left = new Direction('Left');
    static Right = new Direction('Right');

    constructor(name) {
        this.name = name;
    }
    toString() {
        return `Direction.${this.name}`;
    }
}

function snakeGame(table) {
    let snakeLength = 1;
    let playing = true;

    let currentPos = [0, 0];

    let currentDirection = Direction.Right;

    let snakeCells = [[0, 0]];

    let currentFoodPos;

    let gameLoopInterval;
    let inputHandlingInterval;

    let highScore = localStorage.getItem("HighScore") ?? 0;

    const scoreText = document.querySelector(".score-text");
    const highestScoreText = document.querySelector(".high-score-text");
    highestScoreText.innerText = "High Score: " + highScore;

    function gameLoop() {
        currentPos = moveInDirection(currentDirection, currentPos);

        if (terminate(currentPos, snakeCells)) {
            playing = false;
            document.getElementById("grid").remove();
            clearIntervalAll();


            const container  = document.querySelector(".game-container");
            const start = document.createElement("div");
            start.setAttribute("class", "start-game");
            start.innerText = "Start Game";
            start.setAttribute("onclick", "generateMatrix()");
            container.appendChild(start);

            updateScore(scoreText, 0);
            updateHighestScore(highestScoreText)
            return highScore;
        }

        updateCells(snakeCells, "black");

        if (playing) {
            snakeCells = moveTail(currentPos, snakeCells);

            // Eating food
            if (currentFoodPos != null) {
                currentFoodPos = eatFood(currentFoodPos, currentPos);
            }

            // Moving picture
            updateCells(snakeCells, "green");
        }
    }

    function handleInputs() {
        document.onkeydown = (e) => {
            e = e || window.event;
            if (e.keyCode === 38) {
                currentDirection = Direction.Up;
            } else if (e.keyCode === 40) {
                currentDirection = Direction.Down;
            } else if (e.keyCode === 37) {
                currentDirection = Direction.Left;
            } else if (e.keyCode === 39) {
                currentDirection = Direction.Right;
            }
        };
    }

    function clearIntervalAll() {
        clearInterval(gameLoopInterval);
        clearInterval(inputHandlingInterval);
    }

    // Initialize the game loop
    gameLoopInterval = setInterval(gameLoop, 130);

    // Initialize the input handling
    inputHandlingInterval = setInterval(() => {
        if (currentFoodPos == null) {
            currentFoodPos = addFood(snakeCells);
        }
    }, 3500);

    // Start listening for inputs
    handleInputs();



    //Helper functions

    function moveInDirection(direction, currentPos){
        switch(direction){
            case Direction.Right:
                return [currentPos[0], currentPos[1]+1];
            case Direction.Left:
                return [currentPos[0], currentPos[1]-1];
            case Direction.Down:
                return [currentPos[0]+1, currentPos[1]];
            case Direction.Up:
                return [currentPos[0]-1, currentPos[1]];
        }
    }

    function eatFood(currentFoodPos, currentPos){
        if(currentPos[0]==currentFoodPos[1] && currentPos[1]==currentFoodPos[0]){
            addLength(currentPos)
            return null
        }
        return currentFoodPos;
    }

    function addFood(snakeCells){
        let rand = generateRand();
        while(snakeCells.some(e=> e[0]==rand[0] && e[1]==rand[1])){
            rand = generateRand();
        }

        let cell = document.getElementById("grid").rows[rand[1]].cells[rand[0]];
        cell.style.background = "yellow";
        return rand
    }

    function generateRand(){
        const x = Math.floor(Math.random() * 16) + 1;
        const y = Math.floor(Math.random() * 16) + 1;
        return [x, y];
    }

    function updateCells(snakeCells, colour){
        if(colour == "green"){
            for(let i=0; i<snakeCells.length; i++){
                let pos = snakeCells[i];
                let cell = document.getElementById("grid").rows[pos[0]].cells[pos[1]];
                cell.style.background = colour;
            }
        }else{
            let pos = snakeCells[snakeCells.length-1];
            let cell = document.getElementById("grid").rows[pos[0]].cells[pos[1]];
            cell.style.background = colour;
        }
    }

    function addLength(lastPos){
        snakeLength++;
        updateScore(scoreText, snakeLength);
        snakeCells.push(lastPos);
    }

    function moveTail(currentPos, snakeCells){
        let nextSnake = [];
        nextSnake.push(currentPos);
        for(let i=0; i<snakeCells.length-1; i++){
            nextSnake.push(snakeCells[i]);
        }
        return nextSnake;
    }

    function updateScore(scoreCont, newScore){
        scoreCont.innerText = "Score: " + newScore;
    }

    function updateHighestScore(scoreCont){
        if(snakeLength>highScore){
            highScore = snakeLength;
            scoreCont.innerText = "High Score: " + snakeLength;
            localStorage.setItem('HighScore', snakeLength.toString());
        }
    }

    function terminate(currentPos, snakeCells){
        if(snakeCells.some(e => e[0] == currentPos[0] && e[1] == currentPos[1])){
            return true;
        }
        if(currentPos[0]>16 || currentPos[0]<0 || currentPos[1]>16 || currentPos[1]<0){
            return true;
        }
        return false;
    }
}

function generateMatrix() {

  const tbl = document.createElement("table");
  tbl.setAttribute("id", "grid");

  // creating cells
  for (let i = 0; i < 16; i++) {
    // creates a table row
    const row = document.createElement("tr");
    row.setAttribute("id", `coll-${i}`);

    for (let j = 0; j < 16; j++) {
      // Create a <td> element and a text node, make the text
      // node the contents of the <td>, and put the <td> at
      // the end of the table row
      const cell = document.createElement("td");
      cell.setAttribute("id", `row-${i}`);
      row.appendChild(cell);
    }

    // add the row to the end of the table body
    tbl.appendChild(row);
  }
  // appends <table> into container
  const container  = document.querySelector(".game-container");
  container.appendChild(tbl);

  // delete button
    const button = document.querySelector(".start-game");
    button.remove();
  // sets the border attribute of tbl to '2'
  tbl.setAttribute("border", "2");

  snakeGame(tbl);
}