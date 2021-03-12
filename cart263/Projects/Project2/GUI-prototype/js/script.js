"use strict";

let cnv; //variable to hold the canvas
let cnvX; //the canvas' X position
let cnvY; // the canvas' Y position


let layers = []; //an array of our layer objects
let activeLayer = 0; //the current active layer object
let layerCounter = 1; //a variable used for initializing and tracking total number of layers

let dragTracking = false;
let moveTracking = false;
let leftScaleTracking = false;
let rightScaleTracking = false;
let topScaleTracking = false;
let bottomScaleTracking = false;
let rotOriginTracking = false;

let mouseOffsetX;
let mouseOffsetY;
let dragOffsetX;
let dragOffsetY;

let interfaceToolMode = "edit";




function preload() {

}


function setup() {
  let canvasWidth = 800; //prompt("Please input the desired width of your diagram in px:");
  let canvasHeight = 600; //prompt("Please input the desired height of your diagram in px:");

  cnv = createCanvas(canvasWidth, canvasHeight); //create the canvas
  cnv.parent(`viewport-pane`); //position canvas in the HTML framework
  cnv.background(0); //set canvas background
  //center the canvas
  cnvX = ((windowWidth - width) - 300)/2;
  cnvY = (windowHeight - height)/2;
  cnv.position(cnvX, cnvY);
}


function draw() {
  //update the canvas position
  cnv.position(cnvX, cnvY);

  background(0);


  if(moveTracking || topScaleTracking || bottomScaleTracking || leftScaleTracking || rightScaleTracking || rotOriginTracking) {
    updateActiveLayer(); //updates transform information based on mouse movements if mouse is clicked
    updateToolbarTransform(); //update the toolbar to reflect the actual transform of the layer
  }

  if(dragTracking) {
    updateDrag();
  }

  drawLayerImages(); //draws the layer image
  drawTransformPoints(); //draws the transform points bounding the image
  drawRotationalOrigin(); //draws the rotational origin if it's a rotational layer

}


// mousePressed()
// tracks mouse position based on certain prerequisites
function mousePressed() {
  if (interfaceToolMode == "edit") {
    mouseOffsetX = mouseX;
    mouseOffsetY = mouseY;
    checkMoveAction();
    checkScaleAction();
    checkRotOriginAction();
  } else if (interfaceToolMode == "drag") {
    dragOffsetX = winMouseX;
    dragOffsetY = winMouseY;
    dragTracking = true;
  }
}


// mouseReleased()
// stops tracking the mouse on release
function mouseReleased() {
  dragTracking = false;
  moveTracking = false;
  leftScaleTracking = false;
  rightScaleTracking = false;
  topScaleTracking = false;
  bottomScaleTracking = false;
  rotOriginTracking = false;
}


// checkMoveAction()
// check for events to move the layer
function checkMoveAction() {
  if (mouseX > activeLayer.xOrigin - activeLayer.width/2
   && mouseX < activeLayer.xOrigin + activeLayer.width/2
   && mouseY > activeLayer.yOrigin - activeLayer.height/2
   && mouseY < activeLayer.yOrigin + activeLayer.height/2) {
     moveTracking = true;
  }
}


// checkScaleAction()
// check for events to scale the layer
function checkScaleAction() {
  if (mouseX > activeLayer.xOrigin - (activeLayer.width/2) - 5
   && mouseX < activeLayer.xOrigin - (activeLayer.width/2) + 5) {
      leftScaleTracking = true;
      moveTracking = false;
  }
  if (mouseX > activeLayer.xOrigin + (activeLayer.width/2) - 5
   && mouseX < activeLayer.xOrigin + (activeLayer.width/2) + 5) {
      rightScaleTracking = true;
      moveTracking = false;
  }
  if (mouseY > activeLayer.yOrigin - (activeLayer.height/2) - 5
   && mouseY < activeLayer.yOrigin - (activeLayer.height/2) + 5) {
     topScaleTracking = true;
     moveTracking = false;
  }
  if (mouseY > activeLayer.yOrigin + (activeLayer.height/2) - 5
   && mouseY < activeLayer.yOrigin + (activeLayer.height/2) + 5) {
     bottomScaleTracking = true;
     moveTracking = false;
  }
}


