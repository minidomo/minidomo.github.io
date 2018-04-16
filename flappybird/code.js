var player = { x: 50, y: 200, velY: 0, width: 36, height: 25, maxVelY: 8 };
var barObj = { x: 0, y: 375, velX: 2 };
var gameOverSign = { x: 28, y: 450, velY: 0 };
var bPipe = { x: 392, y: randomNumber(159, 335), width: 72, height: 324, velX: 2 };
var tPipe = { x: 392, y: bPipe.y - 444, width: 72, height: 324, velX: 2 };
var b2Pipe = { x: 618, y: randomNumber(159, 335), width: 72, height: 324, velX: 2 };
var t2Pipe = { x: 618, y: b2Pipe.y - 444, width: 72, height: 324, velX: 2 };
var scorePos = { x: 147, y: 30, width: 26 };
var scorePanelSign = { x: 24, y: 450, velY: 0 };
var score = 0;
var isJumping;
var gravity = 0.5;
var isDead;
var deadSound = 0;
var jumpSound = 0;
var bestScore = 0;
var scoreCount = 0;
var isRunning;
var round = 0;
var scores = [];
var countScores = 0;

function update() {
    toStop();
    bird();
    dead();
    checkPass();
    checkCol();
    bar();
    movePipes();
    moveScorePanel();
    moveGameOver();
    makeScore();
}

// objects
function bird() {
    fall();
    player.y += player.velY;
    player.y = clamp(player.y, 0, 375 - player.height);
    if (isJumping) {
        player.velY = -6;
    }
    setPosition("bird", player.x, player.y);
}

function bar() {
    barObj.x -= barObj.velX;
    if (barObj.x <= -47) barObj.x = 0;
    if (isDead) barObj.velX = 0;
    setPosition("floorBar", barObj.x, barObj.y);
}

function moveGameOver() {
    if (isDead) {
        showElement("gameOver");
        gameOverSign.y = clamp(gameOverSign.y, 80 + gameOverSign.velY, 450);
        gameOverSign.y -= gameOverSign.velY;
        setPosition("gameOver", gameOverSign.x, gameOverSign.y);
    }
}

function moveScorePanel() {
    if (gameOverSign.y === 80) {
        showElement("scorePanel");
        scorePanelSign.y = clamp(scorePanelSign.y, 160 + scorePanelSign.velY, 450);
        scorePanelSign.y -= scorePanelSign.velY;
        setPosition("scorePanel", scorePanelSign.x, scorePanelSign.y);
        if (scorePanelSign.y === 160) {
            showElement("playAgainBut");
            showElement("quitBut");
        }
    }
}

function makeScore() {
    if (!isDead) {
        if (score < 10) {
            setPosition("displayScore", 147, scorePos.y);
            setProperty("displayScore", "width", 26);
        } else if (score > 9 && score < 100) {
            setPosition("displayScore", 136, scorePos.y);
            setProperty("displayScore", "width", 48);
        } else if (score > 99) {
            setPosition("displayScore", 128, scorePos.y);
            setProperty("displayScore", "width", 64);
        }
        setText("displayScore", score);
    } else {
        hideElement("displayScore");
        setStyle("scorePanelScore", "font-family: monospace;");
        setStyle("scorePanelBest", "font-family: monospace;");
        if (scorePanelSign.y === 160) {
            showElement("scorePanelScore");
            showElement("scorePanelBest");
            if (score < 10) {
                setPosition("scorePanelScore", 250, 200);
                setProperty("scorePanelScore", "width", 16);
            } else if (score > 9 && score < 100) {
                setPosition("scorePanelScore", 238, 200);
                setProperty("scorePanelScore", "width", 28);
            } else if (score > 99) {
                setPosition("scorePanelScore", 227, 200);
                setProperty("scorePanelScore", "width", 39);
            }
            setText("scorePanelScore", score);
            if (score > bestScore) bestScore = score;
            if (bestScore < 10) {
                setPosition("scorePanelBest", 250, 250);
                setProperty("scorePanelBest", "width", 16);
            } else if (bestScore > 9 && bestScore < 100) {
                setPosition("scorePanelBest", 238, 250);
                setProperty("scorePanelBest", "width", 28);
            } else if (bestScore > 99) {
                setPosition("scorePanelBest", 227, 250);
                setProperty("scorePanelBest", "width", 39);
            }
            setText("scorePanelBest", bestScore);
        }
    }
}

