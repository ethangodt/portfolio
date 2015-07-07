/**
 * Created by ethangodt on 6/28/15.
 */

app.Section = function Section (container, content, title, id) {
	var self = this,
		event = new CustomEvent(id + "Scroll");

	this.active = false; // currently visible in the view

	// DOM nodes
	this.mainWrapper = document.querySelector(".main-wrapper");
	this.sectionWrapper = container;

	// view objects
	this.title = this.sectionWrapper.querySelector(".titleContainer");
	this.content = content;

	window.addEventListener("resize", function () {
		if (!self.active) return;
		self.setMainWrapperHeight();
	});

	window.addEventListener("scroll", function () {
		if (!self.active) return;
		window.dispatchEvent(event);
	});
};

app.Section.prototype.setMainWrapperHeight = function setMainWrapperHeight () {
	var pagePaddingTop = 0;
	console.log(this.mainWrapper);
	this.mainWrapper.style.height = pagePaddingTop + this.content.getHeight() + "px";
};

app.Section.prototype.animateOut = function animateOut () {
	this.sectionWrapper.classList.add("inactive");
	this.content.animateOut();
};

app.Section.prototype.contentOut = function contentOut () {
	this.active = false;
	this.sectionWrapper.style.display = "none";
};

app.Section.prototype.contentIn = function contentIn () {
	this.active = true;
	this.sectionWrapper.style.display = "block";
	this.setMainWrapperHeight();

	// reset scroll position - after elements are set to "display block" this scroll event resets positions and depths of all content
	window.scrollTo(0, 0);
};

app.Section.prototype.animateIn = function animateIn () {
    this.sectionWrapper.classList.remove("inactive");
	this.content.animateIn();
};

app.Section.prototype.sectionOut = function sectionOut () { // a combined function to bring the section fully out
	var self = this;

	this.animateOut();
	setTimeout(function () {
		self.contentOut();
	}, 600); // on a delay to allow the content to fully fade out before removing from flow
};

app.Section.prototype.sectionIn = function sectionIn () { // a combined function to bring the section fully in
	var self = this;

	setTimeout(function () { // used with a timer b/c it will always be paired with section out which needs time to animate
		self.contentIn();
		self.animateIn();
	}, 600);
};