/**
Raving Redactionist++

Coded by: Chip Limeburner

A short game about trying to keep a top secret document redacted.
There is also an extra hidden message of "The Government is very tire :(" which may be found by hovering and clicking over the right words in the text.
*/

"use strict";

let difficulty = 0.03; //a variable to allow us to manipulate the probablity of elements becoming visible

$(`.top-secret`).on(`click`, redact); //add an event listener for clicking on top-secret elements
$(`.extra-secret`).on(`click`, fix); //add an event listener for fixing the extra secret words in place

setInterval(revelation, 750); //every "timer" interval, call the revelation function

// redact(event)
// hide elements that have been clicked
function redact(event) {
  //swap the classes
  $(this).removeClass(`revealed`);
  $(this).addClass(`redacted`);
  $(`#counter`).html($(`.revealed`).length); //update counter of revealed secrets
}


// fix(event)
// super simple function that just locks in the hover effects when one of the extra secret words are clicked
function fix(event) {
  //swap the element classes
  $(this).removeClass(`extra-secret`);
  $(this).addClass(`extra-secret-fixed`);
}

//  revelation()
//  for each redacted element, attempt to reveal it
function revelation() {
  $(`.redacted`).each(attemptReveal);
  difficulty += 0.001; //increase the probability of a reveal

  if ($(`.extra-secret`).length == 0) { //if the whole secret message has been found, turn it dark blue
    $(`.extra-secret-fixed`).css(`color`, `darkblue`);
  }
}

// attemptReveal()
// reveals elements at a random probabilityx
function attemptReveal() {
  let r = Math.random();
  if(r < difficulty) { //if the random number is less than the increasing "difficulty" probability, reveal the element
    $(this).removeClass(`redacted`);
    $(this).addClass(`revealed`);
  }
  $(`#counter`).html($(`.revealed`).length); //update counter of revealed secrets
}
