/**
 * Created by ethangodt on 6/29/15.
 */
var app = {};

// executes miscellaneous preliminary tasks
(function () {
	'use strict';


	// check for Safari to avoid terrible transform support
	var isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
	if (isSafari || window.innerWidth <= 768) {
		document.body.classList.remove("hoverEnabled");
	}


	// this is a CustomEvent constructor polyfill for safari and internet explorer
	function CustomEvent ( event, params ) {
		params = params || { bubbles: false, cancelable: false, detail: undefined };
		var evt = document.createEvent( 'CustomEvent' );
		evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
		return evt;
	}

	CustomEvent.prototype = window.Event.prototype;

	window.CustomEvent = CustomEvent;
}());