define(function(require){
    var Vector = require('vector');
    function getColour(colourAsDecimal) {
        var hexString = Math.floor(colourAsDecimal).toString(16);
        if (hexString.length === 1) {
            hexString = "0" + hexString;
        }
        return hexString;
    }
    var Raindrop = function(x, y) {
        gameEvents.emit('registerPhysics', this, x, y, {velocity: new Vector(Math.random() * 2 - 1, 15)});
        gameEvents.emit('registerCollider', this);
        this.age = 0;
        var colour = Math.floor(Math.random() * 255);
        this.fillStyle = "#" + getColour(colour / 10) + getColour(colour / 4) + getColour(colour);
    };
    Raindrop.prototype = {
        update: function(dt) {
            this.age += dt;
            if (this.age > 5) {
                gameEvents.emit('destroy', this);
                return;
            }
            if (this.position.y > 540 && !this.destroyed) {
                gameEvents.emit('destroy', this);
                return;
            }
            if (this.position.x > 960) {
                this.position.x = 0;
            }
            if (this.position.x < 0) {
                this.position.x = 960;
            }
        },
        render: function(ctx) {
            ctx.save();
            ctx.translate(this.position.x, this.position.y);
            ctx.rotate(this.velocity.getAngle());

            ctx.font = "12px Courier New, Courier";
            ctx.textAlign = 'top';
            ctx.textBaseLine = 'left';
            ctx.fillStyle = this.fillStyle;
            ctx.fillText("rain",0, 0);
            // ctx.fillRect(0, 0, 25, 2);
            ctx.restore();
        }
    };
    var Cloud = function(darkness, x, y) {
        this.position = new Vector(x, y);
        this.age = 0;

        var colour = Math.floor(Math.random() * (Math.min(darkness * 255, 255)));
        colour = 255 - colour;
        this.fillStyle = "#" + getColour(colour) + getColour(colour) + getColour(colour);
    };

    Cloud.prototype = {
        render: function(ctx) {
            ctx.save();
            ctx.translate(this.position.x, this.position.y);
            ctx.font = "80px Courier New, Courier";
            ctx.textAlign = 'center';
            ctx.textBaseLine = 'middle';
            ctx.fillStyle = this.fillStyle;
            ctx.fillText("cloud",0, 0);
            ctx.restore();
        },
        update: function(data) {
            this.age += data.dt;
        }
    };

    var Rain = function() {
        this.drops = [];
        this.clouds = [];
        gameEvents.on('update', this.update, this);
        gameEvents.on('render', this.render, this);
        gameEvents.on('destroy', this.destroyRain, this);
    };

    Rain.prototype = {
        update: function(data) {
            this.cloudiness = data.difficulty;
            var rainPerSecond = 1;
            /*if (Math.random() > 0.3 && debug.rain) {
                this.drops.push(new Raindrop(Math.random() * 960, -25));
            }
            for (var i = 0; i < this.drops.length; i++) {
                this.drops[i].update(data.dt);
            }*/
            if (Math.random() > 0.9 && debug.rain) {
                this.clouds.push(new Cloud(this.cloudiness, Math.random() * 960, Math.random() * 100));
            }
            for (var i = 0; i < this.clouds.length; i++) {
                this.clouds[i].update(data.dt);
            }
        },
        render: function(ctx) {
            for (var i = 0; i < this.drops.length; i++) {
                this.drops[i].render(ctx);
            }
            for (var i = 0; i < this.clouds.length; i++) {
                this.clouds[i].render(ctx);
            }
        },
        destroyRain: function(drop) {
            var dropIndex = this.drops.indexOf(drop);
            if (dropIndex > -1) {
                this.drops.splice(this.drops.indexOf(drop), 1);
            }
        }
    };

    return Rain;
});