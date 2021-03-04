/**

Haiku Generator ++
Coded by: Chip Limeburner

Generates seasonal haikus that can be refreshed with a click.
*/

"use strict";

//array of seasons
let seasons = [
  `Spring`,
  `Summer`,
  `Autumn`,
  `Winter`
];

//arrary of background colors for each season
let seasonBackgrounds = [
  `#acde73`, //Spring
  `#45e6d8`, //Summer
  `#b5783e`, //Fall
  `#69b3d1` //Winter
];

//array of text colors for each season
let seasonTextColors = [
  `#f8fcb8`, //Spring
  `#f6fcd2`, //Summer
  `#f0e8d3`, //Fall
  `#d3f0ed` //Winter
];

//aray of five syllable lines for each season
let fiveSyllableLines = [
  //Spring
  [`Crocuses in bloom`,
  `Warm rain falls to earth`,
  `Ripples on the pond`,
  `The soft glow at dawn`,
  `The days grow longer`],
  //Summer
  [`Campfires at dusk`,
  `Soft beams of sunlight`,
  `The starry night sky`,
  `The chirp of crickets`,
  `Heat off the asphalt`],
  //Fall
  [`Leaves fall from branches`,
  `Birds migrating south`,
  `The days shortening`,
  `The smell of crisp air`,
  `Squirrels caching food`],
  //Winter
  [`Flakes gently falling`,
  `Snow forts in the park`,
  `Clatter on the rink`,
  `Hot cocoa in hand`,
  `Refrigerator`],
];

//array of seven syllable lines for each season
let sevenSyllableLines = [
  //Spring
  [`New offshoots in the forest`,
  `Eggs hatching in nests above`,
  `A zephyr among the leaves`,
  `The cycle begins again`,
  `The birds return from abroad`],
  //Summer
  [`Waves crash on the sandy beach`,
  `Fruit growing on every branch`,
  `Lazy days lost at the pool`,
  `Soft moss carpets the forest`,
  `Hiking trails through the mountains`],
  //Fall
  [`The coming chill of winter`,
  `Cinammon, ginger, and cloves`,
  `Pumpkins on every doorstep`,
  `Color changes in the trees`,
  `Children returning to school`],
  //Winter
  [`The closing of the cycle`,
  `Jack Frost nipping at your nose`,
  `Pine trees decked out with tinsel`,
  `Staying warm by the fire`,
  `Icicles hang from the eaves`],
];

document.getElementById("save-button").addEventListener(`click`, function() {
  window.print();
});

//generate a random season title
let seasonIndex = Math.floor(Math.random() * 4); //generate a random season that will use for the rest of our poem
let title = seasons[seasonIndex]; //pull the seasonal title based on our index

//inject our title and give it a click event to refresh the entire poem
let titleH1 = document.getElementById(`title`);
titleH1.innerText = title;
titleH1.addEventListener(`click`, titleClicked);

// generate three random lines
let line1 = random(fiveSyllableLines);
let line2 = random(sevenSyllableLines);
let line3 = random(fiveSyllableLines);

//inject our three lines
let line1P = document.getElementById(`line-1`);
let line2P = document.getElementById(`line-2`);
let line3P = document.getElementById(`line-3`);
line1P.innerText = line1;
line2P.innerText = line2;
line3P.innerText = line3;

//give the lines click events to refresh
line1P.addEventListener(`click`, lineClicked);
line2P.addEventListener(`click`, lineClicked);
line3P.addEventListener(`click`, lineClicked);


document.body.style[`background-color`] = seasonBackgrounds[seasonIndex]; //assign our seasonal background based on our idnex

//assign our season text color based on our index
document.getElementById(`title`).style[`color`] = seasonTextColors[seasonIndex];
let lines = document.getElementsByClassName(`haiku-line`);
for (let i = 0; i < lines.length; i++) {
  lines[i].style[`color`] = seasonTextColors[seasonIndex];
}


// titleClicked(event)
// initiates the process of refreshing the poem when the title is clicked
function titleClicked(event) {
  fadeOut(event.target, 1);
}


// lineClicked(event)
// initiates the process of refreshing a specific line when it is clicked
function lineClicked(event) {
  fadeOut(event.target, 1);
}


// fadeOut(element, opacity)
// fades out an element, then calls new content for it and calls fading it back in
function fadeOut(element, opacity) {
  //reduce opacity
  opacity -= 0.01;
  element.style[`opacity`] = opacity;
  //if the opacity is still above zero, call the next animation frame recursively
  if (opacity > 0) {
    requestAnimationFrame(function() {
      fadeOut(element, opacity);
    });
  } else { //otherwise, if it's the title start refreshing the rest of the poem
    if (element.id == `title`) {
      setNewTitle(element); //set a new title
      //start the refresh process for the rest of the lines in a cascading fashion
      setTimeout(function() {
        fadeOut(line1P, 1);
      }, 100);
      setTimeout(function() {
        fadeOut(line2P, 1);
      }, 600);
      setTimeout(function() {
        fadeOut(line3P, 1);
      }, 1100);
    } else { //if the element was just a line, set a new line
      setNewLine(element);
    }
    fadeIn(element, 0); //start fading the element (title or line) back in
  }
}


// fadeIn(element, opacity)
// fades an element back in
function fadeIn(element, opacity) {
  //increase the opacity
  opacity += 0.01;
  element.style[`opacity`] = opacity;
  //if the element is still not fully opaque, call the next animation frame recursively
  if (opacity < 1) {
    requestAnimationFrame(function() {
      fadeIn(element, opacity);
    });
  }
}


// setNewTitle(element)
// generates a random season index and pulls corresponding title content, background and text colors
function setNewTitle(element) {
  //update title text
  seasonIndex = Math.floor(Math.random() * 4);
  element.innerText = seasons[seasonIndex];
  //update colors
  document.body.style[`background-color`] = seasonBackgrounds[seasonIndex];
  document.getElementById(`title`).style[`color`] = seasonTextColors[seasonIndex];
}


// setNewLine(element)
// generates a new random line
function setNewLine(element) {
  //generate a new line of the appropriate length
  if(element === line1P || element === line3P) {
    element.innerText = random(fiveSyllableLines);
  } else if(element === line2P) {
    element.innerText = random(sevenSyllableLines);
  }
  //update the line text color to ensure consistency
  lines = document.getElementsByClassName(`haiku-line`);
  for (let i = 0; i < lines.length; i++) {
    lines[i].style[`color`] = seasonTextColors[seasonIndex];
  }
}


// random(array)
// pulls a random element from array based on the season and returns it
function random(array) {
  let index = Math.floor(Math.random() * array[seasonIndex].length); //generate a random index
  return array[seasonIndex][index]; //return the random line
}
