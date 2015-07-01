/**
 * Created by ethangodt on 6/30/15.
 */

(function () {
    'use strict';

    // setup navIcon
    var menuIcon = document.querySelector("#navIcon"),
        buttonContainer = document.querySelector("#buttonContainer");

    menuIcon.addEventListener("click", function () {
        // if it's already open, close it
        if (buttonContainer.style.height === "236px") {
            buttonContainer.style.height = "0px";
            return;
        }

        buttonContainer.style.height = "236px";
    });


    // setup transition class on smallest mobile breakpoint
    if (window.innerWidth <= 485) {
        buttonContainer.classList.add("mobileMenuTransition");
    }

    window.addEventListener("resize", function () {
    	if (window.innerWidth <= 485) {
            buttonContainer.classList.add("mobileMenuTransition");
        } else {
            buttonContainer.classList.remove("mobileMenuTransition");
        }
    });


    // close buttonContainer after button click on smallest mobile breakpoint
    var buttons = buttonContainer.getElementsByTagName("li");

    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", mobileNavClickHandler);
    }
    
    function mobileNavClickHandler () {

        if (window.innerWidth <= 485) {
            buttonContainer.removeAttribute("style");
        }
    }

}());