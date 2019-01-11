const game = {
    unitCount: 0,
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
        clearInterval(computer.aiInt);
        player.victory = false;
        computer.victory = false;
        setTimeout(resetGame, 20);
        $(`.game-board`).html(``);
    }
};
const flyInVelocity = (offsetX, offsetY) => {
    $.Velocity.RegisterEffect(`transition.flyIn`, {
     defaultDuration: 700,
     calls:[
       [{
            left: offsetX,
            top: offsetY,
            opacity: 1,
       }]  
     ],  
 });
}
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
const boss = {
    hp:             500,
    damage:         70,
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
        this.targetX;
        this.$statsBar;
        this.dom;
    }
    
}

class Fighter extends Unit {
    constructor(name, controller, controllerObject, x, y, orient, enemy, enemyObject) {
        super(name, controller, controllerObject, x, y, orient, enemy, enemyObject)
        this.timer= 0;
        this.inCombat = false;
        this.type = `unit`;
        this.unitId;
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
        this.unitId = game.unitCount;
        const $thisSquare = $(`.square[x='${this.x}'][y='${this.y}']`);
        $thisSquare.removeClass(`${this.controller} ${this.name} ${this.name}-gif`);
        $thisSquare.addClass(`${this.controller} ${this.name}`);
        
        this.dom = $thisSquare;
    }
    makeDivImage() { // Needs work**
        const offsetX = $thisSquare.offset().left;
        const offsetY = $thisSquare.offset().top;
        $(`.game-board`).append(`<div class="col-1 ${this.name}Image" id="${game.unitCount}"></div>`);
        $(`#${this.unitId}`).css({
            left: offsetX,
            top: offsetY
        });
    }
    renderStatsBar(damageDealt, targetX) {
        this.$statsBar = $(`<div class="stats-bar" id="${targetX}">${damageDealt}</div>`);
        const $thisY = this.y;
        const $thisX = this.x;
        const $thisSquareUpOne = $(`.square[x='${targetX}'][y=${$thisY + 1}]`);// need to add class to this
        $thisSquareUpOne.append(this.$statsBar);
        $(`#${targetX}`).velocity("transition.slideUpOut", {
            duration: 750,
            complete: function(){
            $(`div#${targetX}`).remove();
            }
        });
        
    }
    checkRange() { 
        let numOfTargets = 0;
        for (let i = 1; i < this.range + 1; i++) {
            const $theUnit = $(`.square[x='${(i * this.orient) + this.x}'][y='${this.y}']`);
            const theUnitObject = this.targetCheck($theUnit);
            if (theUnitObject === true){
                if (this.currentTarget.controller === this.enemy) {
                    this.targetX = $theUnit.attr(`x`);
                    this.target = $theUnit;
                    this.inCombat = true;
                    numOfTargets++;
                    break;
                }
            }
        }
        this.moveOrAttack(numOfTargets);
    }
    moveOrAttack(numOfTargets){
        if (numOfTargets > 0) {
            this.attackSpeedCheck();
        } else {
            this.checkMoveSpeed();
        }
    }
    targetCheck(target) {
            const thisTarget = target;
            let falseCounter = 0;
                if (thisTarget.hasClass(`demon`) === true || thisTarget.hasClass(`swordsman`) === true || thisTarget.hasClass(`archer`) === true || thisTarget.hasClass(`defender`) === true || thisTarget.hasClass(`boss`) === true) {
                    for (let i = 0; i < this.enemyObject.currentUnits.length; i++) {
                        const thisTargetAttrX = parseInt(thisTarget.attr('x'));
                        if (thisTargetAttrX === this.enemyObject.currentUnits[i].x) {
                            this.currentTarget = this.enemyObject.currentUnits[i];
                            return true;
                        } else {
                            falseCounter++;
                        }
                    }
                } else if (thisTarget.hasClass(`tower`))  { 
                    return this.targetTower(thisTarget);     
                } else {
                    return false;
                } 
                return this.falseCounterCheckUnits(falseCounter);  
        }
    targetCheckFriendly(target) {
        const thisTarget = target;
        let falseCounter = 0;
            if (thisTarget.hasClass(`demon`) === true || thisTarget.hasClass(`swordsman`) === true || thisTarget.hasClass(`archer`) === true || thisTarget.hasClass(`defender`) === true || thisTarget.hasClass(`boss`) === true) {
                for (let i = 0; i < this.controllerObject.currentUnits.length; i++) {
                    const thisTargetAttrX = parseInt(thisTarget.attr('x'));
                    if (thisTargetAttrX === this.controllerObject.currentUnits[i].x) {
                        this.currentTarget = this.controllerObject.currentUnits[i];
                        return true;
                    } else {
                        falseCounter++;
                    }
                }
            } else if (thisTarget.hasClass(`tower`))  { 
                return this.targetTower(thisTarget);     
            } else {
                return false;
            } 
            return this.falseCounterCheckFriendlyUnits(falseCounter);  
    }
    targetTower(target) {
        const $thisTarget = target;
        let falseCounter = 0;
        if($thisTarget.hasClass(`tower`)) {
            for (let i = 0; i < this.enemyObject.currentTower.brix.length; i++ ) {
            const thisTargetAttrX = parseInt($thisTarget.attr(`x`));
            const thisTargetAttrY = parseInt($thisTarget.attr(`y`));
            if (thisTargetAttrX === this.enemyObject.currentTower.brix[i].x && thisTargetAttrY === this.enemyObject.currentTower.brix[i].y) {
                this.currentTarget = this.enemyObject.currentTower.brix[i];
                return true;
            } else {
                falseCounter++;
            }
        }
        } else {
            return false;
        }
        return this.falseCounterCheckTower(falseCounter);
    }
    falseCounterCheckUnits(falseCounter) {
        if (falseCounter >= this.enemyObject.currentUnits.length) {
            return false;
        } else {
            return true;
        }
    }
    falseCounterCheckFriendlyUnits(falseCounter) {
        if (falseCounter >= this.controllerObject.currentUnits.length) {
            return false;
        } else {
            return true;
        }
    }
    falseCounterCheckTower(falseCounter) {
        if (falseCounter >= this.enemyObject.currentTower.brix.length) {
            return false;
        } else {
            return true;
        }
    }
    checkMoveSpeed() {
        if (this.timer % this.movementSpeed === 0) {
            this.checkCollision();
        } 
    }
    checkCollision() {
        const $theUnit= $(`.square[x='${(this.orient) + this.x}'][y='${this.y}']`);
        const $isBrickThere = this.targetTower($theUnit);
        const $theEnemyUnitObject = this.targetCheck($theUnit);
        const $theFriendlyUnitObject = this.targetCheckFriendly($theUnit);
        if (($isBrickThere === false) && ($theEnemyUnitObject === false) && ($theFriendlyUnitObject === false)){
            if ($theUnit.hasClass(this.controller) ===true && $theUnit.hasClass(`tower`) === true && $theUnit.hasClass(`${this.enemy}`) === false) {
                this.move(0);
            } else {
                this.move(0);
            }
        } else if($theFriendlyUnitObject === true) {
            this.checkCollisionAhead();
        }
    }
    checkCollisionAhead() {
        const $theUnit= $(`.square[x='${(this.orient + this.orient) + this.x}'][y='${this.y}']`);
        const $isBrickThere = this.targetTower($theUnit);
        const $theEnemyUnitObject = this.targetCheck($theUnit);
        const $theFriendlyUnitObject = this.targetCheckFriendly($theUnit);
        if ($isBrickThere === false && $theFriendlyUnitObject === false && $theEnemyUnitObject === false) {
            this.move(this.orient);
        }
    }
    move(extra) {
        this.checkVictory();
        if (($(this.dom).hasClass(`tower`) === true) && this.x < 13 && this.x > 0){
            $(`.square[x='${this.x}'][y='${this.y}']`).removeClass(`${this.name} ${this.name}-gif`);
            this.x = this.x + this.orient + extra;
            //this.animateMove();
        }else if(this.x < 13 && this.x > 0) {
            $(`.square[x='${this.x}'][y='${this.y}']`).removeClass(`${this.name} ${this.controller} ${this.name}-gif`);
            this.x = this.x + this.orient + extra;
            //this.animateMove();
        } 
        this.render();
    }
    animateMove() { // Needs work
        console.log(`in the animateMove`);
        const xI = $(`.square[x="${this.x}"][y="${this.y}"]`).offset().left;
        const yI = $(`.square[x="${this.x}"][y="${this.y}"]`).offset().top;
        console.log(xI);
        $(`.${this.name}Image#${this.unitId}`).animate({
            left: xI,
            top: yI
        }, 1000, function(){
            console.log(`animation complete`);
        });
    }
    computeActualDamage (target) {
        if (this.damage === 0) {
            return 0;
        } else {
            const actualDamage = this.damage - target.defense;
            if(actualDamage > 0){
                return actualDamage;
            }else {
                return 0;
            }
        }
    }
    attack(target) {
        if (target.hp > 0) {
            const actualDamage = this.computeActualDamage(target);
            target.hp = target.hp - actualDamage;
            this.dom.addClass(`${this.name}-gif`);
            this.renderStatsBar(actualDamage, target.x);
            this.attackKillCheck(target);
            // if($(this.dom).hasClass(`archer`)) {
            //     this.flyArrow(target);
            // }
        }   else if (target.isAlive === true) {
                target.isAlive = false;
                this.inCombat = false;
        } else {
            this.attackDieCheck(target);
            this.attackKillCheck(target);
        }
    }

