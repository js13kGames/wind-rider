define(function(require) {
    var Events = require('minivents.min');

    window.gameEvents = new Events();
    window.SceneManager = require('sceneManager');
    window.debug = {
        rain: false,
        wind: true,
        gravity: false,
        death: true
    };
    SceneManager.loadScene('intro');
});