(function(exports) {
  function Mover2d(x, y, options) {
    options = options || {};
    this.bounds = options.bounds;
    this.input = options.input;
    this.acceleration = new Vector(0, 0);
    this.velocity = new Vector(0);
    this.location = new Vector(x, y); // initial position
  }
  Mover2d.prototype = {
    location: null, // Vector
    velocity: null, // Vector
    acceleration: null, // Vector
    maxspeed: 20.0, // float
    responsiveness: 1, // float

    applyForce: function(force) {
      this.acceleration.add(force);
    },
    update: function(deltaMS) {
      var bounds = this.bounds;
      var sensor = this.input;

      this.applyForce(Force.Gravity);
      if (!this.nudge) {
        this.nudge = Vector.multiply(Force.Gravity, -1 + this.responsiveness * -1);
      }
      if (sensor.up) {
        this.applyForce(this.nudge);
      }
      if (sensor.down) {
        this.applyForce(Vector.multiply(this.nudge, -0.5));
      }
      var deltaTime = deltaMS/1000;
      var accel = Vector.multiply(this.acceleration, deltaTime);
      // add the acceleration over time
      this.velocity.add(accel);
      this.velocity.clamp(-this.maxspeed, this.maxspeed);
      this.location.add(this.velocity);
      if (!bounds.within(this.location)) {
        this.velocity = new Vector(0);
        this.location.clamp(new Vector(0,0), new Vector(bounds.right, bounds.top));
      }
      debug.log('update velocity: ' + this.velocity);
      this.acceleration.multiply(0);
    },
    render: function() {
      // stub
    }
  };

  exports.Mover2d = Mover2d;
})(window);
