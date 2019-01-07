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
    towerLevel: 4,
    currentUnits: [],
    currentTower: [],
}
const computer = {
    ID:   `Roberto Roboto`,
    name: `computer`,
    towerX: 12,
    towerY: 1,
    unitX:  10,
    unitY:  1,
    affinity: -1,
    towerLevel: 4,
    currentUnits: [],
    currentTower: [],
}

class Unit {
    constructor(name, controller, controllerObject, x, y, orient, enemy) {
        this.name = name;
        this.controller = controller;
        this.controllerObject = controllerObject;
        this.x = x;
        this.y = y;
        this.orient = orient;
        this.enemy = enemy;
        this.isAlive = true;
    }
    
}
class Fighter extends Unit {
    constructor(name, controller, controllerObject, x, y, orient, enemy) {
        super(name, controller, controllerObject, x, y, orient, enemy)
        this.timer= 0;
        this.hp =             10;
        this.damage =         6;
        this.attackSpeed =    2;
        this.range =          1;
        this.movementSpeed =  2;
        this.defense =        1;
        this.accuracy =       .6;
        this.inCombat = false;
        this.target;
        this.currentTarget;
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
    checkCollision() { // this is the method that starts the targetCheck and attack sequence ** maybe I can break this up into smaller functions?
        const $theEnemy = $(`.square[x='${(this.range * this.orient) + this.x}'][y='${this.y}']`);
        if ($theEnemy.hasClass(`computer`)) {
            this.target = $theEnemy;
            this.inCombat = true;
            this.targetCheck(computer);
        } else if ($theEnemy.hasClass(`player`)) {
            this.target = $theEnemy;
            this.inCombat = true;
            this.targetCheck(player);
        } else {
            this.move();
        }
    }
    move() {
        if(this.x < 12 && this.x > 1) {
            $(`.square[x='${this.x}'][y='${this.y}']`).removeClass(`fighter ${this.controller}`);
            this.x = this.x + this.orient;
            this.render();
        } 
    }
    // this function with an Interval starts the move checks and ultimately the units moving.
    unitInt() {
        const unitInterval = setInterval(()=>{
            if(this.isAlive === true && this.inCombat === true){
                    this.attackSpeedCheck();
                    
            }   else if (this.isAlive){
                    this.checkMoveSpeed();
                     
            }   else {
                    clearInterval(unitInterval);
                    this.death();
            }
            this.timer++; 
        }, 500);
    }

    targetCheck(target) {
        if (this.target.hasClass(`tower`)){
            this.targetTower(target);
        } else {
            const thisTarget = this.target;
            const targetInEnemyArray = target.currentUnits[0];
                for (let i = 0; i < target.currentUnits.length; i++) {
                    const thisTargetAttrX = parseInt(thisTarget.attr('x'));
                        if (thisTargetAttrX === target.currentUnits[i].x) {
                            this.currentTarget = targetInEnemyArray;
                            this.attack(this.currentTarget);
                        }    
                } 
        }
        
    }

    targetTower(target) {
        const $thisTarget = this.target;
        for (let i = 0; i < target.currentTower.brix.length; i++ ) {
            const thisTargetAttrX = parseInt($thisTarget.attr(`x`));
            const thisTargetAttrY = parseInt($thisTarget.attr(`y`));
            if (thisTargetAttrX === target.currentTower.brix[i].x && thisTargetAttrY === target.currentTower.brix[i].y) {
                this.currentTarget = target.currentTower.brix[i];
                // console.log(target.currentTower[i]);
                this.attack(this.currentTarget);
            }
        }
    }
    attack(target) {
        if (target.hp > 0) {
            const actualDamage = this.damage - target.defense;
                console.log(`${this.controller}${this.name} did ${actualDamage} damage to ${target.controller}${target.name}`);
            target.hp = target.hp - actualDamage;
                console.log(`${target.controller}'s ${target.name} has ${target.hp} hp left!`); 
            this.attackKillCheck(target);
        }   else if (target.isAlive === true) {
                console.log(`${target.controller}'s ${target.name} is dead!`);
                target.isAlive = false;
                this.inCombat = false;
        } else {
            this.attackDieCheck(target);
            this.attackKillCheck(target);
        }
        
    }
    attackKillCheck(target) {
        if (target.hp < 1) {
            //console.log(`using attackKillCheck on ${target.controller}'s ${target.name}`);
            target.isAlive=false;
            this.inCombat=false;
        }
    }
    attackDieCheck(target) {
        if (this.hp < 1) {
            this.isAlive = false;
            this.InCombat = false;
            console.log(`${this.controller}'s ${this.name} has killed ${target.controller}'s ${target.name} but has died from his wounds.`);
        };
    }
    attackSpeedCheck() {
        if (this.timer % this.attackSpeed) {
            this.attack(this.currentTarget);
        } 
    }
    death() {
        console.log(`${this.controller}'s ${this.name} is proclaimed dead by the death(); function!`);
        $(`.square[x='${this.x}'][y='${this.y}']`).removeClass(`fighter ${this.controller}`);
    }
}

class Brick {
    constructor(controllerObject, controller, x, y, tower) {
        this.controllerObject = controllerObject;
        this.controller = controller;
        this.x = x;
        this.y = y;
        this.tower = tower;
        this.hp =       10;
        this.defense =  1;
        this.isAlive = true;
        this.name = `brick`;
    }
    brixInt() {
        const brickInterval = setInterval(()=>{
            if(this.isAlive === false){
                    this.death();
                    clearInterval(brickInterval);
                    //this.render();
            } 
            this.timer++; 
        }, 500);
    }
    death() {
        console.log(`brick destroyed`);
        $($(`.square[x='${this.x}'][y='${this.y}']`)).removeClass(`${this.controller} tower`);
        this.moveBricks();
    }
    moveBricks() {
        console.log(this);
        const thisX = this.x;
        console.log(this.controllerObject.currentTower.brix);
        const brickArr = this.controllerObject.currentTower.brix;
        //const deadBrick = brickArr.splice(0, 1);
        for (let i = 0; i < brickArr.length; i++) {
            if (brickArr[i].x === thisX) {
                const thisBrix = brickArr[i];
                console.log(thisBrix);
                $($(`.square[x='${thisBrix.x}'][y='${thisBrix.y}']`)).removeClass(`${this.controller} tower`);
                thisBrix.y--;
                console.log(`now its y is: ${thisBrix.y}`);
                $($(`.square[x='${thisBrix.x}'][y='${thisBrix.y}']`)).addClass(`${this.controller} tower`);
            }
        }
        console.log(`the death for loop is complete`);
    }
    // render() {
    //     $(`.square[x='${this.x}'][y='${this.y}']`)
    // }
    
}
class Tower extends Unit {
    constructor(name, controller, controllerObject, x, y, orient, enemy) {
        super(name, controller, controllerObject, x, y, orient, enemy)
        this.timer = 0;
        this.brix = [];
    }
    addBrix() {
        for (let i = 1; i < this.controllerObject.towerLevel + 1; i++) {
            for (let j = 0; j > -2; j--) {
                let newBrixX = this.controllerObject.towerX + j;
                const thisBrick = new Brick(this.controllerObject, this.controller, newBrixX, i, this);
                thisBrick.brixInt();
                this.brix.push(thisBrick);
            }
        }
    }
    render() {
        for (let i=0;i<this.brix.length; i++) {
            const $thisBrix = $(`.square[x='${this.brix[i].x}'][y='${this.brix[i].y}']`);
            $thisBrix.addClass(`${this.controller} tower`);
        }
    }
}

const makeTower = (controller) => {
            const tower = new Tower(`tower`, controller.name, controller, controller.towerX, controller.towerY, controller.affinity, controller.enemy);
            controller.currentTower = tower;
            //tower.towInt();
            tower.addBrix();
            tower.render();
} 

const makeFighter = (controller) => {
    let newUnitX = controller.unitX;
    let newUnitY = controller.unitY;
    const newUnit = new Fighter(`fighter`, controller.name, controller, newUnitX, newUnitY, controller.affinity, controller.enemy);
    controller.currentUnits.push(newUnit);
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

player.enemy= computer;
computer.enemy = player;
gameBoardSetup();
game.int();
makeTower(player);
makeTower(computer);
makeFighter(player);
// setting a delay to the computer
setTimeout(makeFighter, 500, computer);