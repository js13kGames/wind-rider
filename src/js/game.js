define(function(require) {
    var Events = require('minivents.min');

    window.gameEvents = new Events();
    window.SceneManager = require('sceneManager');
    window.debug = {
        rain: true,
        wind: true,
        gravity: true,
        death: true
    };
    SceneManager.loadScene('intro');
});