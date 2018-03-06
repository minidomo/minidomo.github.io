document.onkeydown = keyDown;
document.onkeyup = keyUp;

var player = { w: 50, h: 50, x: 0, y: 0, velX: 0, velY: 0, right: false, left: false, up: false, down: false };
var running = false;

function update() {
    if(!running)
        clearInterval(update());
    playerUpdate();
}

function playerUpdate() {
    if (player.up) player.velY = -3;
    else if (!player.down) player.velY = 0;

    if (player.down) player.velY = 3;
    else if (!player.up) player.velY = 0;

    if (player.right) player.velX = 3;
    else if (!player.left) player.velX = 0;

    if (player.left) player.velX = -3;
    else if (!player.right) player.velX = 0;

    player.x += player.velX;
    player.y += player.velY;
    player.x = clamp(player.x, 0, 320 - player.w);
    player.y = clamp(player.y, 0, 450 - player.h);
    document.getElementById('person').style.left = player.x + 'px';
    document.getElementById('person').style.top = player.y + 'px';
}

function clamp(val, min, max) {
    if (val >= max)
        return max;
    else if (val <= min)
        return min;
    else
        return val;
}

function keyDown(e) {
    var key = e.keyCode;
    // alert(key);
    // W
    if (key == 87)
        player.up = true;
    // S
    if (key == 83)
        player.down = true;
    // A
    if (key == 65)
        player.left = true;
    // D
    if (key == 68)
        player.right = true;
}

function keyUp(e) {
    var key = e.keyCode;
    // alert(key);
    // W
    if (key == 87)
        player.up = false;
    // S
    if (key == 83)
        player.down = false;
    // A
    if (key == 65)
        player.left = false;
    // D
    if (key == 68)
        player.right = false;
}

function startGame() {
    alert("Game started");
    running = true;
    setInterval("update()", 17);
}

function stopGame() {
    running = false;
    alert("Game ended");
}