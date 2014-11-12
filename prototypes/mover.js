(function(exports) {
  function clamp(value, lbound, ubound) {
    return Math.min(Math.max(lbound, value), ubound);
  }
  function Mover(value, options) {
    options = options || {};
    this.bounds = options.bounds;
    this.input = options.input;
    this.acceleration = 0;
    this.velocity = 0;
    this.value = value; // initial position
  }
  Mover.prototype = {
    value: 0,
    velocity: 0,
    acceleration: 0,
    maxspeed: 20.0, // float
    responsiveness: 1, // float

    applyForce: function(force) {
      this.acceleration += force;
    },
    update: function(deltaMS) {
      var bounds = this.bounds;
      var sensor = this.input;

      this.applyForce(Force.Gravity);
      if (!this.nudge) {
        this.nudge = Force.Gravity * (-1 + this.responsiveness * -1);
      }
      if (sensor.up) {
        this.applyForce(this.nudge);
      }
      if (sensor.down) {
        this.applyForce(this.nudge * -0.5);
      }
      var deltaTime = deltaMS/1000;
      var accel = this.acceleration * deltaTime;
      // add the acceleration over time
      this.velocity = clamp(this.velocity + accel, -this.maxspeed, this.maxspeed);
      this.value += this.velocity;
      if (!bounds.within(this.value)) {
        this.velocity = 0;
        this.value = clamp(this.value, 0, bounds.top);
      }
      debug.log('update velocity: ' + this.velocity);
      this.acceleration = 0;
    },
    render: function() {
      // stub
    }
  };

  exports.Mover = Mover;
})(window);
