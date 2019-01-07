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
    unitY:  1,
    affinity: 1,
    currentUnits: [],
}
const computer = {
    ID:   `Roberto Roboto`,
    name: `computer`,
    towerX: 12,
    towerY: 1,
    unitX:  10,
    unitY:  1,
    affinity: -1,
    currentUnits: [],
}

class Unit {
    constructor(name, controller, x, y, orient) {
        this.name = name;
        this.controller = controller;
        this.x = x;
        this.y = y;
        this.orient = orient;
        this.isAlive = true;
    }
    
}

class Fighter extends Unit {
    constructor(name, controller, x, y, orient) {
        super(name, controller, x, y, orient)
        this.timer= 0;
        this.hp =             10;
        this.damage =         2;
        this.attackSpeed =    1;
        this.range =          1;
        this.movementSpeed =  2;
        this.defense =        1;
        this.accuracy =       1;
        this.InCombat = false;
        this.target = [];
    }

    render() {
        if (this.controller === 'computer') {
            $(`.square[x='${this.x}'][y='${this.y}']`).addClass(`${this.controller}`);
        }else {
            $(`.square[x='${this.x}'][y='${this.y}']`).addClass(`${this.controller}`);
        }
        $(`.square[x='${this.x}'][y='${this.y}']`).addClass(`${this.name}`);
    }
    checkMoveSpeed() {
        if (this.InCombat) {
            // console.log(`attacking target!`);
        } else if (this.timer % this.movementSpeed) {
            this.checkCollision();
        } 
    }
    checkCollision() { // this is the method that starts the targetCheck and attack sequence
        const $thisX = this.x;
        const $theEnemy = $(`.square[x='${(this.range * this.orient) + $thisX}'][y='${this.y}']`);
        
        //console.log($theEnemy)
        if ($theEnemy.hasClass(`computer`)) {
            this.target = $theEnemy;
            this.InCombat = true;
            this.targetCheck(computer);
        } else if ($theEnemy.hasClass(`player`)) {
            this.target = $theEnemy;
            this.InCombat = true;
            this.targetCheck(player);
        } else {
            this.move();
        }
    }
    move() {
        if(this.x < 11 && this.x > 1) {
            $(`.square[x='${this.x}'][y='${this.y}']`).removeClass(`fighter ${this.controller}`);
            this.x = this.x + this.orient;
            this.render();
        } 
    }
    // this function with an Interval starts the move checks and ultimately the units moving.
    unitInt() {
        setInterval(()=>{
            //if (this.InCombat)
            this.checkMoveSpeed();
            this.timer++;
        }, 500);
    }

    targetCheck(target) {
        const thisTarget = this.target;
        console.log(thisTarget);
        const targetInEnemyArray = target.currentUnits[0];
        console.log(targetInEnemyArray);
        for (let i = 0; i < target.currentUnits.length; i++) {
            let thisTargetAttr = parseInt(thisTarget.attr('x'));
            console.log(`thisTarget.attr('x') is ${thisTargetAttr}`);
            if (thisTargetAttr === target.currentUnits[i].x) {
                console.log(`yay targeting worked and you targeted ${target.name}`);
            } 
        }
        
    }
    attack() {

    };
}

class Tower extends Unit {
    constructor(name, controller, x, y, orient) {
        super(name, controller, x, y, orient)
        this.hp =       100;
        this.level =    1;
        this.brix = [];
    }
    render() {
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
    const tower = new Tower(`tower`, controller.name, newTowerX, newTowerY, controller.affinity);
    tower.render();
} 

const makeFighter = (controller) => {
    let newUnitX = controller.unitX;
    let newUnitY = controller.unitY;
    const newUnit = new Fighter(`fighter`, controller.name, newUnitX, newUnitY, controller.affinity);
    controller.currentUnits.push(newUnit);
    console.log(controller.currentUnits);
    newUnit.render();
    newUnit.unitInt();
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