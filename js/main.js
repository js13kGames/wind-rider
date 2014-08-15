function resizeCanvas() {
    var contentDiv = document.getElementById('content');
    var newHeight = contentDiv.clientWidth * 0.5625;
    contentDiv.setAttribute("style","height:" + newHeight + "px;");
    contentDiv.style.height = newHeight + 'px';
}
window.onresize = resizeCanvas;
resizeCanvas();
