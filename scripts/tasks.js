/**
 * Created by ethangodt on 7/1/15.
 */

(function () {
    'use strict';

	// check for Safari to avoid terrible button transforms
	var isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
	if (isSafari || window.innerWidth <= 768) {
		document.body.classList.remove("hoverEnabled");
	}
}());
