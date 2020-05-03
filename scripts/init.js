import SectionManager from "./SectionManager";
import Router from "./router";

(function init() {
  // sets up main view objects
  var view = new SectionManager();
})();

let innerEl = "<div>This is <span>INSIDE</span></div>";
let testEl = document.createElement("div");
testEl.innerHTML = innerEl;

window.router = new Router(
  {
    "/about": (didMount, willUnmount) => {
      didMount(
        () =>
          new Promise((resolve, reject) => {
            console.log("a-didMount");
            resolve();
          })
      );
      willUnmount(
        () =>
          new Promise((resolve, reject) => {
            console.log("a-willUnmount");
            resolve();
          })
      );
      return testEl;
    },
    "/engineering": (didMount, willUnmount) => {
      didMount(
        () =>
          new Promise((resolve, reject) => {
            console.log("e-didMount");
            resolve();
          })
      );
      willUnmount(
        () =>
          new Promise((resolve, reject) => {
            console.log("e-willUnmount");
            resolve();
          })
      );
      return testEl;
    },
  },
  document.querySelector("#APP")
);
