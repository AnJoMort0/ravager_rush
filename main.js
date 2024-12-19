//Game by AnJoMorto, art by u/Melnact19

const VERSION = 'v.alpha.0.1';

const GRID_SIZE_OR  = 16;
const TARGET_HEIGHT = 336;
const SCALE         = window.innerHeight / TARGET_HEIGHT;
const GRID_SIZE     = GRID_SIZE_OR * SCALE
const SCREEN_WIDTH  = 256 * SCALE;
const SCREEN_HEIGHT = 336 * SCALE;
const FIX           = (16 * SCALE) / 2; //this is to correct position for elements that need to be anchored to the center

const Z_TOP = 10;

function at(square){return (GRID_SIZE * square)}; //function to ease the calculations of squares

let last_pos        = [at(8), at(19)];

kaplay({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    background: [250, 250, 250],
});

//Assets
loadRoot('assets/');
loadSprite("board"          , "temp/board.png");
loadSprite("player"         , "player.png");
loadSprite("blank16x16"     , "blank16x16.png");
loadSprite("blocker"        , "blocker.png");
loadSprite("blocker_double" , "blocker_double.png");

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
    player.onCollide("blocker", () => { //sets the player back to it's previous position when intercepting a blocker --> not letting them move
        player.pos = vec2(last_pos);
    })
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

    //Add game elements
    function addBlocker (coorX, coorY, Z, isDouble){
        if (!isDouble) {
            add([
                sprite("blocker"),
                scale(SCALE),
                anchor("center"),
                pos(at(coorX) + FIX, at(coorY) + FIX),
                z(Z),
                area(scale(0.7)),
                "blocker",
            ]);
        } else {
            add([
                sprite("blocker_double"),
                scale(SCALE),
                anchor("center"),
                pos(at(coorX) + FIX * 2, at(coorY) + FIX),
                z(Z),
                area(scale(0.7)),
                "blocker",
            ]);
        }
    }

        /////////THESE WALLS HAVE TO BE TEMPORARY BECAUSE THEY USE TOO MUCH PERFORMANCE. THEY NEED TO BE A SINGLE ELEMENT AND NOT A WHOLE BUNCH OF WALLS (execpt maybe between the frog doors)
        // Add walls
        const numRows = SCREEN_HEIGHT / (GRID_SIZE);
        for (let i = 0; i < numRows; i++) { 
            addBlocker(0  , i , 0); //left wall
            addBlocker(15 , i , 0); //right wall
        }
        const numCols = SCREEN_WIDTH / (GRID_SIZE);
        for (let i = 0; i < numCols; i++) {
            addBlocker(i, 3, 0); //top line
            addBlocker(3, 4, 0); //top line
            addBlocker(6, 4, 0); //top line
            addBlocker(9, 4, 0); //top line
            addBlocker(12, 4, 0); //top line
            addBlocker(i, 20, 0); //bottom line
        }

        // Add blocker obstacles
        let blockerCoords = [
            [18, [2, 3, 6, 10, 11, 14]],
            [16, [3, 6, 7, 10, 13, 14]],
            [14, [1, 2, 5, 8, 9, 13]],
        ];
        for (let i = 0; i < blockerCoords.length; i++) {
            const YCoord = blockerCoords[i][0];
            const XCoord = blockerCoords[i][1];
        
            for (let j = 0; j < XCoord.length; j++) {
                const current   = XCoord[j];
                const next      = XCoord[j + 1];
        
                if (next === current + 1) { // Check if there are consecutive blockers
                    addBlocker(current, YCoord, Z_TOP, true);
                    j++;
                } else {
                    addBlocker(current, YCoord, Z_TOP, false);
                }
            }
        }              
});

go("main");