import ChatzIO from 'ChatzIO';

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return (root.ChatzIO = factory());
    });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ChatzIO = factory();
  }
}(global, () => {
  return new ChatzIO();
}));