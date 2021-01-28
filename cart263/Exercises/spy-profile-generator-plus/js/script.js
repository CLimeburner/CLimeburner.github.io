"use strict";

/*****************

Spy Profile Generator+
Tutorial: Pippin Barr
Coded: Chip Limeburner

Exercise 3 extending activity 3.

******************/


let spyProfile = {
  name: `**REDACTED**`,
  alias: `**REDACTED**`,
  secretWeapon: `**REDACTED**`,
  posting:  `**REDACTED**`,
  mission: `**REDACTED**`,
  password: `**REDACTED**`
};

//array of tasks
let tasks = [
  `aid`,
  `assist`,
  `delay`,
  `document`,
  `initiate`,
  `instigate`,
  `investigate`,
  `observe`,
  `prevent`,
  `provoke`,
  `stop`
];

//array of titles
let titles = [
  `Agent`,
  `Chairman`,
  `Fr.`,
  `The Great`,
  `Dr.`,
  `Miss`,
  `Mr.`,
  `Mrs.`,
  `Operative`,
  `Señor`
];

//array names
let names = [
  `De La Battrie`,
  `Elroy`,
  `Garry`,
  `Johnson`,
  `Jones`,
  `Kleinberg`,
  `Krausmann`,
  `McBartles`,
  `Noh`,
  `Scoopini`,
  `Stevens`,
  `Voldosknaya`
];

//array of actions
let actions = [
  `blowing up`,
  `counterfeiting`,
  `damaging`,
  `hiding`,
  `incapacitating`,
  `infiltraing`,
  `invading`,
  `relocating`,
  `sabotaging`,
  `stealing`,
  `targeting`
];

//array of targets
let targets = [
  `15 tons of spanish gold`,
  `all the squirrels of Malta`,
  `the Declaration of Independance`,
  `government secrets`,
  `the hope diamond`,
  `hyperdrive technology`,
  `important archaeological ruins`,
  `the last breeding pair of pandas`,
  `the moldavian embassy`,
  `the moon`,
  `nuclear weapons`,
  `the queen of England`,
  `the Smithsonian Museum`,
  `the stock market`,
  `the Vatican archives`
];

//variable to hold imported JSON data
let instrumentData = undefined;
let objectData = undefined;
let tarotData = undefined;
let countryData = undefined;

let data; //a buffer variable to store profile data pulled from local storage

let userInput = ``; //a variable to hold user input commands typed into the keyboard


// preload()
// Description of preload
function preload() {
  //JSON files taken from dariusk https://github.com/dariusk/corpora/tree/master/data
  instrumentData = loadJSON(`https://raw.githubusercontent.com/dariusk/corpora/master/data/music/instruments.json`);
  objectData = loadJSON(`https://raw.githubusercontent.com/dariusk/corpora/master/data/objects/objects.json`);
  tarotData = loadJSON(`https://raw.githubusercontent.com/dariusk/corpora/master/data/divination/tarot_interpretations.json`);
  countryData = loadJSON(`https://raw.githubusercontent.com/dariusk/corpora/master/data/geography/countries.json`);
}


// setup()
// a function that sets up our canvas and imports our data
function setup() {
  createCanvas(windowWidth, windowHeight); //initialize canvas

  data = JSON.parse(localStorage.getItem(`spy-profile-data`)); //pull any relevant locally stored data

  if (data) {
    let password = prompt(`Agent! What is your password?`); //prompt user for their password

    //compare input password
    if (password === data.password) {
      setSpyData(); //if it's a match, import the appropriate data
    }
  } else {
    generateSpyProfile(); //if there is no existing profile to import, create one
  }
}


// setSpyData()
// a function that imports spy profile data from local storage and copies it to usable variable
function setSpyData() {
  spyProfile.name = data.name;
  spyProfile.alias = data.alias;
  spyProfile.secretWeapon = data.secretWeapon;
  spyProfile.posting = data.posting;
  spyProfile.mission = data.mission;
  spyProfile.password = data.password;
}


