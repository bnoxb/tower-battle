const game = {
    timer: 0,
    int() {
        setInterval(() =>{
            this.timer++;
        }, 1000);
    }
};

class Unit {
    constructor(name, controller, x, y) {
        this.name = name;
        this.controller = controller;
        this.x = x;
        this.y = y;
        this.isAlive = true;
        this.inRange = false;
    }
    
}

class Fighter extends Unit {
    constructor(name, controller, x, y) {
        super(name, controller, x, y)
        this.hp = 10;
        this.damage = 2;
        this.attackSpeed = 1;
        this.range = 1;
        this.movementSpeed = 2;
        this.defense = 1;
        this.accuracy = 1;
    }
    render() {
        if (this.controller === 'computer') {
            $(`.square[x='${this.x}'][y='${this.y}']`).addClass(`enemy`);
        }
        $(`.square[x='${this.x}'][y='${this.y}']`).addClass(`fighter`);
    }
    checkMoveSpeed() {
        if (game.timer % this.movementSpeed) {
            this.checkCollision();
        } 
    }
    checkCollision() {
        const $enemyX = this.x
        const $theEnemy = $(`.square[x='${$enemyX + 1}'][y='${this.y}']`);
        if ($theEnemy.hasClass(`enemy`)){
            console.log(`collision detected`);
        } else {
            this.move();
        }
    }
    move() {
        if(this.x < 12) {
            $(`.square[x='${this.x}'][y='${this.y}']`).removeClass(`fighter`);
            this.x++;
            this.render();
        } 
    }
    moveInt () {
        setInterval(()=>{
            this.checkCollision();
        }, 1000);
    }
}

class Tower extends Unit {
    constructor(name, controller, x, y) {
        super(name, controller, x, y)
        this.hp = 100;
        this.level = 1;
        this.brix = [];
    }
    render() {
        console.log(`rendering ${this.x} and ${this.y}`);
        $(`.square[x='${this.x}'][y='${this.y}']`).addClass(`${this.controller} tower`);
        const thisX = this.x - 2;
        for (let i = 1; i < 5; i++) {
            console.log(`i = ${i}`);
            for (let j = 0; j > -2; j--) {
                console.log(`j = ${j}`);
                const thisBrix = this.x;
                $(`.square[x='${thisBrix + j}'][y='${i}']`).addClass(`${this.controller} tower`);
            }
        }
    }
}

const makeTower = (controller) => {
    let towerX = 2;
    const towerY = 1;
    console.log(`towerX: ${towerX} towerY: ${towerY}`);
    if (controller === `computer`) {
        towerX = 12;
    }
    const tower = new Tower(`tower`, controller, towerX, towerY);
    console.log(`just made the tower`);
    tower.render();
} 

const makeUnits = () => {
    const newUnit = new Fighter(`fighter`, 'player', 3, 1);
    newUnit.render();
    newUnit.moveInt();
}

const makeEnemyUnit = () => {
    const enemyUnit = new Fighter(`blocker`,'computer', 8, 1);
    enemyUnit.render();
}

const gameBoardSetup = () => {
    for (let y = 5; y > 0; y--) {
        const $thisRow = $(`<div/>`).appendTo(`.game-board`);
            for (let x = 1; x < 13; x++) {
                $(`<div/>`).attr({x: `${x}`, y: `${y}`}).addClass(`square`).appendTo($thisRow);
            }
    }
}


gameBoardSetup();
game.int();
makeUnits();
makeEnemyUnit();
makeTower(`player`);
makeTower(`computer`);
