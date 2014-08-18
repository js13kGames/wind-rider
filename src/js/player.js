define(function(require) {
    var Vector = require('vector'),
        gravity = new Vector(0, 1);
        Player = function(playerName) {
            this.position = new Vector(480, 270);
            this.velocity = new Vector(0, 0);
            this.acceleration = new Vector(0, 0);
            this.speed = 3;
            this.radius = 25;
            bornTime = Date.now();
            gameEvents.on('update', this.update, this);
            gameEvents.on('render', this.render, this);
            gameEvents.on('press', this.onPress, this);
        };

    Player.prototype = {
        update: function(dt, windVector) {
            this.velocity.add(this.acceleration);
            this.velocity.scale(0.95);
            this.velocity.add(windVector.getScaled(dt));
            this.velocity.limit(10);
            this.position.add(this.velocity);
            if (this.position.y > 540 || this.position.y < 0 || this.position.x < 0 || this.position.x > 960) {
                gameEvents.emit('gameover');
            }

        },
        render: function(context) {
            context.save();
            context.translate(this.position.x, this.position.y);
            context.fillStyle = "#fa3da8";
            context.arc(0, 0, this.radius, 0, 2 * Math.PI, false);
            context.fill();
            context.restore();
        },
        onPress: function(pressX, pressY) {
            var angleToPress = Math.atan2(pressY - this.position.y, pressX - this.position.x);
            this.velocity = Vector.fromPolar(this.speed, angleToPress);
        },
        getLifeSpan: function() {
            return Math.round((Date.now() - bornTime) / 1000);
        },
        destroy: function() {
            gameEvents.off('update', this.update, this);
            gameEvents.off('render', this.render, this);
            gameEvents.off('press', this.onPress, this);
        }
    };

    return Player;
});