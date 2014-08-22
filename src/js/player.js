define(function(require) {
    var Vector = require('vector'),
        gravity = new Vector(0, 0.1);
        Player = function(playerName) {
            gameEvents.emit('registerPlayer', this);
            gameEvents.emit('registerPhysics', this, 480, 270);
            this.speed = 3;
            this.radius = 25;
            bornTime = Date.now();
            gameEvents.on('update', this.update, this);
            gameEvents.on('render', this.render, this);
            gameEvents.on('press', this.onPress, this);
        };

    Player.prototype = {
        update: function(dt, windVector) {
            if (!debug.death) {
                if (this.position.y > 540) {
                    this.position.y = 0;
                } else if (this.position.y < 0) {
                    this.position.y = 540;
                }
                if (this.position.x > 960) {
                    this.position.x = 0;
                } else if (this.position.x < 0) {
                    this.position.x = 960;
                }
            } else {
                if (this.position.y > 540 || this.position.y < 0 || this.position.x < 0 || this.position.x > 960) {
                    gameEvents.emit('gameover');
                }
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
            this.acceleration = Vector.fromPolar(this.speed, angleToPress);
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