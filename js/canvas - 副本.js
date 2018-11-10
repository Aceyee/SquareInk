/**
 *  Name: canvas.js
 *  Author: Zihan Ye
 *  Description: draw lines, circles, and poligons on canvas element
 */

//get screen height and screen width
var screenWidth = $(window).width();
var screenHeight = $(window).height();

//set stroke width for drawing
var strokeWidth = 5;

// get the svg element on block1
var svg1 = document.getElementById("svg1"); // get svg1 element

/* create new Chip class: chipMain*/
var chipMain = new Chip('chipMain', 0);

/* divide the width by 9 for drawing socket (circle) */
var division = 9;
var deltaChipMainX = chipMain.width / division;

/* method for drawing polygons on bottom side */
var drawBottomSide = {
  /* include three straght lines, use for loop to draw line, and shift X to draw next */
  draw: function () {
    var dash = screenHeight - chipMain.bottom - chipMain.border;
    var points = [screenWidth / 2 - deltaChipMainX, screenHeight,
    screenWidth / 2 - deltaChipMainX, chipMain.bottom + chipMain.border];
    for (var count = 0; count < 3; count++) {
      draw2Vertices(svg1, points, dash, 1);
      points = shiftPointsH(points, deltaChipMainX);
    }
  }
}

/* method for drawing polygons on left side */
var drawLeftSide = {
  /* include three polygon lines, draw them separately in three methods*/
  draw: function () {
    this.draw1();
    this.draw2();
    this.draw3();
  },
  /* for each draw method, decide the way points one by one, 
      and then push these (x,y)'s to an array*/
  draw1: function () {
    var x1 = chipMain.left - chipMain.border;
    var y1 = chipMain.top;
    var x2 = x1 - deltaChipMainX;
    var y2 = y1 - deltaChipMainX;
    var x3 = x2;
    var y3 = 0;

    this.points1 = [x3, y3,
      x2, y2,
      x1, y1]

    this.dash1 = y2 + Math.sqrt(2) * deltaChipMainX;
    draw3Vertices(svg1, this.points1, this.dash1, 1);
  },

  draw2: function () {
    var x1 = chipMain.left - chipMain.border;
    var y1 = chipMain.top + deltaChipMainX;
    var x2 = x1 - 2 * deltaChipMainX;
    var y2 = y1 - 2 * deltaChipMainX;
    var x3 = x2;
    var y3 = 2 * deltaChipMainX;
    var x4 = x3 - 2 * deltaChipMainX;
    var y4 = 0;

    this.points2 = [x4, y4,
      x3, y3,
      x2, y2,
      x1, y1];

    this.dash2 = 2 * Math.sqrt(2) * 2 * deltaChipMainX + y2 - y3;
    draw4Vertices(svg1, this.points2, this.dash2, 1, 1, 0.5 * Math.sqrt(2));
  },

  draw3: function () {
    var x1 = chipMain.left - chipMain.border;
    var y1 = chipMain.top + 2 * deltaChipMainX;
    var x2 = x1 - 3 * deltaChipMainX;
    var y2 = y1 - 3 * deltaChipMainX;
    var x3 = x2;
    var y3 = 2 * deltaChipMainX;
    var x4 = x3 - 2 * deltaChipMainX;
    var y4 = 0;

    this.points3 = [x4, y4,
      x3, y3,
      x2, y2,
      x1, y1];

    this.dash3 = (2 + 3) * Math.sqrt(2) * deltaChipMainX + y2 - y3;
    draw4Vertices(svg1, this.points3, this.dash3, 1, 1, 0.5 * Math.sqrt(2));
  }
}



/* method for drawing polygons on right side */
var drawRightSide = {
  /* include three polygon lines, draw them separately in three methods*/
  draw: function () {
    this.draw1();
    this.draw2();
    this.draw3();
  },
  /* here call symmetry horzontal function to get the points in a easier way */
  draw1: function () {
    this.points1 = drawLeftSide.points1;
    this.dash1 = drawLeftSide.dash1;
    this.points1 = symmetryH(this.points1);
    draw3Vertices(svg1, this.points1, this.dash1, -1, 1);
  },
  draw2: function () {
    this.points2 = drawLeftSide.points2;
    this.dash2 = drawLeftSide.dash2;
    this.points2 = symmetryH(this.points2);
    draw4Vertices(svg1, this.points2, this.dash2, -1, 1, 0.5 * Math.sqrt(2));
  },
  draw3: function () {
    this.points3 = drawLeftSide.points3;
    this.dash3 = drawLeftSide.dash3;
    this.points3 = symmetryH(this.points3);
    draw4Vertices(svg1, this.points3, this.dash3, -1, 1, 0.5 * Math.sqrt(2));
  }
};

