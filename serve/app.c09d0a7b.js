// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"scripts/router.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Router = /*#__PURE__*/function () {
  function Router(routeConfig, targetEl) {
    _classCallCheck(this, Router);

    // this._eventQueue = [];
    // this._setupMutationObserver(this.targetEl);
    this._isRouting = false; // throttle routing to not complicate animations

    this.targetEl = targetEl;
    this.routes = {};
    this.register(routeConfig);
    this._fallbackRoute = routeConfig.fallback;

    this._setInitialRoute(); // TODO listen for changes from back and next button

  }

  _createClass(Router, [{
    key: "register",
    value: function register(routeConfig) {
      // TODO add support for nested routers?
      for (var route in routeConfig) {
        this.routes[route] = routeConfig[route];
      }
    }
  }, {
    key: "to",
    value: function to(path) {
      var _this = this;

      var currentPath = window.location.pathname;
      var isSamePath = currentPath === path;

      if (this._isRouting || isSamePath) {
        // throttle if we're already routing,
        // or simply ignore if we're already on the route
        return;
      } // TODO I don't think this needs to go here


      var isRouteSupported = !!this.routes[path];

      if (!isRouteSupported) {
        return this.to(this._fallbackRoute);
      }

      window.history.pushState(null, null, path);
      Promise.resolve().then(function () {
        if (_this.routes[currentPath]) {
          return _this._unMountRoute(currentPath);
        }
      }).then(function () {
        return _this._mountRoute(path);
      });
    }
  }, {
    key: "_unMountRoute",
    value: function _unMountRoute(path) {
      var _this2 = this;

      var route = this.routes[path];
      return route.willUnmount().then(function () {
        _this2.targetEl.removeChild(route.renderable);
      });
    }
  }, {
    key: "_mountRoute",
    value: function _mountRoute(path) {
      var _this3 = this;

      var route = this.routes[path];
      this.targetEl.appendChild(route.renderable);
      return route.didMount().then(function () {
        // at this point a new route has been mounted,
        // the didMount callback is complete,
        // and we no longer need to throttle the router
        _this3._isRouting = false;
      });
    } // _setupMutationObserver(targetEl) {
    //   const observer = new MutationObserver(this._handleMountEvents.bind(this));
    //   observer.observe(targetEl, { childList: true, subtree: false });
    // }
    // _handleMountEvents() {
    //   const event = this._eventQueue.shift();
    //   event();
    // }

  }, {
    key: "_setInitialRoute",
    value: function _setInitialRoute() {
      var _window = window,
          initialPath = _window.location.pathname;

      if (this.routes[initialPath]) {
        this._mountRoute(initialPath);
      } else {
        this.to(this._fallbackRoute);
      }
    }
  }]);

  return Router;
}();

exports.default = Router;
},{}],"scripts/html.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.htmlToElement = htmlToElement;

function htmlToElement(html) {
  var template = document.createElement('template');
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
}
},{}],"scripts/utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.delay = void 0;

var delay = function delay(wait) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve();
    }, wait);
  });
};

exports.delay = delay;
},{}],"scripts/Section.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Section;

var _html = require("./html");

var _utils = require("./utils");

