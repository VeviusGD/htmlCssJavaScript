const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 900;
canvas.height = 600;

const gameModeConfig = {
    'Normal': {
        bossName: 'Destroyer Mk I',
        enemyColors: {
            base: '#2E7D32',
            fast: '#66BB6A',
            tank: '#1B5E20',
            boss: '#388E3C'
        },
        enemyStats: {
            base: { health: 100, damage: 15, speed: { min: 0.4, max: 0.8 } },
            fast: { health: 60, damage: 10, speed: { min: 0.8, max: 1.5 } },
            tank: { health: 300, damage: 25, speed: { min: 0.3, max: 0.6 } },
            boss: { health: 10000, damage: 1000, speed: { min: 0.2, max: 0.4 } }
        },
        towerStats: {
            1: { cost: 100, health: 100, damage: 10, attackRate: 20 },
            2: { cost: 125, health: 200, damage: 100, attackRate: 250 },
            3: { cost: 250, health: 125, damage: 40, attackRate: 160 },
            4: { cost: 450, health: 175, damage: 50, attackRate: 160 },
        },
        initialResources: 400,
        initialEnemyInterval: 650,
        spawnTiers: [ 
            { scoreThreshold: 1500, minInterval: 24,  decreaseAmount: 3 },
            { scoreThreshold: 300,  minInterval: 150, decreaseAmount: 10 },
            { scoreThreshold: 0,    minInterval: 250, decreaseAmount: 20 } 
        ],
        bossSpawnScore: 5000,
        winningScore: 5500
    },
    'Hard': {
        bossName: 'Destroyer Mk II',
        enemyColors: {
            base: '#7B1FA2',
            fast: '#BA68C8',
            tank: '#4A148C',
            boss: '#6A1B9A'
        },
        enemyStats: {
            base: { health: 200, damage: 15, speed: { min: 0.5, max: 0.9 } },
            fast: { health: 120, damage: 15, speed: { min: 1.0, max: 1.8 } },
            tank: { health: 600, damage: 35, speed: { min: 0.4, max: 0.7 } },
            boss: { health: 25000, damage: 1500, speed: { min: 0.3, max: 0.5 } }
        },
        towerStats: {
            1: { cost: 100, health: 120, damage: 15, attackRate: 20 },
            2: { cost: 125, health: 250, damage: 150, attackRate: 250 },
            3: { cost: 250, health: 165, damage: 60, attackRate: 160 },
            4: { cost: 450, health: 215, damage: 75, attackRate: 160 },
        },
        initialResources: 450,
        initialEnemyInterval: 550,
        spawnTiers: [ 
            { scoreThreshold: 3000, minInterval: 22,  decreaseAmount: 3 },
            { scoreThreshold: 500,  minInterval: 135, decreaseAmount: 10 },
            { scoreThreshold: 0,    minInterval: 200, decreaseAmount: 20 }
        ],
        bossSpawnScore: 7500,
        winningScore: 8000
    },
    'Nightmare': {
        bossName: 'Destroyer Mk III',
        enemyColors: {
            base: 'red',
            fast: '#FF7043',
            tank: 'darkred',
            boss: 'maroon'
        },
        enemyStats: {
            base: { health: 400, damage: 15, speed: { min: 0.6, max: 1.0 } },
            fast: { health: 240, damage: 20, speed: { min: 1.2, max: 2.0 } },
            tank: { health: 1200, damage: 45, speed: { min: 0.5, max: 0.8 } },
            boss: { health: 75000, damage: 2000, speed: { min: 0.4, max: 0.6 } }
        },
        towerStats: {
            1: { cost: 125, health: 150, damage: 20, attackRate: 20 },
            2: { cost: 160, health: 300, damage: 200, attackRate: 250 },
            3: { cost: 375, health: 210, damage: 80, attackRate: 160 },
            4: { cost: 600, health: 250, damage: 100, attackRate: 160 },
        },
        initialResources: 500,
        initialEnemyInterval: 450,
        spawnTiers: [ 
            { scoreThreshold: 4500, minInterval: 20,  decreaseAmount: 3 },
            { scoreThreshold: 750,  minInterval: 120,  decreaseAmount: 10 },
            { scoreThreshold: 0,    minInterval: 150, decreaseAmount: 20 }
        ],
        bossSpawnScore: 10000,
        winningScore: 11000
    }
};

