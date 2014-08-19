define(function(require){
    var requestAnimFrame = (function(){
        return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
                window.setTimeout(callback, 1000 / 60);
            };
    })(),
    canvas = document.getElementById('gameCanvas'),
    context = canvas.getContext('2d'),
    clickListener = null,
    keyListener = null,
    scene = null;

    function loadScene(type, time) {
        canvas.width = canvas.width;
        canvas.removeEventListener('mousedown', clickListener);
        canvas.removeEventListener('touchstart', clickListener);
        document.removeEventListener('keydown', keyListener);
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
        canvas.addEventListener('mousedown', clickListener);
        canvas.addEventListener('touchstart', clickListener);
        document.addEventListener('keydown', keyListener);
        window.scene = scene;
    }

    function IntroScene() {
        context.fillStyle = "#fa3da8";
        context.arc(480, 270, 25, 0, 2 * Math.PI, false);
        context.fill();
        context.font = "72px Helvetica, sans-serif";
        context.fillStyle = "#000000";
        context.textAlign = 'center';
        context.textBaseLine = 'middle';
        context.fillText("Game title", 480, 270);
        context.font = "20px Helvetica, sans-serif";
        context.fillText("Click to start", 480, 320);

        clickListener = function(event) {
            loadScene('game');
        };
    }

    function GameOverScene(time) {
        context.fillStyle = "#fa3da8";
        context.arc(480, 270, 25, 0, 2 * Math.PI, false);
        context.fill();
        context.font = "72px Helvetica, sans-serif";
        context.fillStyle = "#000000";
        context.textAlign = 'center';
        context.textBaseLine = 'middle';
        context.fillText("Game over", 480, 270);
        context.font = "20px Helvetica, sans-serif";
        context.fillText("You lasted " + time + " seconds.", 480, 320);
        clickListener = function(event) {
            loadScene('game');
        };
    }
    function GameScene() {
        var Player = require('player'),
            Wind = require('wind'),
            Rain = require('rain'),
            player = new Player(),
            wind = new Wind(),
            rain = new Rain(),
            timeNow = Date.now(),
            lastUpdateTime = Date.now(),
            paused = false,
            gameOver = false;

        gameEvents.on('gameover', endGame);

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
            var dt = timeNow - lastUpdateTime;
            lastUpdateTime = timeNow;
            gameEvents.emit("update", dt / 1000, wind.getVector());
        }

        var stageX = 0, stageY = 0;

        function render() {
            context.clearRect(0, 0, canvas.width, canvas.height);
            gameEvents.emit("render", context);
            var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            for (var y = 0; y < imageData.height; y++) {
                for (var x = 0; x < imageData.width; x++) {
                    var coords = new Vector(x, y);
                    var distanceToMiddle = coords.getDist(new Vector(480, 270));
                    var value = (distanceToMiddle / 550.7267925205746) * 255;
                    setPixel(imageData, x, y, 255, 255, 255, value);
                }
            }
            context.putImageData(imageData, 0, 0);
        }

        function setPixel(imageData, x, y, r, g, b, a) {
            var index = (x + y * imageData.width) * 4;
            imageData.data[index+0] = r;
            imageData.data[index+1] = g;
            imageData.data[index+2] = b;
            imageData.data[index+3] = a;
        }

        clickListener = function(event) {
            // debugger
            var contentDiv = document.getElementById('content');
            stageX = Math.round((event.pageX - contentDiv.offsetLeft - contentDiv.clientLeft) * scale);
            stageY = Math.round((event.pageY - contentDiv.offsetTop - contentDiv.clientTop) * scale);
            gameEvents.emit('press', stageX, stageY);
        };

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