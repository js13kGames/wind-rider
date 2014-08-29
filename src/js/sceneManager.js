define(function(require){
    var requestAnimFrame = (function(){
        return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
                window.setTimeout(callback, 1000 / 60);
            };
    })(),
    clickListener = function(event) {
        // debugger
        var contentDiv = document.getElementById('content');
        stageX = Math.round((event.pageX - contentDiv.offsetLeft - contentDiv.clientLeft) * scale);
        stageY = Math.round((event.pageY - contentDiv.offsetTop - contentDiv.clientTop) * scale);
        gameEvents.emit('press', new Vector(stageX, stageY));
    },
    keyListener = null,
    scene = null,
    strength = 5;

    window.canvas = document.getElementById('gameCanvas');
    window.context = canvas.getContext('2d');
    canvas.addEventListener('mousedown', clickListener);
    canvas.addEventListener('touchstart', clickListener);

    function loadScene(type, time) {
        canvas.width = canvas.width;
        document.removeEventListener('keydown', keyListener);
        gameEvents.off();
        switch (type) {
            case 'game':
                scene = new GameScene();
                break;
            case 'intro':
                scene = new IntroScene();
                break;
            case 'gameover':
                scene = new GameOverScene(time);
                break;
        }
        document.addEventListener('keydown', keyListener);
        window.scene = scene;
    }
    function checkStart(press) {
        if (press.x >= 645 && press.x <= 910 && press.y >= 480 && press.y <= 510) {
            loadScene('game');
        }
    }

    function IntroScene() {
        context.fillStyle = "#fa3da8";
        context.arc(480, 270, 25, 0, 2 * Math.PI, false);
        context.fill();
        context.save();
        context.rotate(Math.random() * Math.PI / 20);
        context.font = "72px Courier New, Courier";
        context.fillStyle = "#fff";
        context.textAlign = 'left';
        context.textBaseLine = 'top';
        context.fillText("Bee's journey", 50, 100);
        context.restore();
        context.fillStyle = "#555";
        context.fillRect(645, 480, 265, 30);
        context.fillStyle = "#fff";
        context.font = "20px Courier New, Courier";
        context.textAlign = 'right';
        context.textBaseLine = 'bottom';
        context.fillText("Tap here to get home", 900, 500);
        gameEvents.on('press', checkStart);
    }

    function GameOverScene(time) {
        context.fillStyle = "#fa3da8";
        context.arc(480, 270, 25, 0, 2 * Math.PI, false);
        context.fill();
        context.save();
        context.translate(480, 270);
        context.rotate((Math.random() * 2 - 1) * Math.PI / 20);
        context.font = "72px Courier New, Courier";
        context.fillStyle = "#fff";
        context.textAlign = 'center';
        context.textBaseLine = 'middle';
        context.fillText("Game over", 0, 0);
        context.restore();
        context.fillStyle = "#000000";
        context.font = "20px Courier New, Courier";
        context.fillText("You lasted " + time + " second" + (time > 1 ? "s" : "") + ".", 480, 320);
        context.fillStyle = "#555";
        context.fillRect(645, 480, 265, 30);
        context.fillStyle = "#fff";
        context.font = "20px Courier New, Courier";
        context.textAlign = 'right';
        context.textBaseLine = 'bottom';
        context.fillText("Tap here to get home", 900, 500);
        gameEvents.on('press', checkStart);
    }
    function GameScene() {
        var physics = new (require('physics'))(),
            player = new (require('player'))(strength),
            difficulty = 0,
            wind = new (require('wind'))(difficulty),
            rain = new (require('rain'))(difficulty),
            timeNow = Date.now(),
            lastUpdateTime = Date.now(),
            paused = false,
            gameOver = false,
            Repeller = require('repeller');

        gameEvents.on('gameover', endGame);
        gameEvents.on('press', createRepeller);

        function createRepeller(press) {
            new Repeller(press, strength);
        }

        function endGame() {
            gameOver = true;
        }

        function animLoop() {
            if (!gameOver) {
                requestAnimFrame(animLoop);
                if (!paused) {
                    drawnPausedText = false;
                    update();
                    render();
                } else {
                    lastUpdateTime = Date.now();
                    if (!drawnPausedText) {
                        drawnPausedText = true;
                        context.font = "72px Helvetica, sans-serif";
                        context.fillStyle = "#000000";
                        context.textAlign = 'center';
                        context.textBaseLine = 'middle';
                        context.fillText("Paused", 480, 270);
                    }
                }
            } else {
                gameEvents.off('gameover', endGame);
                var lifeSpan = player.getLifeSpan();
                player.destroy();
                wind.destroy();
                player = null;
                wind = null;
                loadScene('gameover', lifeSpan);
            }
        }

        function update() {
            timeNow = Date.now();
            var dt = (timeNow - lastUpdateTime) / 1000;
            lastUpdateTime = timeNow;
            difficulty += 0.1 * dt;
            gameEvents.emit("update", {
                dt: dt,
                windVector: wind.getVector(),
                difficulty: difficulty
            });
        }

        var stageX = 0, stageY = 0;

        function render() {
            canvas.width = canvas.width;
            gameEvents.emit("render", context);
        }

        function setPixel(imageData, x, y, r, g, b, a) {
            var index = (x + y * imageData.width) * 4;
            imageData.data[index+0] = r;
            imageData.data[index+1] = g;
            imageData.data[index+2] = b;
            imageData.data[index+3] = a;
        }

        keyListener = function(event) {
            if (event.which === 27) {
                paused = !paused;
            }
        };

        animLoop();
    }
    return {
        loadScene: loadScene
    };
});