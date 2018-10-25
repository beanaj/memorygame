let cardList = [];
let move = 0;
let threeStar = 9;
let twoStar = 20;

window.addEventListener("load", () => {
    controller();
});

function controller() {
    //Shuffle cards on the start of the game
    displayShuffledCards();
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function displayShuffledCards() {
    let cardArray = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-anchor", "fa-leaf",
        "fa-bicycle", "fa-diamond", "fa-bomb", "fa-leaf", "fa-bomb", "fa-bolt", "fa-bicycle", "fa-paper-plane-o", "fa-cube"];
    cardArray = shuffle(cardArray);
    const deck = document.getElementById("cardDeck");
    cardArray.forEach((cardType) => {
        const cardListItem = document.createElement("li");
        cardListItem.className = "card";
        cardListItem.tagName = `${cardType}`;
        cardListItem.addEventListener("click", () => {
            flipCard(cardListItem);
        });
        const cardTile = document.createElement("i");
        cardTile.className = `fa ${cardType}`;
        cardListItem.appendChild(cardTile);
        deck.appendChild(cardListItem);
    });

}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function flipCard(card) {
    console.log(cardList);
    if (cardList.length < 1) {
        card.className = "card match";
        cardList.push(card);
    } else {
        incrementMove();
        let cardMatch = cardList.pop();
        card.className= "card match";
        let card1Type = card.lastChild.className;
        let card2Type = cardMatch.lastChild.className;
        if (card1Type === card2Type) {
            lockCard(card, cardMatch);
        } else {
            setTimeout(function(){
                console.log("Displaying Invalid Tile");
                card.className = "card";
                cardMatch.className = "card";},1000);
        }
    }
}

function lockCard(card, cardMatch){
    card.className = "card match";
    cardMatch.className = "card match";
}

function incrementMove(){
    move+=1;
    document.getElementById("moveCount").innerHTML=move;
    assessStar(move);
}

function assessStar(move){
    if(move>threeStar&&move<=twoStar){

    }else{

    }
}
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
