import sectionFactory from './sectionFactory'

function SectionManager () {
	var self = this;

	this.about = new sectionFactory("aboutSection");
	this.design = new sectionFactory("designSection");
	this.dev = new sectionFactory("devSection");

	this.currentSection = null;


	// setup about section on load
	(function init () {
	    self.currentSection = self.about;
		self.about.contentIn();
		self.about.animateIn();
	}());

	// setup nav listeners
	(function setupNavListeners () {
		var nav = document.getElementsByTagName("nav"),
			buttons = nav[0].getElementsByTagName("li");

		for (var i = 0; i < buttons.length - 1; i++) { // the minus one is to prevent a listener from being added to the contact button
			buttons[i].addEventListener("click", navClickHandler);
		}
	}());

	function navClickHandler () {
		var id = this.getAttribute("id"),
			section;

		switch (id) {
			case "aboutButton":
				section = self.about;
				break;
			case "designButton":
				section = self.design;
				break;
			case "devButton":
				section = self.dev;
				break;
		}

		if (section === self.currentSection) return;

		self.switchSections(self.currentSection, section);
	}
};

SectionManager.prototype.setCurrentSection = function setCurrentSection (newSection) {
	this.currentSection = newSection;
};

SectionManager.prototype.switchSections = function switchSections (currentSection, newSection) {
	currentSection.sectionOut(); // within this function there is a delay on the animate in
	this.setCurrentSection(newSection);
	newSection.sectionIn(); // within this function there is a delay wrapping the whole transition
};

export default SectionManager
