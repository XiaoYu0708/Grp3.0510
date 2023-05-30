// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-analytics.js";
import { getDatabase, ref, set, get, query, equalTo, remove } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCZx4Bxky_nk9jlk7QQDRVmQJIb6-9GrwY",
    authDomain: "grp3-0510.firebaseapp.com",
    databaseURL: "https://grp3-0510-default-rtdb.firebaseio.com",
    projectId: "grp3-0510",
    storageBucket: "grp3-0510.appspot.com",
    messagingSenderId: "310167559440",
    appId: "1:310167559440:web:c481ce5b1fa9ea09a19995",
    measurementId: "G-JVYP4JH37W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase();

function doPost(data) {
    // Reference to a specific location in the database
    const dataRef = ref(database, 'path/to/' + data.name);

    // Set data to the specified location
    set(dataRef, {
        data
    }).then(() => {
        console.log('Data has been successfully written.');
    }).catch((error) => {
        console.error('Error writing data:', error);
    });
}

function doGet() {
    // Get a reference to the database
    const database = getDatabase();

    // Reference to a specific location in the database
    const dataRef = ref(database, 'path/to');

    // Read data from the specified location once
    return get(dataRef)
        .then((snapshot) => {
            const data = snapshot.val();
            return data; // 回傳整個物件
        })
        .catch((error) => {
            console.error('Error reading data:', error);
        });
}

function doDelete(key) {
    // Get a reference to the database
    const database = getDatabase();

    // Reference to a specific location in the database
    const dataRef = ref(database, `path/to/${key}`);

    // Remove the data at the specified location
    remove(dataRef)
        .then(() => {
            console.log(`Data for key "${key}" has been successfully deleted.`);
        })
        .catch((error) => {
            console.error('Error deleting data:', error);
        });
}

function doQuery(name) {
    // Get a reference to the database
    const database = getDatabase();

    // Reference to a specific location in the database
    const dataRef = ref(database, 'path/to');

    // Read the data
    get(dataRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const records = Object.values(data);
                const matchingRecords = records.filter((record) => record.data.name === name);

                if (matchingRecords.length > 0) {
                    matchingRecords.forEach((record) => {
                        const name = record.data.name;
                        const hardmode = record.data.hardmode;
                        const time = record.data.time;
                        const endGame = record.data.endGame;
                        const playDate = record.data.playDate;

                        var text = "姓名：";
                        text += name;
                        text += "\n難度倍數：";
                        text += hardmode;
                        text += "\n遊戲時長(單位：秒)：";
                        text += time;
                        text += "\n完成度：";
                        text += endGame;
                        text += "\n日期：";
                        text += playDate;

                        alert(text);

                    });
                } else {
                    console.log('No matching data found.');
                }
            } else {
                console.log('No data found.');
            }
        })
        .catch((error) => {
            console.error('Error reading data:', error);
        });
}

document.querySelector("#qname_button").addEventListener('click', function () {
    // Call the doQuery function with the name 'xiaoyu'
    doQuery(document.querySelector("#qname").value);
});

doGet()
    .then((result) => {
        const data = result; // 將結果轉換為物件
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const item = data[key];
                const name = item.data.name;
                const hardmode = item.data.hardmode;
                const time = item.data.time;
                const endGame = item.data.endGame; //var:可以被更改的
                const playDate = item.data.playDate;

                //顯示成績的部分
                const list_history = document.getElementById("list-history");
                const tr = document.createElement("tr");
                const td_name = document.createElement("td");
                const td_hardmode = document.createElement("td");
                const td_time = document.createElement("td");
                const td_endGame = document.createElement("td");
                const td_playDate = document.createElement("td");
                const td_button = document.createElement("td");
                const button = document.createElement("button");


                td_name.innerHTML = name;
                td_hardmode.innerHTML = hardmode;
                td_time.innerHTML = time;
                td_endGame.innerHTML = endGame;
                td_playDate.innerHTML = playDate;

                button.name = name;
                button.className = "btn";
                button.innerHTML = "刪除";
                button.addEventListener('click', function () {
                    // 呼叫 doDelete() 函式來刪除特定的資料
                    doDelete(this.name);
                    location.reload();
                });

                td_button.appendChild(button);

                tr.appendChild(td_name);
                tr.appendChild(td_hardmode);
                tr.appendChild(td_time);
                tr.appendChild(td_endGame);
                tr.appendChild(td_playDate);
                tr.appendChild(td_button);

                list_history.appendChild(tr);

                console.log(name, hardmode, time, endGame, playDate);
            }
        }
    })
    .catch((error) => {
        console.error('Error reading data:', error);
    });





