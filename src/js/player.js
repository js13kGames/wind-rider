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
    function drawWing(ctx, xoff, yoff, rotation, scale) {
        ctx.save();
        ctx.translate(xoff, yoff);
        ctx.rotate(rotation);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-6 * scale, -14 * scale, 34 * scale, 95 * scale, 59 * scale, 124 * scale);
        ctx.bezierCurveTo(88 * scale, 158 * scale, 147 * scale, 134 * scale, 157 * scale, 121 * scale);
        ctx.bezierCurveTo(167 * scale, 108 * scale, 195 * scale, 79 * scale, 156 * scale, 37 * scale);
        ctx.bezierCurveTo(139 * scale, 19 * scale, 15 * scale, -3 * scale, 0, 0);
        ctx.closePath();
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
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
            drawWing(context, -7, -25, Math.PI, 0.15);
            drawWing(context, -5, -25, Math.PI + Math.PI / 5 , 0.15);
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