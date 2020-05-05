import Router from "./router";
import Section from "./Section";
import Card from "./cards/card";
import Title from "./Title";
import about from "./cards/views/about.html";
import songlink from "./cards/views/songlink.html";
import plantMW from "./cards/views/plant-midwest.html";

window.router = new Router(
  {
    fallback: "/about",
    "/about": getRoute("aboutSection", "about", [about]),
    "/engineering": getRoute("devSection", "eng", [about, plantMW, songlink]),
  },
  document.querySelector("#APP")
);

function getRoute(id, titleString, cardsHTML) {
  const title = new Title(id, titleString);
  const section = new Section(
    id,
    title,
    cardsHTML.map((html) => new Card(html))
  );
  return {
    renderable: section.renderable(),
    didMount: () => Promise.resolve().then(() => section.animateIn()),
    willUnmount: () => section.animateOut(),
  };
}