// JavaScript程式碼
let startTime = 0;
let gameRunning = false;
let playerInterval = null;
let obstacleInterval = null;
let finishLineInterval = null;
let obstacleSpeed = 5; // 障礙物速度 (單位: 像素/毫秒)
let playerLeft = 0; // 紅點初始左位移
let hardmode = 1;
let gameendmode = false;

var game_screen_width = document.getElementById("game-screen").offsetWidth;
var game_screen_height = document.getElementById("game-screen").offsetHeight;

document.querySelector('#startGame').addEventListener('click', function () {
    document.getElementById('game-screen').style.display = 'block';
    document.querySelector('#gamesetting').style.display = 'none';
    hardmode = document.getElementById('hardmode').value;

    if (hardmode == "" || hardmode == null || hardmode <= 0) {
        hardmode = 1;
    }

    hardmode = 0.02 * hardmode;

    startTime = new Date().getTime();
    gameRunning = true;

    // 開始自動移動
    playerInterval = setInterval(movePlayer, 10);
    obstacleInterval = setInterval(moveObstacles, 10);
    setTimeout(showFinishLine, 30000);

    // 監聽鍵盤事件
    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('keyup', handleKeyRelease);
})


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

    game_screen_width = document.getElementById("game-screen").offsetWidth;
    game_screen_height = document.getElementById("game-screen").offsetHeight;

    // 限制只能在畫面範圍內移動
    if (newLeft < 0) player.style.left = '0px';
    else if (newLeft > game_screen_width - 20) player.style.left = game_screen_width - 20 + 'px';
    else player.style.left = newLeft + 'px';

    // 檢查是否碰到終點線
    const finishLine = document.getElementById('finish-line');
    const finishLineTop = parseInt(finishLine.style.top) || 0;
    if (game_screen_height - 30 <= finishLineTop + 20 && game_screen_height - 30 + 20 >= finishLineTop) {
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
            game_screen_height - 30 + 20 > obstacleTop &&
            game_screen_height - 30 < obstacleTop + 40
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

        game_screen_height = document.getElementById("game-screen").offsetHeight;

        if (newTop > game_screen_height) {
            // 障礙物超出螢幕，移除
            obstacle.remove();
        }
    }

    if (Math.random() < hardmode && !gameendmode) {
        // 隨機生成障礙物
        const obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');

        game_screen_width = document.getElementById("game-screen").offsetWidth;

        obstacle.style.left = Math.floor(Math.random() * game_screen_width - 40) + 'px';
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

    game_screen_height = document.getElementById("game-screen").offsetHeight;

    if (newTop > game_screen_height) {
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
    const playDate = new Date().getFullYear() + "/" + new Date().getMonth() + "/" + new Date().getDate();

    hardmode = hardmode / 0.02;

    if (mode === false) {
        alert('挑戰失敗！遊戲時長 ' + totalTime + ' 秒。');
        var name = "";

        while (name == null || name == "") {
            name = prompt("請輸入姓名");
        }

        doPost({
            name: name,
            hardmode: hardmode,
            time: totalTime,
            endGame: "未完成",
            playDate: playDate
        });
    } else {
        alert('恭喜完成遊戲！');
        var name = "";

        while (name == null || name == "") {
            name = prompt("請輸入姓名");
        }
        doPost({
            name: name,
            hardmode: hardmode,
            time: totalTime,
            endGame: "完成",
            playDate: playDate
        });
    }

    location.reload();
}