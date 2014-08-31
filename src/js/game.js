define(function(require) {
    var Events = require('minivents.min');

    window.gameEvents = new Events();
    window.SceneManager = require('sceneManager');
    window.debug = {
        rain: true,
        wind: false,
        gravity: false,
        death: true,
        player: false
    };
    SceneManager.loadScene('intro');
});