/* method for drawing polygons on top side */
var drawTopSide = {
  /* include six polygon lines, draw them separately in three methods*/
  draw: function () {
    this.draw1();
    this.draw2();
    this.draw3();
    this.draw4();
    this.draw5();
    this.draw6();
  },
  draw1: function () {
    var x1 = chipMain.left;
    var y1 = chipMain.top - chipMain.border;
    var x2 = x1;
    var y2 = y1 - deltaChipMainX;
    var x3 = x2 - deltaChipMainX;
    var y3 = y2 - deltaChipMainX;
    var x4 = x3;
    var y4 = 0;

    this.points1 = [x4, y4,
      x3, y3,
      x2, y2,
      x1, y1];

    this.dash1 = y3 + Math.sqrt(2) * deltaChipMainX + deltaChipMainX;
    draw4Vertices(svg1, this.points1, this.dash1, 0, 1, 1);
  },

  //Note: here the points1 already changed due to object oriented
  /* here shift the privous set of points to obtain next set of points */
  draw2: function () {
    this.points2 = shiftPointsH(this.points1, deltaChipMainX);

    this.dash2 = this.dash1;
    draw4Vertices(svg1, this.points2, this.dash2, 0, 1, 1);
  },
  draw3: function () {
    this.points3 = shiftPointsH(this.points2, deltaChipMainX);

    this.dash3 = this.dash2;
    draw4Vertices(svg1, this.points3, this.dash3, 0, 1, 1);
  },

  /* here call symmetry horzontal function to get the points in a easier way */
  draw4: function () {
    this.points4 = symmetryH(this.points1);

    this.dash4 = this.dash1;
    draw4Vertices(svg1, this.points4, this.dash4, 0, 1, 1);
  },
  draw5: function () {
    this.points5 = shiftPointsH(this.points2, deltaChipMainX);

    this.dash5 = this.dash2;
    draw4Vertices(svg1, this.points5, this.dash5, 0, 1, 1);
  },
  draw6: function () {
    this.points6 = shiftPointsH(this.points3, deltaChipMainX);

    this.dash6 = this.dash3;
    draw4Vertices(svg1, this.points6, this.dash6, 0, 1, 1);
  }
}

drawBottomSide.draw();
drawLeftSide.draw();
drawRightSide.draw();
drawTopSide.draw();


var canvas = document.getElementById('canvas1');
var c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

cannonballs = [];

function Cannonball(x, y, radius, color) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.color = color;

  this.init = function () {
    // Initialize the cannonballs start coordinates (from muzzle of cannon)
    this.x = 0;
    this.y = 0;

    // Translate relative to canvas positioning
    // this.x = this.x + (canvas.width / 2);
    // this.y = this.y + (canvas.height);	
  };

  this.update = function () {
    this.draw();
  };

  this.draw = function () {
    c.save();
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.shadowColor = this.color;
    c.shadowBlur = 5;
    c.shadowOffsetX = 0;
    c.shadowOffsetY = 0;
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
    c.restore();
  };

  this.init();
}

function animate() {
  window.requestAnimationFrame(animate);

  //   c.fillStyle = "rgba(18, 18, 18, 0.2)";
  //   c.fillRect(0, 0, canvas.width, canvas.height);		
  c.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 10; i++) {
    cannonballs.push(new Cannonball(canvas.width / 2, canvas.height / 2, 4, "white"));
  }
    cannonballs[0].update();
}
animate();

// var mouse = {
//   x: window.innerWidth / 2,
//   y: window.innerHeight / 2
// };

// var isMouseDown = false;

// window.addEventListener("mousemove", function(event) {
//   mouse.x = event.clientX;
//   mouse.y = event.clientY;
// });

