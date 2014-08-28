define(function(require) {
    var Vector = require('vector');
    var Repeller = function(position, strength) {
        this.position = position;
        this.strength = strength;
        this.radius = 0;
        gameEvents.on('update', this.update, this);
        gameEvents.on('render', this.render, this);
    };
    Repeller.prototype = {
        update: function(data) {
            this.radius += 2500 * data.dt;
            if (this.radius > canvas.height / 2) {
                this.destroy();
            }
        },
        render: function(ctx) {
            ctx.save();
            ctx.translate(this.position.x, this.position.y);
            ctx.fillStyle = "rgba(255, 0, 0, " + (1 - (this.radius / (canvas.height / 2)));
            ctx.arc(0, 0, this.radius, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.restore();
        },
        destroy: function() {
            gameEvents.off('update', this.update, this);
            gameEvents.off('render', this.render, this);
        }
    };
    return Repeller;
});