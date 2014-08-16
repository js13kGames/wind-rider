define(function(require) {
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
    Player = require('player'),
    Events = require('minivents.min');

    window.gameEvents = new Events();
    var player = new Player(),
    timeNow = Date.now(),
    lastUpdateTime = Date.now();

    function animLoop() {
        requestAnimFrame(animLoop);
        update();
        render();
    }

    function update() {
        timeNow = Date.now();
        var dt = timeNow - lastUpdateTime;
        lastUpdateTime = timeNow;
        gameEvents.emit("update", dt / 1000);
    }

    var stageX = 0, stageY = 0;

    function render() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        gameEvents.emit("render", context);
    }

    canvas.addEventListener('mousedown', onCanvasPress);
    canvas.addEventListener('touchstart', onCanvasPress);

    function onCanvasPress(event) {
        // debugger
        var contentDiv = document.getElementById('content');
        stageX = Math.round((event.pageX - contentDiv.offsetLeft - contentDiv.clientLeft) * scale);
        stageY = Math.round((event.pageY - contentDiv.offsetTop - contentDiv.clientTop) * scale);
        gameEvents.emit('press', stageX, stageY);
    }

    animLoop();
});