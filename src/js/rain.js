define(function(require){
    var Vector = require('vector');
    var Raindrop = function(x, y, alpha) {
        this.alpha = alpha;
        gameEvents.emit('registerPhysics', this, x, y, {velocity: new Vector(Math.random() * 2 - 1, 15)});
        gameEvents.emit('registerCollider', this);
        this.age = 0;
        var colour = Math.floor(Math.random() * 255);
        this.fillStyle = "0, 0, " + colour;
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
            ctx.fillStyle = "rgba(" + this.fillStyle + ", " + this.alpha + ")";
            ctx.fillText("rain",0, 0);
            ctx.restore();
        }
    };
    var Cloud = function(darkness, position) {
        gameEvents.on('destroy', this.destroyRain, this);
        this.position = position;
        this.darkness = darkness;
        this.positions = [];
        this.colours = [];
        this.alpha = 0;
        this.maxAge = 5 + Math.random() * 15;
        this.drops = [];
        this.bounds = {
            left: position.x,
            right: position.x,
            top: position.y,
            bottom: position.y
        };
        var xSpread = Math.random() * 240,
            ySpread = Math.random() * 135,
            baseColour = 255 - (Math.floor(Math.random() * (Math.min(darkness * 255, 255))));
            
        for (var i = 0, numPieces = Math.floor(Math.random() * 50); i < numPieces; i++) {
            var xChange = ((1 - (Math.random() * 2)) * xSpread);
            var yChange = ((1 - (Math.random() * 2)) * ySpread);
            var change = new Vector(xChange, yChange);
            this.positions.push(change);
            if (this.position.x + change.x < this.bounds.left) {
                this.bounds.left = this.position.x + change.x;
            }
            if (this.position.x + change.x > this.bounds.right) {
                this.bounds.right = this.position.x + change.x;
            }
            if (this.position.y + change.y < this.bounds.top) {
                this.bounds.top = this.position.y + change.y;
            }
            if (this.position.y + change.y > this.bounds.bottom) {
                this.bounds.bottom = this.position.y + change.y;
            }
            var colourChange = Math.floor((1 - (Math.random() * 2)) * 15);
            var colour = Math.min(colourChange + baseColour, 255);
            this.colours.push(colour + "," + colour + "," + colour);
        }
        this.age = 0;

    };

    Cloud.prototype = {
        render: function(ctx) {
            ctx.save();
            ctx.translate(this.position.x, this.position.y);
            ctx.scale(scale, scale);
            ctx.font = "28px Courier New, Courier";
            ctx.textAlign = 'center';
            ctx.textBaseLine = 'middle';
            for (var i = 0; i < this.positions.length; i++) {
                ctx.fillStyle = "rgba(" + this.colours[i] + "," + this.alpha + ")";
                ctx.fillText("cloud", this.positions[i].x, this.positions[i].y);
            }
            ctx.restore();

            for (var i = 0; i < this.drops.length; i++) {
                this.drops[i].render(ctx);
            }
        },
        update: function(data) {
            this.age += data.dt;
            var normalisedAge;
            if (this.age < this.maxAge) {
                normalisedAge = this.age / this.maxAge;
                this.alpha = Math.min(normalisedAge, 1);
            } else {
                if (this.age >= this.maxAge) {
                    var ageGap = this.age - this.maxAge;
                    normalisedAge = ageGap / this.maxAge;
                    this.alpha = Math.max(1 - normalisedAge, 0);
                }
            }
            if (this.alpha <= 0) {
                this.dead = true;
            }
            this.generateRain(data.dt);
            
            for (var i = 0; i < this.drops.length; i++) {
                this.drops[i].update(data.dt);
            }
        },
        generateRain: function(dt) {
            // if you're fully dark, and fully opaque
            // generate a new droplet every 10 milliseconds
            if (this.darkness < 0.3) return;
            var msPassed = dt * 1000;
            var rainCoefficient = this.darkness * this.alpha;
            console.log(rainCoefficient, msPassed);
            for (var i = 0; i < msPassed; i++) {
                if (i % 10 === 0) {
                    if (Math.random() < rainCoefficient) {
                        this.createNewRaindrop();
                    }
                }
            }

        },
        createNewRaindrop: function() {
            var rainStartPos = {
                x: this.bounds.left + (Math.random() * (this.bounds.right - this.bounds.left)),
                y: this.bounds.top + (Math.random() * (this.bounds.bottom - this.bounds.top))
            };
            this.drops.push(new Raindrop(rainStartPos.x, rainStartPos.y, this.alpha));
        },
        destroyRain: function(drop) {
            var dropIndex = this.drops.indexOf(drop);
            if (dropIndex > -1) {
                this.drops.splice(this.drops.indexOf(drop), 1);
            }
        }
    };

    var Rain = function() {
        this.drops = [];
        this.cloudiness = 0;
        this.clouds = [];
        gameEvents.on('update', this.update, this);
        gameEvents.on('render', this.render, this);
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
            if (debug.rain) {
                switch (true) {
                    case data.difficulty /*< 3*/> 0:
                        if (this.clouds.length < /*10*/1) {
                            if (Math.random() > /*0.999*/0) {
                                this.clouds.push(new Cloud(Math.random(), new Vector(Math.random() * 960, Math.random() * 100)));
                            }
                        }
                        break;
                }
            }
            var newClouds = [];
            for (var i = 0; i < this.clouds.length; i++) {
                if (!this.clouds[i].dead) {
                    newClouds.push(this.clouds[i]);
                }
            }
            this.clouds = newClouds;
            for (var i = 0; i < this.clouds.length; i++) {
                this.clouds[i].update(data);
            }
        },
        render: function(ctx) {
            for (var i = 0; i < this.drops.length; i++) {
                this.drops[i].render(ctx);
            }
            for (var i = 0; i < this.clouds.length; i++) {
                this.clouds[i].render(ctx);
            }
        }
    };

    return Rain;
});