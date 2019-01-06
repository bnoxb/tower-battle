const game = {
    timer: 0,
    int() {
        setInterval(() =>{
            this.timer++;
        }, 1000);
    }
};
const player = {
    ID:   ``,
    name: `player`,
    towerX: 2,
    towerY: 1,
    unitX:  3,
    unitY:  1
}
const computer = {
    ID:   `Roberto Roboto`,
    name: `computer`,
    towerX: 12,
    towerY: 1,
    unitX:  10,
    unitY:  1
}

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
        this.hp =             10;
        this.damage =         2;
        this.attackSpeed =    1;
        this.range =          1;
        this.movementSpeed =  2;
        this.defense =        1;
        this.accuracy =       1;
    }
    render() {
        if (this.controller === 'computer') {
            $(`.square[x='${this.x}'][y='${this.y}']`).addClass(`enemy`);
        }else {
            $(`.square[x='${this.x}'][y='${this.y}']`).addClass(`player`);
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
        this.hp =       100;
        this.level =    1;
        this.brix = [];
    }
    render() {
        console.log(`rendering ${this.x} and ${this.y}`);
        $(`.square[x='${this.x}'][y='${this.y}']`).addClass(`${this.controller} tower`);
        for (let i = 1; i < 5; i++) {
            for (let j = 0; j > -2; j--) {
                const thisBrix = this.x;
                $(`.square[x='${thisBrix + j}'][y='${i}']`).addClass(`${this.controller} tower`);
            }
        }
    }
}

const makeTower = (controller) => {
    let newTowerX = controller.towerX;
    let newTowerY = controller.towerY;
    console.log(`${controller}'s towerX: ${newTowerX} and towerY: ${newTowerY}`);
    const tower = new Tower(`tower`, controller.name, newTowerX, newTowerY);
    tower.render();
} 

const makeFighter = (controller) => {
    let newUnitX = controller.unitX;
    let newUnitY = controller.unitY;
    const newUnit = new Fighter(`fighter`, controller.name, newUnitX, newUnitY);
    newUnit.render();
    //newUnit.moveInt();
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
makeTower(player);
makeTower(computer);
makeFighter(player);
makeFighter(computer);

