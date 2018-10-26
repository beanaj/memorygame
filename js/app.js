//Global game variables
let cardList = [];
let move = 0;
let matched = 0;
let threeStar = 12;
let twoStar = 20;
let minutes = 0;
let seconds = 0;
let lock = false;
let timer = null;

//Initialize the game state when the page is loaded
window.addEventListener("load", () => {
    initialGame();
});

//Function to start the game for the first time.
function initialGame() {
    //Shuffle cards on the start of the game
    displayShuffledCards();
    //Ensuring when restart is clicked the game is started over
    document.getElementById("restartButton").addEventListener("click", () => {
        restartGame();
    });
    //Start the timer for the game
    timer = setInterval(timerUpdate, 1000);
}

//Function to move the game to the end state and display a congratulatory message.
function endGame() {
    //Stop the timer
    clearInterval(timer);
    //Get the winning time and add it to the scoreboard
    document.getElementById("winMessage").style.display = "block";
    document.getElementById("time").innerHTML = `Time: ${formatTime(seconds, minutes)}`;
    //Get the number of stars and display the score
    let score = document.getElementById("starScore").childElementCount;
    document.getElementById("winRating").innerHTML = `Score: ${score} Stars`;
    //Ensure that the modal closes when clicked off
    document.getElementById("winMessage").addEventListener("click", function () {
        document.getElementById("winMessage").style.display = "none";
    })
}

//Update the time in game
function timerUpdate() {
    let second = getSeconds();
    document.getElementById("timer").innerHTML = formatTime(second, minutes);
    //Check to see if all of the cards have been matched, if so end the game
    if (matched === 16) {
        endGame();
    }
}

//Structure the string used for the time display
function formatTime(second, minute) {
    let time = "";
    //Check to see if the seconds are under 10, in order to determine whether I need to add a leading 0
    if (second < 10) {
        //Same thing for minutes
        if (minute < 10) {
            time = `0${minute}:0${second}`;
        } else {
            time = `${minute}:0${second}`;
        }
    } else {
        if (minute < 10) {
            time = `0${minute}:${second}`;
        } else {
            time = `${minute}:${second}`;
        }
    }
    return time;
}

//Ensure that the seconds roll over
function getSeconds() {
    seconds += 1;
    if (seconds > 59) {
        minutes += 1;
        seconds = 0;
    }
    return seconds;
}

//Restart the game, resetting the global variables
function restartGame() {
    //Add the stars back
    assessStar(false, move);
    cardList = [];
    //Reset the moves
    move = -1;
    incrementMove();
    //Reset the matched numbers
    matched = 0;
    //Shuffle and display the deck
    displayShuffledCards();
    //Reset the timer variables
    minutes = 0;
    seconds = 0;
    document.getElementById("timer").innerHTML = `00:00`;
    matched = 0;
    //Stop and start the timer again
    clearInterval(timer);
    timer = setInterval(timerUpdate, 1000);
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function displayShuffledCards() {
    //Create an array of classes
    let cardArray = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-anchor", "fa-leaf",
        "fa-bicycle", "fa-diamond", "fa-bomb", "fa-leaf", "fa-bomb", "fa-bolt", "fa-bicycle", "fa-paper-plane-o", "fa-cube"];
    //Shuffle the array
    cardArray = shuffle(cardArray);
    const deck = document.getElementById("cardDeck");
    deck.innerHTML = "";
    //Create the deck
    cardArray.forEach((cardType) => {
        const cardListItem = document.createElement("li");
        cardListItem.className = "card";
        cardListItem.tagName = `${cardType}`;
        //Add the event handler for the flipping of cards
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
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//Flip the clicked card
function flipCard(card) {
    //Check to see if there are already cards being flipped, if they are dont allow the flip
    if (!lock) {
        //Check to see if it is the first card being flipped
        if (cardList.length < 1) {
            card.className = "card match";
            cardList.push(card);
        } else {
            //Compare the cards
            let cardMatch = cardList.pop();
            card.className = "card match";
            let card1Type = card.lastChild.className;
            let card2Type = cardMatch.lastChild.className;
            //If matched lock the cards
            if (card1Type === card2Type) {
                lockCard(card, cardMatch);
            } else {
                //Otherwise flip back
                lock = true;
                setTimeout(function () {
                    incrementMove();
                    lock = false;
                    card.className = "card";
                    cardMatch.className = "card";
                }, 1000);
            }
        }
    }
}

//Lock the card by increasing the score and changing the class display
function lockCard(card, cardMatch) {
    incrementMove();
    card.className = "card match";
    cardMatch.className = "card match";
    matched += 1;
}

//Increment the number of moves and update the UI
function incrementMove() {
    move += 1;
    document.getElementById("moveCount").innerHTML = move;
    assessStar(true, move);
}

//Check to see if the stars need to be removed based on the score thresholds
function assessStar(remove, move) {
    if (remove) {
        if (move > threeStar) {
            removeStar();
            if (move > twoStar) {
                removeStar();
            }
        }
    } else {
        //Reset the stars
        resetStar();
    }
}

//Removes a star
function removeStar() {
    const stars = document.getElementById('starScore');
    const lastStar = stars.lastChild;
    if (lastStar) {
        stars.removeChild(stars.lastChild);
        if (!stars.lastChild) {
            //If the last star is removed, add it back
            addStar(stars)
        }
    }
}

//Add back three stars
function resetStar() {
    const stars = document.getElementById('starScore');
    stars.innerHTML = "";
    for (let i = 0; i < 3; i++) {
        addStar(stars);
    }
}

//Add one star to the UI
function addStar(stars) {
    const starListItem = document.createElement("li");
    const star = document.createElement("i");
    star.className = `fa fa-star`;
    starListItem.appendChild(star);
    stars.appendChild(starListItem);
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