// window.addEventListener("resize", function() {
//   canvas.height = window.innerHeight;
//   canvas.width = window.innerWidth;

//   initializeVariables();
// });


// window.addEventListener("mousedown", function() {
//   isMouseDown = true;
// });

// window.addEventListener("mouseup", function() {
//   isMouseDown = false;
// });

// canvas.addEventListener("touchstart", function() {
//   isMouseDown = true;
// });

// canvas.addEventListener("touchmove", function(event) {
//   event.preventDefault();
//   mouse.x = event.touches[0].pageX;
//   mouse.y = event.touches[0].pageY;
// });

// canvas.addEventListener("touchend", function() {
//   isMouseDown = false;
// });


// function Cannon(x, y, width, height, color) {
//   this.x = x;
//   this.y = y;
//   this.width = width;
//   this.height = height;
//   this.angle = 0;
//   this.color = color;

//   this.update = function() {
//     desiredAngle = Math.atan2(mouse.y - this.y, mouse.x - this.x);
//     this.angle = desiredAngle;
//     this.draw();	
//   };

//   this.draw = function() {
//     c.save();
//     c.translate(this.x, this.y);
//     c.rotate(this.angle);
//     c.beginPath();
//     c.fillStyle = this.color;
//     c.shadowColor = this.color;
//     c.shadowBlur = 3;
//     c.shadowOffsetX = 0;
//     c.shadowOffsetY = 0;
//     c.fillRect(0, -this.height / 2, this.width, height);
//     c.closePath();
//     c.restore();
//   };
// }

// function Cannonball(x, y, dx, dy, radius, color, cannon, particleColors) {
//   this.x = x;
//   this.y = y;
//   this.dx = dx;
//   this.dy = -dy;
//   this.radius = radius;
//   this.color = color;
//   this.particleColors = particleColors;
//   this.source = cannon;
//   this.timeToLive = canvas.height / (canvas.height + 800);

//   this.init = function() {
//     // Initialize the cannonballs start coordinates (from muzzle of cannon)
//     this.x = Math.cos(this.source.angle) * this.source.width;
//     this.y = Math.sin(this.source.angle) * this.source.width;

//     // Translate relative to canvas positioning
//     this.x = this.x + (canvas.width / 2);
//     this.y = this.y + (canvas.height);	

//     // Determine whether the cannonball should be 
//     // fired to the left or right of the cannon
//     if (mouse.x - canvas.width / 2 < 0) {
//       this.dx = -this.dx;
//     }

//     this.dy = Math.sin(this.source.angle) * 8;
//     this.dx = Math.cos(this.source.angle) * 8;
//   };

//   this.update = function() {
//     if (this.y + this.radius + this.dy > canvas.height) {
//       this.dy = -this.dy;
//     } else {
//       this.dy += gravity;
//     }

//     this.x += this.dx;
//     this.y += this.dy;
//     this.draw();	

//     this.timeToLive -= 0.01;
//   };

//   this.draw = function() {
//     c.save();
//     c.beginPath();
//     c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
//     c.shadowColor = this.color;
//     c.shadowBlur = 5;
//     c.shadowOffsetX = 0;
//     c.shadowOffsetY = 0;
//     c.fillStyle = this.color;
//     c.fill();
//     c.closePath();
//     c.restore();
//   };

//   this.init();
// }

// function Particle(x, y, dx, dy, radius, color) {
//   this.x = x;
//   this.y = y;
//   this.dx = dx;
//   this.dy = -dy;
//   this.radius = 5;
//   this.color = color;
//   this.timeToLive = 1;
//   // this.mass = 0.2;

//   this.update = function() {
//     if (this.y + this.radius + this.dy > canvas.height) {
//       this.dy = -this.dy;
//     }

//     if (this.x + this.radius + this.dx > canvas.width || this.x - this.radius + this.dx < 0) {
//       this.dx = -this.dx;
//     }
//     // this.dy += gravity * this.mass;
//     this.x += this.dx;
//     this.y += this.dy;
//     this.draw();

//     this.timeToLive -= 0.01;
//   };

