"use strict";

/*****************

Bubble Popper++
Tutorial: Pippin Barr
Coded: Chip Limeburner

An exercise extending the bubble popper activity.

******************/


let popFX = undefined; //a variable for our pop sound fx

let scoreFont = undefined; //a variable to store a bubbly font

let video = undefined; //a variable to store the user's webcam

let handpose = undefined; //a vairable to store the hand pose model

let predictions = []; //a variable to store predictions from the hand pose model

//global variables to handle handpose data
let hand;
let index;
let tip;
let base;
let tipX;
let tipY;
let baseX;
let baseY;

let bubble = undefined; //a variable to store our bubble

let score = 0; //a variable tracking how many bubbles we've popped

let d = undefined; //a variable for tracking distance between pin tip and bubble


// preload()
// Preload loads up our sound effect for the bubble
function preload() {
  soundFormats('mp3', 'ogg'); //set file formats for audio
  popFX = loadSound('assets/sounds/pop.mp3'); //popping sound, taken from the BBC: https://sound-effects.bbcrewind.co.uk/search?q=07042178

  scoreFont = loadFont('assets/fonts/bubble.ttf');//bubble font, downloaded from: https://www.1001freefonts.com/bubble---soap.font
}


// setup()
// Setup loads our machine learning hand model for use in the draw loop
function setup() {
  createCanvas(640, 480); //create the canvas

  //access the user's webcam and hide it
  video = createCapture(VIDEO);
  video.hide();

  //load the handpose model
  handpose = ml5.handpose(video, {
    flipHorizontal: true //flipping input so it's more intuitive
  }, function() {
    console.log(`Model loaded.`);
  });

  //listen for predictions
  handpose.on(`predict`, function(results) {
    predictions = results;
  });

  //defining Bubble
  bubble = {
    center: random(width),
    period: 0,
    x: 0,
    y: height,
    size: 100,
    vx: 0,
    vy: -2
  };
}


// draw()
// Updates our game every frame
function draw() {
  background(120, 180, 255); //make the background light blue

  drawScore(); //update the score on screen

  if (predictions.length > 0) {
    parseData(); //divide up incoming prediction data

    drawPin(); //draw the pin

    d = dist(tipX, tipY, bubble.x, bubble.y); //calculate the distance between pin and bubble for various mechanics

    bubblePop(); //pops the bubble

    bubbleShy(); //nudge bubble if pin is too close
  }

  bubbleUpdate(); //updates all the bubble parameters

  drawBubble(); //draw the bubble at it's new position
}


// parseData()
// a function that divides our model rediction into useable chunks of data
function parseData() {
  //break down data from predictions
  hand = predictions[0];
  index = hand.annotations.indexFinger;
  tip = index[3];
  base = index[0];
  tipX = tip[0];
  tipY = tip[1];
  baseX = base[0];
  baseY = base[1];
}


// drawScore()
// a function that draws the score
function drawScore() {
  push();
  fill(255); //white text
  textSize(72); //good size
  textAlign(RIGHT, TOP); //upper-left corner
  textFont(scoreFont); //use the bubble font we imported
  text(score, width - 30, 20);
  pop();
}


// drawPin()
// a function that draws our pin
function drawPin() {
  //draw the pin shaft
  push();
  noFill();
  stroke(225); //make it a very light grey
  strokeWeight(2); //a little thick
  line(baseX, baseY, tipX, tipY); //draw the line from base to tip of our finger
  pop();

  push();
  //draw the pin ball
  noStroke();
  fill(255, 0, 0); //make the ball red
  ellipse(baseX, baseY, 20);
  //shading on pin ball using gradient
  for (let i = 0; i < 10; i++) {
    noFill();
    stroke(`rgba(0, 0, 0, ${i/40})`);
    ellipse(baseX, baseY, 10+i);
  }
  //highlight on pin ball using gradient
  for (let i = 0; i < 10; i++) {
    noFill();
    stroke(`rgba(255, 255, 255, ${0.5*(1-(i/10))})`);
    ellipse(baseX+2, baseY-3, i+1);
  }
  pop();
}


// drawBubble()
// a function that draws our Bubble
function drawBubble() {
  //draw the bubble
  push();
  noFill();

  //draw the edge of the bubble with a gradient
  for (let i = 0; i <= bubble.size; i++) {
    stroke(`rgba(255, 255, 255, ${(i/bubble.size)/12})`);
    ellipse(bubble.x, bubble.y, bubble.size*(i/bubble.size));
  }

  //draw the specular reflection with a gradient
  for (let i = 0; i <= bubble.size; i++) {
    stroke(`rgba(255, 255, 255, ${(i/bubble.size)/6})`);
    ellipse(bubble.x+10, bubble.y-10, (bubble.size-(bubble.size*(i/bubble.size)))/1.5);
  }
  pop();
}


// bubblePop()
// a function to handle the bubble popping
function bubblePop() {
  if (d < bubble.size/2) {
    resetBubble(); //reset bubble to the bottom of the screen
    score++; //increase score
    popFX.play(); //play the bubble popping sound effect
  }
}


// bubbleShy()
// a function that updates the bubble to shy away from the needle
function bubbleShy() {
  //if the pin comes with 30px of the bubble
  if (d < (bubble.size/2) + 30) {
    if (tipX > bubble.x) {
      bubble.vx = -10; //if the tip is to the right, nudge the bubble left
      bubble.period = Math.PI/2; //start drift to the right
    } else {
      bubble.vx = 10; //if the tip is to the left, nudge the bubble right
      bubble.period = 0; //start drift to the right
    }
  } else {
    bubble.vx = 0; //otherwise just leave the bubble be
  }
}


// bubbleUpdate()
// a function that updates all the bubble parameters each frame
function bubbleUpdate() {
  //move the bubble
  bubble.center += bubble.vx; //nudge the center if the pin is close
  bubble.period += Math.PI/32; //update the dither of the bubble
  bubble.x = bubble.center + (40 * Math.sin(bubble.period)); //dither the bubble along it's vertical axis based on it's period
  bubble.y += bubble.vy; //move the bubble up

  //lock the bubble within the horizontal bounds of the screen
  if (bubble.center < 0) {
    bubble.center = 0;
  } else if (bubble.center > width) {
    bubble.center = width;
  }

  //reset bubble position if it goes too high
  if (bubble.y < 0) {
    resetBubble();
  }
}


// resetBubble()
// a function that resets the bubble to the bottom of the screen
function resetBubble() {
  bubble.center = random(width);
  bubble.y = height;
}
