import {Chatz} from 'Chatz';

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return (root.Chatz = factory());
    });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Chatz = factory();
  }
}(global, () => {
  return new Chatz();
}));