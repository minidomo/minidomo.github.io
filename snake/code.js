setText("instructions", "Press WASD or Arrow Keys to move\n\nPress Spacebar or click Play Again to play again\n\n\nPress Spacebar to start the game");
setStyle("game", "font-family: Lucida Console;");

var snake = {
    x: 0,
    y: 0,
    w: 10,
    h: 10,
    velX: 0,
    velY: 0,
    IDandLength: 1,
    moves: [],
    didCrash: false
};
var fruit = {
    x: 0,
    y: 0,
    w: 10,
    h: 10
};
var ai = {
    b: false,
    o: false,
    t: false,
    access: false,
};
var points = {
    x: [],
    y: []
};

for (var a = 10; a < 310; a += 10)
    points.x.push(a);
for (var a = 20; a < 440; a += 10)
    points.y.push(a);

var doGameOver = 0;
var startUp = true;
var highscore = 1;
// localStorage does not work on Code.org
var hasLocalStorage = typeof (Storage) !== "undefined";
if (hasLocalStorage && localStorage.getItem('highscore') !== null)
    highscore = parseInt(localStorage.getItem('highscore'));
else if (hasLocalStorage)
    localStorage.setItem('highscore', '1');

function snakeObj() {
    if (ai.access)
        aiBot();

    if (snake.x > 300 || snake.x < 10 || snake.y > 430 || snake.y < 20)
        deathAction();

    if (!snake.didCrash) {

        if (snake.moves.length == snake.IDandLength + 1)
            snake.moves.pop();
        snake.moves.splice(0, 0, snake.x + " " + snake.y);

        if (snakeCol(fruit.x, fruit.y, fruit.w, fruit.h))
            addNewBlock();

        setPosition("snake", snake.x, snake.y, snake.w, snake.h);

        for (var a = 1; a < snake.IDandLength; a++) {
            var coords = snake.moves[a].split(" ");

            var x = parseInt(coords[0]);
            var y = parseInt(coords[1]);

            setPosition("" + a, x, y, 10, 10);

            if (snakeCol(x, y, snake.w, snake.h))
                deathAction();
        }
    }
    snake.x += snake.velX;
    snake.y += snake.velY;
}

function deathAction() {
    stopTimedLoop();
    snake.didCrash = true;

    if (doGameOver == 0) {
        doGameOver++;
        gameOver();
    }
}

// inspired from https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
function snakeCol(x1, y1, w1, h1) {
    return x1 < snake.x + snake.w && x1 + w1 > snake.x && y1 < snake.y + snake.h && h1 + y1 > snake.y;
}

function addNewBlock() {
    var coords = snake.moves[snake.IDandLength].split(" ");
    var x = parseInt(coords[0]);
    var y = parseInt(coords[1]);

    image("" + snake.IDandLength, "assets/greenBox.png");
    setPosition("" + snake.IDandLength, x, y, 10, 10);

    snake.IDandLength++;

    fruit.x = points.x[randomNumber(0, points.x.length - 1)];
    fruit.y = points.y[randomNumber(0, points.y.length - 1)];

    while (xyIsSame(fruit.x, fruit.y)) {
        fruit.x = points.x[randomNumber(0, points.x.length - 1)];
        fruit.y = points.y[randomNumber(0, points.y.length - 1)];
    }

    setPosition("fruit", fruit.x, fruit.y, fruit.w, fruit.h);

    setText("scorelabel", "Score: " + snake.IDandLength);
}

function xyIsSame(x, y) {
    return snake.moves.indexOf(x + " " + y) >= 0;
}

