// JavaScript程式碼
let startTime = 0;
let gameRunning = false;
let playerInterval = null;
let obstacleInterval = null;
let finishLineInterval = null;
let obstacleSpeed = 5; // 障礙物速度 (單位: 像素/毫秒)
let playerLeft = 0; // 紅點初始左位移
let gameendmode = false;

function startGame() {
    document.getElementById('game-screen').style.display = 'block';
    document.querySelector('#button-div').style.display = 'none';
    startTime = new Date().getTime();
    gameRunning = true;

    // 開始自動移動
    playerInterval = setInterval(movePlayer, 10);
    obstacleInterval = setInterval(moveObstacles, 10);
    setTimeout(showFinishLine, 30000);

    // 監聽鍵盤事件
    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('keyup', handleKeyRelease);
}

function handleKeyPress(event) {
    if (!gameRunning) return;

    if (event.key === 'ArrowLeft' || event.key === 'a') {
        playerLeft = -1; // 左移
    } else if (event.key === 'ArrowRight' || event.key === 'd') {
        playerLeft = 1; // 右移
    }
}

function handleKeyRelease(event) {
    if (!gameRunning) return;

    if (
        (event.key === 'ArrowLeft' || event.key === 'a') &&
        playerLeft === -1
    ) {
        playerLeft = 0; // 停止左移
    } else if (
        (event.key === 'ArrowRight' || event.key === 'd') &&
        playerLeft === 1
    ) {
        playerLeft = 0; // 停止右移
    }
}

function movePlayer() {
    if (!gameRunning) return;

    const player = document.getElementById('player');
    const currentLeft = parseInt(player.style.left) || 0;
    const newLeft = currentLeft + playerLeft * 5;

    // 限制只能在畫面範圍內移動
    if (newLeft < 0) player.style.left = '0px';
    else if (newLeft > 780) player.style.left = '780px';
    else player.style.left = newLeft + 'px';

    // 檢查是否碰到終點線
    const finishLine = document.getElementById('finish-line');
    const finishLineTop = parseInt(finishLine.style.top) || 0;
    if (570 <= finishLineTop + 20 && 570 + 20 >= finishLineTop) {
        // 碰到終點線，完成遊戲
        endGame(true);
        return;
    }

    // 檢查是否撞到障礙物
    const obstacles = document.getElementsByClassName('obstacle');
    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        const obstacleLeft = parseInt(obstacle.style.left) || 0;
        const obstacleTop = parseInt(obstacle.style.top) || 0;

        if (
            newLeft + 20 > obstacleLeft &&
            newLeft < obstacleLeft + 40 &&
            570 + 20 > obstacleTop &&
            570 < obstacleTop + 40
        ) {
            // 撞到障礙物，結束遊戲
            endGame(false);
            return;
        }
    }
}

function moveObstacles() {
    const gameScreen = document.getElementById('game-screen');
    const obstacles = document.getElementsByClassName('obstacle');
    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        const obstacleTop = parseInt(obstacle.style.top) || 0;
        const newTop = obstacleTop + obstacleSpeed;

        // 更新障礙物位置
        obstacle.style.top = newTop + 'px';

        if (newTop > 600) {
            // 障礙物超出螢幕，移除
            obstacle.remove();
        }
    }

    if (Math.random() < 0.2 && !gameendmode) {
        // 隨機生成障礙物
        const obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');
        obstacle.style.left = Math.floor(Math.random() * 760) + 'px';
        obstacle.style.top = '-40px'; // 初始障礙物位置在畫面最上方
        gameScreen.appendChild(obstacle);
    }

    const endTime = new Date().getTime();
    const play_time = "遊戲時長：" + Math.floor((endTime - startTime) / 1000) + " 秒";
    document.getElementById("play-time").innerHTML = play_time;
}

function showFinishLine() {
    gameendmode = true;
    const finishLine = document.getElementById('finish-line');
    finishLine.style.top = '-20px';
    finishLineInterval = setInterval(moveFinishLine, 10);
}

function moveFinishLine() {
    const finishLine = document.getElementById('finish-line');
    const currentTop = parseInt(finishLine.style.top) || 0;
    const newTop = currentTop + obstacleSpeed;

    finishLine.style.top = newTop + 'px';

    if (newTop > 600) {
        // 終點線到達畫面最下方，停止移動
        clearInterval(finishLineInterval);
    }
}

function endGame(mode) {
    gameRunning = false;
    clearInterval(playerInterval);
    clearInterval(obstacleInterval);
    clearInterval(finishLineInterval);

    const endTime = new Date().getTime();
    const totalTime = Math.floor((endTime - startTime) / 1000);

    if (mode === false) {
        alert('挑戰失敗！遊戲時長 ' + totalTime + ' 秒。');
    } else {
        alert('恭喜完成遊戲！');
    }

    location.reload();
}