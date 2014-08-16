define(function (require) {
    function resizeCanvas() {
        var contentDiv = document.getElementById('content');
        var newHeight = contentDiv.clientWidth * 0.5625;
        contentDiv.setAttribute("style","height:" + newHeight + "px;");
        contentDiv.style.height = newHeight + 'px';
        window.scale = 960 / contentDiv.clientWidth;
        window.TWO_PI = Math.PI * 2;
    }
    window.onresize = resizeCanvas;
    resizeCanvas();
    require('game');
});