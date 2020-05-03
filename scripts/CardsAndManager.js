/**
 * Created by ethangodt on 6/29/15.
 */

export function Card (cardElem) {
	this.elem = cardElem;
	this.wrapperElem = cardElem.parentNode;
};

Card.prototype.animateIn = function animateIn () {
    this.elem.classList.remove("unloaded");
};

Card.prototype.animateOut = function animateOut () {
    this.elem.classList.add("unloaded");
};

Card.prototype.shiftDepth = function shiftDepth (newCardClass, wrapperClass) {
	var currentWrapperClass = this.wrapperElem.classList[0],
		cardClassArr = Array.prototype.slice.call(this.elem.classList),
		oldCardClass = cardClassArr.reduce(function (acc, className) { // return only the class name string I'm looking for
			var re = /(cardFront)|(cardMid)|(cardBack)/;

			if (re.test(className)) {
				return className;
			}

		}, null);

	this.wrapperElem.classList.remove(currentWrapperClass);
	this.wrapperElem.classList.add(wrapperClass);

	this.elem.classList.remove(oldCardClass);
	this.elem.classList.add(newCardClass);
};

Card.prototype.getHeight = function getHeight () {
	var divHeight = this.elem.offsetHeight,
		bottomMargin = 115;

	return divHeight + bottomMargin;
};





export function CardsManager (cardsArr, id) {
   	var self = this;

	this.cards = cardsArr;

	window.addEventListener(id + "Scroll", function () {
		self.shiftDepths(window.scrollY);
	})
};

CardsManager.prototype.getHeight = function getHeight () {
	var totalHeight = 0;

	this.cards.forEach(function (card) {
		totalHeight += card.getHeight();
	});

	return totalHeight;
};

CardsManager.prototype.shiftDepths = function shiftDepths (scrollVal) {
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

CardsManager.prototype.animateIn = function animateIn () {
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

CardsManager.prototype.animateOut = function animateIn () {
	this.cards.forEach(function (card) {
		card.animateOut();
	});
};
