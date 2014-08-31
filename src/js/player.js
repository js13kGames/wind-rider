define(function(require) {
    var Vector = require('vector'),
        gravity = new Vector(0, 0.1);
        Player = function(strength) {
            gameEvents.emit('registerPlayer', this);
            gameEvents.emit('registerPhysics', this, 480, 270);
            this.speed = strength;
            this.radius = 25;
            bornTime = Date.now();
            if (debug.player) gameEvents.on('update', this.update, this);
            if (debug.player) gameEvents.on('render', this.render, this);
            if (debug.player) gameEvents.on('press', this.onPress, this);
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
    function drawBody(ctx, x, y, radius) {
        var grd = ctx.createLinearGradient(-radius, 0, radius, 0),
            yellow = ['rgba(255, 255, 0, 1.000)'],
            black = 'rgba(0, 0, 0, 1.000)';
        grd.addColorStop(0.217, yellow);
        grd.addColorStop(0.247, black);
        grd.addColorStop(0.488, black);
        grd.addColorStop(0.508, yellow);
        grd.addColorStop(0.724, yellow);
        grd.addColorStop(0.746, black);
        grd.addColorStop(1.000, black);

        ctx.fillStyle = grd;
        ctx.arc(0, 0, radius, 0, 2 * Math.PI, false);
        ctx.fill();
    }
    Player.prototype = {
        update: function() {
            var edge = {
                top: -this.radius,
                bottom: canvas.height + this.radius,
                left: -this.radius,
                right: canvas.width + this.radius
            };
            if (!debug.death) {
                if (this.position.y > edge.bottom) {
                    this.position.y = edge.top;
                } else if (this.position.y < edge.top) {
                    this.position.y = edge.bottom;
                }
                if (this.position.x > edge.right) {
                    this.position.x = edge.left;
                } else if (this.position.x < edge.left) {
                    this.position.x = edge.right;
                }
            } else {
                if (this.position.y > edge.bottom || this.position.y < edge.top || this.position.x < edge.left || this.position.x > edge.right) {
                    gameEvents.emit('gameover');
                }
            }

        },
        render: function(context) {
            context.save();
            context.translate(this.position.x, this.position.y);
            drawBody(context, 0, 0, this.radius);
            drawWing(context, -7, -25, Math.PI, 0.15);
            drawWing(context, -5, -25, Math.PI + Math.PI / 5 , 0.15);
            context.restore();
        },
        onPress: function(press) {
            var angleToPress = Math.atan2(press.y - this.position.y, press.x - this.position.x);
            var dist = Vector.dist(press, this.position);
            var effect = Math.max(0, (1 - dist / (canvas.height / 2)) * this.speed);
            this.acceleration = Vector.fromPolar(effect, angleToPress);
            this.acceleration.scale(-1);
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