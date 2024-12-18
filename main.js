//Game by AnJoMorto, art by u/Melnact19

const VERSION = 'v.alpha.0.1';

const GRID_SIZE     = 16;
const TARGET_HEIGHT = 336;
const SCALE         = window.innerHeight / TARGET_HEIGHT;
const SCREEN_WIDTH  = 256 * SCALE;
const SCREEN_HEIGHT = 336 * SCALE;
const FIX           = (16 * SCALE) / 2;

let last_pos        = [GRID_SIZE * 7 * SCALE, GRID_SIZE * 19 * SCALE]

kaplay({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    background: [250, 250, 250],
});

//Assets
loadRoot('assets/');
loadSprite("board", "temp/board.png");
loadSprite("player", "player.png");
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

    function addblocker (posX, posY, posZ){
        add([
            sprite("blocker"),
            scale(SCALE),
            anchor("center"),
            pos(posX + FIX, posY + FIX),
            z(posZ),
            area(scale(0.7)),
            "blocker",
        ]);
    }

    // Add walls
    const numRows = SCREEN_HEIGHT / (GRID_SIZE * SCALE);
    for (let i = 0; i < numRows; i++) { 
        addblocker(0                                , i * GRID_SIZE * SCALE , 0);   //left wall
        addblocker(SCREEN_WIDTH - GRID_SIZE * SCALE , i * GRID_SIZE * SCALE , 0);   //right wall
    }

    // Movement logic for the player
    onKeyPress(["up", "w"], () => {
        last_pos = [player.pos.x, player.pos.y];
        player.pos.y -= GRID_SIZE * SCALE;
    });
    onKeyPress(["down", "s"], () => {
        last_pos = [player.pos.x, player.pos.y];
        player.pos.y += GRID_SIZE * SCALE;
    });
    onKeyPress(["left", "a"], () => {
        last_pos = [player.pos.x, player.pos.y];
        player.pos.x -= GRID_SIZE * SCALE;
    });
    onKeyPress(["right", "d"], () => {
        last_pos = [player.pos.x, player.pos.y];
        player.pos.x += GRID_SIZE * SCALE;
    });
});

go("main");