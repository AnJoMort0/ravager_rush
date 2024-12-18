//Game by AnJoMorto, art by u/Melnact19

const VERSION = 'v.alpha.0.1';

const GRID_SIZE = 16;
const TARGET_HEIGHT = 336;
const SCALE = window.innerHeight / TARGET_HEIGHT;
const SCREEN_WIDTH = 256 * SCALE;
const SCREEN_HEIGHT = 336 * SCALE;

kaplay({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    background: [250, 250, 250],
});

//Assets
loadRoot('assets/');
loadSprite("board", "temp/board.png");
loadSprite("player", "player.png");
loadSprite("block", "block.png");

scene("main", () => {
    // Add the board background
    add([
        sprite("board"),
        pos(0, 0),
        scale(SCALE),
        fixed(),
    ]);

    // Add the player
    const player = add([
        sprite("player"),
        anchor('topleft'),
        pos(GRID_SIZE * 7 * SCALE, GRID_SIZE * 19 * SCALE),
        area(),
        scale(SCALE),
    ]);

    // Add temporary walls
    const numRows = SCREEN_HEIGHT / (GRID_SIZE * SCALE);
    for (let i = 0; i < numRows; i++) {
        // Left wall
        add([
            sprite("block"),
            pos(0, i * GRID_SIZE * SCALE),
            scale(SCALE),
            area(),
            body(),
            "block",
        ]);

        // Right wall
        add([
            sprite("block"),
            pos(SCREEN_WIDTH - GRID_SIZE * SCALE, i * GRID_SIZE * SCALE),
            scale(SCALE),
            area(),
            body(),
            "block",
        ]);
    }

    // Movement logic for the player
    onKeyPress(["up", "w"], () => {
        player.pos.y -= GRID_SIZE * SCALE;
    });
    onKeyPress(["down", "s"], () => {
        player.pos.y += GRID_SIZE * SCALE;
    });
    onKeyPress(["left", "a"], () => {
        player.pos.x -= GRID_SIZE * SCALE;
    });
    onKeyPress(["right", "d"], () => {
        player.pos.x += GRID_SIZE * SCALE;
    });
});

go("main");