//   this.draw = function() {
//     c.save();
//     c.beginPath();
//     c.arc(this.x, this.y, 2, 0, Math.PI * 2, false);
//     c.shadowColor = this.color;
//     c.shadowBlur = 10;
//     c.shadowOffsetX = 0;
//     c.shadowOffsetY = 0;
//     c.fillStyle = this.color;
//     c.fill();

//     c.closePath();

//     c.restore();
//   };
// }


// function Explosion(cannonball) {
//   this.particles = [];	
//   this.rings = [];
//   this.source = cannonball;

//   this.init = function() {
//     for (var i = 0; i < 10; i++) {

//       var dx = (Math.random() * 6) - 3;
//       var dy = (Math.random() * 6) - 3;

//       // var hue = (255 / 5) * i;
//       // var color = "hsl(" + hue + ", 100%, 50%)";
//       var randomColorIndex = Math.floor(Math.random() * this.source.particleColors.length);
//       var randomParticleColor = this.source.particleColors[randomColorIndex];


//         this.particles.push(new Particle(this.source.x, this.source.y, dx, dy, 1, randomParticleColor));
//     }

//     // Create ring once explosion is instantiated
//       // this.rings.push(new Ring(this.source, "blue"));
//   };

//   this.init();

//   this.update = function() {
//     for (var i = 0; i < this.particles.length; i++) {
//         this.particles[i].update();

//         // Remove particles from scene one time to live is up
//         if (this.particles[i].timeToLive < 0) {
//           this.particles.splice(i, 1);
//         }
//     }

//     // Render rings
//     for (var j = 0; j < this.rings.length; j++) {
//       this.rings[j].update();

//       // Remove rings from scene one time to live is up
//         if (this.rings[j].timeToLive < 0) {
//           this.rings.splice(i, 1);
//         }
//     }
//   };
// }

// var gravity = 0.08;
// var desiredAngle = 0;
// var cannon, cannonballs, explosions, colors;

// function initializeVariables() {
//   cannon = new Cannon(canvas.width / 2, canvas.height, 20, 10, "white");
//   cannonballs = [];
//   explosions = [];
//   colors = [


//     // Red / Orange
//     {
//       cannonballColor: "#fff",
//       particleColors: [
//         "#ff4747",
//         "#00ceed",
//         "#fff",
//       ]
//     }

//   ];

// }

// initializeVariables();

// var timer = 0;
// var isIntroComplete = false;
// var introTimer = 0;


// function animate() {
//   window.requestAnimationFrame(animate);

// //   c.fillStyle = "rgba(18, 18, 18, 0.2)";
// //   c.fillRect(0, 0, canvas.width, canvas.height);		
// c.clearRect(0, 0, canvas.width, canvas.height);
//   cannon.update();

//   if (isIntroComplete === false) {
//     introTimer += 1;

//     if (introTimer % 3 === 0) {
//       var randomColor = Math.floor(Math.random() * colors.length);
//       var color = colors[randomColor];

//       cannonballs.push(new Cannonball(canvas.width / 2, canvas.height / 2, 2, 2, 4, color.cannonballColor, cannon, color.particleColors));
//     }

//     if (introTimer > 30) {
//       isIntroComplete = true;
//     }

//   }


//   // Render cannonballs
//   for (var i = 0; i < cannonballs.length; i++) {
//       cannonballs[i].update();

//       if (cannonballs[i].timeToLive <= 0) {

//         // Create particle explosion after time to live expires
//         explosions.push(new Explosion(cannonballs[i]));

//         cannonballs.splice(i, 1);

//       }
//   }

//   // Render explosions
//   for (var j = 0; j < explosions.length; j++) {
//         //Do something
//         explosions[j].update();

//       // Remove explosions from scene once all associated particles are removed
//       if (explosions[j].particles.length <= 0) {
//         explosions.splice(j, 1);
//       }
//   }	


//   if (isMouseDown === true) {
//     timer += 1;
//     if (timer % 3 === 0) {
//       var randomParticleColorIndex = Math.floor(Math.random() * colors.length);
//       var randomColors = colors[randomParticleColorIndex];

//       cannonballs.push(new Cannonball(mouse.x, mouse.y, 2, 2, 4, randomColors.cannonballColor, cannon, randomColors.particleColors));
//     }
//   }
// }

// animate();