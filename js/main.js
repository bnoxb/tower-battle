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
        this.damage =         3;
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
    checkCollision() { // this is the method that starts the targetCheck and attack sequence
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
        if(this.x < 11 && this.x > 1) {
            $(`.square[x='${this.x}'][y='${this.y}']`).removeClass(`fighter ${this.controller}`);
            this.x = this.x + this.orient;
            this.render();
        } 
    }
    // this function with an Interval starts the move checks and ultimately the units moving.
    unitInt() {
        const unitInterval = setInterval(()=>{
            if(this.isAlive === true && this.inCombat === true){
                    console.log(`${this.controller} is alive`);
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
        const thisTarget = this.target;
        const targetInEnemyArray = target.currentUnits[0];
        for (let i = 0; i < target.currentUnits.length; i++) {
            let thisTargetAttr = parseInt(thisTarget.attr('x'));
            if (thisTargetAttr === target.currentUnits[i].x) {
                this.currentTarget = targetInEnemyArray;
                this.attack(targetInEnemyArray);
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
            console.log(`using attackKillCheck on ${target.controller}`);
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
// setting a delay to the computer
setTimeout(makeFighter, 500, computer);