// TODO reset the width when the window resizes
function Section(id, title, cards, backgroundEl, color) {
  var _this = this;

  var template = "\n    <div class=\"sectionContainer inactive\"></div>\n  "; // TODO get rid of id and custom event

  var event = new CustomEvent(id + "Scroll");
  backgroundEl.style.background = "linear-gradient(142deg, ".concat(color, ", transparent)");
  backgroundEl.style.backgroundColor = cards[0].backgroundColor;
  this.backgroundEl = backgroundEl;
  this.cardMargin = 100; // check _cards.scss ....

  this.currentScrollZone = 0;
  this.active = false; // currently visible in the view

  this.appWrapper = document.querySelector(".main-wrapper");
  this.wrapper = (0, _html.htmlToElement)(template);
  this.wrapper.appendChild(title.renderable());
  this.cards = cards;
  this.cards.forEach(function (card, i) {
    card.shiftDepth(i);

    _this.wrapper.appendChild(card.renderable());
  });
  window.addEventListener("resize", function () {
    if (!_this.active) return;

    _this._setMainWrapperHeight();

    _this._setCardWidths();
  });
  var throttleScrollEffects = false;
  window.addEventListener("scroll", function () {
    if (!_this.active) {
      return;
    }

    if (throttleScrollEffects) {
      return;
    } else {
      _this._shiftCardDepths(window.scrollY);

      throttleScrollEffects = true;
      setTimeout(function () {
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
  var _this2 = this;

  return Promise.resolve().then(function () {
    return (0, _utils.delay)(50);
  }) // ugh, need to add a delay here so we can give the browser time to paint the DOM to the screen
  .then(function () {
    _this2.active = true;
    window.scrollTo(0, 0);

    _this2.wrapper.classList.remove("inactive");

    _this2.backgroundEl.classList.remove("inactive");

    _this2._setMainWrapperHeight();

    _this2._setCardWidths();

    return Promise.all(_this2.cards.map(function (card, i) {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          card.animateIn();
        }, 300 * i);
      });
    }));
  });
};

Section.prototype.animateOut = function animateOut() {
  var _this3 = this;

  return Promise.resolve().then(function () {
    _this3.active = false;

    _this3.wrapper.classList.add("inactive");

    _this3.backgroundEl.classList.add("inactive");

    _this3.cards.forEach(function (card) {
      card.animateOut();
    });
  }).then(function () {
    return (0, _utils.delay)(600);
  });
};

Section.prototype._setCardWidths = function _setCardWidths() {
  var _this4 = this;

  this.cards.forEach(function (card, i) {
    if (i !== 0) {
      card.setWidth(_this4.cards[0].el.offsetWidth + "px");
    }
  });
};

Section.prototype._setMainWrapperHeight = function setMainWrapperHeight() {
  var _this5 = this;

  var newHeight = 0;
  this.cards.forEach(function (card) {
    var cardAndMargin = card.getHeight() + _this5.cardMargin;

    newHeight += cardAndMargin;
  });
  this.appWrapper.style.height = newHeight + "px";
};

Section.prototype._shiftCardDepths = function _shiftCardDepths(scrollVal) {
  var _this6 = this;

  var currentScrollZone = this.currentScrollZone;
  var totalMargin = 0;
  var totalCardHeight = 0;
  var startOfZones = [0];

  for (var i = 0; i < this.cards.length; i++) {
    totalMargin += this.cardMargin;
    totalCardHeight += this.cards[i].getHeight();
    var startOfNextScrollZone = totalMargin + totalCardHeight;
    startOfZones.push(startOfNextScrollZone);

    if (scrollVal < startOfNextScrollZone) {
      // you're not in the next scrollZone, you're in this one
      currentScrollZone = i;
      break;
    }
  }

  var zoneHeight = startOfZones[currentScrollZone + 1] - startOfZones[currentScrollZone];
  var zoneOffsetScrollHeight = scrollVal - startOfZones[currentScrollZone];
  var percentageCompleteWithZone = zoneOffsetScrollHeight / zoneHeight;
  var depthHasUpdated = currentScrollZone !== this.currentScrollZone;
  var almostUpdated = percentageCompleteWithZone > 0.8;

  if (depthHasUpdated) {
    this.backgroundEl.style.backgroundColor = this.cards[currentScrollZone].backgroundColor;
  }

  if (depthHasUpdated || almostUpdated) {
    this.currentScrollZone = currentScrollZone;
    this.cards.forEach(function (card, i) {
      card.shiftDepth(Math.max(i - _this6.currentScrollZone, 0), percentageCompleteWithZone >= 1 ? 0 : percentageCompleteWithZone // I need to see 100% as 0%
      );
    });
  }
};
},{"./html":"scripts/html.js","./utils":"scripts/utils.js"}],"scripts/cards/card.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Card;

var _html = require("../html");