    flyArrow(target) { // another work in progress animation
        const newX = this.currentTarget.x;
        const newY = this.currentTarget.y;
        const offsetX = $(`.square[x="${newX}"][y="${newY}"]`).offset().left;
        const offsetY = $(`.square[x="${newX}"][y="${newY}"]`).offset().top;
        const $arrow = $(`<img id="arrow" src="./images/arrow.png">`);
        flyInVelocity(offsetX, offsetY);
        $(this.dom).append($arrow);
        $(`img#arrow`).velocity('transition.flyIn');
        
    }
    attackAnimate() {

    }
    attackKillCheck(target) {
        if (target.hp < 1) {
            target.isAlive=false;
            this.inCombat=false;
            game.score++;
            $('#score-board').text(`Gold: ${game.score}`);
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
            this.dom.removeClass(`${this.name}-gif`);
            this.attack(this.currentTarget);
        } 
    }
    death() {
        $(`.square[x='${this.x}'][y='${this.y}']`).removeClass(`${this.name} ${this.controller} ${this.name}-gif`);
        const thisIndex = this.controllerObject.currentUnits.indexOf(this);
        this.controllerObject.currentUnits.splice(thisIndex, 1);
    }
    checkVictory() {
        if (this.x === this.enemyObject.unitX) {
            this.controllerObject.victory = true;
            clearInterval(this.unitIntHandler);
            clearInterval(computer.aiInt);
            alert(`${this.controller} has beat level ${game.level}!`);
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
        clearInterval(computer.aiInt())
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
    }
}
class Boss extends Fighter {
    constructor(name, controller, controllerObject, x, y, orient, enemy, enemyObject) {
        super(name, controller, controllerObject, x, y, orient, enemy, enemyObject)
        this.hp =             boss.hp;
        this.damage =         boss.damage;
        this.attackSpeed =    boss.attackSpeed;
        this.range =          boss.range;
        this.movementSpeed =  boss.movementSpeed;
        this.defense =        boss.defense;
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
    game.unitCount++;
}

const makeArcher = (controller) => {
        let newUnitX = controller.unitX;
        let newUnitY = controller.unitY;
        const newUnit = new Archer(`archer`, controller.name, controller, newUnitX, newUnitY, controller.affinity, controller.enemy.name, controller.enemy);
        controller.currentUnits.push(newUnit);
        newUnit.render();
        newUnit.initInt();
        game.unitCount++;
}

const makeDefender = (controller) => {
    let newUnitX = controller.unitX;
    let newUnitY = controller.unitY;
    const newUnit = new Defender(`defender`, controller.name, controller, newUnitX, newUnitY, controller.affinity, controller.enemy.name, controller.enemy);
    controller.currentUnits.push(newUnit);
    newUnit.render();
    newUnit.initInt();
    game.unitCount++;    
}

const makeDemon = (controller) => {
            let newUnitX = controller.unitX;
            let newUnitY = controller.unitY;
            const newUnit = new Demon(`demon`, controller.name, controller, newUnitX, newUnitY, controller.affinity, controller.enemy.name, controller.enemy);
            controller.currentUnits.push(newUnit);
            newUnit.render();
            newUnit.initInt();
            game.unitCount++;
}
const makeBoss = (controller) => {
    let newUnitX = controller.unitX;
    let newUnitY = controller.unitY;
    const newUnit = new Boss(`boss`, controller.name, controller, newUnitX, newUnitY, controller.affinity, controller.enemy.name, controller.enemy);
    controller.currentUnits.push(newUnit);
    newUnit.render();
    newUnit.initInt();
    game.unitCount++;
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
    $(`body`).css('background-image', 'url("./images/forest-dark-background.jpg")');
    gameBoardSetup();
    player.enemy= computer;
    computer.enemy = player;
    game.int();
    makeTower(player);
    makeTower(computer);
    research.initInt();
    setIntervals();
    // buttonsOn();
}
const resetGame = () => {
    gameBoardSetup();
    makeTower(player);
    makeTower(computer);
    clearInterval(computer.aiInt);
    if (game.level % 5 === 0) {
        alert(`starting boss level!`);
        makeBoss(computer);
    }else{
        makeTower(player);
        makeTower(computer);
        setIntervals(); 
    }
    
}
const compUnits = () => {
    if (game.level === 1) {
        makeDemon(computer);
    } else if (game.level === 2) {
        const ranNum = Math.floor(Math.random() * 2) + 1;
        if (ranNum === 1) {
            makeDemon(computer);
        } else {
            makeDemon(computer);
            makeDemon(computer);
        }
    } else {
        makeDemon(computer);
        makeDemon(computer);
    }
}
const aiIntervalSet = () => {
    i = setInterval(compUnits, 10000);
    return i;
}
const setIntervals = () => {
    computer.aiInt = aiIntervalSet();
    
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
            renderGameToDom();
            startGame();
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
$(`body`).on('click', function(e) {
    if (e.target.tagName === 'BUTTON'){
        const $thisButton = $(e.target)[0];
        if ($($thisButton).hasClass(`sword-up`)) {
            swordsmanUpgrades.whichButton($thisButton);
        } else if ($($thisButton).hasClass(`archer-up`)) {
            archerUpgrades.whichButton($thisButton);
        }else if ($($thisButton).hasClass(`defender-up`)) {
            defenderUpgrades.whichButton($thisButton);
        }
    }
});
const research = {
    researchProgress: 0,
    currentResearch: 'Research: none',
    timer: 0,
    researchIntHandler: 0,
    initInt() {
        this.researchIntHandler = setInterval(this.researchInt(), 1000);
    },
    researchInt() {
        this.timer++; 
    }
}
const swordsmanUpgrades = {
    hp: {
        hpIntHandler: 0,
        cost: 5,
        hpUp() {
            if(research.currentResearch === 'Research: none'){
                if(game.score > 4) {
                    console.log(`paid 5g`);
                    research.currentResearch = `Swordsman HP`;
                    game.score = game.score - this.cost;
                    this.render();
                    this.hpInt();
                } else {
                    console.log(`you cant afford that.`);
                }
            }else {
                console.log(`you are already researching something`);
            }
        },
        hpUpResearchSpeed() {
            if(research.timer % 10) {
                this.hpUpFunction();
            }
        },
        hpUpFunction() {
            if(research.researchProgress < 100) {
                research.researchProgress+=10;
                this.render();
            } else {
                console.log(`research complete`);
                swordsman.hp+= 10;
                research.researchProgress = 0;
                research.currentResearch = `Research: none`;
                this.render();
                clearInterval(this.hpIntHandler);
            }  
        }, 
        hpInt() {
                this.hpIntHandler = this.hpIntSet();
        },
        hpIntSet() {
                i = setInterval(this.hpUpResearchSpeed.bind(this), 2000);
                return i;
        },
        render() {
            $(`.research-bar`).css(`width`, research.researchProgress+ "%").attr(`aria-valuenow`, research.researchProgress);
            $(`.research-bar`).text(research.currentResearch);
            $('#score-board').text(`Gold: ${game.score}`);
        }
    },
    defense: {
        defenseIntHandler: 0,
        cost: 5,
        defenseUp() {
            if(research.currentResearch === 'Research: none'){
                if(game.score > 4) {
                    console.log(`paid 5g`);
                    research.currentResearch = `Swordsman Defense`;
                    game.score = game.score - this.cost;
                    this.render();
                    this.defenseInt();
                } else {
                    console.log(`you cant afford that.`);
                }
            }else {
                console.log(`you are already researching something`);
            }
        },
        defenseUpResearchSpeed() {
            if(research.timer % 10) {
                this.defenseUpFunction();
            }
        },
        defenseUpFunction() {
            if(research.researchProgress < 100) {
                research.researchProgress+=10;
                this.render();
            } else {
                console.log(`research complete`);
                swordsman.defense+= 5;
                research.researchProgress = 0;
                research.currentResearch = `Research: nonenone`;
                this.render();
                clearInterval(this.defenseIntHandler);
            }  
        }, 
        defenseInt() {
                this.defenseIntHandler = this.defenseIntSet();
        },
        defenseIntSet() {
                i = setInterval(this.defenseUpResearchSpeed.bind(this), 2000);
                return i;
        },
        render() {
            $(`.research-bar`).css(`width`, research.researchProgress+ "%").attr(`aria-valuenow`, research.researchProgress);
            $(`.research-bar`).text(research.currentResearch);
            $('#score-board').text(`Gold: ${game.score}`);
        }
    },
    damage: {
        damageIntHandler: 0,
        cost: 5,
        damageUp() {
            if(research.currentResearch === 'Research: none'){
                if(game.score > 4) {
                    console.log(`paid 5g`);
                    research.currentResearch = `Swordsman damage`;
                    game.score = game.score - this.cost;
                    this.render();
                    this.damageInt();
                } else {
                    console.log(`you cant afford that.`);
                }
            }else {
                console.log(`you are already researching something`);
            }
        },
        damageUpResearchSpeed() {
            if(research.timer % 10) {
                this.damageUpFunction();
            }
        },
        damageUpFunction() {
            if(research.researchProgress < 100) {
                research.researchProgress+=10;
                this.render();
            } else {
                console.log(`research complete`);
                swordsman.damage+= 10;
                research.researchProgress = 0;
                research.currentResearch = `Research: none`;
                this.render();
                clearInterval(this.damageIntHandler);
            }  
        }, 
        damageInt() {
                this.damageIntHandler = this.damageIntSet();
        },
        damageIntSet() {
                i = setInterval(this.damageUpResearchSpeed.bind(this), 2000);
                return i;
        },
        render() {
            $(`.research-bar`).css(`width`, research.researchProgress+ "%").attr(`aria-valuenow`, research.researchProgress);
            $(`.research-bar`).text(research.currentResearch);
            $('#score-board').text(`Gold: ${game.score}`);
        }
    },
    attackSpeed: {
        attackSpeedIntHandler: 0,
        cost: 20,
        attackSpeedUp() {
            if(research.currentResearch === 'Research: none'){
                if(game.score > 19) {
                    console.log(`paid 20g`);
                    research.currentResearch = `Swordsman Attack Speed`;
                    game.score = game.score - this.cost;
                    this.render();
                    this.attackSpeedInt();
                } else {
                    console.log(`you cant afford that.`);
                }
            }else {
                console.log(`you are already researching something`);
            }
        },
        attackSpeedUpResearchSpeed() {
            if(research.timer % 2) {
                this.attackSpeedUpFunction();
            }
        },
        attackSpeedUpFunction() {
            if(research.researchProgress < 100) {
                research.researchProgress+=1;
                this.render();
            } else {
                console.log(`research complete`);
                swordsman.attackSpeed-= 15;
                research.researchProgress = 0;
                research.currentResearch = `Research: none`;
                this.render();
                clearInterval(this.attackSpeedIntHandler);
            }  
        }, 
        attackSpeedInt() {
                this.attackSpeedIntHandler = this.attackSpeedIntSet();
        },
        attackSpeedIntSet() {
                i = setInterval(this.attackSpeedUpResearchSpeed.bind(this), 500);
                return i;
        },
        render() {
            $(`.research-bar`).css(`width`, research.researchProgress+ "%").attr(`aria-valuenow`, research.researchProgress);
            $(`.research-bar`).text(research.currentResearch);
            $('#score-board').text(`Gold: ${game.score}`);
        }
    },
    whichButton(target){
        if($(target).attr(`id`)===`swordsman-hp-up`){
            this.hp.hpUp();
        } else if ($(target).attr(`id`)===`swordsman-defense-up`) {
            this.defense.defenseUp();
        } else if ($(target).attr(`id`)===`swordsman-damage-up`) {
            this.damage.damageUp();
        } else if ($(target).attr(`id`)===`swordsman-attack-speed-up`) {
            this.attackSpeed.attackSpeedUp();
        }
    }
}
const archerUpgrades = {
    hp: {
        hpIntHandler: 0,
        cost: 5,
        hpUp() {
            if(research.currentResearch === 'Research: none'){
                if(game.score > 4) {
                    console.log(`paid 5g`);
                    research.currentResearch = `Archer HP`;
                    game.score = game.score - this.cost;
                    this.render();
                    this.hpInt();
                } else {
                    console.log(`you cant afford that.`);
                }
            }else {
                console.log(`you are already researching something`);
            }
        },
        hpUpResearchSpeed() {
            if(research.timer % 10) {
                this.hpUpFunction();
            }
        },
        hpUpFunction() {
            if(research.researchProgress < 100) {
                research.researchProgress+=10;
                this.render();
            } else {
                console.log(`research complete`);
                archer.hp+= 10;
                research.researchProgress = 0;
                research.currentResearch = `Research: none`;
                this.render();
                clearInterval(this.hpIntHandler);
            }  
        }, 
        hpInt() {
                this.hpIntHandler = this.hpIntSet();
        },
        hpIntSet() {
                i = setInterval(this.hpUpResearchSpeed.bind(this), 2000);
                return i;
        },
        render() {
            $(`.research-bar`).css(`width`, research.researchProgress+ "%").attr(`aria-valuenow`, research.researchProgress);
            $(`.research-bar`).text(research.currentResearch);
            $('#score-board').text(`Gold: ${game.score}`);
        }
    },
    defense: {
        defenseIntHandler: 0,
        cost: 5,
        defenseUp() {
            if(research.currentResearch === 'Research: none'){
                if(game.score > 4) {
                    console.log(`paid 5g`);
                    research.currentResearch = `Archer Defense`;
                    game.score = game.score - this.cost;
                    this.render();
                    this.defenseInt();
                } else {
                    console.log(`you cant afford that.`);
                }
            }else {
                console.log(`you are already researching something`);
            }
        },
        defenseUpResearchSpeed() {
            if(research.timer % 10) {
                this.defenseUpFunction();
            }
        },
        defenseUpFunction() {
            if(research.researchProgress < 100) {
                research.researchProgress+=10;
                this.render();
            } else {
                console.log(`research complete`);
                archer.defense+= 5;
                research.researchProgress = 0;
                research.currentResearch = `Research: none`;
                this.render();
                clearInterval(this.defenseIntHandler);
            }  
        }, 
        defenseInt() {
                this.defenseIntHandler = this.defenseIntSet();
        },
        defenseIntSet() {
                i = setInterval(this.defenseUpResearchSpeed.bind(this), 2000);
                return i;
        },
        render() {
            $(`.research-bar`).css(`width`, research.researchProgress+ "%").attr(`aria-valuenow`, research.researchProgress);
            $(`.research-bar`).text(research.currentResearch);
            $('#score-board').text(`Gold: ${game.score}`);
        }
    },
    damage: {
        damageIntHandler: 0,
        cost: 5,
        damageUp() {
            if(research.currentResearch === 'Research: none'){
                if(game.score > 4) {
                    console.log(`paid 5g`);
                    research.currentResearch = `Archer damage`;
                    game.score = game.score - this.cost;
                    this.render();
                    this.damageInt();
                } else {
                    console.log(`you cant afford that.`);
                }
            }else {
                console.log(`you are already researching something`);
            }
        },
        damageUpResearchSpeed() {
            if(research.timer % 10) {
                this.damageUpFunction();
            }
        },
        damageUpFunction() {
            if(research.researchProgress < 100) {
                research.researchProgress+=10;
                this.render();
            } else {
                console.log(`research complete`);
                archer.damage+= 10;
                research.researchProgress = 0;
                research.currentResearch = `Research: none`;
                this.render();
                clearInterval(this.damageIntHandler);
            }  
        }, 
        damageInt() {
                this.damageIntHandler = this.damageIntSet();
        },
        damageIntSet() {
                i = setInterval(this.damageUpResearchSpeed.bind(this), 2000);
                return i;
        },
        render() {
            $(`.research-bar`).css(`width`, research.researchProgress+ "%").attr(`aria-valuenow`, research.researchProgress);
            $(`.research-bar`).text(research.currentResearch);
            $('#score-board').text(`Gold: ${game.score}`);
        }
    },
    attackSpeed: {
        attackSpeedIntHandler: 0,
        cost: 20,
        attackSpeedUp() {
            if(research.currentResearch === 'Research: none'){
                if(game.score > 19) {
                    console.log(`paid 20g`);
                    research.currentResearch = `Archer Attack Speed`;
                    game.score = game.score - this.cost;
                    this.render();
                    this.attackSpeedInt();
                } else {
                    console.log(`you cant afford that.`);
                }
            }else {
                console.log(`you are already researching something`);
            }
        },
        attackSpeedUpResearchSpeed() {
            if(research.timer % 2) {
                this.attackSpeedUpFunction();
            }
        },
        attackSpeedUpFunction() {
            if(research.researchProgress < 100) {
                research.researchProgress+=1;
                this.render();
            } else {
                console.log(`research complete`);
                archer.attackSpeed-= 15;
                research.researchProgress = 0;
                research.currentResearch = `Research: none`;
                this.render();
                clearInterval(this.attackSpeedIntHandler);
            }  
        }, 
        attackSpeedInt() {
                this.attackSpeedIntHandler = this.attackSpeedIntSet();
        },
        attackSpeedIntSet() {
                i = setInterval(this.attackSpeedUpResearchSpeed.bind(this), 500);
                return i;
        },
        render() {
            $(`.research-bar`).css(`width`, research.researchProgress+ "%").attr(`aria-valuenow`, research.researchProgress);
            $(`.research-bar`).text(research.currentResearch);
            $('#score-board').text(`Gold: ${game.score}`);
        }
    },
    whichButton(target){
    
        if($(target).attr(`id`)===`archer-hp-up`){
            this.hp.hpUp();
        } else if ($(target).attr(`id`)===`archer-defense-up`) {
            this.defense.defenseUp();
        } else if ($(target).attr(`id`)===`archer-damage-up`) {
            console.log(`archer damage upgrade clicked`);
            this.damage.damageUp();
        } else if ($(target).attr(`id`)===`archer-attack-speed-up`) {
            this.attackSpeed.attackSpeedUp();
        }
    }
}
const defenderUpgrades = {
    hp: {
        hpIntHandler: 0,
        cost: 5,
        hpUp() {
            if(research.currentResearch === 'Research: none'){
                if(game.score > 4) {
                    console.log(`paid 5g`);
                    research.currentResearch = `Defender HP`;
                    game.score = game.score - this.cost;
                    this.render();
                    this.hpInt();
                } else {
                    console.log(`you cant afford that.`);
                }
            }else {
                console.log(`you are already researching something`);
            }
        },
        hpUpResearchSpeed() {
            if(research.timer % 10) {
                this.hpUpFunction();
            }
        },
        hpUpFunction() {
            if(research.researchProgress < 100) {
                research.researchProgress+=10;
                this.render();
            } else {
                console.log(`research complete`);
                defender.hp+= 10;
                research.researchProgress = 0;
                research.currentResearch = `Research: none`;
                this.render();
                clearInterval(this.hpIntHandler);
            }  
        }, 
        hpInt() {
                this.hpIntHandler = this.hpIntSet();
        },
        hpIntSet() {
                i = setInterval(this.hpUpResearchSpeed.bind(this), 2000);
                return i;
        },
        render() {
            $(`.research-bar`).css(`width`, research.researchProgress+ "%").attr(`aria-valuenow`, research.researchProgress);
            $(`.research-bar`).text(research.currentResearch);
            $('#score-board').text(`Gold: ${game.score}`);
        }
    },
    defense: {
        defenseIntHandler: 0,
        cost: 5,
        defenseUp() {
            if(research.currentResearch === 'Research: none'){
                if(game.score > 4) {
                    console.log(`paid 5g`);
                    research.currentResearch = `Defender Defense`;
                    game.score = game.score - this.cost;
                    this.render();
                    this.defenseInt();
                } else {
                    console.log(`you cant afford that.`);
                }
            }else {
                console.log(`you are already researching something`);
            }
        },
        defenseUpResearchSpeed() {
            if(research.timer % 10) {
                this.defenseUpFunction();
            }
        },
        defenseUpFunction() {
            if(research.researchProgress < 100) {
                research.researchProgress+=10;
                this.render();
            } else {
                console.log(`research complete`);
                defender.defense+= 5;
                research.researchProgress = 0;
                research.currentResearch = `Research: none`;
                this.render();
                clearInterval(this.defenseIntHandler);
            }  
        }, 
        defenseInt() {
                this.defenseIntHandler = this.defenseIntSet();
        },
        defenseIntSet() {
                i = setInterval(this.defenseUpResearchSpeed.bind(this), 2000);
                return i;
        },
        render() {
            $(`.research-bar`).css(`width`, research.researchProgress+ "%").attr(`aria-valuenow`, research.researchProgress);
            $(`.research-bar`).text(research.currentResearch);
            $('#score-board').text(`Gold: ${game.score}`);
        }
    },
    damage: {
        damageIntHandler: 0,
        cost: 5,
        damageUp() {
            if(research.currentResearch === 'Research: none'){
                if(game.score > 4) {
                    console.log(`paid 5g`);
                    research.currentResearch = `Defender damage`;
                    game.score = game.score - this.cost;
                    this.render();
                    this.damageInt();
                } else {
                    console.log(`you cant afford that.`);
                }
            }else {
                console.log(`you are already researching something`);
            }
        },
        damageUpResearchSpeed() {
            if(research.timer % 10) {
                this.damageUpFunction();
            }
        },
        damageUpFunction() {
            if(research.researchProgress < 100) {
                research.researchProgress+=10;
                this.render();
            } else {
                console.log(`research complete`);
                defender.damage+= 10;
                research.researchProgress = 0;
                research.currentResearch = `Research: none`;
                this.render();
                clearInterval(this.damageIntHandler);
            }  
        }, 
        damageInt() {
                this.damageIntHandler = this.damageIntSet();
        },
        damageIntSet() {
                i = setInterval(this.damageUpResearchSpeed.bind(this), 2000);
                return i;
        },
        render() {
            $(`.research-bar`).css(`width`, research.researchProgress+ "%").attr(`aria-valuenow`, research.researchProgress);
            $(`.research-bar`).text(research.currentResearch);
            $('#score-board').text(`Gold: ${game.score}`);
        }
    },
    moveSpeed: {
        moveSpeedIntHandler: 0,
        cost: 20,
        moveSpeedUp() {
            if(research.currentResearch === 'Research: none'){
                if(game.score > 19) {
                    console.log(`paid 20g`);
                    research.currentResearch = `Defender Move Speed`;
                    game.score = game.score - this.cost;
                    this.render();
                    this.moveSpeedInt();
                } else {
                    console.log(`you cant afford that.`);
                }
            }else {
                console.log(`you are already researching something`);
            }
        },
        moveSpeedUpResearchSpeed() {
            if(research.timer % 2) {
                this.moveSpeedUpFunction();
            }
        },
        moveSpeedUpFunction() {
            if(research.researchProgress < 100) {
                research.researchProgress+=1;
                this.render();
            } else {
                console.log(`research complete`);
                defender.moveSpeed-= 50;
                research.researchProgress = 0;
                research.currentResearch = `Research: none`;
                this.render();
                clearInterval(this.moveSpeedIntHandler);
            }  
        }, 
        moveSpeedInt() {
                this.moveSpeedIntHandler = this.moveSpeedIntSet();
        },
        moveSpeedIntSet() {
                i = setInterval(this.moveSpeedUpResearchSpeed.bind(this), 500);
                return i;
        },
        render() {
            $(`.research-bar`).css(`width`, research.researchProgress+ "%").attr(`aria-valuenow`, research.researchProgress);
            $(`.research-bar`).text(research.currentResearch);
            $('#score-board').text(`Gold: ${game.score}`);
        }
    },
    whichButton(target){
        if($(target).attr(`id`)===`defender-hp-up`){
            this.hp.hpUp();
        } else if ($(target).attr(`id`)===`defender-defense-up`) {
            this.defense.defenseUp();
        } else if ($(target).attr(`id`)===`defender-damage-up`) {
            this.damage.damageUp();
        } else if ($(target).attr(`id`)===`defender-move-speed-up`) {
            this.moveSpeed.moveSpeedUp();
        }
    }
}

const renderGameToDom = () => {
    $(`body`).html(``);
    $(`body`).append(`<div class="container wrapper">
    <div class="row">
    <div class="col-12 title">Tower Battle</div>
    </div>
    <div class="row">
        <div class="col-2 data-bar">
            <button id="next-level" disabled='true'>Go to next level</button>
            <div id="current-level">Level: 1</div>
             <div id="score-board">Gold: 0</div>
        </div>
        <div class="col-3">
             <div class="progress">
                 <div class="progress-bar research-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                     Research: none
                 </div>
             </div>
        </div>
        <div class="col-7">
             <div class="btn-group dropleft">
                 <button type="button" class="btn btn-secondary btn-block dropdown-toggle upgrade" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                     Upgrade Swordsman
                 </button>
                 <div class="dropdown-menu">
                     <!-- Dropdown menu links -->
                     <button type="button" class="btn upgrade sword-up" id="swordsman-hp-up">Upgrade Swordsman Hitpoints 5g</button>
                     <button type="button" class="btn upgrade sword-up" id="swordsman-defense-up">Upgrade Swordsman Defense 5g</button>
                     <button type="button" class="btn upgrade sword-up" id="swordsman-damage-up">Upgrade Swordsman Damage 5g</button>
                     <button type="button" class="btn upgrade sword-up" id="swordsman-attack-speed-up">Upgrade Swordsman Attack Speed 20g</button>
                 </div>
             </div>
             <div class="btn-group dropleft">
                     <button type="button" class="btn btn-secondary btn-block dropdown-toggle upgrade" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                         Upgrade Archer
                     </button>
                     <div class="dropdown-menu">
                         <!-- Dropdown menu links -->
                         <button type="button" class="btn upgrade archer-up" id="archer-hp-up">Upgrade Archer Hitpoints 5g</button>
                         <button type="button" class="btn upgrade archer-up" id="archer-defense-up">Upgrade Archer Defense 5g</button>
                         <button type="button" class="btn upgrade archer-up" id="archer-damage-up">Upgrade Archer Damage 5g</button>
                         <button type="button" class="btn upgrade archer-up" id="archer-attack-speed-up">Upgrade Archer Attack Speed 20g</button>
                     </div>
             </div>
             <div class="btn-group dropleft">
                     <button type="button" class="btn btn-secondary btn-block dropdown-toggle upgrade" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                         Upgrade Defender
                     </button>
                     <div class="dropdown-menu">
                         <!-- Dropdown menu links -->
                         <button type="button" class="btn upgrade defender-up" id="defender-hp-up">Upgrade Defender Hitpoints 5g</button>
                         <button type="button" class="btn upgrade defender-up" id="defender-defense-up">Upgrade Defender Defense 5g</button>
                         <button type="button" class="btn upgrade defender-up" id="defender-damage-up">Upgrade Defender Damage 5g</button>
                         <button type="button" class="btn upgrade defender-up" id="defender-move-speed-up">Upgrade Defender Move Speed 20g</button>
                     </div>
             </div>
        </div>
    </div> 
 </div>
 </div>
 <div class='container game-board '></div>
 <div class="container">
     <div class="row">
         <div class="col-6">
             <button type="button" class="btn btn-primary" id="make-sword">Make Swordsman</button>
             <button type="button" class="btn btn-primary" id="make-archer">Make Archer</button>
             <button type="button" class="btn btn-primary" id="make-defender">Make Defender</button>
         </div>
     </div>
 </div>`);
}
