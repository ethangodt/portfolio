import { htmlToElement } from "./html";

export default function Title(title) {
  const template = `
	  <div class="titleContainer">
      <h2>${title.toUpperCase()}</h2>
    </div>
	`;
  this.el = htmlToElement(template);
}

Title.prototype.renderable = function renderable() {
  return this.el;
};

Title.prototype.animate = function animateTitle(scrollAmt) {
  if (scrollAmt < 10) {
    this.el.raf("opacity", 1);
    this.el.raf("transform", "scale(1)");
  } else if (scrollAmt >= 10 && scrollAmt <= 60) {
    // change opacity
    // the scrollVal is what's *subtracted* from the opacity of the element
    // scrollVal begins changing after 10 inital pixels have been scrolled
    // opacity changes from 1 to 0 over 50 scrolled pixels ((50 * 2) / 100 = 1)
    const opacityScrollVal = ((scrollAmt - 10) * 2) / 100;
    this.el.raf("opacity", `${1 - opacityScrollVal.toFixed(3)}`);

    // change scale
    // this works to shift the scale down from 1 to .99
    // like the opacityScrollVal, scaleScrollVal starts tracking after 10 initial pixels have been scrolled
    // it completes the change after 50 pixels — (50 * .5) / 1000 = .01
    const scaleScrollVal = ((scrollAmt - 10) * 0.5) / 1000;
    this.el.raf("transform", `scale(${1 - scaleScrollVal.toFixed(3)})`);
  } else {
    this.el.raf("opacity", 0);
    this.el.raf("transform", "scale(.99)");
  }
};
