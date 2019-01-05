const game = {
    timer: 0,
    int() {
        setInterval(() =>{
            this.timer++;
        }, 1000);
    }
};

class Unit {
    constructor(name, hp, damage, attackSpeed, range, movementSpeed, defense, x, y) {
        this.name = name;
        this.hp = hp;
        this.damage = damage;
        this.attackSpeed = attackSpeed;
        this.range = range;
        this.movementSpeed = movementSpeed;
        this.defense = defense;
        this.x = x;
        this.y = y;
        this.isAlive = true;
        this.inRange = false;
    }
    render() {
        if (this.name === 'enemy') {
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
        console.log($theEnemy.hasClass(`enemy`));
        if ($theEnemy.hasClass(`enemy`)){
            console.log(`collision detected`);
            //$(`.square[x='${this.x}'][y='${this.y}']`).removeClass(`fighter`);
        } else {
            console.log(`no collision detected`);
            this.move();
        }
    }
    move() {
        if(this.x < 12) {
            console.log(`moving unit`);
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
const makeUnits = () => {
    const newUnit = new Unit(`fighter`, 10, 2, 1, 1, 2, 1, 3, 1);
    newUnit.render();
    newUnit.moveInt();
}

const makeEnemyUnit = () => {
    const enemyUnit = new Unit(`enemy`, 10, 2, 1, 1, 2, 1, 8, 1);
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
