import { htmlToElement } from "../html";

export default function Card(html, backgroundColor) {
  this.backgroundColor = backgroundColor;
  this.el = htmlToElement(html);
}

Card.prototype.renderable = function render() {
  return this.el;
};

Card.prototype.animateIn = function animateIn() {
  this.el.classList.remove("unloaded");
};

Card.prototype.animateOut = function animateOut() {
  this.el.classList.add("unloaded");
};

Card.prototype.shiftDepth = function shiftDepth(
  depth,
  percentageCompleteWithZone
) {
  const newStyle = {
    position: "fixed",
    top: `${175 - 32 * specialDepth(depth, percentageCompleteWithZone)}px`,
    zIndex: depth * -10,
    opacity: 1 - 0.4 * specialDepth(depth, percentageCompleteWithZone),
    left: `calc((99vw - 250px) * .5 + 250px - ${this.el.offsetWidth * 0.5})`,
    transform: `scale(${
      1 - 0.04 * specialDepth(depth, percentageCompleteWithZone)
    })`,
    //
    // something wacko is happening with CSS 3D space,
    // when the heights of different objects are pushed back
    // — despite perspective-origin or anything —
    // the top edge of the objects do not align
    height: "1000px",
  };
  for (let style in newStyle) {
    if (depth === 0) {
      // you're being viewed, and you don't
      // need extra styles — remove them if you had them
      this.el.raf(style, null);
    } else {
      this.el.raf(style, newStyle[style]);
    }
  }
};

Card.prototype.getHeight = function getHeight() {
  // because the fixed cards in the bg require fixed height,
  // we use scrollHeight to see what those elements would be in normal page flow
  // see "wacko" comment above
  return this.el.scrollHeight;
};

Card.prototype.setWidth = function setWidth(width) {
  this.el.raf("width", width);
};

function easeInOutCubic(x) {
  // awesome website https://easings.net/
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function specialDepth(originalDepth, percent) {
  let reverseImpact = 1; // lol
  if (percent > 0.8) {
    // ease a curve through last 20% of zone only
    reverseImpact = easeInOutCubic((1 - percent) * 5); // some number between 0 - 1
  }
  return originalDepth - (1 - reverseImpact);
}