function Card(html, backgroundColor) {
  this.backgroundColor = backgroundColor;
  this.el = (0, _html.htmlToElement)(html);
}

Card.prototype.renderable = function render() {
  return this.el;
};

Card.prototype.animateIn = function animateIn() {
  console.log(this.el.classList);
  this.el.classList.remove("unloaded");
};

Card.prototype.animateOut = function animateOut() {
  this.el.classList.add("unloaded");
};

Card.prototype.shiftDepth = function shiftDepth(depth, percentageCompleteWithZone) {
  var newStyle = {
    position: "fixed",
    top: "".concat(175 - 32 * specialDepth(depth, percentageCompleteWithZone), "px"),
    zIndex: depth * -10,
    opacity: 1 - 0.4 * specialDepth(depth, percentageCompleteWithZone),
    left: "calc((99vw - 250px) * .5 + 250px - ".concat(this.el.offsetWidth * 0.5, ")"),
    transform: "scale(".concat(1 - 0.04 * specialDepth(depth, percentageCompleteWithZone), ")"),
    //
    // something wacko is happening with CSS 3D space,
    // when the heights of different objects are pushed back
    // — despite perspective-origin or anything —
    // the top edge of the objects do not align
    height: "1000px"
  };

  for (var style in newStyle) {
    if (depth === 0) {
      // you're being viewed, and you don't
      // need extra styles — remove them if you had them
      this.el.style[style] = null;
    } else {
      this.el.style[style] = newStyle[style];
    }
  }
};

Card.prototype.getHeight = function getHeight() {
  // because the fixed cards in the bg require fixed height,
  // we use scrollHeight to see what those elements would be in normal page flow
  // see "wacko" comment above
  return this.el.scrollHeight;
};

Card.prototype.setWidth = function setWidth(width) {
  this.el.style.width = width;
};

function easeInOutCubic(x) {
  // awesome website https://easings.net/
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function specialDepth(originalDepth, percent) {
  var reverseImpact = 1; // lol

  if (percent > 0.8) {
    // ease a curve through last 20% of zone only
    reverseImpact = easeInOutCubic((1 - percent) * 5); // some number between 0 - 1
  }

  return originalDepth - (1 - reverseImpact);
}
},{"../html":"scripts/html.js"}],"scripts/Title.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Title;

var _html = require("./html");

function Title(id, title) {
  var _this = this;

  console.log(id);
  var template = "\n\t  <div class=\"titleContainer\">\n      <h2>".concat(title.toUpperCase(), "</h2>\n    </div>\n\t");
  this.el = (0, _html.htmlToElement)(template);
  window.addEventListener(id + "Scroll", function () {
    var scrollAmt = window.scrollY;

    if (scrollAmt < 250) {
      window.requestAnimationFrame(function () {
        _this.animateTitle(scrollAmt);
      });
    }
  });
}

Title.prototype.renderable = function renderable() {
  return this.el;
};

