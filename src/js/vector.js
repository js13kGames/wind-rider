define(function(require) {
	var Vector = function(x, y) {
		this.x = x;
		this.y = y;
	};
	function pythag(a, b) {
		return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
	}
	Vector.prototype = {
		add: function(vector) {
			this.x += vector.x;
            this.y += vector.y;
		},
		subtract: function(vector) {
			this.x -= vector.x;
            this.y -= vector.y;
		},
		mag: function() {
			return pythag(this.x, this.y);
		},
		scale: function(scalar) {
			this.x *= scalar;
			this.y *= scalar;
		},
        normalise: function() {
            var biggest = Math.max(Math.abs(this.x), Math.abs(this.y));
            this.x /= biggest;
            this.y /= biggest;
        },
		getDist: function(vector) {
			var xDist = Math.abs(this.x - vector.x),
				yDist = Math.abs(this.y - vector.y);
			return pythag(xDist, yDist);
		},
		getAngle: function() {
			return Math.atan(this.y / this.x);
		},
        getScaled: function(scalar) {
            return new Vector(this.x * scalar, this.y * scalar);
        }
	};
	Vector.fromPolar = function(radius, angle) {
		return new Vector(radius * Math.cos(angle), radius * Math.sin(angle));
	};
	window.Vector = Vector;
	return Vector;
});