/*****************

Where's Sausage Dog?
SausageDog class
Tutorial by: Pippin Barr
Coded by: Chip Limeburner

An extension of the Animal class for creating the clickable target of the game

******************/

class SausageDog extends Animal {

  //constructor()
  //creates the the sausage dog object with properties of an Animal as well as a found parameter and a rotation speed
  constructor(x, y, image, orientation) {
    super(x, y, image, orientation); //calling Animal.js constructor

    this.found = false; //variable to track if dog has been clicked
    this.rotationSpeed = 0.25; //variable to provide a speed to rotate once clicked
  }


  //update()
  //updates the object each frame to rotate if it's been clicked
  update() {
    super.update(); //calls update from the Animal class

    //if sausage dog has been found, start spinning
    if (this.found) {
      this.angle += this.rotationSpeed; //increment by rotationSpeed
    }
  }


  //mousePressed()
  //a method to check if the dog has been clicked and if so, set its found parameter to true
  mousePressed() {
    //check to see if click is over the sausage dog image and the game isn't over
    if (this.overlap(mouseX, mouseY) && timeRemaining > 0) {
        this.found = true; //set found to true
        isTiming = false; //stop the clock
        window.setTimeout(levelUpdate, 1000); //wait a moment, then move to the next level
    }
  }

}