// checkRotOriginAction()
// check for events to move the rotational origin
function checkRotOriginAction() {
  if (mouseX > activeLayer.xOrigin + activeLayer.pivotXOffset - 5
   && mouseX < activeLayer.xOrigin + activeLayer.pivotXOffset + 5
   && mouseY > activeLayer.yOrigin + activeLayer.pivotYOffset - 5
   && mouseY < activeLayer.yOrigin + activeLayer.pivotYOffset + 5) {
      rotOriginTracking = true;
      moveTracking = false;
  }
}


// updateDrag()
// moves the canvas at each frame based on how much the mouse has moved
function updateDrag() {
  cnvX -= (dragOffsetX - winMouseX);
  cnvY -= (dragOffsetY - winMouseY);
  dragOffsetX = winMouseX;
  dragOffsetY = winMouseY;
}


// updateActiveLayer()
// updates active layer properties based on moving and scaling actions
function updateActiveLayer() {
  //update active layer info
  if (moveTracking) {
    activeLayer.xOrigin += mouseX - mouseOffsetX;
    activeLayer.yOrigin += mouseY - mouseOffsetY;
  }
  if (topScaleTracking) {
    activeLayer.yOrigin += (mouseY - mouseOffsetY)/2;
    activeLayer.height -= mouseY - mouseOffsetY;
  }
  if (bottomScaleTracking) {
    activeLayer.yOrigin += (mouseY - mouseOffsetY)/2;
    activeLayer.height += mouseY - mouseOffsetY;
  }
  if (leftScaleTracking) {
    activeLayer.xOrigin += (mouseX - mouseOffsetX)/2;
    activeLayer.width -= mouseX - mouseOffsetX;
  }
  if (rightScaleTracking) {
    activeLayer.xOrigin += (mouseX - mouseOffsetX)/2;
    activeLayer.width += mouseX - mouseOffsetX;
  }
  if (rotOriginTracking) {
    activeLayer.pivotXOffset += mouseX - mouseOffsetX;
    activeLayer.pivotYOffset += mouseY - mouseOffsetY;
  }
  mouseOffsetX = mouseX;
  mouseOffsetY = mouseY;
}


// drawLayerImages()
// iterates through the layers, drawing their images
function drawLayerImages() {
  //draw the layers
  imageMode(CENTER);
  for (let i = layers.length - 1; i > -1; i--) {
    if(layers[i].img) {
      image(layers[i].img, layers[i].xOrigin, layers[i].yOrigin, layers[i].width, layers[i].height);
    }
  }
}


// drawTransformPoints()
// draws the corner and edge points for scaling actions
function drawTransformPoints() {
  //draw tranform points for active layer
  if(activeLayer.img) {
    push();
    fill(255);
    ellipse(activeLayer.xOrigin - activeLayer.width/2, activeLayer.yOrigin - activeLayer.height/2, 10); //upper left corner
    ellipse(activeLayer.xOrigin, activeLayer.yOrigin - activeLayer.height/2, 10); //upper middle
    ellipse(activeLayer.xOrigin + activeLayer.width/2, activeLayer.yOrigin - activeLayer.height/2, 10); //upper right corner
    ellipse(activeLayer.xOrigin - activeLayer.width/2, activeLayer.yOrigin, 10); //middle left side
    ellipse(activeLayer.xOrigin + activeLayer.width/2, activeLayer.yOrigin, 10); //middle right side
    ellipse(activeLayer.xOrigin - activeLayer.width/2, activeLayer.yOrigin + activeLayer.height/2, 10); //lower left corner
    ellipse(activeLayer.xOrigin, activeLayer.yOrigin + activeLayer.height/2, 10); //lower middle
    ellipse(activeLayer.xOrigin + activeLayer.width/2, activeLayer.yOrigin + activeLayer.height/2, 10); //lower right corner
    pop();
  }
}


