/**
 * Created by ethangodt on 6/29/15.
 */

app.Card = function Card (cardElem) {
	this.elem = cardElem;
	this.wrapperElem = cardElem.parentNode;
};

app.Card.prototype.animateIn = function animateIn () {
    this.elem.classList.remove("unloaded");
};

app.Card.prototype.animateOut = function animateOut () {
    this.elem.classList.add("unloaded");
};

app.Card.prototype.shiftDepth = function shiftDepth (cardClass, wrapperClass) {
	var currentWrapperClass = this.wrapperElem.classList[0],
		cardClassArr = Array.prototype.slice.call(this.elem.classList),
		relevantCardClass = cardClassArr.reduce(function (acc, elem) {
			var re = /(cardFront)|(cardMid)|(cardBack)/;

			// todo this is a little lame
			if (re.test(elem)) {
				return elem;
			}

		}, null);

	this.wrapperElem.classList.remove(currentWrapperClass);
	this.wrapperElem.classList.add(wrapperClass);

	this.elem.classList.remove(relevantCardClass);
	this.elem.classList.add(cardClass);
};

app.Card.prototype.getHeight = function getHeight () {
	var divHeight = this.elem.offsetHeight,
		bottomMargin = 115;

	return divHeight + bottomMargin;
};





app.CardsManager = function CardsManager (cardsArr, id) {
   	var self = this;

	this.cards = cardsArr;

	window.addEventListener(id + "Scroll", function () {
		self.shiftDepths(window.scrollY);
	})
};

app.CardsManager.prototype.getHeight = function getHeight () {
	var totalHeight = 0;

	this.cards.forEach(function (card) {
		totalHeight += card.getHeight();
	});

	return totalHeight;
};

app.CardsManager.prototype.shiftDepths = function shiftDepths (scrollVal) {
	var self = this,
		firstZone = 175 + this.cards[0].getHeight(),
		secondZone = firstZone + this.cards[1].getHeight(),
		offset = 155; // this amount is b/c the shift should happen before the previous card fully leaves view

	if (scrollVal < firstZone - offset) {
		window.requestAnimationFrame(function () {
			self.cards[0].shiftDepth("cardFront", "cardWrapperFront");
			self.cards[1].shiftDepth("cardMid", "cardWrapperMid");
			self.cards[2].shiftDepth("cardBack", "cardWrapperBack");
		});
	} else if (scrollVal >= firstZone - offset && scrollVal < secondZone - offset) {
		window.requestAnimationFrame(function () {
			self.cards[0].shiftDepth("cardFront", "cardWrapperFront");
			self.cards[1].shiftDepth("cardFront", "cardWrapperFront");
			self.cards[2].shiftDepth("cardMid", "cardWrapperMid");
		});
	} else if (scrollVal >= secondZone - offset) {
		window.requestAnimationFrame(function () {
			self.cards[0].shiftDepth("cardFront", "cardWrapperFront");
			self.cards[1].shiftDepth("cardFront", "cardWrapperFront");
			self.cards[2].shiftDepth("cardFront", "cardWrapperFront");
		});
	}
};

app.CardsManager.prototype.animateIn = function animateIn () {
	var self = this,
		numOfCards = this.cards.length;

	(function delay (idx) {
		window.requestAnimationFrame(self.cards[idx].animateIn.bind(self.cards[idx]));
		if (idx < numOfCards - 1) {
			setTimeout(function () {
				delay(idx + 1);
			}, 300);
		}
	}(0));
};

app.CardsManager.prototype.animateOut = function animateIn () {
	this.cards.forEach(function (card) {
		card.animateOut();
	});
};