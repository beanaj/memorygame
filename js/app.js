let cardList = [];
let move = 0;
let matched =0;
let threeStar = 100;
let twoStar = 100;
let minutes = 0;
let seconds = 0;
let lock = false;
let timer = null;

window.addEventListener("load", () => {
    initialGame();
});

function initialGame() {
    //Shuffle cards on the start of the game
    displayShuffledCards();
    document.getElementById("restartButton").addEventListener("click", ()=>{
        restartGame();
    });
    timer = setInterval(timerUpdate, 1000);
}

function endGame(){
    clearInterval(timer);
    document.getElementById("winMessage").style.display = "block";
    document.getElementById("time").innerHTML = `Time: ${formatTime(seconds, minutes)}`;
    let score =  document.getElementById("starScore").childElementCount;
    document.getElementById("winRating").innerHTML = `Score: ${score} Stars`;
    document.getElementById("winMessage").addEventListener("click", function () {
        document.getElementById("winMessage").style.display = "none";
    })
}

function timerUpdate(){
    let second = getSeconds();
    document.getElementById("timer").innerHTML= formatTime(second, minutes);
    console.log(matched);
    if(matched===1){
        endGame();
    }
}

function formatTime(second, minute) {
    let time = "";
    if(second<10){
        if(minute<10){
            time = `0${minute}:0${second}`;
        }else {
            time = `${minute}:0${second}`;
        }
    }else{
        if(minute<10){
            time = `0${minute}:${second}`;
        }else {
            time = `${minute}:${second}`;
        }
    }
    return time;
}
function getSeconds(){
    seconds+=1;
    if(seconds>59){
        minutes+=1;
        seconds=0;
    }
    return seconds;
}

function restartGame(){
    assessStar(false, move);
    cardList = [];
    move = -1;
    incrementMove();
    matched =0;
    displayShuffledCards();
    minutes=0;
    seconds=0;
    document.getElementById("timer").innerHTML=`00:00`;
    matched = 0;
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
    let cardArray = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-anchor", "fa-leaf",
        "fa-bicycle", "fa-diamond", "fa-bomb", "fa-leaf", "fa-bomb", "fa-bolt", "fa-bicycle", "fa-paper-plane-o", "fa-cube"];
    cardArray = shuffle(cardArray);
    const deck = document.getElementById("cardDeck");
    deck.innerHTML="";
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

function flipCard(card) {
    if(!lock){
        if (cardList.length < 1) {
            card.className = "card match";
            cardList.push(card);
        } else {
            let cardMatch = cardList.pop();
            card.className= "card match";
            let card1Type = card.lastChild.className;
            let card2Type = cardMatch.lastChild.className;
            if (card1Type === card2Type) {
                lockCard(card, cardMatch);
            } else {
                lock=true;
                setTimeout(function(){
                    incrementMove();
                    lock = false;
                    card.className = "card";
                    cardMatch.className = "card";},1000);
            }
        }
    }
}

function lockCard(card, cardMatch){
    incrementMove();
    card.className = "card match";
    cardMatch.className = "card match";
    matched+=1;
}

function incrementMove(){
    move+=1;
    document.getElementById("moveCount").innerHTML=move;
    assessStar(true, move);
}

function assessStar(remove, move){
    if(remove){
        if(move>threeStar){
            removeStar();
            if(move>twoStar){
                removeStar();
            }
        }
    }else {
        resetStar();
    }
}

function removeStar(){
    const stars = document.getElementById('starScore');
    const lastStar = stars.lastChild;
    if(lastStar){
        stars.removeChild(stars.lastChild);
        if(!stars.lastChild){
            addStar(stars)
        }
    }
}

function resetStar(){
    const stars = document.getElementById('starScore');
    stars.innerHTML="";
    for(let i = 0; i<3;i++){
        addStar(stars);
    }
}

function addStar(stars){
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
