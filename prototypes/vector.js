'use strict';
(function(exports) {
  // utils
  function clamp(value, lbound, ubound) {
    return Math.min(Math.max(lbound, value), ubound);
  }

  function or0(num) {
    return isNaN(num) ? 0 : num;
  }

  function elseValue(num, x) {
    return isNaN(num) ? x : num;
  }

  function multiply(v1, v2) {
    if(typeof v2 !== 'object') {
      v2 = new Vector(v2);
    }
    var product = new Vector(
      or0(v1.x) * or0(v2.x),
      or0(v1.y) * or0(v2.y),
      or0(v1.z) * or0(v2.z)
    );
    return product;
  }

  function divide(v1, v2) {
    if(typeof v2 !== 'object') {
      v2 = new Vector(v2);
    }
    var product = new Vector(
      or0(v1.x) / or0(v2.x),
      or0(v1.y) / or0(v2.y),
      or0(v1.z) / or0(v2.z)
    );
    return product;
  }

  function add(v1, v2) {
    return new Vector(
      or0(v1.x) + or0(v2.x),
      or0(v1.y) + or0(v2.y),
      or0(v1.z) + or0(v2.z)
    );
  }

  function subtract(v1, v2) {
    return new Vector(
      or0(v1.x) - or0(v2.x),
      or0(v1.y) - or0(v2.y),
      or0(v1.z) - or0(v2.z)
    );
  }

  function truthy(v1) {
    return (v1.x || v1.y || v1.z);
  }

  function clone(v1) {
    return new Vector(v1.x, v1.y, v1.z);
  }


  function Vector(x,y,z) {
    if (!(this instanceof Vector)) {
      return new Vector(x,y,z);
    }
    // new Vector(0.5) => { x: 0.5, y: 0.5, z: 0.5 };
    this.x = elseValue(x, 1);
    this.y = elseValue(y, this.x);
    this.z = elseValue(z, this.x);
  }
  Vector.prototype = {
    _update: function(v) {
      this.x = v.x;
      this.y = v.y
      this.z = v.z;
      return this;
    },
    add: function() {
      Array.from(arguments).forEach(function(vect) {
        this.x += or0(vect.x);
        this.y += or0(vect.y);
        this.z += or0(vect.z);
      }, this);
      return this;
    },
    subtract: function() {
      Array.from(arguments).forEach(function(vect) {
        this.x -= or0(vect.x);
        this.y -= or0(vect.y);
        this.z -= or0(vect.z);
      }, this);
      return this;
    },
    multiply: function(v2) {
      var args = Array.from(arguments);
      args.unshift(this);
      return this._update(Vector.multiply.apply(null, args));
    },
    divide: function(v2) {
      var result = Vector.divide(this, v2);
      return this._update(result);
    },
    clamp: function(lbound, ubound) {
      return Vector.clamp(this, lbound, ubound);
    },
    normalize: function() {
      var max = Math.max(this.x, this.y, this.z, 1);
      this.x /= max;
      this.y /= max;
      this.y /= max;
      return this;
    },
    magnitude: function() {
      return Vector.magnitude(this);
    },

    toString: function() {
      return '{ x: ' + this.x + ', y: ' + this.y + ', z: ' + this.z + ' }';
    }
  };

  Vector.subtract = subtract;
  Vector.add = add;
  Vector.multiply = multiply;
  Vector.divide = divide;
  Vector.truthy = truthy;
  Vector.clone = clone;
  Vector.clamp = function(v1, lbound, ubound) {
    v1.x = clamp(v1.x, elseValue(lbound, lbound.x), elseValue(ubound, ubound.x));
    v1.y = clamp(v1.y, elseValue(lbound, lbound.y), elseValue(ubound, ubound.y));
    v1.z = clamp(v1.z, elseValue(lbound, lbound.z), elseValue(ubound, ubound.z));
    return v1;
  };
  Vector.distance = function(v1, v2) {
    // 1,2,0
    // -2,3,5
    // = Math.sqrt(9 + 1 + 25)
    // = sqrt(35).
    // return Math.abs((v1.x * v1.y) - (v2.x * v2.y));
    return Math.pow(
      Math.pow(v1.x - v2.x, 2) +
      Math.pow(v1.y - v2.y, 2) +
      Math.pow(v1.z - v1.z, 2), 1/3
    );
  };
  Vector.magnitude = function(v1) {
    return Math.pow(
      Math.pow(v1.x, 2) +
      Math.pow(v1.y, 2) +
      Math.pow(v1.z, 2), 1/3
    )
  };

  exports.Vector = Vector;
})(window);