let gameMode = 'Normal';

const cellSize = 100;
const cellGap = 3;
let numberOfResources = 300;
let enemiesInterval = 650;
let frame = 0;
let gameOver = false;
let score = 0;
let chosenTower = 1;
let bossSpawned = false;
let bossBarOpacity = 0;
let winScreenOpacity = 0;
let gameOverOpacity = 0;
let sellMode = false;
let boss = null;
let enemiesSpawnedCount = 0;
let gameStarted = false;

let towerStats = {};

const startButton = {
    x: 350,
    y: 380,
    width: 200,
    height: 70
}

const sellButton = {
    x: canvas.width - 90,
    y: 10,
    width: 80,
    height: 80
}

const gameGrid = [];
const towers = [];
const enemies = [];
const projectiles = [];
const resources = [];
const winParticles = [];

// mouse
const mouse = {
    x: 10,
    y: 10,
    width: 0.1,
    height: 0.1,
    clicked: false,
}
canvas.addEventListener('mousedown', function(){
    mouse.clicked = true;
});
canvas.addEventListener('mouseup', function(){
    mouse.clicked = false;
});
let canvasPosition = canvas.getBoundingClientRect();
canvas.addEventListener('mousemove', function(e){
    mouse.x = e.x - canvasPosition.left;
    mouse.y = e.y - canvasPosition.top;
});
canvas.addEventListener('mouseleave', function(){
    mouse.x = undefined;
    mouse.y = undefined;
});

