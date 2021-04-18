





class Layer {

  constructor(idNum) {
    this.layerIdNum = idNum;
    this.layersIndex = 1;
    this.name = `Layer ${idNum}`;
    this.type = "background"
    this.parent = "none";
    this.children = [];
    this.img;
    this.imgURL;
    this.xOrigin = width/2;
    this.yOrigin = height/2;
    this.width;
    this.height;
    this.dimensionsLocked = false;
    this.dimenseionsRatio = width/height;

    //rotational values
    this.pivotXOffset = 0;
    this.pivotYOffset = 0;
    this.angle = 0;

    //translational values
    this.slideStartX = 0;
    this.slideStartY = 0;
    this.slideEndX = 100;
    this.slideEndY = 0;
    this.displacement = 0;
  }






}
