/*****************

Where's Sausage Dog?
Animal class
Tutorial by: Pippin Barr
Coded by: Chip Limeburner

A general class for creating both the static and clickable animals of out game

******************/

class Animal {

  //constructor()
  //creates the animal object with a given position x and y and a given image graphic image
  constructor(x, y, image, orientation) {
    this.x = x;
    this.y = y;
    this.image = image;
    this.orientation = orientation;

    this.angle = 0;
  }


  //update()
  //updates the object each frame
  update() {
    this.display();
  }


  //display()
  //a method that displays the animal's image
  display() {
    push();
    imageMode(CENTER);
    translate(this.x, this.y);
    rotate(this.angle);
    if (this.orientation > 0.5) {
      scale(-1, 1);
    }
    image(this.image, 0, 0);
    pop();
  }


  //overlap()
  //A method to check if a point x and y overlaps with a given animal's image
  overlap(x, y) {
    if (x > this.x - this.image.width / 2 &&
        x < this.x + this.image.width / 2 &&
        y > this.y - this.image.height / 2 &&
        y < this.y + this.image.height / 2) {
      return true;
    }
    else {
      return false;
    }
  }

}