Title.prototype.animateTitle = function animateTitle(scrollAmt) {
  if (scrollAmt < 10) {
    this.el.style.opacity = 1;
    this.el.style.transform = "scale(1)";
  } else if (scrollAmt >= 10 && scrollAmt <= 60) {
    // change opacity
    // the scrollVal is what's *subtracted* from the opacity of the element
    // scrollVal begins changing after 10 initial pixels have been scrolled
    // opacity changes from 1 to 0 over 50 scrolled pixels ((50 * 2) / 100 = 1)
    var opacityScrollVal = (scrollAmt - 10) * 2 / 100;
    this.el.style.opacity = "" + 1 - opacityScrollVal.toFixed(3); // change scale
    // this works to shift the scale down from 1 to .99
    // like the opacityScrollVal, scaleScrollVal starts tracking after 10 initial pixels have been scrolled
    // it completes the change after 50 pixels — (50 * .5) / 1000 = .01

    var scaleScrollVal = (scrollAmt - 10) * 0.5 / 1000;
    this.el.style.transform = "scale(" + (1 - scaleScrollVal.toFixed(3)) + ")";
  } else {
    this.el.style.opacity = 0;
    this.el.style.transform = "scale(.99)";
  }
};
},{"./html":"scripts/html.js"}],"scripts/mobileNav.js":[function(require,module,exports) {
(function () {
  'use strict'; // setup navIcon

  var menuIcon = document.querySelector("#navIcon"),
      buttonContainer = document.querySelector("#buttonContainer");
  menuIcon.addEventListener("click", function () {
    // if it's already open, close it
    if (buttonContainer.style.height === "236px") {
      buttonContainer.style.height = "0px";
      return;
    }

    buttonContainer.style.height = "236px";
  }); // setup css transition class on smallest mobile breakpoint

  if (window.innerWidth <= 485) {
    buttonContainer.classList.add("mobileMenuTransition");
  }

  window.addEventListener("resize", function () {
    if (window.innerWidth <= 485) {
      buttonContainer.classList.add("mobileMenuTransition");
    } else {
      buttonContainer.classList.remove("mobileMenuTransition");
    }
  }); // close buttonContainer after button click on smallest mobile breakpoint

  var buttons = buttonContainer.getElementsByTagName("li");

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", mobileNavClickHandler);
  }

  function mobileNavClickHandler() {
    if (window.innerWidth <= 485) {
      buttonContainer.removeAttribute("style");
    }
  }
})();
},{}],"scripts/app.js":[function(require,module,exports) {
"use strict";

var _router = _interopRequireDefault(require("./router"));

var _Section = _interopRequireDefault(require("./Section"));

var _card = _interopRequireDefault(require("./cards/card"));

var _Title = _interopRequireDefault(require("./Title"));

var _about = _interopRequireDefault(require("./cards/views/about.html"));

var _songlink = _interopRequireDefault(require("./cards/views/songlink.html"));

var _plantMidwest = _interopRequireDefault(require("./cards/views/plant-midwest.html"));

var _p2p = _interopRequireDefault(require("./cards/views/p2p.html"));

var _gifting = _interopRequireDefault(require("./cards/views/gifting.html"));

var _jaws = _interopRequireDefault(require("./cards/views/jaws.html"));

var _crossfit = _interopRequireDefault(require("./cards/views/crossfit.html"));

var _ekk = _interopRequireDefault(require("./cards/views/ekk.html"));

require("./mobileNav");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// fix this later
var APP_CONTAINER = document.querySelector("#APP");
window.router = new _router.default({
  fallback: "/about",
  "/about": getRoute("aboutSection", "about", "#2d2d2d", [new _card.default(_about.default, "#b5b5b5")]),
  "/paypal": getRoute("bla", "paypal", "#0070ba", [new _card.default(_p2p.default, "#dcd9f5"), new _card.default(_gifting.default, "#bb8be6"), new _card.default(_jaws.default, "red")]),
  "/misc": getRoute("sldjf", "side projects", "#7a88d0", [new _card.default(_songlink.default, "red")]),
  "/design": getRoute("lsdjf", "design", "#7a88d0", [new _card.default(_plantMidwest.default, "#4232c7"), new _card.default(_crossfit.default, "#b77272"), new _card.default(_ekk.default, "red")])
}, APP_CONTAINER);

function getRoute(id, titleString, color, cards) {
  var sectionBackgroundEl = document.createElement("div");
  sectionBackgroundEl.classList.add("section-bg-gradient", "inactive");
  APP_CONTAINER.appendChild(sectionBackgroundEl);
  var title = new _Title.default(id, titleString);
  var section = new _Section.default(id, title, cards, sectionBackgroundEl, color);
  return {
    renderable: section.renderable(),
    didMount: function didMount() {
      return Promise.resolve().then(function () {
        return section.animateIn();
      });
    },
    willUnmount: function willUnmount() {
      return section.animateOut();
    }
  };
}
},{"./router":"scripts/router.js","./Section":"scripts/Section.js","./cards/card":"scripts/cards/card.js","./Title":"scripts/Title.js","./cards/views/about.html":"scripts/cards/views/about.html","./cards/views/songlink.html":"scripts/cards/views/songlink.html","./cards/views/plant-midwest.html":"scripts/cards/views/plant-midwest.html","./cards/views/p2p.html":"scripts/cards/views/p2p.html","./cards/views/gifting.html":"scripts/cards/views/gifting.html","./cards/views/jaws.html":"scripts/cards/views/jaws.html","./cards/views/crossfit.html":"scripts/cards/views/crossfit.html","./cards/views/ekk.html":"scripts/cards/views/ekk.html","./mobileNav":"scripts/mobileNav.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50973" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}],"node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"node_modules/parcel-bundler/src/builtins/bundle-loader.js":[function(require,module,exports) {
var getBundleURL = require('./bundle-url').getBundleURL;

