/**
 * Created by ethangodt on 6/29/15.
 */

app.sectionFactory = function sectionFactory (id) {
    var container, content, title;

	container = document.querySelector("#" + id);

	content = (function gatherCards () {
        var cards = container.getElementsByClassName("card");

		if (cards.length > 1) { // if more than one card, package everything in a cardManager
			var cardsArr = [];
			for (var i = 0; i < cards.length; i++) {
				cardsArr.push(new app.Card(cards[i]));
			}
			return new app.CardsManager(cardsArr, id);
		} else if (cards.length === 1) { // if only one card, just use single card as content
			return new app.Card(cards[0]);
		}
    }());

	title = new app.Title(container, id);

	return new app.Section(container, content, title, id); // make new section with all parts and return
};