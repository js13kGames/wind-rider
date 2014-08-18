define(function(require) {
    var Events = require('minivents.min');

    window.gameEvents = new Events();
    window.SceneManager = require('sceneManager');
    SceneManager.loadScene('intro');
});