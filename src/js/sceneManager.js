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
        var stageX = Math.round((event.pageX - contentDiv.offsetLeft - contentDiv.clientLeft) * scale);
        var stageY = Math.round((event.pageY - contentDiv.offsetTop - contentDiv.clientTop) * scale);
        gameEvents.emit('press', new Vector(stageX, stageY));
    },
    paused = false,
    keyListener = function(event) {
        if (event.which === 27) {
            paused = !paused;
        }
    },
    Physics = require('physics'),
    Player = require('player'),
    Wind = require('wind');

    window.canvas = document.getElementById('gameCanvas');
    window.context = canvas.getContext('2d');
    canvas.addEventListener('mousedown', clickListener);
    canvas.addEventListener('touchstart', clickListener);
    document.addEventListener('keydown', keyListener);

    function GameScene() {
        var physics = new Physics(),
            player = new Player(),
            wind = new Wind(),
            timeNow = Date.now(),
            lastUpdateTime = Date.now(),
            difficulty = 0,
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
            }
        }

        function update() {
            timeNow = Date.now();
            var dt = (timeNow - lastUpdateTime) / 1000;
            lastUpdateTime = timeNow;
            difficulty += dt;
            gameEvents.emit("update", {
                dt: dt,
                windVector: wind.getVector(),
                difficulty: difficulty
            });
        }

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

        animLoop();
    }

    return GameScene;
});