define(function(require){
    var Vector = require('vector');
    var Raindrop = function(x, y) {
        gameEvents.emit('registerPhysics', this, x, y, {velocity: new Vector(Math.random() * 2 - 1, 15)});
        gameEvents.emit('registerCollider', this);
        this.age = 0;
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
            ctx.fillStyle = "#0000ff";
            ctx.fillRect(0, 0, 25, 2);
            ctx.restore();
        }
    };
    var Rain = function() {
        this.drops = [];
        gameEvents.on('update', this.update, this);
        gameEvents.on('render', this.render, this);
        gameEvents.on('destroy', this.destroyRain, this);
    };

    Rain.prototype = {
        update: function(data) {
            var rainPerSecond = 1;
            if (Math.random() > 0.3 && debug.rain) {
                this.drops.push(new Raindrop(Math.random() * 960, -25));
            }
            for (var i = 0; i < this.drops.length; i++) {
                this.drops[i].update(data.dt);
            }
        },
        render: function(ctx) {
            for (var i = 0; i < this.drops.length; i++) {
                this.drops[i].render(ctx);
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