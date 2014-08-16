define(function(require) {
    var Vector = require('vector'),
        windVector = new Vector(0, 0),
        angle = 0,
        speed = 0,
        time = 0,
        size = 12,
        xScale = 0,
        Wind = function() {
            gameEvents.on('update', this.update, this);
            gameEvents.on('render', this.render, this);
        };
    Wind.prototype = {
        update: function(dt) {
            time += dt;
            xChange = (1 - Math.random() * 2);
            yChange = (1 - Math.random() * 2);
            windVector.add(new Vector(xChange, yChange));
            windVector.limit(10);
            speed = windVector.mag();
            xScale = speed / 10;
            angle = windVector.getAngle();
        },
        render: function(ctx) {
            ctx.font="20pt Arial";
            ctx.fillStyle="#000000";
            ctx.fillText(Math.round(speed), 840, 50);
            ctx.save();
            ctx.translate(840, 50);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(0, -size / 2);
            ctx.lineTo(size * xScale, -size / 2);
            ctx.lineTo(size * xScale, -size);
            ctx.lineTo(size * 2 * xScale, 0);
            ctx.lineTo(size * xScale, size);
            ctx.lineTo(size * xScale, size/2);
            ctx.lineTo(0, size/2);
            ctx.closePath();
            ctx.fillStyle="#ff0000";
            ctx.fill();
            ctx.restore();
        },
        getVector: function() {
            return windVector;
        }
    };
    return Wind;
});