define(function(require) {
    var Vector = require('vector');
    var gravity = new Vector(0, 0.05);
    var Physics = function() {
        this.physicsObjects = [];
        this.colliders = [];
        this.player = null;
        gameEvents.on('update', this.update, this);
        gameEvents.on('registerPlayer', this.registerPlayer, this);
        gameEvents.on('registerPhysics', this.registerObject, this);
        gameEvents.on('registerCollider', this.registerCollider, this);
        gameEvents.on('destroy', this.removeObject, this);
    };

    Physics.prototype = {
        registerPlayer: function(player) {
            this.player = player;
        },
        registerCollider: function(collider) {
            this.colliders.push(collider);
        },
        registerObject: function(object, x, y, startPhysics) {
            this.physicsObjects.push(object);
            object.velocity = startPhysics && startPhysics.velocity || new Vector(0, 0);
            object.acceleration = startPhysics && startPhysics.acceleration || new Vector(0, 0);
            object.position = new Vector(x, y);
        },
        removeObject: function(object) {
            var index = this.physicsObjects.indexOf(object);
            if (index > -1) {
                this.physicsObjects.splice(index, 1);
            }
            index = this.colliders.indexOf(object);
            if (index > -1) {
                this.colliders.splice(index, 1);
            }
        },
        update: function(data) {
            this.updateColliders();
            for (var i = 0; i < this.physicsObjects.length; i++) {
                this.updatePhysics(this.physicsObjects[i], data.windVector);
            }
        },
        updatePhysics: function(object, windVector) {
            var wind = new Vector(windVector.x, windVector.y);
            wind.scale(0.005);
            if (debug.gravity) object.acceleration.add(gravity);
            if (debug.wind) object.acceleration.add(wind);
            object.velocity.add(object.acceleration);
            object.acceleration = new Vector(0, 0);
            object.velocity.limit(15);
            object.position.add(object.velocity);
        },
        updateColliders: function() {
            for (var i = 0; i < this.colliders.length; i++) {
                var collider = this.colliders[i];
                var colliderFront = Vector.fromPolar(25, collider.velocity.getAngle());
                colliderFront.add(collider.position);
                var distance = Vector.dist(colliderFront, this.player.position);
                if (distance < this.player.radius) {
                    this.player.acceleration.add(collider.velocity.scale(0.01));
                    gameEvents.emit('destroy', collider);
                }
            }
        }
    };

    return Physics;
});