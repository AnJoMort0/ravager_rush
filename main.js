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
let score           = 0;
let crossings       = 0;

kaplay({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    background: [250, 250, 250],
});

//debug.inspect = true;

//Assets
loadRoot('assets/');
loadSprite("board"          , "temp/board.png");
loadSprite("blank_wall"     , "blank16x336.png");
loadSprite("player"         , "player.png");
loadSprite("blank16x16"     , "blank16x16.png");
loadSprite("blocker"        , "blocker.png");
loadSprite("blocker_double" , "blocker_double.png");
loadSprite("lilypad"        , "lilypad.png");
loadSprite("drip_leaf"      , "drip_leaf.png");
loadSprite("drip_leaf_wet"  , "drip_leaf_falling.png");
loadSprite("drip_leaf_gone" , "drip_leaf_collapsed.png");
loadSprite("zombie"         , "zombie.png");
loadSprite("ravager"        , "ravager.png");
loadSprite("ravager_wet"    , "ravager_water.png");

scene("main", () => {
    let wetTime = 0;
    let wetPenalty = 60; // in frames

    // Add the board background
    add([
        sprite("board"),
        scale(SCALE),
        pos(0, 0),
    ]);
    // Add walls
    add([ //left
        sprite("blank_wall"),
        scale(SCALE, SCALE * 1.5),
        anchor("top"),
        pos(at(0) + FIX, at(4)),
        area(scale(0.5)),
        "blocker",
    ]);
    add([ //right
        sprite("blank_wall"),
        scale(SCALE, SCALE * 1.5),
        anchor("top"),
        pos(at(15) + FIX, at(4)),
        area(scale(0.5)),
        "blocker",
    ]);
    add([ //top
        sprite("blank_wall"),
        scale(SCALE, SCALE * 1.3),
        anchor("top"),
        rotate(90),
        pos(at(15), at(3) + FIX),
        area(scale(0.5)),
        "blocker",
    ]);
    add([ //bottom
        sprite("blank_wall"),
        scale(SCALE, SCALE * 1.3),
        anchor("top"),
        rotate(90),
        pos(at(15), at(20) + FIX),
        area(scale(0.5)),
        "blocker",
    ]);
    addBlocker(3, 4, 0); //between doors
    addBlocker(6, 4, 0); 
    addBlocker(9, 4, 0);
    addBlocker(12, 4, 0); 

    // Add the player
    const player = add([
        sprite("player"),
        scale(SCALE),
        pos(vec2(last_pos)),
        z(Z_TOP + 10),
        area(),
        {
            update(){
                if (this.pos.y < at(12) && get("floater").filter(o => o.isColliding(player)) == 0) {
                    this.tag("wet");
                    wetTime++;
                } else {
                    this.untag("wet");
                    canMove = true;
                    wetTime = 0;
                }
            }
        },
        "player",
    ]);
    player.onCollide("blocker", () => { //sets the player back to it's previous position when intercepting a blocker --> not letting them move
        player.pos = vec2(last_pos);
    });
    player.onCollide("enemy", () => {
        console.log("dead");
    });
    player.onCollide("floater", () => {
        canMove = true;
    })
    player.onCollide("collapsable", (d) => {
        console.log("touched");
        if (d.is("collapsed")) {
            console.log("collapsed");
            return;
        } else {
            d.use(sprite("drip_leaf_wet"));
            wait(1, () => {
                d.tag("collapsed");
                d.use(sprite("drip_leaf_gone"));
                d.untag("floater");
                wait(5, () => {
                    d.untag("collapsed");
                    d.use(sprite("drip_leaf"));
                    d.tag("floater");
                })
            });
        }
    });

    onKeyPress(["up", "w"], () => {
        if(player.is("wet")){
            if (wetTime > wetPenalty) {
                wetTime = 0;
                last_pos = [player.pos.x, player.pos.y];
                player.pos.y -= GRID_SIZE;
            } else {
                return;
            };
        } else {
            last_pos = [player.pos.x, player.pos.y];
            player.pos.y -= GRID_SIZE;
        }
    });
    onKeyPress(["down", "s"], () => {
        if(player.is("wet")){
            if (wetTime > wetPenalty) {
                wetTime = 0;
                last_pos = [player.pos.x, player.pos.y];
                player.pos.y += GRID_SIZE;
            } else {
                return;
            };
        } else {
            last_pos = [player.pos.x, player.pos.y];
            player.pos.y += GRID_SIZE;
        }
    });
    onKeyPress(["left", "a"], () => {
        if(player.is("wet")){
            if (wetTime > wetPenalty) {
                wetTime = 0;
                last_pos = [player.pos.x, player.pos.y];
                player.pos.x -= GRID_SIZE;
            } else {
                return;
            };
        } else {
            last_pos = [player.pos.x, player.pos.y];
            player.pos.x -= GRID_SIZE;
        }
    });
    onKeyPress(["right", "d"], () => {
        if(player.is("wet")){
            if (wetTime > wetPenalty) {
                wetTime = 0;
                last_pos = [player.pos.x, player.pos.y];
                player.pos.x += GRID_SIZE;
            } else {
                return;
            };
        } else {
            last_pos = [player.pos.x, player.pos.y];
            player.pos.x += GRID_SIZE;
        }
    });    

 //Add game elements
    // Add blocker obstacles
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
    let blockerCoords = [
        [18, [2, 3, 6, 10, 11, 14]],
        [16, [3, 6, 7, 10, 13, 14]],
        [14, [1, 2, 5, 8, 9, 13]],
    ];
    for (let i = 0; i < blockerCoords.length; i++) { // this loop was developped with the help of chatGPT
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

    // Add lilypads
    function addFloater (coorX, coorY, isDrip){
        if (!isDrip) {
            add([
                sprite("lilypad"),
                scale(SCALE),
                rotate(choose([0, 90, 180, 270])),
                anchor("center"),
                pos(at(coorX) + FIX, at(coorY) + FIX),
                z(Z_TOP),
                area(scale(0.7)),
                "floater",
            ]);
        } else {
            add([
                sprite("drip_leaf"),
                scale(SCALE),
                rotate(choose([0, 90, 180, 270])),
                anchor("center"),
                pos(at(coorX) + FIX, at(coorY) + FIX),
                z(Z_TOP),
                area(scale(0.7)),
                "floater",
                "collapsable",
            ]);
        }
    }
    let lilypadCoords = [
        [5, [4, 12]],
        [6, [6]],
        [7, [9]],
        [8, [2, 7]],
        [9, [10]],
        [10, [2, 6]],
        [11, [13]],
    ];
    for (let i = 0; i < lilypadCoords.length; i++) {
        const YCoord = lilypadCoords[i][0];
        const XCoord = lilypadCoords[i][1];
    
        for (let j = 0; j < XCoord.length; j++) {
            addFloater(XCoord[j], YCoord, false);
        }
    }
    let drip_leafCoords = [
        [5, [2]],
        [6, [7, 9, 14]],
        [7, [3, 5, 11]],
        [8, [1]],
        [9, [4, 11]],
        [10, [8, 14]],
        [11, [1, 4, 5, 9]],
    ];
    for (let i = 0; i < drip_leafCoords.length; i++) {
        const YCoord = drip_leafCoords[i][0];
        const XCoord = drip_leafCoords[i][1];
    
        for (let j = 0; j < XCoord.length; j++) {
            addFloater(XCoord[j], YCoord, true);
        }
    }

    // Add zombie
    const zombie = add([
        sprite("zombie"),
        scale(SCALE),
        anchor("center"),
        pos(at(1) + FIX, at(12) + FIX),
        z(Z_TOP),
        area(scale(0.7)),
        "enemy",
    ])
    loop(1, () => {
        // Zombie mouvement
        if (player.pos.y > at(8) && player.pos.y < at(16)) {
            if (zombie.pos.x > player.pos.x) {
                zombie.pos.x -= at(1);
            }
            if (zombie.pos.x < player.pos.x){
                zombie.pos.x += at(1)
            }
        }
    })

    loop(5, () => {
        add([
            sprite("ravager"),
            scale(SCALE),
            anchor("center"),
            pos(at(16), at(17) + FIX),
            z(Z_TOP),
            area(scale(0.7)),
            offscreen({destroy: true}),
            "enemy",
            "ravager",
        ]);
    })
    loop(5, () => {
        add([
            sprite("ravager", {flipX: true}),
            scale(SCALE),
            anchor("center"),
            pos(at(0), at(15) + FIX),
            z(Z_TOP),
            area(scale(0.7)),
            offscreen({destroy: true}),
            "enemy",
            "ravager",
        ]);
    })
    loop(5, () => {
        add([
            sprite("ravager"),
            scale(SCALE),
            anchor("center"),
            pos(at(16), at(13) + FIX),
            z(Z_TOP),
            area(scale(0.7)),
            offscreen({destroy: true}),
            "enemy",
            "ravager",
        ]);
    })
    loop(5, () => {
        add([
            sprite("ravager_wet", {flipX: true}),
            scale(SCALE),
            anchor("center"),
            pos(at(0), at(11) + FIX),
            z(Z_TOP),
            area(scale(0.7)),
            offscreen({destroy: true}),
            "enemy",
            "ravager",
        ]);
    })
    loop(5, () => {
        add([
            sprite("ravager_wet"),
            scale(SCALE),
            anchor("center"),
            pos(at(16), at(9) + FIX),
            z(Z_TOP),
            area(scale(0.7)),
            offscreen({destroy: true}),
            "enemy",
            "ravager",
        ]);
    })
    loop(5, () => {
        add([
            sprite("ravager_wet", {flipX: true}),
            scale(SCALE),
            anchor("center"),
            pos(at(0), at(7) + FIX),
            z(Z_TOP),
            area(scale(0.7)),
            offscreen({destroy: true}),
            "enemy",
            "ravager",
        ]);
    })
    loop(5, () => {
        add([
            sprite("ravager_wet"),
            scale(SCALE),
            anchor("center"),
            pos(at(16), at(5) + FIX),
            z(Z_TOP),
            area(scale(0.7)),
            offscreen({destroy: true}),
            "enemy",
            "ravager",
        ]);
    })

    loop(0.5, () => {
        allRavagers = get("ravager");
        allRavagers.forEach(ravager => {
            if (ravager.flipX == false) {
                ravager.pos.x -= at(1);
            } else {
                ravager.pos.x += at(1);
            }
        });
    })
});

go("main");