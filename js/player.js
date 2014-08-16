define(function(require) {
    var name = "";
    x = 480;
    y = 270;
    rotation = 0;
    speed = 500;
    var Player = function(playerName) {
        name = playerName;
        gameEvents.on('update', this.update, this);
        gameEvents.on('render', this.render, this);
    };
    Player.prototype = {
        update: function(dt) {
            x += ((Math.random() * speed) -speed/2) * dt;
            y += ((Math.random() * speed) -speed/2) * dt;
        },
        render: function(context) {
            context.fillStyle = "#fa3da8";
            context.fillRect(x - 12.5, y - 12.5, 25, 25);
        }
    };

    return Player;
});