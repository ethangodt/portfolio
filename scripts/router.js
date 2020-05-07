export default class Router {
  constructor(routeConfig, targetEl) {
    // this._eventQueue = [];
    // this._setupMutationObserver(this.targetEl);
    this._isRouting = false; // throttle routing to not complicate animations
    this.targetEl = targetEl;
    this.routes = {};
    this.register(routeConfig);
    this._fallbackRoute = routeConfig.fallback;
    this._setInitialRoute();
    // TODO listen for changes from back and next button
  }
  register(routeConfig) {
    // TODO add support for nested routers?
    for (let route in routeConfig) {
      this.routes[route] = routeConfig[route];
    }
  }
  to(path) {
    const currentPath = this._getPath(window.location.pathname);
    const isSamePath = currentPath === path;
    if (this._isRouting || isSamePath) {
      // throttle if we're already routing,
      // or simply ignore if we're already on the route
      return;
    }
    // TODO I don't think this needs to go here
    const isRouteSupported = !!this.routes[path];
    if (!isRouteSupported) {
      return this.to(this._fallbackRoute);
    }
    window.history.pushState(null, null, this._makePath(path));
    Promise.resolve()
      .then(() => {
        if (this.routes[currentPath]) {
          return this._unMountRoute(currentPath);
        }
      })
      .then(() => {
        return this._mountRoute(path);
      });
  }
  _unMountRoute(path) {
    const route = this.routes[path];
    return route.willUnmount().then(() => {
      this.targetEl.removeChild(route.renderable);
    });
  }
  _mountRoute(path) {
    const route = this.routes[path];
    this.targetEl.appendChild(route.renderable);
    return route.didMount().then(() => {
      // at this point a new route has been mounted,
      // the didMount callback is complete,
      // and we no longer need to throttle the router
      this._isRouting = false;
    });
  }
  // _setupMutationObserver(targetEl) {
  //   const observer = new MutationObserver(this._handleMountEvents.bind(this));
  //   observer.observe(targetEl, { childList: true, subtree: false });
  // }
  // _handleMountEvents() {
  //   const event = this._eventQueue.shift();
  //   event();
  // }
  _setInitialRoute() {
    const initialPath = this._getPath(window.location.pathname);
    if (this.routes[initialPath]) {
      this._mountRoute(initialPath);
    } else {
      this.to(this._fallbackRoute);
    }
  }
  _getPath() {
    const isGithub = window.location.pathname.includes("portfolio");
    return isGithub
      ? window.location.pathname.replace("/portfolio", "")
      : window.location.pathname;
  }
  _makePath(path) {
    const isGithub = window.location.pathname.includes("portfolio");
    return isGithub ? `/portfolio${path}` : path;
  }
}