function gameOver() {
    if (snake.IDandLength > highscore) {
        highscore = snake.IDandLength;
        // localStorage does not work on Code.org
        if (hasLocalStorage && highscore > parseInt(localStorage.getItem('highscore')))
            localStorage.setItem('highscore', '' + highscore);
    }

    setText("highscorelabel", "Best: " + highscore);

    textLabel("gameOverLabel", "G A M E  O V E R");
    textLabel("endScoreLabel", "Score: " + snake.IDandLength);
    button("playagainButt", "Play Again");

    setProperty("gameOverLabel", "text-align", "center");
    setProperty("endScoreLabel", "text-align", "center");
    setProperty("playagainButt", "text-align", "center");

    setProperty("gameOverLabel", "text-color", "white");
    setProperty("endScoreLabel", "text-color", "white");

    setProperty("playagainButt", "background-color", "#2bbecc");

    setPosition("gameOverLabel", 90, 165, 140, 20);
    setPosition("endScoreLabel", 110, 185, 100, 20);
    setPosition("playagainButt", 110, 215, 100, 30);

    setProperty("playagainButt", "font-size", 12);

    setStyle("playagainButt", "font-family: Lucida Console; font-weight: bold;");

    onEvent("playagainButt", "click", function () {
        deleteElement("gameOverLabel");
        deleteElement("endScoreLabel");
        deleteElement("playagainButt");

        hideElement("snake");
        hideElement("fruit");
        for (var a = 1; a < snake.IDandLength; a++)
            hideElement("" + a);

        reset();
    });

    var resetOnce = true;

    if (ai.access && resetOnce) {
        deleteElement("gameOverLabel");
        deleteElement("endScoreLabel");
        deleteElement("playagainButt");
        hideElement("snake");
        hideElement("fruit");
        reset();
        resetOnce = false;
    }

    onEvent("game", "keydown", function (event) {
        var key = event.key;

        if (key == " " && resetOnce) {
            deleteElement("gameOverLabel");
            deleteElement("endScoreLabel");
            deleteElement("playagainButt");
            hideElement("snake");
            hideElement("fruit");
            for (var a = 1; a < snake.IDandLength; a++)
                hideElement("" + a);
            reset();
            resetOnce = false;
        }

        if (key == "r" && resetOnce) {
            startUp = true;
            ai.access = false;
            ai.b = false;
            ai.o = false;
            ai.t = false;
            highscore = 0;

            showElement("instructions");
            setText("scorelabel", "");
            setText("highscorelabel", "");

            deleteElement("gameOverLabel");
            deleteElement("endScoreLabel");
            deleteElement("playagainButt");
            hideElement("snake");
            hideElement("fruit");
            for (var a = 1; a < snake.IDandLength; a++)
                hideElement("" + a);
            resetOnce = false;
        }
    });
}

function reset() {
    setScreen("game");

    for (var a = 1; a < snake.IDandLength; a++)
        deleteElement("" + a);

    snake.IDandLength = 1;
    doGameOver = 0;
    snake.didCrash = false;

    snake.x = points.x[randomNumber(0, points.x.length - 1)];
    snake.y = points.y[randomNumber(0, points.y.length - 1)];

    snake.moves = [snake.x + " " + snake.y];

    fruit.x = points.x[randomNumber(0, points.x.length - 1)];
    fruit.y = points.y[randomNumber(0, points.y.length - 1)];
    while (xyIsSame(fruit.x, fruit.y)) {
        fruit.x = points.x[randomNumber(0, points.x.length - 1)];
        fruit.y = points.y[randomNumber(0, points.y.length - 1)];
    }

    giveDirection();

    setPosition("snake", snake.x, snake.y, snake.w, snake.h);
    setPosition("fruit", fruit.x, fruit.y, fruit.w, fruit.h);
    setText("scorelabel", "Score: 1");
    showElement("snake");
    showElement("fruit");

    timedLoop(50, snakeObj);
}

function giveDirection() {
    if (snake.x <= 160 && snake.y <= 230) // quadrant 2
        if (randomNumber(0, 1) == 0)
            down();
        else
            right();
    else if (snake.x < 160 && snake.y > 230) // quadrant 3
        if (randomNumber(0, 1) == 0)
            up();
        else
            right();
    else if (snake.x >= 160 && snake.y <= 230) // quadrant 1
        if (randomNumber(0, 1) == 0)
            down();
        else
            left();
    else // quadrant 4
        if (randomNumber(0, 1) == 0)
            up();
        else
            left();
}

