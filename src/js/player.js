define(function(require) {
    var Vector = require('vector'),
        position = new Vector(480, 270),
        velocity = new Vector(0, 0),
        acceleration = new Vector(0, 0),
        gravity = new Vector(0, 2),
        rotation = Math.PI * 2,
        speed = 3,
        respondingToPress = false,
        Player = function(playerName) {
            gameEvents.on('update', this.update, this);
            gameEvents.on('render', this.render, this);
            gameEvents.on('press', onPress);
        };

    function onPress(pressX, pressY) {
        var angleToPress = Math.atan2(pressY - position.y, pressX - position.x);
        /*acceleration = Vector.fromPolar(speed, angleToPress);
        acceleration.normalise();*/
        velocity = Vector.fromPolar(speed, angleToPress);
    }

    Player.prototype = {
        update: function(dt) {
            velocity.add(acceleration);
            position.add(velocity);
            rotation = velocity.getAngle();
            if (position.y < 540) {
                velocity.add(gravity.getScaled(dt));
            } else {
                position.y = 540;
                velocity.scale(0.95);
            }

        },
        render: function(context) {
            context.save();
            context.translate(position.x, position.y);
            context.rotate(rotation);
            context.fillStyle = "#fa3da8";
            context.fillRect(-25, -12.5, 50, 25);
            context.restore();
        }
    };

    return Player;
});