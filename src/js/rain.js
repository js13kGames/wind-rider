define(function(require){
    var Vector = require('vector');
    var gravity = new Vector(0, 1);
    var Raindrop = function(x, y, rainIndex) {
        this.velocity = new Vector(0, 1);
        this.position = new Vector(x, y);
        this.rainIndex = rainIndex;
    };
    Raindrop.prototype = {
        update: function(dt, windVector) {
            this.velocity.add(windVector.getScaled(dt));
            this.velocity.add(gravity);
            this.position.add(this.velocity);
            if (this.position.y > 540 && !this.destroyed) {
                gameEvents.emit('destroyRain', this);
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
            ctx.fillStyle = "#0000ff";
            ctx.fillRect(0, 0, 25, 2);
            ctx.fill();
            ctx.restore();
        }
    };
    var Rain = function() {
        this.drops = [];
        this.rainIndex = 0;
        gameEvents.on('update', this.update, this);
        gameEvents.on('render', this.render, this);
        gameEvents.on('destroyRain', this.destroyRain, this);
    };

    Rain.prototype = {
        update: function(dt, windspeed) {
            var rainPerSecond = 1;
            if (Math.random() > 0.1) {
                this.drops.push(new Raindrop(Math.random() * 960, -10, this.rainIndex));
            }
            for (var i = 0; i < this.drops.length; i++) {
                this.drops[i].update(dt, windspeed);
            }
            console.log(this.drops.length);
        },
        render: function(ctx) {
            for (var i = 0; i < this.drops.length; i++) {
                this.drops[i].render(ctx);
            }
        },
        destroyRain: function(drop) {
            this.drops.splice(this.drops.indexOf(drop), 1);
        }
    };

    return Rain;
});