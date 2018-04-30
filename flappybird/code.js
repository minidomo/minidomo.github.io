setStyle("game", "font-family: Consolas;");
setStyle("endGame", "font-family: Consolas;");
setStyle("endPlayAgain", "font-family: Consolas;");
setStyle("resetVals", "font-family:Consolas;");
if (randomNumber(0, 1) === 0) {
    hideElement("backNight");
    showElement("backDay");
} else {
    hideElement("backDay");
    showElement("backNight");
}
var loop;
var first;
var second;
var bird;
var land;
var gameover;
var alive = true;
var firstTime = true;
var score = 0;
var best = 0;

function update() {
    first.move();
    second.move();
    bird.move();
    land.move();
    bird.pass();
    bird.collide();
    if (!alive) {
        gameover.animate();
    }
}

function reset() {
    if (!firstTime) {
        if (randomNumber(0, 1) === 0) {
            hideElement("backNight");
            showElement("backDay");
        } else {
            hideElement("backDay");
            showElement("backNight");
        }
    }
    loop = setInterval(update, 17);
    first = new pipes(392, randomNumber(159, 335), "botPipe", "topPipe");
    second = new pipes(618, randomNumber(159, 335), "bot2Pipe", "top2Pipe");
    bird = new birdObj("bird");
    land = new landObj("floorBar");
    alive = true;
    score = 0;
    setText("displayScore", score);
}

function landObj(idname) {
    var x = 0;
    var y = 375;
    var id = idname;
    this.velX = -2;

    this.move = function () {
        if (alive) {
            x += this.velX;
            if (x <= -47) // length of 1 block
                x = 0;
            setPosition(id, x, y);
        }
    };
}

function gameoverObj(idname, idname2, idname3, idname4, idname5, idname6) {
    var x = 28;
    var y = 450;
    var velY = 37;
    var x1 = 24;
    var y1 = 450;
    var velY1 = 29;

    setPosition(idname, x, y);
    setPosition(idname2, x1, y1);
    showElement(idname);
    showElement(idname2);

    this.animate = function () {
        if (y !== 80)
            moveGameover();
        if (y === 80 && y1 !== 160)
            moveScorepanel();
        if (y1 === 160) {
            showElement(idname5);
            showElement(idname6);
            if (score > best)
                best = score;
            format(idname3, 200, score);
            format(idname4, 250, best);
            showElement(idname3);
            showElement(idname4);
            if (bird.onFloor())
                clearInterval(loop);
        }
    };

    this.hide = function () {
        hideElement(idname);
        hideElement(idname2);
        hideElement(idname3);
        hideElement(idname4);
        hideElement(idname5);
        hideElement(idname6);
    };

    function moveGameover() {
        y -= velY;
        if (y < 80)
            y = 80;
        setPosition(idname, x, y);
    }

    function moveScorepanel() {
        y1 -= velY1;
        if (y1 < 160)
            y1 = 160;
        setPosition(idname2, x1, y1);
    }

    function format(id, y, num) {
        if (num < 10) {
            setPosition(id, 250, y);
            setProperty(id, "width", 16);
        } else if (num > 9 && num < 100) {
            setPosition(id, 238, y);
            setProperty(id, "width", 28);
        } else if (num > 99) {
            setPosition(id, 227, y);
            setProperty(id, "width", 39);
        }
        setText(id, num);
    }
}

function birdObj(idname) {
    var id = idname;
    var x = 50;
    var y = 200;
    this.velY = 0;
    var maxVelY = 8;
    var width = 36;
    var height = 25;
    var gravity = 0.5;
    this.jump = false;

    this.move = function () {
        this.velY = fall(this.velY);
        y += this.velY;
        y = clamp(y, 0, 375 - height); // height of the platform
        if (this.jump && alive)
            this.velY = -6;
        setPosition(id, x, y);
    };

    this.pass = function () {
        if (alive) {
            var val = x + width;
            if (val === first.x + (first.width / 2) || val === second.x + (second.width / 2)) {
                setText("displayScore", ++score);
                format();
                playSound("assets/flappyBirdScore.mp3");
            }
        }
    };

    this.collide = function () {
        if (alive) {
            if (collide(first.x, first.y, first.width, first.height) || collide(second.x, second.y, second.width, second.height) ||
                collide(first.x, first.y2, first.width, first.height) || collide(second.x, second.y2, second.width, second.height)) {
                alive = false;
            }
            if (y === 375 - height) // touches ground
                alive = false;
            if (!alive) {
                playSound("assets/flappyBirdDie.mp3");
                gameover = new gameoverObj("gameOver", "scorePanel", "scorePanelScore", "scorePanelBest", "playAgainBut", "quitBut");
            }
        }
    };

    this.onFloor = function () {
        return y === 375 - height;
    };

    function format() {
        if (score < 10) {
            setPosition("displayScore", 147, 30);
            setProperty("displayScore", "width", 26);
        } else if (score > 9 && score < 100) {
            setPosition("displayScore", 136, 30);
            setProperty("displayScore", "width", 48);
        } else if (score > 99) {
            setPosition("displayScore", 128, 30);
            setProperty("displayScore", "width", 64);
        }
    }

    function collide(x1, y1, w1, h1) {
        return x < x1 + w1 && x + width > x1 && y < y1 + h1 && y + height > y1;
    }

    function fall(velY) {
        velY += gravity;
        if (this.velY >= maxVelY)
            this.velY = maxVelY;
        return velY;
    }

    function clamp(val, min, max) {
        if (val >= max)
            return max;
        else if (val <= min)
            return min;
        else
            return val;
    }
}

function pipes(xval, yval, idname, idname2) {
    this.x = xval;
    this.y = yval;
    var id = idname;
    var id2 = idname2;
    this.y2 = this.y - 444;

    // constants
    this.width = 72;
    this.height = 324;
    var vel = 2;

    this.move = function () {
        if (alive) {
            if (this.x <= -this.width) {
                this.x = 392;
                this.y = randomNumber(159, 335);
                this.y2 = this.y - 444;
            }
            this.x -= vel;
            setPosition(id, this.x, this.y);
            setPosition(id2, this.x, this.y2);
        }
    };
}

onEvent("game", "keydown", function (event) {
    var key = event.key;
    if ((key === " " || key === "w" || key === "Up") && alive) {
        if (firstTime) {
            reset();
            showElement("displayScore");
            firstTime = false;
        }
        if (!bird.jump) {
            stopSound("assets/flappyBirdJump.mp3");
            playSound("flappyBirdJump.mp3");
            bird.jump = true;
        }
    }

    // play again
    if (key === "d" && !alive) {
        gameover.hide();
        reset();
    }

    // quit
    if (key === "f" && !alive) {
        setScreen("endGame");
        gameover.hide();
    }
});

onEvent("game", "keyup", function (event) {
    var key = event.key;
    if (key === " " || key === "w" || key === "Up") {
        bird.jump = false;
    }
});

onEvent("playAgainBut", "click", function () {
    gameover.hide();
    reset();
});

onEvent("quitBut", "click", function () {
    setScreen("endGame");
    gameover.hide();
});

onEvent("resetVals", "click", function () {
    setScreen("game");
    best = 0;
    reset();
});

onEvent("endPlayAgain", "click", function () {
    setScreen("game");
    reset();
});