function movePipes() {
    var num = randomNumber(159, 335);
    if (isDead) {
        tPipe.velX = 0;
        bPipe.velX = 0;
        t2Pipe.velX = 0;
        b2Pipe.velX = 0;
    }
    if (tPipe.x <= -72 && bPipe.x <= -72) {
        tPipe.x = 392;
        bPipe.x = 392;
        bPipe.y = num;
        tPipe.y = bPipe.y - 444;
    }
    if (t2Pipe.x <= -72 && b2Pipe.x <= -72) {
        t2Pipe.x = 392;
        b2Pipe.x = 392;
        b2Pipe.y = num;
        t2Pipe.y = b2Pipe.y - 444;
    }
    tPipe.x -= tPipe.velX;
    bPipe.x -= bPipe.velX;
    t2Pipe.x -= t2Pipe.velX;
    b2Pipe.x -= b2Pipe.velX;

    setPosition("topPipe", tPipe.x, tPipe.y);
    setPosition("botPipe", bPipe.x, bPipe.y);
    setPosition("top2Pipe", t2Pipe.x, t2Pipe.y);
    setPosition("bot2Pipe", b2Pipe.x, b2Pipe.y);
}

// other functions
function fall() {
    player.velY += gravity;
    if (player.velY > player.maxVelY) player.velY = player.maxVelY;
}

function dead() {
    if (player.y === 375 - player.height) {
        isDead = true;
        if (deadSound === 0) {
            playSound("assets/flappyBirdDie.mp3", false);
            deadSound++;
        }
    }
}

function checkPass() {
    if (!isDead) {
        if (player.x + player.width === tPipe.x + 36 || player.x + player.width === t2Pipe.x + 36) {
            score++;
            playSound("assets/flappyBirdScore.mp3");
        }
    }
}

function checkCol() {
    if (player.x < bPipe.x + bPipe.width &&
        player.x + player.width > bPipe.x &&
        player.y < bPipe.y + bPipe.height &&
        player.height + player.y > bPipe.y) {
        isDead = true;
        if (deadSound === 0) {
            playSound("flappyBirdDie.mp3", false);
            deadSound++;
        }
    }
    else if (player.x < tPipe.x + tPipe.width &&
        player.x + player.width > tPipe.x &&
        player.y < tPipe.y + tPipe.height &&
        player.height + player.y > tPipe.y) {
        isDead = true;
        if (deadSound === 0) {
            playSound("flappyBirdDie.mp3", false);
            deadSound++;
        }
    }
    else if (player.x < b2Pipe.x + b2Pipe.width &&
        player.x + player.width > b2Pipe.x &&
        player.y < b2Pipe.y + b2Pipe.height &&
        player.height + player.y > b2Pipe.y) {
        isDead = true;
        if (deadSound === 0) {
            playSound("flappyBirdDie.mp3", false);
            deadSound++;
        }
    }
    else if (player.x < t2Pipe.x + t2Pipe.width &&
        player.x + player.width > t2Pipe.x &&
        player.y < t2Pipe.y + t2Pipe.height &&
        player.height + player.y > t2Pipe.y) {
        isDead = true;
        if (deadSound === 0) {
            playSound("flappyBirdDie.mp3", false);
            deadSound++;
        }
    }
}

function clamp(val, min, max) {
    if (val >= max)
        return max;
    else if (val <= min)
        return min;
    else
        return val;
}

function toStop() {
    if (!isRunning) stopTimedLoop();
}

