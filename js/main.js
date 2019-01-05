const game = {
    timer: 0,
    int() {
        setInterval(() =>{
            this.timer++;
        })
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
        $(`.square[x='${this.x}'][y='${this.y}']`).addClass(`fighter`);
    }
    checkMoveSpeed() {
        console.log(`checking move speed`);
        if (game.timer % this.movementSpeed) {
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
            this.checkMoveSpeed();
        }, 1000);
    }
}
const makeUnits = () => {
    const newUnit = new Unit(`fighter`, 10, 2, 1, 1, 2, 1, 3, 1);
    newUnit.render();
    newUnit.moveInt();
}


const gameBoardSetup = () => {
    for (let y = 5; y > 0; y--) {
        const $thisRow = $(`<div/>`).appendTo(`.game-board`);
            for (let x = 1; x < 13; x++) {
                console.log(`going through loop`);
                $(`<div/>`).attr({x: `${x}`, y: `${y}`}).addClass(`square`).appendTo($thisRow);
            }
    }
}

gameBoardSetup();
game.int();
makeUnits();
