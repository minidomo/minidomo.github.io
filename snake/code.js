let game_state;

const AI = {
    isOn: false,
    pathVelocity: [],
    pathDirection: []
};

const player = {
    row: 0,
    col: 0,
    velR: 0,
    velC: 0,
    direction: 0,
    currentScore: 0,
    currentHighscore: 0,
    pieceCoordinates: [],
    nextCoordinate: []
};

const fruit = {
    row: 0,
    col: 0
};

const GAME_CONSTANTS = {
    GRID: {
        ROWS: 41,
        COLUMNS: 29
    },
    STATE: {
        MENU: 0,
        DEAD: 1,
        PLAYING: 2
    },
    DIRECTION: {
        UP: 0,
        DOWN: 1,
        LEFT: 2,
        RIGHT: 3
    },
    SIZE: {
        PLAYER: {
            WIDTH: 10,
            HEIGHT: 10
        },
        FRUIT: {
            WIDTH: 10,
            HEIGHT: 10
        }
    },
    TARGET_GRAPHICS_FPS: 60,
    TARGET_UPDATE_FPS: 15,
    VELOCITY: 1,
};

const getY = (row) => {
    return row * 10 + 20;
};

const getX = (col) => {
    return col * 10 + 10;
};

const initialSetup = () => {
    setText('instructions', 'Press WASD or Arrow Keys to move\n\nPress Spacebar or click Play Again to play again\n\n\nPress Spacebar to start the game');
    setStyle('game', 'font-family: Lucida Console;');

    if (typeof Storage !== 'undefined') {
        const bestScore = localStorage.getItem('minidomoSnakeHighscore');
        if (bestScore) {
            player.currentHighscore = parseInt(bestScore);
        } else {
            player.currentHighscore = 1;
            localStorage.setItem('minidomoSnakeHighscore', '1');
        }
    }

    game_state = GAME_CONSTANTS.STATE.MENU;
};

const loadGame = () => {
    initializePlayerValues();
    randomlyPlaceFruitAtEmptyLocation();

    if (AI.isOn) {
        determineAiPath();
    }

    hideElement('instructions');
    setScreen('game');

    game_state = GAME_CONSTANTS.STATE.PLAYING;
    drawGraphics();
    updateValues();

    showElement('snake_0');
    showElement('fruit');
};

const drawGraphics = () => {
    const interval = 1000 / GAME_CONSTANTS.TARGET_GRAPHICS_FPS;
    const draw = setInterval(() => {
        if (game_state === GAME_CONSTANTS.STATE.DEAD) {
            clearInterval(draw);
        } else {
            drawPlayerPieces();
            setPosition('fruit', getX(fruit.col), getY(fruit.row), GAME_CONSTANTS.SIZE.FRUIT.WIDTH, GAME_CONSTANTS.SIZE.FRUIT.HEIGHT);
            setText('scorelabel', `Score: ${player.currentScore}`);
            setText('highscorelabel', 'Best: ' + player.currentHighscore);
        }
    }, interval);
};

const updateValues = () => {
    const interval = 1000 / GAME_CONSTANTS.TARGET_UPDATE_FPS;
    const update = setInterval(() => {
        assignPlayerVelocity();
        storeLastPlayerLocation();
        updatePlayerLocation();
        if (isAtSameLocation(player, fruit)) {
            increasePlayerScoreByOne();
            addPlayerPiece();
            randomlyPlaceFruitAtEmptyLocation();
            if (AI.isOn) {
                determineAiPath();
            }
        } else if (isOutOfPlayField(player) || playerCollidesWithItself()) {
            clearInterval(update);
            loadEndScreen();
        }
    }, interval);
};

const loadEndScreen = () => {
    game_state = GAME_CONSTANTS.STATE.DEAD;

    player.currentHighscore = Math.max(player.currentHighscore, player.currentScore);
    setText('highscorelabel', `Best: ${player.currentHighscore}`);
    if (typeof Storage !== undefined) {
        localStorage.setItem('minidomoSnakeHighscore', player.currentHighscore.toString());
    }

    textLabel('gameOverLabel', 'G A M E  O V E R');
    textLabel('endScoreLabel', 'Score: ' + player.currentScore);
    button('playagainButt', 'Play Again');

    setProperty('gameOverLabel', 'text-align', 'center');
    setProperty('endScoreLabel', 'text-align', 'center');
    setProperty('playagainButt', 'text-align', 'center');

    setProperty('gameOverLabel', 'text-color', 'white');
    setProperty('endScoreLabel', 'text-color', 'white');

    setProperty('playagainButt', 'background-color', '#2bbecc');

    setPosition('gameOverLabel', 90, 165, 140, 20);
    setPosition('endScoreLabel', 110, 185, 100, 20);
    setPosition('playagainButt', 110, 215, 100, 30);

    setProperty('playagainButt', 'font-size', 12);

    setStyle('playagainButt', 'font-family: Lucida Console; font-weight: bold;');


    onEvent("playagainButt", "click", () => {
        clearEndScreen();
        loadGame();
    });
};

