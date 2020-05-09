window.Element.prototype.raf = function raf(property, value) {
  window.requestAnimationFrame(() => {
    this.style[property] = value;
  });
};
