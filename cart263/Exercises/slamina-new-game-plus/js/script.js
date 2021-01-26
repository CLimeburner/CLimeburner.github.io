"use strict";

/*****************

Slamina-new-game-plus
Tutorial: Pippin Barr
Coded: Chip Limeburner

This is a game using Annyang and responsiveVoice libraries in which you have to guess animals based on their
names said backwards. Correct guesses will score you point, while incorrect guesses or running out of time will
score failures, until all animals have been guessed. 

******************/


const TIMER = 2000; //amount of time players will have on each word

// list of animals imported from Darius Kazemi https://github.com/dariusk/corpora/blob/master/data/animals/common.json
let animals = [
      "aardvark",
      "alligator",
      "alpaca",
      "antelope",
      "ape",
      "armadillo",
      "baboon",
      "badger",
      "bat",
      "bear",
      "beaver",
      "bison",
      "boar",
      "buffalo",
      "bull",
      "camel",
      "canary",
      "capybara",
      "cat",
      "chameleon",
      "cheetah",
      "chimpanzee",
      "chinchilla",
      "chipmunk",
      "cougar",
      "cow",
      "coyote",
      "crocodile",
      "crow",
      "deer",
      "dingo",
      "dog",
      "donkey",
      "dromedary",
      "elephant",
      "elk",
      "ewe",
      "ferret",
      "finch",
      "fish",
      "fox",
      "frog",
      "gazelle",
      "gila monster",
      "giraffe",
      "gnu",
      "goat",
      "gopher",
      "gorilla",
      "grizzly bear",
      "ground hog",
      "guinea pig",
      "hamster",
      "hedgehog",
      "hippopotamus",
      "hog",
      "horse",
      "hyena",
      "ibex",
      "iguana",
      "impala",
      "jackal",
      "jaguar",
      "kangaroo",
      "koala",
      "lamb",
      "lemur",
      "leopard",
      "lion",
      "lizard",
      "llama",
      "lynx",
      "mandrill",
      "marmoset",
      "mink",
      "mole",
      "mongoose",
      "monkey",
      "moose",
      "mountain goat",
      "mouse",
      "mule",
      "muskrat",
      "mustang",
      "mynah bird",
      "newt",
      "ocelot",
      "opossum",
      "orangutan",
      "oryx",
      "otter",
      "ox",
      "panda",
      "panther",
      "parakeet",
      "parrot",
      "pig",
      "platypus",
      "polar bear",
      "porcupine",
      "porpoise",
      "prairie dog",
      "puma",
      "rabbit",
      "raccoon",
      "ram",
      "rat",
      "reindeer",
      "reptile",
      "rhinoceros",
      "salamander",
      "seal",
      "sheep",
      "shrew",
      "silver fox",
      "skunk",
      "sloth",
      "snake",
      "squirrel",
      "tapir",
      "tiger",
      "toad",
      "turtle",
      "walrus",
      "warthog",
      "weasel",
      "whale",
      "wildcat",
      "wolf",
      "wolverine",
      "wombat",
      "woodchuck",
      "yak",
      "zebra"
    ];

let currentAnimal = ``; //a variable to hold the current animal to be guessed
let currentAnswer = ``; //stores the last thing the player guessed

let answerChecked = 1; //a variable to track if the answer has been checked

let correctCounter = 0; //tracker for the number of correct answers
let wrongCounter = 0; //tracker for the number of wrong answers

let isTiming = 0; //variable to track start and stop of timer
let time = TIMER; //variable to track time remaining

let rightTone; //a ding to play when players get the answer right
let wrongTone; //a buzzer to play when players get the answer wrong

let animalsRemaining = animals.length; //a variable to track the number of animals left to guess

let isGameOver = 0; //a variable to track game state and say something when all the animals are guessed

// setup()
// Description of setup
function setup() {
  createCanvas(windowWidth, windowHeight); //create the canvas

  //set general font style for the game
  textSize(32);
  textStyle(BOLD);
  fill(255, 255, 255);

  //define the ding for when players get it right
  rightTone = new p5.Oscillator('sine'); //set ding to sine wave pattern
  rightTone.freq(300); //start it at a moderate pitch

  //define the buzzer for when players get it wrong
  wrongTone = new p5.Oscillator('sawtooth'); //set the buzzer to a sawtooth wave pattern
  wrongTone.freq(100); //make the tone low-pitched

  displayScore(); //create initial graphics

  //implement annyang
  if (annyang) {
    let commands = {
      'I think it is *animal': guessAnimal
    };
    annyang.addCommands(commands); //add the command we just defined
    annyang.start(); //start annyang running
  }
}