// drawRotationalOrigin()
// draws the origin around which the layer will rotate if it's a rotational layer
function drawRotationalOrigin() {
  if(activeLayer.type == "rotational") {
    push();
    fill(255);
    ellipse(activeLayer.xOrigin + activeLayer.pivotXOffset, activeLayer.yOrigin + activeLayer.pivotYOffset, 10); //center dot
    stroke(255);
    strokeWeight(2);
    noFill();
    ellipse(activeLayer.xOrigin + activeLayer.pivotXOffset, activeLayer.yOrigin + activeLayer.pivotYOffset, 20); //ring around dot for greater visibility
    pop();
  }
}


// createNewLayer()
// initializes new layers
function createNewLayer() {
  for(let i = 0; i < layers.length; i++) {
    layers[i].layersIndex++;
  }
  layers.unshift(new Layer(layerCounter)); //create the new layer object and add it to the layers array
  if(layerCounter == 1) { //if this is the first layer, make it the active layer by default
    activeLayer = layers[0];
    //layerTab.id += "current-layer-tab";
  }

  layerCounter++; //increment layerCounter to track the total number of layers

  displayLayerList();
}


// tabSelector(tab)
// makes tab the active layer and updates the toolbar to reflect as such
function tabSelector(tab) {
  setActiveLayer(tab); //assigns tab as the active layer
  setToolbarProperties(); //updates toolbar to display properties for the active layer
}


// moveLayerUp(tab)
// swaps the position of tab with the layer above it
function moveLayerUp(clickedButton) {
  tabSelector(clickedButton.parentNode.parentNode); //make the moving layer the active one
  if(layers[activeLayer.layersIndex-2]) {
    let layerA = layers[activeLayer.layersIndex-1]; //the active tab
    let layerB = layers[activeLayer.layersIndex-2]; //the tab it's replacing
    let buffer = layerB; //get the adjacent element above
    layers[layerA.layersIndex-2] = layerA; //move layerA up in the array
    layers[layerA.layersIndex-1] = buffer; //move layerB to where layerA used to be
    //swap layer index values
    layerA.layersIndex--;
    layerB.layersIndex++;
    displayLayerList();
  }
}

// moveLayerDown(tab)
// swaps the position of tab with the layer below it
function moveLayerDown(clickedButton) {
  tabSelector(clickedButton.parentNode.parentNode); //make the moving layer the active one
  if(layers[activeLayer.layersIndex]) {
    let layerA = layers[activeLayer.layersIndex-1]; //the active tab
    let layerB = layers[activeLayer.layersIndex]; //the tab it's replacing
    let buffer = layerB; //get the adjacent element below
    layers[layerA.layersIndex] = layerA; //move layerA down in the array
    layers[layerA.layersIndex-1] = buffer; //move layerB to where layerA used to be
    //swap layer index values
    layerA.layersIndex++;
    layerB.layersIndex--;
    displayLayerList();
  }
}


// updateName(event)
// updates the active layer's name
function updateName(event) {
  if(event.key == "Enter") {
    activeLayer.name = $(`#layerName`).val();
    $(`.layer-nametag:eq(${activeLayer.layersIndex-1})`).html(activeLayer.name);
  }
}


// updateType()
// updates the active layer's type
function updateType() {
  activeLayer.type = $(`#layerType`).val();
  setToolbarProperties();
}


// updateImage
// updates the active layer's image when one is uploaded
function updateImage() {
  activeLayer.img = loadImage(URL.createObjectURL(document.getElementById("layerImage").files[0])); //load the uploaded image data
  //assign appropriate initial sizes, given our canvas
  let wxhRatio = activeLayer.img.width/activeLayer.img.height;
  if(activeLayer.type == "background") {
    activeLayer.width = width;
    activeLayer.height = height;
  } else if(width > height) {
    activeLayer.height = height/2;
    activeLayer.width = activeLayer.height * wxhRatio;
  } else {
    activeLayer.width = width/2;
    activeLayer.height = activeLayer.width * wxhRatio;
  }
  setToolbarProperties();
}


