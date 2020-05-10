import "./init";
import Router from "./router";
import Section from "./Section";
import Card from "./cards/card";
import Title from "./Title";
import about from "./cards/views/about.html";
import songlink from "./cards/views/songlink.html";
import plantMW from "./cards/views/plant-midwest.html";
import p2p from "./cards/views/p2p.html";
import gifting from "./cards/views/gifting.html";
import jaws from "./cards/views/jaws.html";
import crossfit from "./cards/views/crossfit.html";
import ekk from "./cards/views/ekk.html";
import "./mobileNav"; // refactor this later

const APP_CONTAINER = document.querySelector("#APP");

window.router = new Router(
  {
    fallback: "/about",
    "/about": getRoute("about", "#2d2d2d", [new Card(about, "#b5b5b5")]),
    "/paypal": getRoute("paypal", "#0070ba", [
      new Card(p2p, "#8fc4fb"),
      new Card(gifting, "#3b9a47"),
      new Card(jaws, "#bb8be6"),
    ]),
    "/misc": getRoute("side projects", "#5a5d6d", [new Card(songlink, "#d03608")]),
    "/design": getRoute("design", "#987676", [
      new Card(plantMW, "#400000"),
      new Card(crossfit, "red"),
      new Card(ekk, "black"),
    ]),
  },
  APP_CONTAINER
);

function hackyTobacky(path) {
  // in case my router is running on github pages....
  return window.location.pathname.includes("portfolio")
    ? `/portfolio${path}`
    : path;
}

function getRoute(titleString, color, cards) {
  const sectionBackgroundEl = document.createElement("div");
  sectionBackgroundEl.classList.add("section-bg-gradient", "inactive");
  APP_CONTAINER.appendChild(sectionBackgroundEl);
  const title = new Title(titleString);
  const section = new Section(title, cards, sectionBackgroundEl, color);
  return {
    renderable: section.renderable(),
    didMount: () => Promise.resolve().then(() => section.animateIn()),
    willUnmount: () => section.animateOut(),
  };
}
