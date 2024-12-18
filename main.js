//Game by AnJoMorto, art by u/Melnact19

const VERSION = 'v.alpha.0.1';

const GRID_SIZE_OR  = 16;
const TARGET_HEIGHT = 336;
const SCALE         = window.innerHeight / TARGET_HEIGHT;
const GRID_SIZE     = GRID_SIZE_OR * SCALE
const SCREEN_WIDTH  = 256 * SCALE;
const SCREEN_HEIGHT = 336 * SCALE;
const FIX           = (16 * SCALE) / 2; //this is to correct position for elements that need to be anchored to the center

function at(square){return (GRID_SIZE * square)}; //function to ease the calculations of squares

let last_pos        = [at(7), at(19)];

kaplay({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    background: [250, 250, 250],
});

//Assets
loadRoot('assets/');
loadSprite("board"  , "temp/board.png");
loadSprite("player" , "player.png");
loadSprite("blocker", "blocker.png");

scene("main", () => {
    // Add the board background
    add([
        sprite("board"),
        scale(SCALE),
        pos(0, 0),
    ]);

    // Add the player
    const player = add([
        sprite("player"),
        scale(SCALE),
        pos(vec2(last_pos)),
        area(),
        "player",
    ]);
    player.onCollide("blocker", () => { //setting the player back to it's previous position when intercepting a blocker --> not letting it move
        player.pos = vec2(last_pos);
    })

    function addblocker (coorX, coorY, Z){
        add([
            sprite("blocker"),
            scale(SCALE),
            anchor("center"),
            pos(at(coorX) + FIX, at(coorY) + FIX),
            z(Z),
            area(scale(0.7)),
            "blocker",
        ]);
    }

    // Add walls
    const numRows = SCREEN_HEIGHT / (GRID_SIZE);
    for (let i = 0; i < numRows; i++) { 
        addblocker(0  , i , 0); //left wall
        addblocker(15 , i , 0); //right wall
    }
    const numCols = SCREEN_WIDTH / (GRID_SIZE);
    for (let i = 0; i < numCols; i++) {
        addblocker(i, 3, 0); //top line
        addblocker(3, 4, 0);
        addblocker(6, 4, 0);
        addblocker(9, 4, 0);
        addblocker(12, 4, 0);
        addblocker(i, 20, 0); //bottom line
    }

    // Movement logic for the player
    onKeyPress(["up", "w"], () => {
        last_pos = [player.pos.x, player.pos.y];
        player.pos.y -= GRID_SIZE;
    });
    onKeyPress(["down", "s"], () => {
        last_pos = [player.pos.x, player.pos.y];
        player.pos.y += GRID_SIZE;
    });
    onKeyPress(["left", "a"], () => {
        last_pos = [player.pos.x, player.pos.y];
        player.pos.x -= GRID_SIZE;
    });
    onKeyPress(["right", "d"], () => {
        last_pos = [player.pos.x, player.pos.y];
        player.pos.x += GRID_SIZE;
    });
});

go("main");