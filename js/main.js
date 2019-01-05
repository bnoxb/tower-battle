
const gameBoardSetup = () => {
    for (let y = 5; y > 0; y--) {
        const $thisRow = $(`<div/>`).attr(`thisRow`, y).appendTo(`#game-board`);
            for (let x = 1; x < 13; x++) {
                console.log(`going through loop`);
                $(`<div/>`).attr({x: `${x}`, y: `${y}`}).addClass(`square`).appendTo($thisRow);
            }
    }
}


gameBoardSetup();