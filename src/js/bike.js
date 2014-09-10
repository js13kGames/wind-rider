define(function(require) {
    var angle1 = 0;
    var angle2 = 0;
    var Vector = require('vector');
    var frameAngle1 = Vector.fromPolar(1, degToRad(352));
    var frameAngle2 = Vector.fromPolar(1, degToRad(70));
    var frameAngle3 = Vector.fromPolar(1, degToRad(185));
    var frameAngle4 = Vector.fromPolar(1, degToRad(131));
    var origin = new Vector(0, 0);
    var Bike = function(position) {
        this.scale = 10;
        this.position = position;
        this.rotation = 0;
        this.colour = "#" + (Math.floor(Math.random() * 16777215)).toString(16);
        console.log(this.colour);
        gameEvents.on('render', this.render, this);
    };

    function drawVector(ctx, v, length, scale, startPos, colour) {
        ctx.save();
        ctx.translate(startPos.x, startPos.y);
        var scaled = v.getScaled(length * scale);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(scaled.x, scaled.y);
        ctx.strokeStyle = colour || "#000";
        ctx.stroke();
        ctx.restore();
        return new Vector(scaled.x, scaled.y).add(startPos);
    }

    function degToRad(deg) {
        return (Math.PI * deg) / 180 ;
    }

    function radToDeg(rad) {
        return 180 * (rad / Math.PI);
    }

    Bike.prototype = {
        render: function(ctx) {
            this.drawBike(ctx);
        },
        update: function(physics) {
            this.position = physics.position;
            this.velocity = physics.velocity;
            this.rotation += (Math.PI * 2) + degToRad(this.velocity.x);
            this.rotation = this.rotation % (Math.PI * 2);
        },
        drawPedal: function(ctx, position, isFront) {
            ctx.save();
            ctx.translate(position.x, position.y);

            var v = Vector.fromPolar(isFront ? 3 * this.scale : -3 * this.scale, this.rotation);
            var p = drawVector(ctx, v, 1, 1, new Vector(0, 0), this.colour);

            ctx.beginPath();
            ctx.moveTo(p.x - this.scale, p.y);
            ctx.lineTo(p.x + this.scale, p.y);
            ctx.strokeStyle = '#000';
            ctx.stroke();

            ctx.restore();
        },
        drawWheel: function(ctx, position) {
            ctx.save();
            ctx.translate(position.x, position.y);
            ctx.rotate(this.rotation);

            for (var i = 0; i < Math.PI * 2; i += Math.PI / 5) {
                var v = Vector.fromPolar(5 * this.scale, i);
                ctx.moveTo(0, 0);
                drawVector(ctx, v, 1, 1, new Vector(0, 0), '#aaa');
            }

            ctx.beginPath();
            ctx.arc(0, 0, 5 * this.scale, 0, Math.PI * 2);
            ctx.strokeStyle = "#000";
            ctx.stroke();

            ctx.restore();
            ctx.moveTo(position.x, position.y);
        },
        drawBike: function(ctx) {
            ctx.save();
            ctx.lineWidth = 4;
            ctx.translate(this.position.x, this.position.y);

            var saddlePos = new Vector(0, 0).subtract(frameAngle2).scale(this.scale * 2);
            var pedalPos = new Vector(0, 0).add(frameAngle2).scale(7.5 * this.scale);
            this.drawPedal(ctx, pedalPos, false);
            drawVector(ctx, frameAngle2, 9.5, this.scale, saddlePos, this.colour);


            ctx.moveTo(0, 0);
            var front = drawVector(ctx, frameAngle1, 10, this.scale, origin, this.colour);
            var handlePos = saddlePos.add(front);
            var frontWheel = new Vector(0, 0).add(frameAngle2).scale(10.3 * this.scale).add(handlePos);
            ctx.moveTo(frontWheel.x, frontWheel.y);
            this.drawWheel(ctx, frontWheel);

            ctx.moveTo(handlePos.x, handlePos.y);
            drawVector(ctx, frameAngle2, 10, this.scale, handlePos, this.colour);

            ctx.moveTo(front.x, front.y);
            drawVector(ctx, frameAngle4, 11.2, this.scale, front, this.colour);
            ctx.moveTo(pedalPos.x, pedalPos.y);
            var backWheel = drawVector(ctx, frameAngle3, 7.5, this.scale, pedalPos, this.colour);

            this.drawWheel(ctx, backWheel);

            ctx.beginPath();
            ctx.moveTo(backWheel.x, backWheel.y);
            ctx.lineTo(0, 0);
            this.colourStroke(ctx);

            this.drawPedal(ctx, pedalPos, true);

            ctx.restore();
        },
        colourStroke: function(ctx) {
            ctx.strokeStyle = this.colour;
            ctx.stroke();
        }
    };

    return Bike;
});