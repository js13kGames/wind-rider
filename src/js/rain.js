define(function(require){
    var Vector = require('vector');
    var gravity = new Vector(0, 1);
    var Raindrop = function(x, y, rainIndex) {
        this.velocity = new Vector(0, 1);
        this.position = new Vector(x, y);
        this.rainIndex = rainIndex;
        gameEvents.on('update', this.update, this);
        gameEvents.on('render', this.render, this);
    };
    Raindrop.prototype = {
        update: function(dt, windVector) {
            this.velocity.add(windVector.getScaled(dt));
            this.velocity.add(gravity);
            this.position.add(this.velocity);
            if (this.position.y > 540 && !this.destroyed) {
                gameEvents.emit('destroyRain', this.rainIndex);
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
        },
        destroy: function() {
            this.destroyed = true;
            gameEvents.on('update', this.update, this);
            gameEvents.on('render', this.render, this);
        }
    };
    var Rain = function() {
        this.drops = {};
        this.rainIndex = 0;
        gameEvents.on('update', this.update, this);
        gameEvents.on('destroyRain', this.destroyRain, this);
    };

    Rain.prototype = {
        update: function(dt, windspeed) {
            var rainPerSecond = 1;
            // console.log(dt);
            if (Math.random() > 0.1) {
                this.drops['rain' + this.rainIndex] = new Raindrop(Math.random() * 960, -10, this.rainIndex);
                this.rainIndex++;
            }
        },
        destroyRain: function(rainIndex) {
            var raindrop = this.drops['rain' + rainIndex];
            raindrop.destroy();
            delete this.drops['rain' + rainIndex];
        }
    };

    return Rain;
});