function updateXOrigin(event) {
  if (event.key == `Enter`) {
    let buffer = activeLayer.xOrigin - $(`#layerX`).val();
    activeLayer.xOrigin -= buffer;
  }
}


function updateYOrigin(event) {
  if (event.key == `Enter`) {
    let buffer = activeLayer.yOrigin - $(`#layerY`).val();
    activeLayer.yOrigin -= buffer;
  }
}


function updateHeight(event) {
  if (event.key == `Enter`) {
    let buffer = activeLayer.height - $(`#layerHeight`).val();
    activeLayer.height -= buffer;
  }
}


function updateWidth(event) {
  if (event.key == `Enter`) {
    let buffer = activeLayer.width - $(`#layerWidth`).val();
    activeLayer.width -= buffer;
  }
}


function updateRotXOrigin(event) {
  if (event.key == `Enter`) {
    let buffer = activeLayer.pivotXOffset + (activeLayer.xOrigin - $("#layerRotX").val());
    activeLayer.pivotXOffset -= buffer;
  }
}


function updateRotYOrigin(event) {
  if (event.key == `Enter`) {
    let buffer = activeLayer.pivotYOffset + (activeLayer.yOrigin - $("#layerRotY").val());
    activeLayer.pivotYOffset -= buffer;
  }
}


// setActiveLayer(tab)
// makes the arrangements to set tab as the active layer
function setActiveLayer(tab) {
  for (let i = 0; i < document.getElementById("layers-container").children.length; i++) {
    if (document.getElementById("layers-container").children[i] === tab) {
      activeLayer = layers[i]; //if the iterated tab is the one you clicked, make it the active one
    } else {
      document.getElementById("layers-container").children[i].id = "" //otherwise make sure it ISNT the active one
    }
  }
  tab.id += "current-layer-tab"; //give the clicked tab the current layer ID
}


// setToolbarProperties()
// updates the toolbar to display the active layer's properties
function setToolbarProperties() {
  //when a layer is selected, populate the toolbar with the name, type, and image tools
  document.getElementById("toolbar").innerHTML =
  `<h2 class="sidebar-title">Toolbar</h2>

  <div class="toolbar-section" id="">
    <p class="toolbar-section-title">Layer Name:</p>
    <input type="text" id="layerName" name="layerName" value="" onkeydown="updateName(event)">
  </div>

  <div class="toolbar-section" id="">
    <p class="toolbar-section-title">Layer Type:</p>
    <select class="" id="layerType" name="layerType" onchange="updateType()">
      <option value="background">Background</option>
      <option value="rotational">Rotational</option>
      <option value="translational">Translational</option>
      <option value="flap">Flap</option>
      <option value="string">String</option>
      <option value="annotation">Annotation</option>
    </select>
  </div>

  <div class="toolbar-section" id="">
    <p class="toolbar-section-title">Layer Image:</p>
    <input type="file" id="layerImage" name="layerImage" value="" accept="image/*" onchange="updateImage()">
  </div>`;

  //if the layer has an image, populate the toolbar additionally with the center and size tools
  if(activeLayer.img) {
    document.getElementById("toolbar").innerHTML +=
    `<div class="toolbar-section" id="">
      <p class="toolbar-section-title">Center:</p>
      <p style="margin:0px;float:left;">X:</p> <input type="text" id="layerX" name="layerX" value="" style="width:50px;float:left;" onkeydown="updateXOrigin(event)">
      <p style="margin:0px;margin-left:20px;float:left;">Y:</p> <input type="text" id="layerY" name="layerY" value="" style="width:50px;float:left;" onkeydown="updateYOrigin(event)">
    </div>

    <div class="toolbar-section" id="">
      <p class="toolbar-section-title">Size:</p>
      <p style="margin:0px;float:left;">Width:</p> <input type="text" id="layerWidth" name="layerWidth" value="" style="width:50px;float:left;" onkeydown="updateWidth(event)">
      <p style="margin:0px;margin-left:20px;float:left;">Height:</p> <input type="text" id="layerHeight" name="layerHeight" value="" style="width:50px;float:left;" onkeydown="updateHeight(event)">
    </div>`;
  }

  if(activeLayer.type == "rotational") {
    document.getElementById("toolbar").innerHTML +=
    `<div class="toolbar-section" id="">
      <p class="toolbar-section-title">Pivot Point:</p>
      <p style="margin:0px;float:left;">X:</p> <input type="text" id="layerRotX" name="layerRotX" value="" style="width:50px;float:left;" onkeydown="updateRotXOrigin(event)">
      <p style="margin:0px;margin-left:20px;float:left;">Y:</p> <input type="text" id="layerRotY" name="layerRotY" value="" style="width:50px;float:left;" onkeydown="updateRotYOrigin(event)">
    </div>`;
  }

  //populate the tool values
  document.getElementById("layerName").value = activeLayer.name;
  document.getElementById("layerType").value = activeLayer.type;
  if(activeLayer.img) {
    updateToolbarTransform();
  }
}


