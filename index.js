const GAME_BOX = document.getElementById("game-area");
const CONTEXT = GAME_BOX.getContext("2d");
const WIDTH = GAME_BOX.width;
const HEIGHT = GAME_BOX.height;
let currentScoreArea = document.getElementById("current-score");
let currentScore = 0;
const BUTTON = document.getElementById("start-game");
BUTTON.addEventListener("click", start);
//This creates the background of the board
CONTEXT.fillStyle = "#2d0354";
CONTEXT.fillRect(0,0, WIDTH, HEIGHT);
let time = 0;
let bullets = [];

class InputHandler {
    constructor() {
        document.addEventListener("keydown", (event) => {
            this.direction = event.code;
          });
        document.addEventListener("keyup", event => {
            this.direction = "ArrowUp";
        });
    }
}
class Player {
    constructor() {
        this.x = WIDTH/2;
        this.y = HEIGHT/2 + 150;
        this.damage = 1;
        this.fireRate = 50;
    }
    draw() {
        CONTEXT.fillStyle = "orange";
        CONTEXT.fillRect(this.x, this.y, 10, 10);
    }
    update(input) {
        switch(input) {
            case "ArrowRight":
                this.x += 5;
                break;
            case "ArrowLeft":
                this.x -= 5;
                break;
            default:
                if(time >= this.fireRate) {
                    bullets.splice(0, 1, new Bullet(this.x, this.y));
                    time = 0;
                }
                break; 
        }
        if(this.x > WIDTH) {
            this.x = 10;
        } else if(this.x < 0) {
            this.x = WIDTH-10;
        }
    }
}
class Bullet {
    constructor(x, y) {
        this.shotSpeed = 10;
        this.x = x;
        this.y = y;
        this.fill = "Orange";
        this.exists = true;
        this.height = 10;
        this.width = 10;
    }
    update() {
        this.y -= 10;
        if(this.y < HEIGHT) {
            this.draw();
        }
    }
    draw() {
        if(this.exists) {
            CONTEXT.fillStyle = "yellow";
            CONTEXT.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}
class Enemy {
    constructor(posX, posY) {
        this.x = posX;
        this.y = posY;
        this.width = 10;
        this.height = 10;
        this.speed = 2;
        this.exists = true;
        this.swapDirection = () => this.speed *= -1; 
    }
    update() {
        this.x += this.speed;
        if(this.x < 0 || this.x > WIDTH) {
            this.y += 10;
            this.swapDirection();
        }
    }
    draw() {
        if(this.exists) {
            CONTEXT.fillStyle = "white";
            CONTEXT.beginPath();
            CONTEXT.arc(this.x, this.y, 5, 0, 2 * Math.PI);
            CONTEXT.fill();
        }
    }
}

let ship = new Player();
ship.draw();
let arrayOfEnemeies = [];
let input = new InputHandler();

let posX = 10;
let posY = 10;
for(let i = 0; i < 104; i++) {
    if(posX < WIDTH) {
        arrayOfEnemeies.push(new Enemy(posX, posY));
        posX += 20;   
    } else {
        posX = 10;
        posY += 20;
        arrayOfEnemeies.push(new Enemy(posX, posY));
    }
}
for(let i = 0; i < arrayOfEnemeies.length; i++) {
    arrayOfEnemeies[i].draw();
}

function start() {
    BUTTON.disabled = true;
    BUTTON.style.display = "none";
    gameLoop();
}
function gameLoop() {
    CONTEXT.clearRect(0,0, WIDTH, HEIGHT);
    CONTEXT.fillStyle = "#2d0354";
    CONTEXT.fillRect(0,0, WIDTH, HEIGHT);
    ship.update(input.direction);
    ship.draw();
    for(let i = 0; i < arrayOfEnemeies.length; i++) {
        arrayOfEnemeies[i].update();
        arrayOfEnemeies[i].draw();       
    }
    for(let bullet of bullets) {
        for(let enemies of arrayOfEnemeies) {
            if (bullet.exists && bullet.x < enemies.x + enemies.width &&
                bullet.x + bullet.width > enemies.x &&
                bullet.y < enemies.y + enemies.height &&
                bullet.y + bullet.height > enemies.y){
                    bullet.exists = false;
                    let indexOfEnemies = arrayOfEnemeies.indexOf(enemies);
                    enemies.exists = false;
                    arrayOfEnemeies.splice(indexOfEnemies, 1);
                    currentScore++;
                    currentScoreArea.innerHTML = "Score: " + currentScore;
             } else if(enemies.y >= ship.y) {
                alert("Game Over");
                window.location.reload();
             }
        }
        bullet.update();
    }
    time++;
    window.requestAnimationFrame(gameLoop);
}