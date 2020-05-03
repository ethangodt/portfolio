export default class Router {
  constructor(routeConfig, targetEl) {
    // this._eventQueue = [];
    this._isRouting = false; // throttle routing to not complicate animations
    this.targetEl = targetEl;
    // this._setupMutationObserver(this.targetEl);
    this.routes = {};
    this.register(routeConfig);
    this._setInitialRoute();
    // TODO listen for changes from back and next button
  }
  register(routeConfig) {
    // TODO add support for nested routers?
    for (let route in routeConfig) {
      let newRoute = {
        renderable: undefined,
        didMount: () => {},
        willUnmount: () => {},
      };
      const renderable = routeConfig[route](
        (didMount) => (newRoute.didMount = didMount),
        (willUnmount) => (newRoute.willUnmount = willUnmount)
      );
      newRoute.renderable = renderable;
      this.routes[route] = newRoute;
    }
  }
  to(path) {
    const currentPath = window.location.pathname;
    if (this._isRouting || currentPath === path) {
      // throttle if we're already routing,
      // or simply ignore if we're already on the route
      return;
    }
    window.history.pushState(null, null, path);
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
      while (this.targetEl.firstChild) {
        // honestly there should only ever be one
        this.targetEl.removeChild(this.targetEl.firstChild);
      }
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
    const initialPath = window.location.pathname;
    if (this.routes[initialPath]) {
      this._mountRoute(initialPath);
    }
  }
}

