/**
 * Created by ethangodt on 6/29/15.
 */

export default function Title (container, id) {
    var self = this;

	this.elem = container.querySelector(".titleContainer");

	window.addEventListener(id + "Scroll", function () {
		var scrollAmt = window.scrollY;

		if (scrollAmt < 250) {
			window.requestAnimationFrame(function () {
				self.animateTitle(scrollAmt);
			});
		}
	});
};

Title.prototype.animateTitle = function animateTitle (scrollAmt) {
	if (scrollAmt < 10) {
		this.elem.style.opacity = 1;
		this.elem.style.transform = "scale(1)";
	} else if (scrollAmt >= 10 && scrollAmt <= 60) {
		// change opacity
		// the scrollVal is what's *subtracted* from the opacity of the element
		// scrollVal begins changing after 10 initial pixels have been scrolled
		// opacity changes from 1 to 0 over 50 scrolled pixels ((50 * 2) / 100 = 1)
		var opacityScrollVal = ((scrollAmt - 10) * 2) / 100;
		this.elem.style.opacity = "" + 1 - opacityScrollVal.toFixed(3);

		// change scale
		// this works to shift the scale down from 1 to .99
		// like the opacityScrollVal, scaleScrollVal starts tracking after 10 initial pixels have been scrolled
		// it completes the change after 50 pixels — (50 * .5) / 1000 = .01
		var scaleScrollVal = ((scrollAmt - 10) * .5) / 1000;
		this.elem.style.transform = "scale(" + (1 - scaleScrollVal.toFixed(3)) + ")";
	} else {
		this.elem.style.opacity = 0;
		this.elem.style.transform = "scale(.99)";
	}
};
