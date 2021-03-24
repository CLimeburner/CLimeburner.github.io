/**

Code Taker++
Tutorial by: Pippin Barr
Coded by: Chip Limeburner

*/

"use strict";

//load our audio honk and make sure it has appropriate volume
let surpriseHonk = new Audio(`assets/sounds/honk.mp3`); //Audio sourced from BBC Sound Effects: https://sound-effects.bbcrewind.co.uk/search?q=07037289
surpriseHonk.volume = 1;

$(`#solved-dialog`).dialog({
  autoOpen: false, //don't open the dialog window by default
  buttons: { //make a button that allows you to close the dialog window
    "Well in that case, just try to get some rest.": function() {
      $(this).dialog(`close`); //close the dialog window
    }
  }
});

$(`.secret`).one(`mouseover`, function(event) { //give the secret spans a mouseover listener
  $(this).addClass(`found`, 500); //give the span the "found" class
  $(this).draggable({ //make the span draggable
    helper: `clone` //when dragging, clone the element rather than move the original
  });
});

$(`#answer`).droppable({ //make the answer box a location you can drop letters
  drop: function(event, ui) {
    let letter = ui.draggable.text();
    $(this).append(letter); //append the letters
    //reset the letter that has been dragged so it's no longer a moving part
    ui.draggable.draggable(`disable`);
    ui.draggable.removeClass(`found`);

    //if the player has solved the anagram
    if($(this).text() === `Pagliacci`) {
      surpriseHonk.play(); //play the honk sound
      $(`#solved-dialog`).dialog(`open`); //open the dialog box
    }
  }
});