function aiBot() {
    if (fruit.x == 10 || fruit.x == 300 || fruit.y == 20 || fruit.y == 430) {

        if (fruit.x == 10 || fruit.x == 300) {
            if (snake.y != fruit.y) {
                if (isDown() || isUp())
                    if (snake.x == 10)
                        right();
                    else if (snake.x == 300)
                        left();
                    else
                        if (randomNumber(0, 1) == 0)
                            left();
                        else
                            right();
                if (isRight() || isLeft())
                    if (snake.y > fruit.y)
                        up();
                    else if (snake.y < fruit.y)
                        down();
            } else {
                if (snake.x == fruit.x)
                    if (snake.y > 200)
                        up();
                    else
                        down();
                else if (fruit.x == 10)
                    left();
                else if (fruit.x == 300)
                    right();
            }
        }

        if (fruit.y == 20 || fruit.y == 430) {
            if (snake.x != fruit.x) {
                if (isRight() || isLeft())
                    if (snake.y == 20)
                        down();
                    else if (snake.y == 430)
                        up();
                    else
                        if (randomNumber(0, 1) == 0)
                            down();
                        else
                            up();
                if (isDown() || isUp())
                    if (snake.x > fruit.x)
                        left();
                    else if (snake.x < fruit.x)
                        right();
            } else {
                if (snake.y == fruit.y)
                    if (snake.x > 160)
                        left();
                    else
                        right();
                else if (fruit.y == 20)
                    up();
                else if (fruit.y == 430)
                    down();
            }

        }

    } else {
        if (snake.x > fruit.x && !isLeft()) {
            if (!isDown() && snake.y > fruit.y - 10)
                up();
            else if (isDown() && snake.y > fruit.y - 10)
                left();
            if (!isUp() && snake.y < fruit.y + 10)
                down();
            else if (isUp() && snake.y < fruit.y + 10)
                left();
            if (snake.y == fruit.y)
                left();
        }
        if (snake.x < fruit.x && !isRight()) {
            if (!isDown() && snake.y > fruit.y - 10)
                up();
            else if (isDown() && snake.y > fruit.y - 10)
                right();
            if (!isUp() && snake.y < fruit.y + 10)
                down();
            else if (isUp() && snake.y < fruit.y + 10)
                right();
            if (snake.y == fruit.y)
                right();

        }
        if (snake.x == fruit.x) {
            if (!isDown() && snake.y > fruit.y + 10)
                up();
            else if (isDown() && snake.y > fruit.y + 10)
                if (snake.x == 10)
                    right();
                else if (snake.x == 300)
                    left();
            if (!isUp() && snake.y < fruit.y - 10)
                down();
            else if (isUp() && snake.y < fruit.y - 10)
                if (snake.x == 10)
                    right();
                else if (snake.x == 300)
                    left();
        }
    }
}

onEvent("game", "keydown", function (event) {
    var key = event.key;

    if (startUp) {
        if (key == " ") {
            startUp = false;
            hideElement("instructions");
            setText("highscorelabel", "Best: " + highscore);
            reset();
        } else {
            if (key != "b" && key != "o" && key != "t") {
                ai.b = false;
                ai.o = false;
                ai.t = false;
                ai.access = false;
            }
            if (key == "b")
                ai.b = true;
            if (ai.b && key == "o")
                ai.o = true;
            if (key == "t")
                if (ai.o)
                    ai.t = true;
                else
                    ai.b = false;
            if (ai.b && ai.o && ai.t)
                ai.access = true;
        }
    } else {
        var coords = snake.moves[1].split(" ");
        var oldx = parseInt(coords[0]);
        var oldy = parseInt(coords[1]);
        if (!isDown() && (key == "w" || key == "Up"))
            up();
        if (!isUp() && (key == "s" || key == "Down"))
            down();
        if (!isRight() && (key == "a" || key == "Left"))
            left();
        if (!isLeft() && (key == "d" || key == "Right"))
            right();
        if (key == "r" && ai.access) {
            stopTimedLoop();
            startUp = true;
            ai.access = false;
            ai.b = false;
            ai.o = false;
            ai.t = false;
            highscore = 0;

            showElement("instructions");
            setText("scorelabel", "");
            setText("highscorelabel", "");

            hideElement("snake");
            hideElement("fruit");
            for (var a = 1; a < snake.IDandLength; a++)
                hideElement("" + a);
        }
    }
});

// these are functions for to set velX and velY variables to indicate movement of the snake
function up() {
    snake.velY = -10;
    snake.velX = 0;
}

function down() {
    snake.velY = 10;
    snake.velX = 0;
}

function left() {
    snake.velX = -10;
    snake.velY = 0;
}

function right() {
    snake.velX = 10;
    snake.velY = 0;
}

// these are functions to check if the snake is currently going in a certain direction
function isUp() {
    return snake.velY == -10 && snake.velX == 0;
}

function isDown() {
    return snake.velY == 10 && snake.velX == 0;
}

function isLeft() {
    return snake.velX == -10 && snake.velY == 0;
}

function isRight() {
    return snake.velX == 10 && snake.velY == 0;
}