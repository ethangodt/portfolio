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
import "./mobileNav"; // fix this later

const APP_CONTAINER = document.querySelector("#APP");

window.router = new Router(
  {
    fallback: "/about",
    "/about": getRoute("aboutSection", "about", "#2d2d2d", [
      new Card(about, "#b5b5b5"),
    ]),
    "/paypal": getRoute("bla", "paypal", "#0070ba", [
      new Card(p2p, "#dcd9f5"),
      new Card(gifting, "#bb8be6"),
      new Card(jaws, "red"),
    ]),
    "/misc": getRoute("sldjf", "side projects", "#7a88d0", [
      new Card(songlink, "red"),
    ]),
    "/design": getRoute("lsdjf", "design", "#7a88d0", [
      new Card(plantMW, "#4232c7"),
      new Card(crossfit, "#b77272"),
      new Card(ekk, "red"),
    ]),
  },
  APP_CONTAINER
);

function getRoute(id, titleString, color, cards) {
  const sectionBackgroundEl = document.createElement("div");
  sectionBackgroundEl.classList.add("section-bg-gradient", "inactive");
  APP_CONTAINER.appendChild(sectionBackgroundEl);
  const title = new Title(id, titleString);
  const section = new Section(id, title, cards, sectionBackgroundEl, color);
  return {
    renderable: section.renderable(),
    didMount: () => Promise.resolve().then(() => section.animateIn()),
    willUnmount: () => section.animateOut(),
  };
}
