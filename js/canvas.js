/**
 *  Name: canvas.js
 *  Author: Zihan Ye
 *  Description: draw lines, circles, and poligons on canvas element
 */

/******************************* Parameters *********************************/


//set stroke width for drawing
var strokeWidth = 5;

// store all pre-defined points in an array
var pointsArrayIntro = [];
var dashArrayIntro = [];

// store all dynamic points in an array
var pointsArrayRandom = [];
var dashArrayRandom = [];

// store all reverse dynamic points in an array
var pointsArrayRandomReverse = [];
var dashArrayRandomReverse = [];

var pathIntro = [];
var pathRandom = [];
var pathRandomReverse = [];

var socketShift = [];

const second = 2;
const fps = 60;
const lambda = second * fps;
const period = 10;
const gravity = 0.5;
const bounceTimes = 1;
const explosionParts = 5;
const balanceResistance = 1;
const resistance = 0.1;

const cannonballColor = "aqua";
const particleColor = "gold";
const particleShadowColor = "orange";
const particleRadius = 1;

//get screen height and screen width
var screenWidth = $(window).width();
var screenHeight = $(window).height();

// create new Chip class: chipMain
var chipMain = new Chip('chipMain', 0);

/******************************* Parameters End ******************************/

/******************************* SVG Draw *********************************/

// get the svg element on block1
var svg1 = document.getElementById("svg1"); // get svg1 element
var svg1after = document.getElementById("svg1after"); // get svg1 element

// divide the width by 9 for drawing socket (circle)
var division = 9;
var deltaChipMainX = chipMain.width / division;

bottomSide.init();
leftSide.init();
rightSide.init();
topSide.init();

for(let i=0; i<pathIntro.length; i++){
    let path = pathIntro[i];
    drawVertices(svg1, path.points, path.length, path.brightness, 
        path.moveCircleH, path.moveCircleV, path.slopeFix);
}

leftCenterSide.init();
leftBottomSide.init();
rightCenterSide.init();
rightBottomSide.init();

/******************************* SVG Draw End ********************************/

/******************************* Canvas Draw *********************************/

var canvas = document.getElementById('canvas1');
var c = canvas.getContext('2d');

canvas.width = screenWidth;
canvas.height = screenHeight;

var cannonballs = [];
var explosions = [];
var input = false;

var end = false;
var count = 0;

c.fillStyle = "rgba(1, 1, 1, 0.2)";

function animate() {
  window.requestAnimationFrame(animate);
  c.fillRect(0, 0, canvas.width, canvas.height);

  if (!end) {
    for (let i = 0; i < pointsArrayIntro.length; i++) {
      cannonballs.push(new Cannonball(canvas.width / 2, canvas.height / 2, 2, cannonballColor, pointsArrayIntro[i], dashArrayIntro[i]));
    }
  }
  end = true;

  //update cannonbals, and create new Explosion after every period
  for (let i = 0; i < cannonballs.length; i++) {
    cannonballs[i].update();
    if (count % period == 0) {
      explosions.push(new Explosion(cannonballs[i]));
    }
    if (cannonballs[i].destroy) {
      cannonballs.splice(i, 1);
    }
  }

  //update explosions, each explosion will create several particles,
  //if all partcicles are done, delete this explosion
  for (let i = 0; i < explosions.length; i++) {
    explosions[i].update();
    if (explosions[i].particles.length <= 0) {
      explosions.splice(i, 1);
    }
  }

  if (explosions.length <= 0) {
    if (cannonballs.length < 3) {
      $(svg1after).empty();
      let index = Math.floor(Math.random() * 4);
      for (let i = 0; i < 3; i++) {
        let path = pathRandom[index][i];
        cannonballs.push(new Cannonball(canvas.width / 2, canvas.height / 2, 2, cannonballColor, path.points, path.length));
        drawVerticesAfter(svg1after, path.points, path.length, "bright", path.moveCircleH, path.moveCircleV, path.slopeFix, false);
      }
      input = true;
    }
  }

  if (input) {
    if (cannonballs.length < 3) {
      let index = Math.floor(Math.random() * 4);
      for (let i = 0; i < 3; i++) {
        let path = pathRandomReverse[index][i];
        cannonballs.push(new Cannonball(canvas.width / 2, canvas.height / 2, 2, cannonballColor, path.points, path.length));
        drawVerticesAfter(svg1after, path.points, path.length, "bright", path.moveCircleH, path.moveCircleV, path.slopeFix, true);
      }
      input = false;
    }
  }

  if (count < 1000) {
    count++;
  } else {
    count = 0;
  }
}
animate();
/******************************* Canvas Draw End *****************************/