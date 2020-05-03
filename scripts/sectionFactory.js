import {Card, CardsManager} from './CardsAndManager'
import Title from './Title'
import Section from './Section'

export default function sectionFactory (id) {
	console.log('testing');
	var container, content, title;

	container = document.querySelector("#" + id);

	content = (function gatherCards () {
        var cards = container.getElementsByClassName("card");

		if (cards.length > 1) { // if more than one card, package everything in a cardManager
			var cardsArr = [];
			for (var i = 0; i < cards.length; i++) {
				cardsArr.push(new Card(cards[i]));
			}
			return new CardsManager(cardsArr, id);
		} else if (cards.length === 1) { // if only one card, just use single card as content
			return new Card(cards[0]);
		}
    }());

	title = new Title(container, id);

	return new Section(container, content, title, id); // make new section with all parts and return
};