const clearEndScreen = () => {
    deleteElement("gameOverLabel");
    deleteElement("endScoreLabel");
    deleteElement("playagainButt");

    hideElement("fruit");
    player.pieceCoordinates.forEach((coordinate, index) => {
        if (index === 0) {
            hideElement(`snake_${index}`);
        } else {
            deleteElement(`snake_${index}`);
        }
    });
};

const playerCollidesWithItself = () => {
    if (player.pieceCoordinates.length > 1) {
        const foundCoordinate = player.pieceCoordinates.slice(1).find((coordinate) => coordinate[0] === player.row && coordinate[1] === player.col);
        return foundCoordinate ? true : false;
    }
    return false;
};

const drawPlayerPieces = () => {
    player.pieceCoordinates.forEach((coordinate, i) => {
        const [row, col] = coordinate;
        const element = document.getElementById(`snake_${i}`);
        if (!element) {
            image(`snake_${i}`, 'assets/greenBox.png');
        }
        setPosition(`snake_${i}`, getX(col), getY(row), GAME_CONSTANTS.SIZE.PLAYER.WIDTH, GAME_CONSTANTS.SIZE.PLAYER.HEIGHT);
    });
};

const addPlayerPiece = () => {
    player.pieceCoordinates.push(player.nextCoordinate);
};

const initializePlayerValues = () => {
    player.row = randomNumber(0, GAME_CONSTANTS.GRID.ROWS);
    player.col = randomNumber(0, GAME_CONSTANTS.GRID.COLUMNS);
    player.direction = randomNumber(0, 3);
    player.currentScore = 1;
    player.pieceCoordinates = [[player.row, player.col]];
    player.nextCoordinate = [];
};

const randomlyPlaceFruitAtEmptyLocation = () => {
    const availableLocationBoard = Array(GAME_CONSTANTS.GRID.ROWS + 1).fill(Array(GAME_CONSTANTS.GRID.COLUMNS + 1).fill(true));
    player.pieceCoordinates.forEach((coordinate) => {
        const [row, col] = coordinate;
        availableLocationBoard[row][col] = false;
    });
    do {
        fruit.row = randomNumber(0, GAME_CONSTANTS.GRID.ROWS);
        fruit.col = randomNumber(0, GAME_CONSTANTS.GRID.COLUMNS);
    } while (!availableLocationBoard[fruit.row][fruit.col]);
};

const increasePlayerScoreByOne = () => {
    player.currentScore++;
};

const isAtSameLocation = (a, b) => {
    return a.row === b.row && a.col === b.col;
};

const storeLastPlayerLocation = () => {
    player.nextCoordinate = player.pieceCoordinates[player.pieceCoordinates.length - 1];
};

const assignPlayerVelocity = () => {
    if (AI.isOn) {
        player.direction = AI.pathDirection.pop();
    }
    if (player.direction === GAME_CONSTANTS.DIRECTION.UP) {
        player.velC = 0;
        player.velR = -GAME_CONSTANTS.VELOCITY;
    } else if (player.direction === GAME_CONSTANTS.DIRECTION.DOWN) {
        player.velC = 0;
        player.velR = GAME_CONSTANTS.VELOCITY;
    } else if (player.direction === GAME_CONSTANTS.DIRECTION.LEFT) {
        player.velC = -GAME_CONSTANTS.VELOCITY;
        player.velR = 0;
    } else if (player.direction === GAME_CONSTANTS.DIRECTION.RIGHT) {
        player.velC = GAME_CONSTANTS.VELOCITY;
        player.velR = 0;
    }
};

const updatePlayerLocation = () => {
    player.row += player.velR;
    player.col += player.velC;
    player.pieceCoordinates.splice(0, 0, [player.row, player.col]);
    player.pieceCoordinates.pop();
};

const isOutOfPlayField = (object) => {
    const ROW = {
        LOWER_BOUND: getY(0),
        UPPER_BOUND: getY(GAME_CONSTANTS.GRID.ROWS)
    };
    const COL = {
        LOWER_BOUND: getX(0),
        UPPER_BOUND: getX(GAME_CONSTANTS.GRID.COLUMNS)
    };
    const objectFixedRow = getY(object.row);
    const objectFixedCol = getX(object.col);
    return objectFixedRow < ROW.LOWER_BOUND || objectFixedRow > ROW.UPPER_BOUND || objectFixedCol < COL.LOWER_BOUND || objectFixedCol > COL.UPPER_BOUND;
};

