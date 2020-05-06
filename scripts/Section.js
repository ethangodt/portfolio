import { htmlToElement } from "./html";
import { delay } from "./utils";

// TODO reset the width when the window resizes

export default function Section(id, title, cards, backgroundEl, color) {
  const template = `
    <div class="sectionContainer inactive"></div>
  `;
  // TODO get rid of id and custom event
  const event = new CustomEvent(id + "Scroll");
  backgroundEl.style.background = `linear-gradient(142deg, ${color}, transparent)`
  backgroundEl.style.backgroundColor = cards[0].backgroundColor
  this.backgroundEl = backgroundEl;
  this.cardMargin = 100; // check _cards.scss ....
  this.currentScrollZone = 0;
  this.active = false; // currently visible in the view
  this.appWrapper = document.querySelector(".main-wrapper");
  this.wrapper = htmlToElement(template);
  this.wrapper.appendChild(title.renderable());
  this.cards = cards;
  this.cards.forEach((card, i) => {
    card.shiftDepth(i);
    this.wrapper.appendChild(card.renderable());
  });

  window.addEventListener("resize", () => {
    if (!this.active) return;
    this._setMainWrapperHeight();
    this._setCardWidths();
  });

  let throttleScrollEffects = false;
  window.addEventListener("scroll", () => {
    if (!this.active) {
      return;
    }
    if (throttleScrollEffects) {
      return;
    } else {
      this._shiftCardDepths(window.scrollY);
      throttleScrollEffects = true;
      setTimeout(() => {
        throttleScrollEffects = false;
      }, 30);
    }
    window.dispatchEvent(event);
  });
}

Section.prototype.renderable = function renderable() {
  return this.wrapper;
};

Section.prototype.animateIn = function animateIn() {
  return Promise.resolve()
    .then(() => delay(50)) // ugh, need to add a delay here so we can give the browser time to paint the DOM to the screen
    .then(() => {
      this.active = true;
      window.scrollTo(0, 0);
      this.wrapper.classList.remove("inactive");
      this.backgroundEl.classList.remove("inactive");
      this._setMainWrapperHeight();
      this._setCardWidths();
      return Promise.all(
        this.cards.map(
          (card, i) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                card.animateIn();
              }, 300 * i);
            })
        )
      );
    });
};

Section.prototype.animateOut = function animateOut() {
  return Promise.resolve()
    .then(() => {
      this.active = false;
      this.wrapper.classList.add("inactive");
      this.backgroundEl.classList.add("inactive");
      this.cards.forEach((card) => {
        card.animateOut();
      });
    })
    .then(() => {
      return delay(600);
    });
};

Section.prototype._setCardWidths = function _setCardWidths() {
  this.cards.forEach((card, i) => {
    if (i !== 0) {
      card.setWidth(this.cards[0].el.offsetWidth + "px");
    }
  });
};

Section.prototype._setMainWrapperHeight = function setMainWrapperHeight() {
  let newHeight = 0;
  this.cards.forEach((card) => {
    let cardAndMargin = card.getHeight() + this.cardMargin;
    newHeight += cardAndMargin;
  });
  this.appWrapper.style.height = newHeight + "px";
};

Section.prototype._shiftCardDepths = function _shiftCardDepths(scrollVal) {
  let currentScrollZone = this.currentScrollZone;
  let totalMargin = 0;
  let totalCardHeight = 0;
  let startOfZones = [0];
  for (let i = 0; i < this.cards.length; i++) {
    totalMargin += this.cardMargin;
    totalCardHeight += this.cards[i].getHeight();
    let startOfNextScrollZone = totalMargin + totalCardHeight;
    startOfZones.push(startOfNextScrollZone);
    if (scrollVal < startOfNextScrollZone) {
      // you're not in the next scrollZone, you're in this one
      currentScrollZone = i;
      break;
    }
  }
  const zoneHeight =
    startOfZones[currentScrollZone + 1] - startOfZones[currentScrollZone];
  const zoneOffsetScrollHeight = scrollVal - startOfZones[currentScrollZone];
  const percentageCompleteWithZone = zoneOffsetScrollHeight / zoneHeight;
  let depthHasUpdated = currentScrollZone !== this.currentScrollZone;
  let almostUpdated = percentageCompleteWithZone > 0.8;
  if (depthHasUpdated) {
    this.backgroundEl.style.backgroundColor = this.cards[currentScrollZone].backgroundColor
  }
  if (depthHasUpdated || almostUpdated) {
    this.currentScrollZone = currentScrollZone;
    this.cards.forEach((card, i) => {
      card.shiftDepth(
        Math.max(i - this.currentScrollZone, 0),
        percentageCompleteWithZone >= 1 ? 0 : percentageCompleteWithZone // I need to see 100% as 0%
      );
    });
  }
};
