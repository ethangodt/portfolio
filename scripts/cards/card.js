/*
import ekkCard from ...
new Card(ekkCard)
*/

import { htmlToElement } from "../html";

export default function Card(html) {
  // const template = `<div class="cardWrapperFront"></div>`;
  // this.wrapper = htmlToElement(template);
  // this.wrapper.appendChild(this.card);
  this.el = htmlToElement(html);
  this._depth = 0;
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
  this._setStyle(depth, percentageCompleteWithZone);
};

Card.prototype.getHeight = function getHeight() {
  // because the fixed cards in the bg require fixed height,
  // we use scrollHeight to see what those elements would be in normal page flow
  return this.el.scrollHeight;
};

Card.prototype.setWidth = function setWidth(width) {
  this.el.style.width = width;
};

Card.prototype._setStyle = function _setStyle(depth, percent) {
  const newStyle = {
    position: "fixed",
    top: "175px",
    marginTop: `${0 - 25 * specialDepth(depth, percent)}px`,
    zIndex: depth * -10,
    opacity: 1.1 - 0.3 * depth,
    perspectiveOrigin: "center top",
    transform: `scale(${1 - 0.03 * specialDepth(depth, percent)})`,
    // something wacko is happening with CSS 3D space,
    // when the heights of different objects are pushed back
    // despite perspective-origin or anything
    // the top edge of the objects do not align
    height: "1000px",
  };
  for (let style in newStyle) {
    if (depth === 0) {
      // you're being viewed, and you don't
      // need extra styles — remove them if you had them
      this.el.style[style] = null;
    } else {
      this.el.style[style] = newStyle[style];
    }
  }
};

function easeInSine(x) {
  return 1 - Math.cos((x * Math.PI) / 2);
}

function easeInOutQuint(x) {
  return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
}

function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function specialDepth(originalDepth, percent) {
  let reverseImpact = 1; // lol
  if (percent > 0.8) {
    reverseImpact = easeInOutCubic((1 - percent) * 5); // some number between 0 - 1
  }
  let num = originalDepth - (1 - reverseImpact);
  return num;
}

// const newStyle = {
//   position: "fixed",
//   top: '175px',
//   marginTop: `${-32.5 - (12 * this._depth)}px`,
//   zIndex: this._depth * -10,
//   opacity: 1.1 - 0.3 * this._depth,
//   // perspectiveOrigin: 'center top',
//   transform: `scale(${1 - (.03 * this._depth)})`,
//   height: '1000px',
// };
