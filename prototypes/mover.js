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
    this.id = 'mover_' + (Mover._count++);
  }
  Mover._count = 0;
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
      if ( this.element) {
        var style = this.element.style;
        var renderScale = this.renderScale || 1;
        var top = Math.max(0, this.value) * renderScale * -1;
        style.transform = 'translate(0px, ' + top + 'px)';
        var blue = Math.round(Math.abs(this.velocity) / 40 * 255);
        var red = Math.round(blue / 2);
        var green = Math.round(blue / 2);
        style.backgroundColor = 'rgb('+red+', '+green+', '+blue+ ')';
      }
    }
  };

  exports.Mover = Mover;
})(window);
