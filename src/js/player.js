define(function(require) {
    var Vector = require('vector'),
        gravity = new Vector(0, 0.1);
        Player = function() {
            gameEvents.emit('registerPhysics', this, 480, 270);
            this.radius = 25;
            bornTime = Date.now();
            if (debug.player) gameEvents.on('update', this.update, this);
            if (debug.player) gameEvents.on('render', this.render, this);
            if (debug.player) gameEvents.on('press', this.onPress, this);
        };
    Player.prototype = {
        update: function() {
            var edge = {
                left: -this.radius,
                right: canvas.width + this.radius
            };
            if (!debug.death) {
                if (this.position.x > edge.right) {
                    this.position.x = edge.left;
                } else if (this.position.x < edge.left) {
                    this.position.x = edge.right;
                }
            } else {
                if (this.position.x < edge.left || this.position.x > edge.right) {
                    gameEvents.emit('gameover');
                }
            }

        },
        render: function(context) {
            context.save();
            context.translate(this.position.x, this.position.y);
            context.fillStyle = '#000';
            context.fillRect(0, 0, this.radius, this.radius);
            context.restore();
        },
        onPress: function(press) {
            gameEvents.emit('accelerate', this, new Vector(10,0));
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