// updateToolbarTransform
// updates the toolbar sidebar when a transformation is carried out
function updateToolbarTransform() {
  document.getElementById("layerX").value = activeLayer.xOrigin;
  document.getElementById("layerY").value = activeLayer.yOrigin;
  document.getElementById("layerWidth").value = activeLayer.width;
  document.getElementById("layerHeight").value = activeLayer.height;
  if(activeLayer.type == "rotational") {
    updateRotationalTransform()
  }
  if(activeLayer.type == "translational") {

  }
  if(activeLayer.type == "flap") {

  }
}


// updateRotationalTransform()
// updates the sidebar values for the rotational origin
function updateRotationalTransform() {
  document.getElementById("layerRotX").value = activeLayer.xOrigin + activeLayer.pivotXOffset;
  document.getElementById("layerRotY").value = activeLayer.yOrigin + activeLayer.pivotYOffset;
}


// swapToolMode(element, mode)
// swap to the appropriate tool mode when element is clicked
function swapToolMode(element, mode) {
  interfaceToolMode = mode;
  let interfaceButtons = document.getElementsByClassName(`interface-buttons`);
  for (let i = 0; i < interfaceButtons.length; i++) {
    interfaceButtons[i].style[`background-color`] = "lightgray";
  }
  element.style[`background-color`] = "white";
  if(mode ==`drag`) {
    document.getElementsByTagName("body")[0].style.cursor = "move";
  } else {
    document.getElementsByTagName("body")[0].style.cursor = "default";

  }
}


// displayLayerList()
// draws the HTML elements based on the layers[] array
function displayLayerList() {
  let htmlBuffer = ``; //create an empty buffer to load with our layer tab elements
  //for each layer in the layers array, create appropriate tabs
  for (let i = 0; i < layers.length; i++) {
    //open a div in the buffer
    htmlBuffer +=
    `<div class="layer-tab" id="`

    //if this tab is the active one, give it the active tab ID
    if (layers[i] == activeLayer) {
      htmlBuffer +=
      `current-layer-tab`
    }

    //add most of the functional parts of the tab such as buttons and nametag
    htmlBuffer +=
    `">
      <div style="float: left;">
       <div class="up-button" title="Move layer up"><img src="assets/images/uparrow.png" alt=""></div>
       <div class="down-button" title="Move layer down"><img src="assets/images/downarrow.png" alt=""></div>
     </div>
     <div class="nametag-container">
      <H3 class="layer-nametag">${layers[i].name}</H3>
     </div>
    </div>`;
  }

  $(`#layers-container`).html(htmlBuffer); //create the html element from what's in the buffer

  //give the html element the appropriate event listeners
  $(`.nametag-container`).on(`click`, function() {
    tabSelector(this.parentNode);
  });
  $(`.up-button`).on(`click`, function() {
    moveLayerUp(this);
  });
  $(`.down-button`).on(`click`, function() {
    moveLayerDown(this);
  });

}