// generateSpyProfile()
// a function that uses JSON data to create a new spy profile
function generateSpyProfile() {
  spyProfile.name = prompt(`Agent! What is your name?`); //prompt user for their name
  let instrument = random(instrumentData.instruments); //generate an alias
  spyProfile.alias = `The ${instrument}`;
  spyProfile.secretWeapon = random(objectData.objects); //generate a weapon
  spyProfile.posting = random(countryData.countries); //generate a Posting
  spyProfile.mission = `To ${random(tasks)} ${random(titles)} ${random(names)} ${random(actions)} ${random(targets)}`; //generate mission
  let card = random(tarotData.tarot_interpretations); //generate a password
  spyProfile.password = random(card.keywords);

  localStorage.setItem(`spy-profile-data`, JSON.stringify(spyProfile)); //save profile to local storage after generation
}


// draw()
// a function that draws all out stuff
function draw() {
  displayPaper(); //draw the paper background

  displayText(); //draw the text on the paper
}


// keyPressed()
// a function that listens for specific key strokes
function keyPressed() {
  //make backspace work when typing
  if (keyCode === BACKSPACE) {
    userInput = userInput.substring(0,userInput.length-1); //do the typical backspace thing
  } else if (keyCode === ENTER) {
    //if user inputs "reassign", give them a new mission and gadget
    if (userInput === `reassign`) {
      spyProfile.secretWeapon = random(objectData.objects); //generate a weapon
      spyProfile.posting = random(countryData.countries); //generate a Posting
      spyProfile.mission = `To ${random(tasks)} ${random(titles)} ${random(names)} ${random(actions)} ${random(targets)}`; //generate mission

      localStorage.setItem(`spy-profile-data`, JSON.stringify(spyProfile)); //save new profile to local storage after generation
    }
    userInput = ``; //clear the command line to empty
  }
}


// keyPressed()
// a function that takes typing info
function keyTyped() {
  if (key === `Enter`) {
    return; //just prevent "enter" being input as a character. This is working around some weird inherent behavior of the keyTyped() method.
  }
  userInput = userInput.concat(key); //add typed keys to the end of the input
}


// displayPaper()
// a function that makes the background look like aged and creased paper
function displayPaper() {
  background(`rgba(245, 230, 190, 1)`); //tastefully off-white yellow

  //draw the horizontal rules
  push();
  stroke(`rgba(50, 0, 200, 0.5)`); //light blue
  strokeWeight(2);
  for (let i = 105; i < height; i = i + 30) {
    line(0, i, width, i);
  }
  pop();

  //draw the vertical margin rule
  push();
  stroke(`rgba(150, 0, 100, 0.5)`); //light red
  strokeWeight(5);
  line(85, 0, 85, height);
  pop();

  //draw page crease
  push();
  //draw gradient of shadow in the crease
  for(let i = 0; i < 30; i++) {
    stroke(lerpColor(color(`rgba(0,0,0,0.25)`),color(`rgba(150,150,150,0)`),i/30));
    //draw fade above and below the crease
    line(0,(height/2)-(i),width,(height/2)-(i));
    line(0,(height/2)+30-(30-i),width,(height/2)+30-(30-i));
  }
  //draw the crease line itself
  stroke(`rgba(0,0,0,0.1)`);
  strokeWeight(3);
  line(0,height/2,width,height/2);
  pop();
}


// displayText()
// a function to draw our text
function displayText() {
  //initialize a form string
  let profile = `** FOR YOUR EYES ONLY **

  Name: ${spyProfile.name}
  Alias: ${spyProfile.alias}
  Posting: ${spyProfile.posting}
  Mission: ${spyProfile.mission}
  Assigned Gadget: ${spyProfile.secretWeapon}
  Password: ${spyProfile.password}`
  ;

  //draw the profile text
  push();
  textFont(`Courrier, monospace`);
  textSize(24);
  textAlign(TOP, LEFT);
  fill(0);
  text(profile, 100, 100);

  text(`  Type "reassign", then enter, to get a new mission:`, 100, 370); //display the instructions

  text(`  >> ${userInput}`, 100, 430); //display the user input line

  pop();
}
