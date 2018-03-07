document.onmousedown = mouseDown;
document.onmouseup = mouseUp;
document.ontouchstart = touchStart;
document.ontouchend = touchEnd;

var player = {
    w: 25,
    h: 25,
    x: 220,
    y: 269,
    velY: 0,
    maxVelY: 6,
    isJumping: false
};

var running = false;
var gravity = 0.6;

function update() {
    if (!running)
        clearInterval(update());
    playerUpdate();
}

function reset() {
    player.x = 220;
    player.y = 269;
    player.velY = 1;
    document.getElementById('bird').style.left = player.x + 'px';
    document.getElementById('bird').style.top = player.y + 'px';
}

function playerUpdate() {
    fall();
    player.y += player.velY;
    if (player.isJumping)
        player.velY = -8;
    document.getElementById('bird').style.top = player.y + 'px';
}

function fall() {
    player.velY += gravity;
    if (player.velY >= player.maxVelY)
        player.velY = player.maxVelY;
}

function mouseDown(ev) {
    player.isJumping = true;
}

function mouseUp(ev) {
    player.isJumping = false;
}

function touchStart(e) {
    player.isJumping = true;
}

function touchEnd(e) {
    player.isJumping = false;
}

function start() {
    // alert("working");
    running = true;
    reset();
    setInterval("update()", 17);
}