// draw()
// Description of draw()
function draw() {
  if (animalsRemaining == 0 && isGameOver == 0) {
    responsiveVoice.speak("The question is, how many more animals can there be? And the answer is none. None more animals.", "US English Female");
    isGameOver = 1;
  }

  //if the clock is running, decrement the timer
  if (isTiming == 1) {
    time--;
  }

  displayClock(); //draw the clock

  //if time has run out, mark it as an automatic wrong answer
  if (time == 0) {
    isTiming = 0; //stop the clock
    time = 1; //freeze clock at eleventh hour to prevent endless time == 0 triggering
    guessAnimal(''); //pass an obviously wrong answer to trigger a wrong guess to the score
  }
}


// mousePressed()
// a function that triggers on a mouse click
function mousePressed() {
  //only advance the level if the players don't already have a word active
  if (isTiming == 0) {
    nextQuestion(); //advance to the next question
  }
}


// guessAnimal(animal)
// a function that determines if a guessed "animal" is correct
function guessAnimal(animal) {
  isTiming = 0; //stop the clock
  answerChecked = 0; //signify the current answer hasn't been checked yet
  currentAnswer = animal.toLowerCase(); //store input

  animalsRemaining = animals.length; //update number of animals remaining

  checkCorrect(); //update score and feedback color
  displayScore(); //update score graphic
  displayAnswer(); //show feedback answer on screen
}


// sayBackwards(animal)
// a function that will take an "animal" input and say it backwards
function sayBackwards() {
  let reverseAnimal = reverseString(currentAnimal); //reverse the current animal
  responsiveVoice.speak(reverseAnimal, "US English Female"); //say the reversed animal with responsive voice
}


// nextQuestion()
// a function that advances to the next question
function nextQuestion() {
  let popIndex = Math.floor(random(0,animalsRemaining)); //determine a random animal index to pull
  currentAnimal = animals[popIndex]; //pull the animal
  animals.splice(popIndex, 1); //remove the animal from the array
  sayBackwards(); //say the currentAnimal backwards

  displayScore(); //clear the screen and update the score

  time = TIMER; //reset the time
  isTiming = 1; //start the clock
}


// displayScore()
// a function that draws the score on screen
function displayScore() {
  clear(); //clear screen
  background(0); // black background

  //draw the score in the upper left corner
  textAlign(LEFT, TOP);
  text(`Correct Guesses: ${correctCounter}`, 150, 10);
  text(`Wrong Guesses: ${wrongCounter}`, 150, 50);
  text(`Animals remaining: ${animalsRemaining}`, 150, 90);
}


// displayAnswer()
// a function that colors text and then displays it as feedback for the player
function displayAnswer() {
  //set some rules for the text we'll use as game feedback
  push();
  textSize(128);
  textAlign(CENTER, CENTER);
  text(currentAnswer, width/2, height/2); //display the guessed answer with appropriate color
  pop();

  answerChecked = 1; //signify that the answer has been process already
}

// displayClock()
// a function to draw the clock timer
function displayClock() {
  //draw the timer
  push();
  translate(70, 65); //set origin
  //make it turn clockwise and from the top
  rotate(-0.5*PI);
  scale(1, -1);
  arc(0, 0, 115, 115, 0, 2*PI*time/TIMER, PIE);
  pop();
}


// checkCorrect()
// a function to carry out the neccesary steps based on if an answer is correct or not
function checkCorrect() {
  //check to see if the answer was correct
  if (currentAnswer === currentAnimal) {
    fill(0, 255, 0); //if correct, make the text green
    correctCounter++; //increment the number of correct guesses
    //audio feedback for correct answers
    responsiveVoice.speak("Correct", "US English Female");
    playRightTone();
  }
  else {
    fill(255, 0, 0); //if wrong, make the text red
    wrongCounter++; //increment the number of wrong guesses
    //audio feedback for wrong answers
    responsiveVoice.speak("Incorrect", "US English Female");
    playWrongTone();
  }
}


// reverseString(string)
// a function that takes a string "string" and reverses it
function reverseString(string) {
  // Split the string into an array of characters
  let characters = string.split('');
  // Reverse the array of characters
  let reverseCharacters = characters.reverse();
  // Join the array of characters back into a string
  let result = reverseCharacters.join('');
  // Return the result
  return result;
}


// playRightTone()
// a function that plays the rightTone
function playRightTone() {
  //play the correct tone
  rightTone.start();
  rightTone.freq(100,0.05);
  rightTone.freq(700,0.2);
  rightTone.stop(0.25);
  rightTone.freq(300);
}


// playWrongTone()
// a function that plays the wrongTone
function playWrongTone() {
  //play the buzzer
  wrongTone.start();
  wrongTone.stop(0.25);
}
