//Game by AnJoMorto, art by u/Melnact19

const VERSION = 'v.alpha.0.1';

// Start the game with a scaled-up window and scaling factor
const SCALE = 1.5; // Adjust this value to scale the game up
const GRID_SIZE = 16;
const SCREEN_WIDTH = 256 * SCALE;
const SCREEN_HEIGHT = 336 * SCALE;

kaplay({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    scale: SCALE,
    background: [250, 250, 250],
});

//Assets
loadRoot('assets/');
loadSprite("board", "temp/board.png");
loadSprite("player", "player.png");

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