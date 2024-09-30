let gameBoard = document.querySelector(".game");
let playBtn = document.querySelector(".play-game");
let againBtn = document.querySelector(".play-again")
let foodX, foodY, snakeX = 1, snakeY = 1;
let velocityX = 0, velocityY = 0;
let snakeBody = [{x: snakeX, y: snakeY}]; // Initialize snake body with the head
let myInterval;
let score = 0;
let foodCount = 0;
let key = document.querySelectorAll(".key")
let gameoverSound = new Audio("./Audio/gameover.mp3");
let eatSound = new Audio("./Audio/eat.mp3");
let turnSound = new Audio("./Audio/turn.mp3");



function playGame(){
    playBtn.addEventListener("click", function(){
        playBtn.classList.add("d-n");
        gameBoard.style.display = "grid";
        gameBoard.style.gridTemplate = "repeat(14,1fr)/repeat(14,1fr)";
        startGame();
    });
}
playGame();

function createFood(){
    foodX = Math.floor(Math.random() * 14) + 1;
    foodY = Math.floor(Math.random() * 14) + 1;
    let foodElement = document.createElement("div");
    foodElement.classList.add("food");
    foodElement.style.gridArea = `${foodY}/${foodX}`;
    foodElement.id = "food"; // Assign ID to reuse the element
    gameBoard.appendChild(foodElement);
}

function updateFoodPosition() {
    document.getElementById("food").style.gridArea = `${foodY}/${foodX}`;
}

function createSnake(){
    let snakeElement = document.createElement("div");
    snakeElement.classList.add("snakehead");
    snakeElement.style.gridArea = `${snakeY}/${snakeX}`;
    snakeElement.id = "snakeHead"; // Assign ID for snake head
    gameBoard.appendChild(snakeElement);
}

function move(e){
    switch(e.key){
        case "ArrowUp":
            if (velocityY !== 1) { 
                velocityX = 0; 
                velocityY = -1;
                turnSound.play(); 
            }
            break;
        case "ArrowDown":
            if (velocityY !== -1) { 
                velocityX = 0; 
                velocityY = 1;
                turnSound.play(); 
            }
            break;
        case "ArrowLeft":
            if (velocityX !== 1) { 
                velocityX = -1; 
                velocityY = 0;
                turnSound.play(); 
            }
            break;
        case "ArrowRight":
            if (velocityX !== -1) { 
                velocityX = 1; 
                velocityY = 0;
                turnSound.play(); 
            }
            break;
    }
}

key.forEach((key)=>{
    key.addEventListener("click",()=>move({key:key.dataset.key}))
})

function updateGame() {

    let nextX = snakeX + velocityX;
    let nextY = snakeY + velocityY;

    // Check for collision with the borders
    if (nextX < 1 || nextX > 14 || nextY < 1 || nextY > 14) {
        gameOver();
        return;
    }
    
    // Check for collision with the snake's own body
    for (let i = 1; i < snakeBody.length; i++) {
        if (snakeBody[i].x === nextX && snakeBody[i].y === nextY) {
            gameOver();
            return;
        }
    }

    // Move the snake head
    snakeX += velocityX;
    snakeY += velocityY;

    // Move the body segments
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = { ...snakeBody[i - 1] }; // Copy previous segment's position
    }
    snakeBody[0] = { x: snakeX, y: snakeY }; // Update the head position in the array

    // Check if the snake eats the food
    if (snakeX === foodX && snakeY === foodY) {
        eatSound.play()
        foodX = Math.floor(Math.random() * 14) + 1;
        foodY = Math.floor(Math.random() * 14) + 1;
        score += 10;
        foodCount ++;
        snakeBody.push({}); // Add new segment at the tail
        updateFoodPosition(); // Update the food position
    }

    // Update snake elements (head and body)
    document.getElementById("snakeHead").style.gridArea = `${snakeY}/${snakeX}`;
    for (let i = 1; i < snakeBody.length; i++) {
        let bodySegment = document.getElementById(`snakeBody${i}`);
        if (!bodySegment) {
            bodySegment = document.createElement("div");
            bodySegment.classList.add("snakebody");
            bodySegment.id = `snakeBody${i}`;
            gameBoard.appendChild(bodySegment);
        }
        bodySegment.style.gridArea = `${snakeBody[i].y}/${snakeBody[i].x}`;
    }
}

function startGame() {
    againBtn.classList.add("d-n");
    createSnake();
    createFood();
    document.addEventListener("keydown", move);
    myInterval = setInterval(updateGame, 200);
}

function gameOver() {
    gameoverSound.play()
    document.removeEventListener("keydown", move);
    clearInterval(myInterval);
    alert(`You ate ${foodCount} food and your score is: ${score}`)
    againBtn.classList.remove("d-n");
    againBtn.addEventListener("click", playAgain)
}

function playAgain(){
    gameBoard.innerHTML = "";
    snakeX = 1, snakeY = 1;
    velocityX = 0, velocityY = 0;
    score = 0, foodCount = 0;
    snakeBody = [{x: snakeX, y: snakeY}];
    startGame();
}