const game = {
    level: 1,
    timer: 0,
    int() {
        setInterval(() =>{
            this.timer++;
        }, 1000);
    },
    resetBoard() {
        
        player.currentUnits=[];
        computer.currentUnits=[];
        player.currentTower= [];
        computer.currentTower= [];
        
        clearInterval(aiInt);
        $(`.game-board`).html(``);
        console.log(`about to start level ${this.level}`);
        setTimeout(resetGame, 20);
    }
};
const player = {
    ID:   ``,
    name: `player`,
    towerX: 2,
    towerY: 1,
    unitX:  1,
    unitY:  1,
    affinity: 1,
    towerLevel: 4,
    currentUnits: [],
    currentTower: [],
    victory: false,
}
const computer = {
    ID:   `Roberto Roboto`,
    name: `computer`,
    towerX: 12,
    towerY: 1,
    unitX:  12,
    unitY:  1,
    affinity: -1,
    towerLevel: 4,
    currentUnits: [],
    currentTower: [],
    victory: false,
    aiInt: 0,
}
const demon = {
    hp:             5,
    damage:         2,
    attackSpeed:    250,
    range:          1,
    movementSpeed:  250,
    defense:        0,
    accuracy:       .6,
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
        this.dom;
    }
    
}

class Fighter extends Unit {
    constructor(name, controller, controllerObject, x, y, orient, enemy, enemyObject) {
        super(name, controller, controllerObject, x, y, orient, enemy, enemyObject)
        this.timer= 0;
        this.inCombat = false;
        this.unitIntHandler;
        this.target;
        this.currentTarget;
    }

    render() {
        const $thisSquare = $(`.square[x='${this.x}'][y='${this.y}']`);
        $thisSquare.addClass(`${this.controller} ${this.name}`);
        $thisSquare.attr(`controller`, this.controller);
        console.log($thisSquare.attr(`controller`));
        this.dom = $thisSquare;
        console.log(this.dom.attr(`controller`));
    }
    checkMoveSpeed() {
        if (this.timer % this.movementSpeed === 0) {
            this.checkCollision();
        } 
    }

    checkRange() { 
        let numOfTargets = 0;
        for (let i = 1; i < this.range + 1; i++) {
            const $theUnit = $(`.square[x='${(i * this.orient) + this.x}'][y='${this.y}']`);
            if ($theUnit.attr(this.enemy)) {
                this.target = $theUnit;
                this.inCombat = true;
                numOfTargets++;
                break;
            }
        }
        if (numOfTargets > 0) {
            this.attackSpeedCheck();
        } else {
            this.checkMoveSpeed();
        }
            
    }
    checkCollision() {
        const $theUnit= $(`.square[x='${(this.orient) + this.x}'][y='${this.y}']`);
        if ($theUnit.attr(this.controller) && $theUnit.hasClass(`tower`)) {
            this.move(0);
        } else if ($theUnit.hasClass(this.controller)) {
            this.checkCollisionAhead();
        } else {
            this.move(0);
        }
    }
    checkCollisionAhead() {
        console.log(`checking collision ahead`);
        const $theUnit= $(`.square[x='${(this.orient + this.orient) + this.x}'][y='${this.y}']`);
        if ($theUnit.hasClass(this.enemy) === false && $theUnit.hasClass(this.controller) === false) {
            this.move(this.orient);
        } 
    }
    
    move(extra) {
        if (($(this.dom).hasClass(`tower`) === true) && this.x < 13 && this.x > 0){
            console.log(`inside the tower if check`);
            $(`.square[x='${this.x}'][y='${this.y}']`).removeClass(`${this.name}`);
            this.checkVictory();
            this.x = this.x + this.orient + extra;
            this.render();
        }else if(this.x < 13 && this.x > 0) {
            $(`.square[x='${this.x}'][y='${this.y}']`).removeClass(`${this.name} ${this.controller}`);
            this.checkVictory();
            this.x = this.x + this.orient + extra;
            this.render();
            
        } 
    }
    
