const game = {
    level: 1,
    timer: 0,
    score: 0,
    board: [[],[],[],[],[]],
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
        player.victory = false;
        computer.victory = false;
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
const defender = {
    hp:             70,
    damage:         20,
    attackSpeed:    200,
    range:          1,
    movementSpeed:  200,
    defense:        6,
}
const archer = {
    hp:             40,
    damage:         20,
    attackSpeed:    100,
    range:          3,
    movementSpeed:  100,
    defense:        0,
}
const swordsman = {
    hp:             100,
    damage:         50,
    attackSpeed:    100,
    range:          1,
    movementSpeed:  60,
    defense:        25,
}
const brick = {
    hp: 75,
    defense: 25,
}
const demon = {
    hp:             50,
    damage:         30,
    attackSpeed:    100,
    range:          1,
    movementSpeed:  100,
    defense:        0,
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
        this.type = `unit`;
        this.unitIntHandler;
        this.target;
        this.currentTarget;
    }
    initInt() {
        this.unitIntHandler = setInterval(this.unitInt.bind(this), 20);
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
    render() {
        const $thisSquare = $(`.square[x='${this.x}'][y='${this.y}']`);
        $thisSquare.removeClass(`${this.controller} ${this.name}`)
        $thisSquare.addClass(`${this.controller} ${this.name}`);
        this.dom = $thisSquare;
    }
    checkRange() { 
        //console.log(`${this.name} checking range`);
        let numOfTargets = 0;
        for (let i = 1; i < this.range + 1; i++) {
            const $theUnit = $(`.square[x='${(i * this.orient) + this.x}'][y='${this.y}']`);
            const theUnitObject = this.targetCheck($theUnit);
            if (theUnitObject === true){
                //console.log(`${this.controller}'s ${this.name} has a target = true`)
                if (this.currentTarget.controller === this.enemy) {
                    this.target = $theUnit;
                    this.inCombat = true;
                    numOfTargets++;
                    break;
                }
            }
        }
        if (numOfTargets > 0) {
            this.attackSpeedCheck();
        } else {
            this.checkMoveSpeed();
        }
    }
    targetCheck(target) {
            const thisTarget = target;
                if (thisTarget.hasClass(`demon`) === true || thisTarget.hasClass(`swordsman`) === true || thisTarget.hasClass(`archer`) === true || thisTarget.hasClass(`defender`) === true) {
                    for (let i = 0; i < this.enemyObject.currentUnits.length; i++) {
                        const thisTargetAttrX = parseInt(thisTarget.attr('x'));
                        if (thisTargetAttrX === this.enemyObject.currentUnits[i].x) {
                            this.currentTarget = this.enemyObject.currentUnits[i];
                            return true;
                        }
                    }
                } else if (thisTarget.hasClass(`tower`))  { 
                    return this.targetTower(target);     
                }
            }
    targetTower(target) {
        const $thisTarget = target;
        for (let i = 0; i < this.enemyObject.currentTower.brix.length; i++ ) {
            const thisTargetAttrX = parseInt($thisTarget.attr(`x`));
            const thisTargetAttrY = parseInt($thisTarget.attr(`y`));
            if (thisTargetAttrX === this.enemyObject.currentTower.brix[i].x && thisTargetAttrY === this.enemyObject.currentTower.brix[i].y) {
                this.currentTarget = this.enemyObject.currentTower.brix[i];
                return true;
                // console.log(target.currentTower[i]);
                //this.attack(this.currentTarget);
            }
        }
    }
    checkMoveSpeed() {
        if (this.timer % this.movementSpeed === 0) {
            this.checkCollision();
        } 
    }
    checkCollision() {
        const $theUnit= $(`.square[x='${(this.orient) + this.x}'][y='${this.y}']`);
        if ($theUnit.hasClass(this.controller) && $theUnit.hasClass(`tower`)) {
            this.move(0);
        } else if ($theUnit.hasClass(this.controller)) {
            this.checkCollisionAhead();
        } else {
            this.move(0);
        }
    }
    checkCollisionAhead() {
        const $theUnit= $(`.square[x='${(this.orient + this.orient) + this.x}'][y='${this.y}']`);
        if ($theUnit.hasClass(this.enemy) === false && $theUnit.hasClass(this.controller) === false) {
            this.move(this.orient);
        } 
    }
    
    move(extra) {
        this.checkVictory();
        if (($(this.dom).hasClass(`tower`) === true) && this.x < 13 && this.x > 0){
            $(`.square[x='${this.x}'][y='${this.y}']`).removeClass(`${this.name}`);
            this.x = this.x + this.orient + extra;
            //this.animateMove();
        }else if(this.x < 13 && this.x > 0) {
            $(`.square[x='${this.x}'][y='${this.y}']`).removeClass(`${this.name} ${this.controller}`);
            this.x = this.x + this.orient + extra;
            //this.animateMove();
        } 
        this.render();
    }

    animateMove() {// experimental method for now
        const xI = this.dom.offset().left;
        const yI = this.dom.offset().top;
        console.log(this);
        $(this.image).animate({
            left: xI,
            top: yI
        }, 250);
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
        console.log(`${this.name} is targting ${target}`);
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
            console.log(`using attackKillCheck on ${target.controller}'s ${target.name}`);
            target.isAlive=false;
            this.inCombat=false;
            game.score++;
            $('#score-board').text(`Score: ${game.score}`);
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
            this.attack(this.currentTarget);
        } 
    }
    death() {
        console.log(`${this.controller}'s ${this.name} is proclaimed dead by the death(); function!`);
        $(`.square[x='${this.x}'][y='${this.y}']`).removeClass(`${this.name} ${this.controller}`);
        const thisIndex = this.controllerObject.currentUnits.indexOf(this);
        this.controllerObject.currentUnits.splice(thisIndex, 1);
    }
    checkVictory() {
        if (this.x === this.enemyObject.unitX) {
            this.controllerObject.victory = true;
            clearInterval(this.unitIntHandler);
            clearInterval(computer.aiInt);
            alert(`${this.controller} has won!`)
            this.levelComplete();
        } else if (this.controllerObject.victory === true || this.enemyObject.victory === true) {
            clearInterval(this.unitIntHandler);
            clearInterval(computer.aiInt);
            this.death();
        }
    }
    levelComplete() {
        game.level++;
        $(`#current-level`).text(`Level: ${game.level}`);
        demon.hp= demon.hp + 2;
        demon.damage= demon.damage + 1;
        $(`#next-level`).prop('disabled', false);
        //setTimeout(game.resetBoard, 20);
    }
}

