define(function(require) {
    var Events = require('minivents.min');

    window.gameEvents = new Events();
    window.SceneManager = require('sceneManager');
    window.debug = false;
    SceneManager.loadScene('intro');
});