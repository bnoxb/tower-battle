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
    constructor(name, controller, controllerObject, x, y, orient, enemy, enemyObject) {
        this.name = name;
        this.controller = controller;
        this.controllerObject = controllerObject;
        this.x = x;
        this.y = y;
        this.orient = orient;
        this.enemy = enemy;
        this.enemyObject = enemyObject;
        this.isAlive = true;
    }
    
}

class Fighter extends Unit {
    constructor(name, controller, controllerObject, x, y, orient, enemy, enemyObject) {
        super(name, controller, controllerObject, x, y, orient, enemy, enemyObject)
        this.timer= 0;
        this.inCombat = false;
        this.target;
        this.currentTarget;
    }

    render() {
    
            $(`.square[x='${this.x}'][y='${this.y}']`).addClass(`${this.controller}`);
            $(`.square[x='${this.x}'][y='${this.y}']`).addClass(`${this.name}`);
    }
    checkMoveSpeed() {
        if (this.InCombat) {
            // console.log(`attacking target!`);
        } else if (this.timer % this.movementSpeed) {
            this.checkRange();
        } 
    }

    checkRange() { 
        const $theUnit = $(`.square[x='${(this.range * this.orient) + this.x}'][y='${this.y}']`);
        if ($theUnit.hasClass(this.enemy)) {
            this.target = $theUnit;
            this.inCombat = true;
            this.targetCheck(this.enemyObject);
        } else if ($theUnit.hasClass(this.controller)){
            console.log(`dont target your own dudes!`);
            this.checkCollision();
        } else {
            this.checkCollision();
        }
    }

    checkCollision() {
        const $theUnit= $(`.square[x='${(this.orient) + this.x}'][y='${this.y}']`);
        if ($theUnit.hasClass(this.enemy)) {
            console.log(`collision detected`);
        } else if ($theUnit.hasClass(this.controller)) {
            this.checkCollisionAhead();
        } else {
            this.move(0);
        }
    }
    checkCollisionAhead() {
        const $theUnit= $(`.square[x='${(this.orient + this.orient) + this.x}'][y='${this.y}']`);
        if ($theUnit.hasClass(this.enemy)) {
            console.log(`collision detected`);
        } else if ($theUnit.hasClass(this.controller)) {
            console.log(`collision detected`);
        } else {
            this.move(1);
        }
    }
    
    move(extra) {
        if(this.x < 12 && this.x > 1) {
            $(`.square[x='${this.x}'][y='${this.y}']`).removeClass(`${this.name} ${this.controller}`);
            this.x = this.x + this.orient + extra;
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
            this.checkVictory();
        }, 500);
    }

    checkVictory() {
        if (this.x === 12 || this.x === 0) {
            console.log(`You win!!`);
        }
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
    computeActualDamage (target) {
        if (this.damage === 0) {
            return 0;
        } else {
            const actualDamage = this.damage - target.defense;
            return actualDamage;
        }
    }
    attack(target) {
        if (target.hp > 0) {
            const actualDamage = this.computeActualDamage(target);
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
        $(`.square[x='${this.x}'][y='${this.y}']`).removeClass(`${this.name} ${this.controller}`);
        this.controllerObject.currentUnits.splice(0, 1);
    }
}
class Swordsman extends Fighter {
    constructor(name, controller, controllerObject, x, y, orient, enemy, enemyObject) {
        super(name, controller, controllerObject, x, y, orient, enemy, enemyObject)
        this.hp =             10;
        this.damage =         6;
        this.attackSpeed =    2;
        this.range =          1;
        this.movementSpeed =  2;
        this.defense =        1;
        this.accuracy =       .6;
    }
}
class Archer extends Fighter {
    constructor(name, controller, controllerObject, x, y, orient, enemy, enemyObject) {
        super(name, controller, controllerObject, x, y, orient, enemy, enemyObject)
        this.hp =             5;
        this.damage =         3;
        this.attackSpeed =    2;
        this.range =          3;
        this.movementSpeed =  2;
        this.defense =        0;
        this.accuracy =       .6;
    }
}

class Defender extends Fighter {
    constructor(name, controller, controllerObject, x, y, orient, enemy, enemyObject) {
        super(name, controller, controllerObject, x, y, orient, enemy, enemyObject)
        this.hp =             20;
        this.damage =         0;
        this.attackSpeed =    2;
        this.range =          1;
        this.movementSpeed =  2;
        this.defense =        2;
        this.accuracy =       .6;
    }
}

class Brick extends Unit {
    constructor(name, controller, controllerObject, x, y, orient, enemy, enemyObject, tower) {
        super(name, controller, controllerObject, x, y, orient, enemy, enemyObject)
        this.tower = tower;
        this.hp =       10;
        this.defense =  1;
    }
    brixInt() {
        const brickInterval = setInterval(()=>{
            if(this.isAlive === false){
                    this.death();
                    clearInterval(brickInterval);
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
        const thisX = this.x;
        const brickArr = this.controllerObject.currentTower.brix;
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
}
class Tower extends Unit {
    constructor(name, controller, controllerObject, x, y, orient, enemy, enemyObject) {
        super(name, controller, controllerObject, x, y, orient, enemy, enemyObject)
        this.timer = 0;
        this.brix = [];
    }
    addBrix() {
        for (let i = 1; i < this.controllerObject.towerLevel + 1; i++) {
            for (let j = 0; j > -2; j--) {
                let newBrixX = this.controllerObject.towerX + j;
                const thisBrick = new Brick(`brick`,this.controller, this.controllerObject, newBrixX, i, this.orient, this.enemy, this);
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
            const tower = new Tower(`tower`, controller.name, controller, controller.towerX, controller.towerY, controller.affinity, controller.enemy.name, controller.enemy);
            controller.currentTower = tower;
            //tower.towInt();
            tower.addBrix();
            tower.render();
} 

const makeSwordsman = (controller) => {
    let newUnitX = controller.unitX;
    let newUnitY = controller.unitY;
    const newUnit = new Swordsman(`swordsman`, controller.name, controller, newUnitX, newUnitY, controller.affinity, controller.enemy.name, controller.enemy);
    controller.currentUnits.push(newUnit);
    newUnit.render();
    newUnit.unitInt();
}
const makeArcher = (controller) => {
        let newUnitX = controller.unitX;
        let newUnitY = controller.unitY;
        const newUnit = new Archer(`archer`, controller.name, controller, newUnitX, newUnitY, controller.affinity, controller.enemy.name, controller.enemy);
        controller.currentUnits.push(newUnit);
        newUnit.render();
        newUnit.unitInt();
}
const makeDefender = (controller) => {
    let newUnitX = controller.unitX;
    let newUnitY = controller.unitY;
    const newUnit = new Defender(`defender`, controller.name, controller, newUnitX, newUnitY, controller.affinity, controller.enemy.name, controller.enemy);
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

$(`#make-sword`).on('click', () => {
    makeSwordsman(player);
    
});

$(`#make-archer`).on('click', () => {
    console.log(`button clicked`);
    makeArcher(player);
});

$(`#make-defender`).on('click', () => {
    console.log(`button clicked`);
    makeDefender(player);
});

player.enemy= computer;
computer.enemy = player;
gameBoardSetup();
game.int();
makeTower(player);
makeTower(computer);
// setting a delay to the computer
setTimeout(makeDefender, 500, computer);