onEvent('game', 'keydown', (event) => {
    const { key } = event;
    // console.log(`${key} - (${key.charCodeAt(0)})`);

    if (game_state === GAME_CONSTANTS.STATE.MENU) {
        if (key === 'q') {
            AI.isOn = !AI.isOn;
            console.log(`AI: ${AI.isOn}`);
        }
        if (key === ' ') {
            loadGame();
        }
    } else if (game_state === GAME_CONSTANTS.STATE.PLAYING && !AI.isOn) {
        const DIRECTIONS = {
            UP: ['w', 'Up'],
            DOWN: ['s', 'Down'],
            LEFT: ['a', 'Left'],
            RIGHT: ['d', 'Right']
        };
        if ((player.pieceCoordinates.length === 1 || player.row <= player.pieceCoordinates[1][0]) && DIRECTIONS.UP.find((e) => e === key)) {
            player.direction = GAME_CONSTANTS.DIRECTION.UP;
        } else if ((player.pieceCoordinates.length === 1 || player.row >= player.pieceCoordinates[1][0]) && DIRECTIONS.DOWN.find((e) => e === key)) {
            player.direction = GAME_CONSTANTS.DIRECTION.DOWN;
        } else if ((player.pieceCoordinates.length === 1 || player.col <= player.pieceCoordinates[1][1]) && DIRECTIONS.LEFT.find((e) => e === key)) {
            player.direction = GAME_CONSTANTS.DIRECTION.LEFT;
        } else if ((player.pieceCoordinates.length === 1 || player.col >= player.pieceCoordinates[1][1]) && DIRECTIONS.RIGHT.find((e) => e === key)) {
            player.direction = GAME_CONSTANTS.DIRECTION.RIGHT;
        }
    } else if (game_state === GAME_CONSTANTS.STATE.DEAD) {
        if (key === 'q') {
            AI.isOn = !AI.isOn;
            console.log(`AI: ${AI.isOn}`);
        }
        if (key === ' ') {
            clearEndScreen();
            loadGame();
        }
    }
});

// work in progress
const determineAiPath = () => {
    const createNode = (row, col, previousNode, length) => {
        return {
            r: row,
            c: col,
            prev: previousNode,
            length: length
        };
    };
    const visitedGrid = [];
    for (let r = 0; r <= GAME_CONSTANTS.GRID.ROWS; r++) {
        const row = [];
        for (let c = 0; c <= GAME_CONSTANTS.GRID.COLUMNS; c++) {
            row.push(false);
        }
        visitedGrid.push(row);
    }
    const print = () => {
        let str = '';
        visitedGrid.forEach((row) => {
            row.forEach((col) => {
                str += (col ? '#' : '.');
            });
            str = str.trim() + '\n';
        });
        str = str.trim();
        console.log(str);
    };
    player.pieceCoordinates.forEach((coordinate, i) => {
        if (i > 0) {
            const [row, col] = coordinate;
            visitedGrid[row][col] = true;
        }
    });
    const dr = [0, 0, -1, 1], dc = [1, -1, 0, 0];
    const queue = [createNode(player.row, player.col, null, 1)];
    let pathNode = null;
    while (queue.length > 0) {
        const cur = queue.splice(0, 1)[0];
        if (visitedGrid[cur.r][cur.c])
            continue;
        visitedGrid[cur.r][cur.c] = true;
        if (cur.r === fruit.row && cur.c === fruit.col) {
            pathNode = cur;
            break;
        }
        for (let i = 0; i < dr.length; i++) {
            const r = cur.r + dr[i];
            const c = cur.c + dc[i];
            if (r < 0 || c < 0 || r >= visitedGrid.length || c >= visitedGrid[0].length)
                continue;
            queue.push(createNode(r, c, cur, cur.length + 1));
        }
    }
    if (pathNode) {
        let prevUsed = pathNode;
        let cur = pathNode.prev;
        while (cur) {
            const velR = prevUsed.r - cur.r;
            const velC = prevUsed.c - cur.c;
            if (velR === 0) {
                if (velC === 1) {
                    AI.pathDirection.push(GAME_CONSTANTS.DIRECTION.RIGHT);
                } else {
                    AI.pathDirection.push(GAME_CONSTANTS.DIRECTION.LEFT);
                }
            } else {
                if (velR === 1) {
                    AI.pathDirection.push(GAME_CONSTANTS.DIRECTION.DOWN);
                } else {
                    AI.pathDirection.push(GAME_CONSTANTS.DIRECTION.UP);
                }
            }
            prevUsed = cur;
            cur = cur.prev;
        }
    }
};

initialSetup();