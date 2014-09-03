define(function(require) {
    var Vector = require('vector');
        Wind = function() {
            this.windVector = new Vector(0, 0);
            this.angle = 0;
            this.speed = 0;
            this.size = 12;
            this.xScale = 0;
            gameEvents.on('update', this.update, this);
            gameEvents.on('render', this.render, this);
        };
    Wind.prototype = {
        update: function(data) {
            var changeScale = Math.min(data.difficulty, 1);
            xChange = (changeScale - Math.random() * (changeScale * 2));
            yChange = (changeScale - Math.random() * (changeScale * 2));
            this.windVector.add(new Vector(xChange, yChange));
            this.windVector.limit(data.difficulty);
            this.speed = this.windVector.mag();
            this.xScale = this.speed / 10;
            this.angle = this.windVector.getAngle();
        },
        render: function(ctx) {
            ctx.font="20pt Arial";
            ctx.fillStyle="#000000";
            ctx.fillText(Math.round(this.speed), 840, 50);
            ctx.save();
            ctx.translate(840, 50);
            ctx.rotate(this.angle);
            ctx.fillStyle="#ff0000";
            ctx.beginPath();
            ctx.moveTo(0, -this.size / 2);
            ctx.lineTo(this.size * this.xScale, -this.size / 2);
            ctx.lineTo(this.size * this.xScale, -this.size);
            ctx.lineTo(this.size * 2 * this.xScale, 0);
            ctx.lineTo(this.size * this.xScale, this.size);
            ctx.lineTo(this.size * this.xScale, this.size/2);
            ctx.lineTo(0, this.size/2);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        },
        destroy: function() {
            gameEvents.off('update', this.update, this);
            gameEvents.off('render', this.render, this);
        },
        getVector: function() {
            return new Vector(-10, 0);// Vector.fromPolar(this.speed, this.angle);
        }
    };
    return Wind;
});