class Swordsman extends Fighter {
    constructor(name, controller, controllerObject, x, y, orient, enemy, enemyObject) {
        super(name, controller, controllerObject, x, y, orient, enemy, enemyObject)
        this.hp =             swordsman.hp;
        this.damage =         swordsman.damage;
        this.attackSpeed =    swordsman.attackSpeed;
        this.range =          swordsman.range;
        this.movementSpeed =  swordsman.movementSpeed;
        this.defense =        swordsman.defense;
        this.image = '<div class="swordsmanImage"></div>'
    }
}

class Archer extends Fighter {
    constructor(name, controller, controllerObject, x, y, orient, enemy, enemyObject) {
        super(name, controller, controllerObject, x, y, orient, enemy, enemyObject)
        this.hp =             archer.hp;
        this.damage =         archer.damage;
        this.attackSpeed =    archer.attackSpeed;
        this.range =          archer.range;
        this.movementSpeed =  archer.movementSpeed;
        this.defense =        archer.defense;
    }
}

class Defender extends Fighter {
    constructor(name, controller, controllerObject, x, y, orient, enemy, enemyObject) {
        super(name, controller, controllerObject, x, y, orient, enemy, enemyObject)
        this.hp =             defender.hp;
        this.damage =         defender.damage;
        this.attackSpeed =    defender.attackSpeed;
        this.range =          defender.range;
        this.movementSpeed =  defender.movementSpeed;
        this.defense =        defender.defense;
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
        this.type = 'tower';
        this.hp =       brick.hp;
        this.defense =  brick.defense;
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
    newUnit.dom.append(newUnit.image);
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
        const $thisRow = $(`<div/>`).appendTo(`.game-board`).addClass(`row`);
            for (let x = 1; x < 13; x++) {
                $(`<div/>`).attr({x: `${x}`, y: `${y}`}).addClass(`col-1 square`).appendTo($thisRow);
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
    clearInterval(aiInt);
    $(`.game-board`).html(``);
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
const aiIntervalSet = () => {
    i = setInterval(compUnits, 10000);
    return i;
}
const setIntervals = () => {
    aiInt = aiIntervalSet();
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
            buttonSword();
        }else if($($thisButton).attr(`id`) === `make-archer`) {
            buttonArcher();
        }else if($($thisButton).attr(`id`) === `make-defender`) {
            buttonDefender();
        }else if($($thisButton).attr(`id`)=== `next-level`) {
            game.resetBoard();
            $(`#next-level`).prop(`disabled`, true);
        }  
    }
});
$(`.wrapper`).on('click', function(e) {
    if (e.target.tagName === 'BUTTON'){
        const $thisButton = $(e.target)[0];
        if ($($thisButton).attr(`id`) === 'swordsman-hp-up'){
            console.log(`button was clicked`);
            research.swordsman.hp.hpUp();
        } else if ($($thisButton).attr(`id`) === 'make-sword') {
            console.log(`button was clicked`);
            buttonSword();
        }else if($($thisButton).attr(`id`) === `make-archer`) {
            buttonArcher();
        }else if($($thisButton).attr(`id`) === `make-defender`) {
            buttonDefender();
        }else if($($thisButton).attr(`id`)=== `next-level`) {
            game.resetBoard();
            $(`#next-level`).prop(`disabled`, true);
        }  
    }
});
const research = {
    researchProgress: 0,
    swordsman: {
        hp: {
            cost: 5,
            hpUp() {
                console.log(`got to HpUp`);
                if(game.score > 4) {
                    console.log(`paid 5g`);
                    game.score = game.score - this.cost;
                    // console.log(`spent 5g on upgrade`);
                    // swordsman.hp = swordsman.hp + 10;
                    // console.log(`upgraded swordsman hp! Now has ${swordsman.hp}`);
                    this.hpUpInterval();
                }
            },
            hpUpInterval() {
                console.log(`in the interval`);
                console.log(research.researchProgress);
                while (research.researchProgress < 101) {
                    console.log(`in the while loop`);
                    setTimeout(function(){
                        research.researchProgress+=25;
                        console.log(`Research Progress: ${research.researchProgress}%`);
                    }, 2000);
                }
                swordsman.hp+= 10;
                research.researchProgress = 0;
            }
        }
    }
}
startGame();