// game board
const controlsBar = {
    width: canvas.width,
    height: cellSize,
}
class Cell {
    constructor(x, y){
        this.x= x;
        this.y = y;
        this.width = cellSize;
        this.height = cellSize;
    }
    draw(){
        if (mouse.x && mouse.y && collision(this, mouse)){
            ctx.strokeStyle = 'black';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}
function createGrid(){
    for (let y = cellSize; y < canvas.height; y += cellSize){
        for (let x = 0; x < canvas.width; x += cellSize){
            gameGrid.push(new Cell(x, y));
        }
    }
}
createGrid();
function handleGameGrid(){
    for (let i = 0; i < gameGrid.length; i++){
        gameGrid[i].draw();
    }
}

// projectiles
class Projectile {
    constructor(x, y, power, isPiercing = false){
        this.x = x;
        this.y = y;
        this.width = 4;
        this.height = 4;
        this.power = power;
        this.speed = 25;
        this.isPiercing = isPiercing;
        this.hitEnemies = [];
    }
    update(){
        this.x += this.speed
    }
    draw(){
        if (this.isPiercing) {
            ctx.fillStyle = 'cyan';
        } else {
            ctx.fillStyle = 'gold';
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
        ctx.fill();
    }
}
function handleProjectiles(){
    for (let i = 0; i < projectiles.length; i++){
        projectiles[i].update();
        projectiles[i].draw();

        if (projectiles[i] && projectiles[i].x > canvas.width + 101 - cellSize){
            projectiles.splice(i, 1);
            i--;
        }

        for (let j = 0; j < enemies.length; j++){
            if(enemies[j] && projectiles[i] && collision(projectiles[i], enemies[j]))
            {
                if (projectiles[i].isPiercing) {
                    if (!projectiles[i].hitEnemies.includes(enemies[j])) {
                        enemies[j].health -= projectiles[i].power;
                        projectiles[i].hitEnemies.push(enemies[j]);
                    }
                } 
                else {
                    enemies[j].health -= projectiles[i].power;
                    projectiles.splice(i, 1);
                    i--;
                    break;
                }
            }
        }
    }
}

class Tower {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.width = cellSize - cellGap * 2;
        this.height = cellSize - cellGap * 2;
        this.shooting = true;
        this.projectiles = [];
        this.timer = 0;
        this.chosenTower = chosenTower;

        const stats = towerStats[this.chosenTower];
        
        this.health = stats.health;
        this.damage = stats.damage;
        this.attackRate = stats.attackRate;

        if (this.chosenTower === 3) {
            this.burstShotsLeft = 0;
            this.burstSpeed = 10;
            this.burstTimer = 0;
        }
    }
    
    draw(){
        if (this.chosenTower === 1) {
            ctx.fillStyle = 'darkgreen';
        } else if (this.chosenTower === 2) {
            ctx.fillStyle = 'gray';
        } else if (this.chosenTower === 3) {
            ctx.fillStyle = '#8B4513';
        } else if (this.chosenTower === 4) {
            ctx.fillStyle = 'navy';
        } else {
            ctx.fillStyle = 'gray';
        }
        
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        ctx.fillStyle = 'white';
        ctx.font = '20px "Are You Serious"';
        ctx.fillText(Math.floor(this.health), this.x + 2, this.y + 22);
    }

    update(){
        if (this.shooting){
            if (this.chosenTower === 3) {
                if (this.burstShotsLeft > 0) {
                    this.burstTimer++;
                    if (this.burstTimer % this.burstSpeed === 0) {
                        projectiles.push(new Projectile(this.x + 50, this.y + 50, this.damage));
                        this.burstShotsLeft--;
                        this.burstTimer = 0;
                    }
                } else {
                    this.timer++;
                    if (this.timer >= this.attackRate) {
                        this.timer = 0;
                        this.burstShotsLeft = 3;
                        
                        projectiles.push(new Projectile(this.x + 50, this.y + 50, this.damage));
                        this.burstShotsLeft--;
                    }
                }
            }
            else {
                this.timer++;
                if (this.timer >= this.attackRate){
                    this.timer = 0;
                    let isPiercing = (this.chosenTower === 4);
                    projectiles.push(new Projectile(this.x + 50, this.y + 50, this.damage, isPiercing));
                }
            }
        } else {
            this.timer = this.attackRate;
            if (this.chosenTower === 3) {
                this.burstShotsLeft = 0;
                this.burstTimer = 0;
            }
        }
    }
}

function handleTowers(){
    for (let i = 0; i < towers.length; i++){
        towers[i].draw();

        if (sellMode && mouse.x && mouse.y && collision(towers[i], mouse)) {
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = 'red';
            ctx.fillRect(towers[i].x, towers[i].y, towers[i].width, towers[i].height);
            ctx.globalAlpha = 1.0;
        }

        towers[i].update();

        let enemyInRow = false;
        for (let j = 0; j < enemies.length; j++) {
            let enemy = enemies[j];
            let tower = towers[i];
            
            if (enemy.enemyType === 'boss') {
                if (tower.y >= enemy.y && tower.y < (enemy.y + enemy.height)) {
                    if (tower.chosenTower === 1) {
                        if (enemy.x < tower.x + (cellSize * 3)) {
                            enemyInRow = true;
                            break;
                        }
                    } else {
                        enemyInRow = true;
                        break;
                    }
                }
            }

            if (enemy.enemyType !== 'boss' && enemy.y === tower.y) {
                if (tower.chosenTower === 1) {
                    if (enemy.x < tower.x + (cellSize * 3)) {
                        enemyInRow = true;
                        break;
                    }
                } else {
                    enemyInRow = true;
                    break;
                }
            }
        }
        towers[i].shooting = enemyInRow;

        for (let j = 0; j < enemies.length; j++){
            if (towers[i] && collision(towers[i], enemies[j])){
                enemies[j].movement = 0;
                enemies[j].attackTimer++;

                if (enemies[j].attackTimer % enemies[j].attackRate === 0) {
                    towers[i].health -= enemies[j].damage;
                }
            }

            if (towers[i] && towers[i].health <= 0){
                let deadTower = towers[i];
                towers.splice(i, 1);
                i--;
                
                for (let k = 0; k < enemies.length; k++) {
                    if (collision(deadTower, enemies[k])) {
                        enemies[k].movement = enemies[k].speed;
                        enemies[k].attackTimer = 0;
                    }
                }
            }
        }
    }
}

// selecting towers
const card1 = {
    x: 10,
    y: 10,
    width: 70,
    height: 85,
}
const card2 = {
    x: 90,
    y: 10,
    width: 70,
    height: 85,
}
const card3 = {
    x: 170,
    y: 10,
    width: 70,
    height: 85,
}
const card4 = {
    x: 250,
    y: 10,
    width: 70,
    height: 85,
}

function chooseTower(){
    let card1stroke = 'black'
    let card2stroke = 'black'
    let card3stroke = 'black'
    let card4stroke = 'black'

    if(collision(mouse, card1) && mouse.clicked){
        chosenTower = 1;
    } else if (collision(mouse, card2) && mouse.clicked){
        chosenTower = 2;
    } else if (collision(mouse, card3) && mouse.clicked){
        chosenTower = 3;
    } else if (collision(mouse, card4) && mouse.clicked){
        chosenTower = 4;
    }

    if (chosenTower === 1){
        card1stroke = 'gold'
    } else if (chosenTower === 2){
        card2stroke = 'gold'
    } else if (chosenTower === 3){
        card3stroke = 'gold'
    } else if (chosenTower === 4){
        card4stroke = 'gold'
    }

    ctx.lineWidth = 2;
    ctx.textAlign = 'center';

    ctx.fillStyle = 'darkgreen';
    ctx.fillRect(card1.x, card1.y, card1.width, card1.height);
    ctx.strokeStyle = card1stroke;
    ctx.strokeRect(card1.x, card1.y, card1.width, card1.height);
    
    ctx.fillStyle = 'white';
    ctx.font = '16px "Are You Serious"';
    ctx.fillText('Slasher', card1.x + card1.width / 2, card1.y + 20);
    ctx.font = '14px "Are You Serious"';
    ctx.fillText(towerStats[1]?.cost || 'N/A', card1.x + card1.width / 2, card1.y + card1.height - 8);

    ctx.fillStyle = 'gray';
    ctx.fillRect(card2.x, card2.y, card2.width, card2.height);
    ctx.strokeStyle = card2stroke;
    ctx.strokeRect(card2.x, card2.y, card2.width, card2.height);
    
    ctx.fillStyle = 'white';
    ctx.font = '16px "Are You Serious"';
    ctx.fillText('Sniper', card2.x + card2.width / 2, card2.y + 20);
    ctx.font = '14px "Are You Serious"';
    ctx.fillText(towerStats[2]?.cost || 'N/A', card2.x + card2.width / 2, card2.y + card2.height - 8);

    ctx.fillStyle = '#8B4513';
    ctx.fillRect(card3.x, card3.y, card3.width, card3.height);
    ctx.strokeStyle = card3stroke;
    ctx.strokeRect(card3.x, card3.y, card3.width, card3.height);
    
    ctx.fillStyle = 'white';
    ctx.font = '16px "Are You Serious"';
    ctx.fillText('Soldier', card3.x + card3.width / 2, card3.y + 20);
    ctx.font = '14px "Are You Serious"';
    ctx.fillText(towerStats[3]?.cost || 'N/A', card3.x + card3.width / 2, card3.y + card3.height - 8);

    ctx.fillStyle = 'navy';
    ctx.fillRect(card4.x, card4.y, card4.width, card4.height);
    ctx.strokeStyle = card4stroke;
    ctx.strokeRect(card4.x, card4.y, card4.width, card4.height);
    
    ctx.fillStyle = 'white';
    ctx.font = '16px "Are You Serious"';
    ctx.fillText('Archer', card4.x + card4.width / 2, card4.y + 20);
    ctx.font = '14px "Are You Serious"';
    ctx.fillText(towerStats[4]?.cost || 'N/A', card4.x + card4.width / 2, card4.y + card4.height - 8);
    
    ctx.textAlign = 'left';
}

const floatingMessages = [];
class floatingMessage {
    constructor(value, x, y, size, color){
        this.value = value;
        this.x = x;
        this.y = y;
        this.size = size;
        this.lifespan = 0;
        this.color = color;
        this.opacity = 1;
    }
    update(){
        this.y -= 0.65;
        this.lifespan += 1;
        if (this.opacity > 0.01) this.opacity -= 0.015;
    }
    draw(){
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.font = this.size + 'px "Are You Serious"';
        ctx.fillText(this.value, this.x, this.y);
        ctx.globalAlpha = 1;
    }
}
function handleFloatingMessages(){
    for (let i = 0; i < floatingMessages.length; i++){
        floatingMessages[i].update();
        floatingMessages[i].draw();
        if (floatingMessages[i].lifespan >= 75){
            floatingMessages.splice(i, 1);
            i--;
        }
    }
}

// enemies
class Enemy {
    constructor(verticalPosition, enemyType = 'base', gameMode){
        this.x = canvas.width;
        this.y = verticalPosition;
        this.width = cellSize - cellGap * 2;
        this.height = cellSize - cellGap * 2;
        this.enemyType = enemyType;
        this.attackTimer = 0;
        this.attackRate = 60;

        const config = gameModeConfig[gameMode];
        const stats = config.enemyStats[enemyType];
        const speedRange = stats.speed;

        this.health = stats.health;
        this.maxHealth = stats.health;
        this.speed = Math.random() * (speedRange.max - speedRange.min) + speedRange.min;
        this.damage = stats.damage;
        this.color = config.enemyColors[enemyType];

        if (enemyType === 'boss') {
            this.width = cellSize - cellGap * 2;
            this.height = (cellSize * 5) - cellGap * 2;
            this.y = cellSize + cellGap;
        }

        this.movement = this.speed;
    }
    update(){
        this.x -= this.movement;
    }
    draw(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        ctx.fillStyle = 'white';
        ctx.font = '20px "Are You Serious"';
        ctx.fillText(Math.floor(this.health), this.x + 2, this.y + 22);
    }
}

function handleEnemies(){
    for (let i = 0; i < enemies.length; i++){
        enemies[i].update();
        enemies[i].draw();
        if (enemies[i].x < 0){
            gameOver = true;
        }
        if (enemies[i].health <= 0){
            let gainedResources = enemies[i].maxHealth * 0.15;
            numberOfResources += gainedResources;
            score += gainedResources;
            floatingMessages.push(new floatingMessage('+' + gainedResources, enemies[i].x, enemies[i].y, 20, 'black'))
            floatingMessages.push(new floatingMessage('+' + gainedResources, 137.5, 24, 20, 'black'))

            enemies.splice(i, 1);
            i--;
        }
    }

    if (score >= gameModeConfig[gameMode].bossSpawnScore && !bossSpawned) {        enemies.push(new Enemy(cellSize, 'boss', gameMode));
        boss = enemies[enemies.length - 1];
        bossSpawned = true;
    }

    if (frame % enemiesInterval === 0 && score < gameModeConfig[gameMode].winningScore && !bossSpawned){        
        let verticalPosition;
        if (enemiesSpawnedCount < 3) {
            verticalPosition = 3 * cellSize + cellGap;
        } else {
            verticalPosition = Math.floor(Math.random() * 5 + 1) * cellSize + cellGap;
        }
        
        let spawnPool = ['base'];
        if (score >= 300) {
            spawnPool.push('fast');
        }
        if (score >= 1000) {
            spawnPool.push('tank');
        }

        let randomType = spawnPool[Math.floor(Math.random() * spawnPool.length)];
        
        enemies.push(new Enemy(verticalPosition, randomType, gameMode));
        
        enemiesSpawnedCount++;

        const spawnTiers = gameModeConfig[gameMode].spawnTiers;
        
        let minInterval = 250;
        let decreaseAmount = 20;

        for (const tier of spawnTiers) {
            if (score >= tier.scoreThreshold) {
                minInterval = tier.minInterval;
                decreaseAmount = tier.decreaseAmount;
                break;
            }
        }

        if (enemiesInterval > minInterval) enemiesInterval -= decreaseAmount;
    }
}

// resources
const amounts = [30, 40, 50];
const lategame = [80, 90, 100];
class Resource {
    constructor(){
        this.x = Math.random() * (canvas.width - cellSize);
        this.y = (Math.floor(Math.random() * 5) + 1) * cellSize + 25;
        this.width = cellSize * 0.6;
        this.height = cellSize * 0.6;
        if (score >= 1200){
            this.amount = lategame[Math.floor(Math.random() * lategame.length)];
        }
        else {
            this.amount = amounts[Math.floor(Math.random() * amounts.length)];
        }
    }
    draw(){
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'black';
        ctx.font = '15px "Are You Serious"';
        ctx.fillText(this.amount, this.x + 15, this.y + 25);
    }
}
function handleResources(){
    if (frame % 600 === 0 && frame > 100 && score < gameModeConfig[gameMode].winningScore){        resources.push(new Resource());
    }
    for (let i = 0; i < resources.length; i++){
        resources[i].draw();
        if (resources[i] && mouse.x && mouse.y && collision(resources[i], mouse)){
            numberOfResources += resources[i].amount;
            floatingMessages.push(new floatingMessage('+' + resources[i].amount, resources[i].x, resources[i].y, 20, 'black'));
            floatingMessages.push(new floatingMessage('+' + resources[i].amount, 137.5, 24, 20, 'black'));
            resources.splice(i, 1);
            i--;
        }
    }
}

// win effects
class WinParticle {
    constructor(type) {
        this.type = type;
        this.colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
        
        if (this.type === 'confetti') {
            this.x = Math.random() * canvas.width;
            this.y = -10;
            this.width = Math.random() * 10 + 5;
            this.height = Math.random() * 20 + 10;
            this.speedY = Math.random() * 2 + 1;
            this.speedX = Math.random() * 4 - 2;
        } else if (this.type === 'balloon') {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 50;
            this.radius = Math.random() * 10 + 10;
            this.speedY = Math.random() * 2 + 1;
            this.speedX = Math.random() * 2 - 1;
        }
    }

    update() {
        if (this.type === 'confetti') {
            this.y += this.speedY;
            this.x += this.speedX;
        } else if (this.type === 'balloon') {
            this.y -= this.speedY;
            this.x += this.speedX;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        if (this.type === 'confetti') {
            ctx.fillRect(this.x, this.y, this.width, this.height);
        } else if (this.type === 'balloon') {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = '#555';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + this.radius);
            ctx.lineTo(this.x, this.y + this.radius + 20);
            ctx.stroke();
        }
    }
}

function handleWinParticles() {
    for (let i = 0; i < winParticles.length; i++) {
        winParticles[i].update();
        winParticles[i].draw();

        if (winParticles[i].type === 'confetti' && winParticles[i].y > canvas.height + 10) {
            winParticles.splice(i, 1);
            i--;
        } else if (winParticles[i].type === 'balloon' && winParticles[i].y < -50) {
            winParticles.splice(i, 1);
            i--;
        }
    }
}

// utilities
function handleGameStatus(){
    if (!bossSpawned) {
        ctx.fillStyle = 'green';
        ctx.font = '30px "Are You Serious"';
        ctx.fillText('Resources: ' + numberOfResources, 335, 40);
        ctx.fillText('Score: ' + score, 335, 80);
    }

    ctx.textAlign = 'center';
    if (gameOver){
        if (gameOverOpacity < 1) gameOverOpacity += 0.01;
        ctx.globalAlpha = gameOverOpacity;

        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'red';
        ctx.font = '90px "Are You Serious"';
        ctx.fillText('out. NOW', canvas.width/2, 330);
        ctx.fillStyle = 'white';
        ctx.font = '30px "Are You Serious"';
        ctx.fillText('Click to Restart', canvas.width/2, 380);

        ctx.globalAlpha = 1;
    }
    
    if (score > gameModeConfig[gameMode].winningScore && enemies.length === 0){        if (frame % 3 === 0) {
            winParticles.push(new WinParticle('confetti'));
        }
        if (frame % 25 === 0) {
            winParticles.push(new WinParticle('balloon'));
        }

        if (winScreenOpacity < 1) winScreenOpacity += 0.01;
        
        ctx.globalAlpha = winScreenOpacity;
        
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'gold';
        ctx.font = '60px "Are You Serious"';
        ctx.fillText ('You Won!', canvas.width/2, 280);
        ctx.font = '30px "Are You Serious"';
        ctx.fillText ('Mode: ' + gameMode, canvas.width/2, 330);
        ctx.fillText ('Score: ' + score, canvas.width/2, 365);
        
        ctx.fillStyle = 'white';
        
        ctx.fillText('Click to Continue', canvas.width/2, 480);
        
        ctx.globalAlpha = 1;
    }
    ctx.textAlign = 'left';
}

canvas.addEventListener('click', function(){
    
    if (!gameStarted) {
        if (collision(mouse, startButton)) {
            gameStarted = true;
            resetGame(gameMode);
        }
        return;
    }

    if (gameOver || (score > gameModeConfig[gameMode].winningScore && enemies.length === 0)) {        gameStarted = false;
        updateButtonColor();
        return;
    }

    if (collision(mouse, sellButton)) {
        sellMode = !sellMode;
        return;
    }

    if (sellMode) {
        for (let i = 0; i < towers.length; i++) {
            if (collision(mouse, towers[i])) {
                const tower = towers[i];
                const stats = towerStats[tower.chosenTower];
                let refund = 0;
                
                if (tower.health < (stats.health * 0.5)) {
                    refund = Math.floor(stats.cost * 0.2);
                } else {
                    refund = Math.floor(stats.cost * 0.5);
                }
                
                numberOfResources += refund;
                floatingMessages.push(new floatingMessage('+' + refund, tower.x, tower.y, 20, 'gold'));
                towers.splice(i, 1);
                i--;
                sellMode = false;
                return;
            }
        }
        return;
    }

    const gridPositionX = mouse.x - (mouse.x % cellSize) + cellGap;
    const gridPositionY = mouse.y - (mouse.y % cellSize) + cellGap;
    if (gridPositionY < cellSize) return;
    for (let i = 0; i < towers.length; i++){
        if (towers[i].x === gridPositionX && towers[i].y === gridPositionY)
        return;
    }

    let towerCost = towerStats[chosenTower].cost;

    if (numberOfResources >= towerCost){
        towers.push(new Tower(gridPositionX, gridPositionY));
        numberOfResources -= towerCost;
    } else {
        floatingMessages.push(new floatingMessage('You need ' + (towerCost - numberOfResources) + ' more Resources!', mouse.x, mouse.y, 20, 'red'))    }
});

function drawStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgb(50, 50, 50)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = '90px "Are You Serious"';
    ctx.textAlign = 'center';
    ctx.fillText('The Frontlines (Prequel)', canvas.width/2, 280);
    
    ctx.fillStyle = 'darkgreen';
    ctx.fillRect(startButton.x, startButton.y, startButton.width, startButton.height);
    ctx.fillStyle = 'white';
    ctx.font = '40px "Are You Serious"';
    ctx.fillText('Start', canvas.width/2, 425);

    ctx.font = '30px "Are You Serious"';
    ctx.fillText('Mode: ' + gameMode, canvas.width/2, 520);

    ctx.textAlign = 'left';
}

function drawSellButton(){
    ctx.lineWidth = 2;
    ctx.fillStyle = '#c91e1e';
    ctx.fillRect(sellButton.x, sellButton.y, sellButton.width, sellButton.height);
    
    ctx.fillStyle = 'white';
    ctx.font = '50px "Are You Serious"';
    ctx.textAlign = 'center';
    ctx.fillText('$', sellButton.x + sellButton.width / 2, sellButton.y + 58);
    ctx.textAlign = 'left';
    
    if (sellMode) {
        ctx.strokeStyle = 'gold';
    } else {
        ctx.strokeStyle = 'black';
    }
    ctx.strokeRect(sellButton.x, sellButton.y, sellButton.width, sellButton.height);
}

function handleBossBar(){
    if (!bossSpawned) return;
    if (boss.health <= 0) {
        if (bossBarOpacity > 0) bossBarOpacity -= 0.01;
    } else {
        if (bossBarOpacity < 1) bossBarOpacity += 0.01;
    }
    
    if (bossBarOpacity <= 0) return;

    ctx.globalAlpha = bossBarOpacity;

    const barX = 335;
    const barY = 10;
    const barWidth = 450;
    const barHeight = 80;

    ctx.fillStyle = 'black';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    ctx.fillStyle = 'gray';
    ctx.fillRect(barX + 2, barY + 2, barWidth - 4, barHeight - 4);
    
    const healthPercent = boss.health / boss.maxHealth;
    
    ctx.fillStyle = gameModeConfig[gameMode].enemyColors.boss;
    ctx.fillRect(barX + 2, barY + 2, (barWidth - 4) * healthPercent, barHeight - 4);
    
    ctx.fillStyle = 'white';
    ctx.font = '25px "Are You Serious"';
    ctx.textAlign = 'center';
    const bossName = gameModeConfig[gameMode].bossName || 'Destroyer';
const text = bossName + ": " + Math.floor(boss.health) + " / " + boss.maxHealth;
    ctx.fillText(text, barX + barWidth / 2, barY + 50);
    ctx.textAlign = 'left';

    ctx.globalAlpha = 1;
}

function createGameModeButtons() {
    const modes = ['Normal', 'Hard', 'Nightmare'];
    let topPosition = 50; 

    modes.forEach((mode, index) => {
        const button = document.createElement('button');
        button.id = 'gameModeButton_' + mode;
        button.textContent = mode;
        
        button.style.position = 'absolute';
        button.style.top = `calc(50% + ${index * 100 - 100}px)`;
        button.style.left = 'calc(50% - 450px - 160px)';
        button.style.transform = 'translateY(-50%)';
        button.style.width = '140px';
        button.style.height = '90px';
        button.style.fontFamily = '"Are You Serious", cursive';
        button.style.fontSize = '18px';
        button.style.color = 'white';
        button.style.border = '3px solid black';
        button.style.borderRadius = '8px';
        button.style.cursor = 'pointer';
        button.style.textShadow = '2px 2px #000';
        
        button.style.backgroundColor = gameModeConfig[mode].enemyColors.base;
        
        button.addEventListener('click', () => {
            if (gameStarted) return;
            gameMode = mode;
            
            document.querySelectorAll('[id^=gameModeButton_]').forEach(btn => {
                btn.style.border = '3px solid black';
            });
            button.style.border = '5px solid gold';
        });

        document.body.appendChild(button);
    });
}

function updateButtonColor() {
    const gameModeButton = document.getElementById('gameModeButton');
    if (!gameModeButton) return;

    gameModeButton.textContent = gameMode;
    gameModeButton.style.backgroundColor = gameModeConfig[gameMode].enemyColors.base;
}

function resetGame(selectedMode) {
    gameMode = selectedMode;
    
    const config = gameModeConfig[gameMode];
    numberOfResources = config.initialResources;
    enemiesInterval = config.initialEnemyInterval;
    towerStats = { ...config.towerStats };

    frame = 0;
    gameOver = false;
    score = 0;
    chosenTower = 1;
    bossSpawned = false;
    bossBarOpacity = 0;
    winScreenOpacity = 0;
    gameOverOpacity = 0;
    sellMode = false;
    boss = null;
    enemiesSpawnedCount = 0;
    progressionSaved = false;
    
    towers.length = 0;
    enemies.length = 0;
    projectiles.length = 0;
    resources.length = 0;
    winParticles.length = 0;
    floatingMessages.length = 0;
}

function gameLoop(){
    if (!gameStarted) {
        drawStartScreen();
    } else if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgb(210, 200, 190)';
        ctx.fillRect(0, 100, canvas.width, canvas.height - 100);
        ctx.fillStyle = 'rgb(200, 190, 180)';
        ctx.fillRect(0,0,controlsBar.width, controlsBar.height);
        
        handleGameGrid();
        handleResources();
        handleTowers();
        handleProjectiles();
        handleEnemies();
        handleWinParticles();
        chooseTower();
        drawSellButton();
        handleGameStatus();
        handleBossBar();
        handleFloatingMessages();
        frame++;
    } else {
        handleGameStatus();
    }
    
    requestAnimationFrame(gameLoop);
}


function collision(first, second){
    if (    !(  first.x > second.x + second.width ||
                first.x + first.width < second.x ||
                first.y > second.y + second.height ||
                first.y + first.height < second.y)
    ) {
        return true;
    }
}

window.addEventListener('resize', function(){
    canvasPosition = canvas.getBoundingClientRect();
})

createGameModeButtons();

document.getElementById('gameModeButton_Normal').style.border = '5px solid gold';

gameLoop();