function reset() {
    player.y = 200;
    player.velY = 0;
    isJumping = false;
    isDead = false;
    barObj.x = 0;
    barObj.velX = 2;
    gameOverSign.y = 450;
    gameOverSign.velY = 37;
    tPipe.velX = 2;
    bPipe.velX = 2;
    tPipe.x = 392;
    bPipe.x = 392;
    t2Pipe.velX = 2;
    b2Pipe.velX = 2;
    t2Pipe.x = 618;
    b2Pipe.x = 618;
    score = 0;
    deadSound = 0;
    scorePos.x = 147;
    scorePos.width = 26;
    stopSound("flappyBirdDie.mp3");
    if (randomNumber(0, 1) === 0) {
        hideElement("backDay");
        showElement("backNight");
    } else {
        hideElement("backNight");
        showElement("backDay");
    }
    scorePanelSign.y = 450;
    scorePanelSign.velY = 29;
    hideElement("playAgainBut");
    hideElement("gameOver");
    hideElement("scorePanel");
    hideElement("scorePanelScore");
    hideElement("scorePanelBest");
    showElement("displayScore");
    scoreCount = 0;
    hideElement("quitBut");
    countScores = 0;
}

// event handlers
onEvent("playBut", "click", function () {
    setScreen("game");
    setStyle("game", "font-family: monospace;");
    isRunning = true;
    reset();
    timedLoop(17, update);
});

onEvent("game", "keydown", function (event) {
    if (!isDead) {
        if (event.key == " " || event.key == "Up") {
            isJumping = true;
            stopSound("assets/flappyBirdJump.mp3");
            if (jumpSound === 0) {
                playSound("flappyBirdJump.mp3", false);
                jumpSound++;
            }
        }
        // console.log("Jumping");
    } else {
        // console.log("You are dead");
        if (event.key == "d" || event.key == "Left") {
            scores.push(score);
            reset();
            round++;
        }
    }
});

onEvent("game", "keyup", function (event) {
    if (event.key == " " || event.key == "Up") {
        isJumping = false;
        jumpSound = 0;
    }
});

onEvent("playAgainBut", "click", function () {
    scores.push(score);
    reset();
    round++;
});

onEvent("quitBut", "click", function () {
    isRunning = false;
    setScreen("endGame");
    setStyle("endGame", "font-family: monospace;");
    setStyle("button1", "font-family: monospace;");
    round++;
    scores.push(score);
    var attemps = "";
    var scoreString = "";
    for (var s = 0; s < round; s++) {
        attemps += (s + 1) + "\n";
        scoreString += scores[s] === undefined ? -1 + "\n" : scores[s] + "\n";
    }
    setText("allAttemps", attemps);
    setText("allScores", scoreString);
});

onEvent("button1", "click", function () {
    hideElement("mobileJump");
    setScreen("menu");
    round = 0;
    while (0 < scores.length) scores.shift();
    bestScore = 0;
});

onEvent("label4", "mouseover", function () {
    showElement("attempLab");
    showElement("scoreLab");
    showElement("allAttemps");
    showElement("allScores");
});
onEvent("label4", "mouseout", function () {
    hideElement("attempLab");
    hideElement("scoreLab");
    hideElement("allAttemps");
    hideElement("allScores");
});

onEvent("game", "mousedown", function () {
    if (!isDead) {
        isJumping = true;
        stopSound("flappyBirdJump.mp3");
        if (jumpSound === 0) {
            playSound("flappyBirdJump.mp3", false);
            jumpSound++;
        }
        // console.log("Jumping");
    }
});

onEvent("game", "mouseup", function () {
    isJumping = false;
    jumpSound = 0;
});

// extra
setStyle("menu", "font-family: monospace;");
setStyle("playBut", "font-family: monospace;");
setStyle("mobBut", "font-family: monospace;");
setStyle("label3", "font-weight: bold;");
setStyle("label2", "font-weight: bold;");
setStyle("label5", "font-weight: bold;");
setStyle("playBut", "font-weight: bold;");
setStyle("mobBut", "font-weight: bold;");