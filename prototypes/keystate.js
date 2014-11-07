KeyState = {
  up: 0,
  down: 0,
  left: 0,
  right: 0,
  pressed: 0,
  lastTime: 0,
  handleEvent: function(evt) {
    switch(evt.keyCode) {
      case 37:    // left arrow
        this.left = (evt.type == 'keydown') ? 1 : 0;
        break;
      case 38:    // up arrow
        this.up = (evt.type == 'keydown') ? 2 : 0;
        break;
      case 39:    // right arrow
        this.right = (evt.type == 'keydown') ? 4 : 0;
        break;
      case 40:    // down arrow
        this.down = (evt.type == 'keydown') ? 8 : 0;
        break;
    }
    this.pressed = this.left | this.up | this.right | this.down;
  },
  listen: function() {
    // this.timestamp: 0
    document.addEventListener('keydown', this);
    document.addEventListener('keyup', this);
  },
  stop: function() {
    document.removeEventListener('keydown', this);
    document.removeEventListener('keyup', this);
  },
  toString: function() {
    return JSON.stringify({ up: this.up, down: this.down, left: this.left, right: this.right });
  }
};
