'use strict';
(function(exports) {
  function Clock() {};
  Clock.prototype = {
    _running: false,
    onRAF: function(timestamp) {
      if (this._running) {
        this.onTick && this.onTick(timestamp - this.lastFrameTime);
        this.lastFrameTime = timestamp;
      }
      if (this.continueCondition()) {
        this.tick();
      } else {
        this.stop();
      }
    },
    start: function(config) {
      function _Animation(props) {
        for (var key in props) this[key] = props[key];
      }
      _Animation.prototype = {
        continueCondition: function() {},
        onTick: function() {}
      };
      var animation = this.animation = new _Animation(config || {});
      this._running = true;
      this.startTime = window.performance.now();
      this.lastFrameTime = this.startTime;
      this.onTick = animation.onTick.bind(animation);
      this.tick = requestAnimationFrame.bind(window, this.onRAF.bind(this));
      this.continueCondition = function() {
        return this._running && animation.continueCondition();
      };
      this.startTime = Date.now();
      this._timerid = this.tick();
    },
    stop: function() {
      this._timerid && cancelAnimationFrame(this._timerid);
      this._running = this._timerid = false;
    }
  };
  exports.Clock = Clock;
})(window);
