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

drawLeftCenter.draw();
drawLeftBottom.draw();
drawRightCenter.draw();
drawRightBottom.draw();

/******************************* SVG Draw End ********************************/

/******************************* Canvas Draw *********************************/

// var canvas = document.getElementById('canvas1');
// var c = canvas.getContext('2d');

// canvas.width = screenWidth;
// canvas.height = screenHeight;

// var cannonballs = [];
// var explosions = [];
// var input = false;

// var end = false;
// var count = 0;

// c.fillStyle = "rgba(1, 1, 1, 0.2)";

// function animate() {
//   window.requestAnimationFrame(animate);
//   c.fillRect(0, 0, canvas.width, canvas.height);

//   if (!end) {
//     for (let i = 0; i < pointsArrayIntro.length; i++) {
//       cannonballs.push(new Cannonball(canvas.width / 2, canvas.height / 2, 2, cannonballColor, pointsArrayIntro[i], dashArrayIntro[i]));
//     }
//   }
//   end = true;

//   //update cannonbals, and create new Explosion after every period
//   for (let i = 0; i < cannonballs.length; i++) {
//     cannonballs[i].update();
//     if (count % period == 0) {
//       explosions.push(new Explosion(cannonballs[i]));
//     }
//     if (cannonballs[i].destroy) {
//       cannonballs.splice(i, 1);
//     }
//   }

//   //update explosions, each explosion will create several particles,
//   //if all partcicles are done, delete this explosion
//   for (let i = 0; i < explosions.length; i++) {
//     explosions[i].update();
//     if (explosions[i].particles.length <= 0) {
//       explosions.splice(i, 1);
//     }
//   }

//   if (explosions.length <= 0) {
//     if (cannonballs.length < 3) {
//       $(svg1after).empty();
//       let index = Math.floor(Math.random() * 4);
//       for (let i = 0; i < 3; i++) {
//         cannonballs.push(new Cannonball(canvas.width / 2, canvas.height / 2, 2, cannonballColor, pointsArrayRandom[index][i], dashArrayRandom[index]));
//         drawVerticesAfter(svg1after, pointsArrayRandom[index][i], dashArrayRandom[index], "bright", socketShift[index].h, socketShift[index].v, Math.sqrt(2) / 2, false);
//       }
//       // drawVertices(svg1, pointsArrayRandom[index][0], dashArrayRandom[index], "bright", -1, -1, Math.sqrt(2) / 2);
//       // drawVertices(svg1, pointsArrayRandom[index][1], dashArrayRandom[index], "bright", -1, -1, Math.sqrt(2) / 2);
//       // drawVertices(svg1, pointsArrayRandom[index][2], dashArrayRandom[index], "bright", -1, -1, Math.sqrt(2) / 2);
//       input = true;
//     }
//   }

//   if (input) {
//     if (cannonballs.length < 3) {
//       let index = Math.floor(Math.random() * 4);
//       for (let i = 0; i < 3; i++) {
//         cannonballs.push(new Cannonball(canvas.width / 2, canvas.height / 2, 2, cannonballColor, pointsArrayRandomReverse[index][i], dashArrayRandomReverse[index]));
//         drawVerticesAfter(svg1after, pointsArrayRandomReverse[index][i], dashArrayRandom[index], "bright", socketShift[index].h, socketShift[index].v, Math.sqrt(2) / 2, true);
//       }
//       // cannonballs.push(new Cannonball(canvas.width / 2, canvas.height / 2, 2, cannonballColor, pointsArrayRandomReverse[index][0], dashArrayRandomReverse[index]));
//       // cannonballs.push(new Cannonball(canvas.width / 2, canvas.height / 2, 2, cannonballColor, pointsArrayRandomReverse[index][1], dashArrayRandomReverse[index]));
//       // cannonballs.push(new Cannonball(canvas.width / 2, canvas.height / 2, 2, cannonballColor, pointsArrayRandomReverse[index][2], dashArrayRandomReverse[index]));
//       input = false;
//     }
//   }

//   if (count < 1000) {
//     count++;
//   } else {
//     count = 0;
//   }
// }
// animate();
/******************************* Canvas Draw End *****************************/