window.addEventListener("load", function () {
	// this sets up excess space (10px) within the skillsContainer to prevent the
	// div from growing and shrinking when the skills blocks are hovered
	var skillsContainer = document.querySelector(".skillsContainer"),
		skillsTitleHeight = skillsContainer.querySelector("h3").clientHeight,
		iconContainer = skillsContainer.querySelector(".iconContainer");

	// init setup on load
	skillsContainer.style.height = iconContainer.clientHeight + skillsTitleHeight + 10 + "px"; // plus 10 for wiggle room

	// setup after resize
	window.addEventListener("resize", function () {
		skillsContainer.style.height = iconContainer.clientHeight + skillsTitleHeight + 10 + "px"; // plus 10 for wiggle room
	})
});