    initInt() {
        this.unitIntHandler = setInterval(this.unitInt.bind(this), 1);
    }
    unitInt() {
        if(this.isAlive === true){
            this.checkRange();
        }   else {
            this.death();
            clearInterval(this.unitIntHandler);
        }
        this.timer++; 
        this.checkVictory();
    }
    checkVictory() {
        if (this.x === this.enemyObject.unitX) {
            this.controllerObject.victory = true;
            clearInterval(this.unitIntHandler);
            alert(`${this.controller} has won!`)
            this.levelComplete();
        } else if (this.controllerObject.victory === true || this.enemyObject.victory === true) {
            clearInterval(this.unitIntHandler);
            this.death();
        }
    }
    levelComplete() {
        game.level++;
        demon.hp= demon.hp + 2;
        demon.damage= demon.damage + 1;
        //setTimeout(game.resetBoard, 20);
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
        if (this.timer % this.attackSpeed === 0) {
            this.targetCheck(this.enemyObject);
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
        this.attackSpeed =    250;
        this.range =          1;
        this.movementSpeed =  250;
        this.defense =        1;
        this.accuracy =       .6;
    }
}

class Archer extends Fighter {
    constructor(name, controller, controllerObject, x, y, orient, enemy, enemyObject) {
        super(name, controller, controllerObject, x, y, orient, enemy, enemyObject)
        this.hp =             5;
        this.damage =         3;
        this.attackSpeed =    250;
        this.range =          3;
        this.movementSpeed =  250;
        this.defense =        0;
        this.accuracy =       .6;
    }
}

class Defender extends Fighter {
    constructor(name, controller, controllerObject, x, y, orient, enemy, enemyObject) {
        super(name, controller, controllerObject, x, y, orient, enemy, enemyObject)
        this.hp =             20;
        this.damage =         0;
        this.attackSpeed =    250;
        this.range =          1;
        this.movementSpeed =  250;
        this.defense =        2;
        this.accuracy =       .6;
    }
}

class Demon extends Fighter {
    constructor(name, controller, controllerObject, x, y, orient, enemy, enemyObject) {
        super(name, controller, controllerObject, x, y, orient, enemy, enemyObject)
        this.hp =             demon.hp;
        this.damage =         demon.damage;
        this.attackSpeed =    demon.attackSpeed;
        this.range =          demon.range;
        this.movementSpeed =  demon.movementSpeed;
        this.defense =        demon.defense;
        this.accuracy =       demon.accuracy;
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
        $($(`.square[x='${this.x}'][y='${this.y}']`)).removeClass(`${this.controller} tower`);
        this.moveBricks();
    }
    moveBricks() {
        const thisX = this.x;
        const brickArr = this.controllerObject.currentTower.brix;
        for (let i = 0; i < brickArr.length; i++) {
            if (brickArr[i].x === thisX) {
                const thisBrix = brickArr[i];
                $($(`.square[x='${thisBrix.x}'][y='${thisBrix.y}']`)).removeClass(`${this.controller} tower`);
                thisBrix.y--;
                $($(`.square[x='${thisBrix.x}'][y='${thisBrix.y}']`)).addClass(`${this.controller} tower`);
            }
        }
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
    newUnit.initInt();
}

const makeArcher = (controller) => {
        let newUnitX = controller.unitX;
        let newUnitY = controller.unitY;
        const newUnit = new Archer(`archer`, controller.name, controller, newUnitX, newUnitY, controller.affinity, controller.enemy.name, controller.enemy);
        controller.currentUnits.push(newUnit);
        newUnit.render();
        newUnit.initInt();
       
}

const makeDefender = (controller) => {
    let newUnitX = controller.unitX;
    let newUnitY = controller.unitY;
    const newUnit = new Defender(`defender`, controller.name, controller, newUnitX, newUnitY, controller.affinity, controller.enemy.name, controller.enemy);
    controller.currentUnits.push(newUnit);
    newUnit.render();
    newUnit.initInt();
}

const makeDemon = (controller) => {
    let newUnitX = controller.unitX;
    let newUnitY = controller.unitY;
    const newUnit = new Demon(`demon`, controller.name, controller, newUnitX, newUnitY, controller.affinity, controller.enemy.name, controller.enemy);
    controller.currentUnits.push(newUnit);
    newUnit.render();
    newUnit.initInt();
}

const gameBoardSetup = () => {
    for (let y = 5; y > 0; y--) {
        const $thisRow = $(`<div/>`).appendTo(`.game-board`);
            for (let x = 1; x < 13; x++) {
                $(`<div/>`).attr({x: `${x}`, y: `${y}`}).addClass(`square`).appendTo($thisRow);
            }
    }
}

const startGame = () => {
    gameBoardSetup();
    player.enemy= computer;
    computer.enemy = player;
    game.int();
    makeTower(player);
    makeTower(computer);
    setIntervals();
    // buttonsOn();
}
const resetGame = () => {
    gameBoardSetup();
    makeTower(player);
    makeTower(computer);
    player.victory = false;
    computer.victory = false;
    setIntervals();
}

const compUnits = () => {
    if (game.level === 1) {
        makeDemon(computer);
    } else if (game.level === 2) {
        const ranNum = Math.floor(Math.random() * 2) + 1;
        if (ranNum === 1) {
            makeDemon(computer);
        } else {
            makeArcher(computer);
        }
    } else {
        makeDemon(computer);
        makeArcher(computer);
    }
}

const compRandomUnits = () => {
    const ranNum = Math.floor(Math.random() * 3) + 1;
    console.log(ranNum);
    if (ranNum === 1) {
        makeSwordsman(computer);
    } else if (ranNum === 2) {
        makeArcher(computer);
    } else {
        makeDefender(computer);
    }
}
const aiIntervalSet = () => {
    i = setInterval(compUnits, 10000);
    return i;
}
const setIntervals = () => {
    aiInt = aiIntervalSet();
}
const clearIntervals = ()=>{

}

const buttonDefender = () => {
    makeDefender(player);
    $(`#make-defender`).prop(`disabled`, true);
    setTimeout(function () {
        $(`#make-defender`).prop(`disabled`, false);
    }, 5000)
}
const buttonSword = () => {
    makeSwordsman(player);
    $(`#make-sword`).prop(`disabled`, true);
    setTimeout(function () {
        $(`#make-sword`).prop(`disabled`, false);
    }, 5000)
}
const buttonArcher = () => {
    makeArcher(player);
    $(`#make-archer`).prop(`disabled`, true);
    setTimeout(function () {
        $(`#make-archer`).prop(`disabled`, false);
    }, 5000)
}

    $(`body`).on('click', function(e) {
    if (e.target.tagName === 'BUTTON'){
        const $thisButton = $(e.target)[0];
        if ($($thisButton).attr('id') === 'start-game'){
            // startGame();
        } else if ($($thisButton).attr(`id`) === 'make-sword') {
            console.log(`button was clicked`);
            buttonSword();
        }else if($($thisButton).attr(`id`) === `make-archer`) {
            buttonArcher();
        }else if($($thisButton).attr(`id`) === `make-defender`) {
            buttonDefender();
        }else if($($thisButton).attr(`id`)=== `next-level`) {
            game.resetBoard();
        }  
    }
});


startGame();