function loadBundlesLazy(bundles) {
  if (!Array.isArray(bundles)) {
    bundles = [bundles];
  }

  var id = bundles[bundles.length - 1];

  try {
    return Promise.resolve(require(id));
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      return new LazyPromise(function (resolve, reject) {
        loadBundles(bundles.slice(0, -1)).then(function () {
          return require(id);
        }).then(resolve, reject);
      });
    }

    throw err;
  }
}

function loadBundles(bundles) {
  return Promise.all(bundles.map(loadBundle));
}

var bundleLoaders = {};

function registerBundleLoader(type, loader) {
  bundleLoaders[type] = loader;
}

module.exports = exports = loadBundlesLazy;
exports.load = loadBundles;
exports.register = registerBundleLoader;
var bundles = {};

function loadBundle(bundle) {
  var id;

  if (Array.isArray(bundle)) {
    id = bundle[1];
    bundle = bundle[0];
  }

  if (bundles[bundle]) {
    return bundles[bundle];
  }

  var type = (bundle.substring(bundle.lastIndexOf('.') + 1, bundle.length) || bundle).toLowerCase();
  var bundleLoader = bundleLoaders[type];

  if (bundleLoader) {
    return bundles[bundle] = bundleLoader(getBundleURL() + bundle).then(function (resolved) {
      if (resolved) {
        module.bundle.register(id, resolved);
      }

      return resolved;
    }).catch(function (e) {
      delete bundles[bundle];
      throw e;
    });
  }
}

function LazyPromise(executor) {
  this.executor = executor;
  this.promise = null;
}

LazyPromise.prototype.then = function (onSuccess, onError) {
  if (this.promise === null) this.promise = new Promise(this.executor);
  return this.promise.then(onSuccess, onError);
};

LazyPromise.prototype.catch = function (onError) {
  if (this.promise === null) this.promise = new Promise(this.executor);
  return this.promise.catch(onError);
};
},{"./bundle-url":"node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"node_modules/parcel-bundler/src/builtins/loaders/browser/html-loader.js":[function(require,module,exports) {
module.exports = function loadHTMLBundle(bundle) {
  return fetch(bundle).then(function (res) {
    return res.text();
  });
};
},{}],0:[function(require,module,exports) {
var b=require("node_modules/parcel-bundler/src/builtins/bundle-loader.js");b.register("html",require("node_modules/parcel-bundler/src/builtins/loaders/browser/html-loader.js"));b.load([["about.dea146a3.html","scripts/cards/views/about.html"],["songlink.f3472061.html","scripts/cards/views/songlink.html"],["plant-midwest.0aee591a.html","scripts/cards/views/plant-midwest.html"],["p2p.7c894fa0.html","scripts/cards/views/p2p.html"],["gifting.70ef70fb.html","scripts/cards/views/gifting.html"],["jaws.1792e7f9.html","scripts/cards/views/jaws.html"],["crossfit.44dd47f9.html","scripts/cards/views/crossfit.html"],["ekk.f9d363ea.html","scripts/cards/views/ekk.html"]]).then(function(){require("scripts/app.js");});
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js",0], null)
//# sourceMappingURL=/app.c09d0a7b.js.map