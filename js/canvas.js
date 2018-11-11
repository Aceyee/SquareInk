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

// store all points in an array
var pointsArray = [];
var dashArray = [];

const second = 2;
const fps = 60;
const lambda = second * fps;


/* method for drawing polygons on bottom side */
var drawBottomSide = {
  /* include three straght lines, use for loop to draw line, and shift X to draw next */
  draw: function () {
    this.draw1();
    this.draw2();
    this.draw3();
  },
  draw1: function () {
    this.dash = screenHeight - chipMain.bottom - chipMain.border;
    var p1 = new Point(screenWidth / 2 - deltaChipMainX, screenHeight);
    var p2 = new Point(screenWidth / 2 - deltaChipMainX, chipMain.bottom + chipMain.border);
    this.points1 = [p1, p2];
    pointsArray.push(this.points1);
    dashArray.push(this.dash);
    draw2Vertices(svg1, this.points1, this.dash, 1);
  },
  draw2: function () {
    this.points2 = copyPoints(this.points1);
    this.points2 = shiftPointsH(this.points2, deltaChipMainX);
    // pointsArray.push(this.points2);
    // dashArray.push(this.dash);
    draw2Vertices(svg1, this.points2, this.dash, 1);
  },
  draw3: function () {
    this.points3 = copyPoints(this.points2);
    this.points3 = shiftPointsH(this.points3, deltaChipMainX);
    // pointsArray.push(this.points3);
    // dashArray.push(this.dash);
    draw2Vertices(svg1, this.points3, this.dash, 1);
  }
}

/* method for drawing polygons on left side */
var drawLeftSide = {
  /* include three polygon lines, draw them separately in three methods*/
  draw: function () {
    this.points1 = [];
    this.draw1();
    this.draw2();
    this.draw3();
  },
  /* for each draw method, decide the way points one by one, 
      and then push these (x,y)'s to an array*/
  draw1: function () {
    var p1 = new Point(chipMain.left - chipMain.border, chipMain.top);
    var p2 = new Point(p1.x - deltaChipMainX, p1.y - deltaChipMainX);
    var p3 = new Point(p2.x, 0);
    this.points1 = [p3, p2, p1];
    this.dash1 = p2.y + Math.sqrt(2) * deltaChipMainX;
    pointsArray.push(this.points1);
    dashArray.push(this.dash1);
    draw3Vertices(svg1, this.points1, this.dash1, 1);
  },

  draw2: function () {
    var p1 = new Point(chipMain.left - chipMain.border, chipMain.top + deltaChipMainX);
    var p2 = new Point(p1.x - 2 * deltaChipMainX, p1.y - 2 * deltaChipMainX);
    var p3 = new Point(p2.x, 2 * deltaChipMainX);
    var p4 = new Point(p3.x - 2 * deltaChipMainX, 0);

    this.points2 = [p4, p3, p2, p1];

    this.dash2 = 2 * Math.sqrt(2) * 2 * deltaChipMainX + p2.y - p3.y;
    // pointsArray.push(this.points2);
    // dashArray.push(this.dash2);
    draw4Vertices(svg1, this.points2, this.dash2, 1, 1, 0.5 * Math.sqrt(2));
  },

  draw3: function () {
    var p1 = new Point(chipMain.left - chipMain.border, chipMain.top + 2 * deltaChipMainX);
    var p2 = new Point(p1.x - 3 * deltaChipMainX, p1.y - 3 * deltaChipMainX);
    var p3 = new Point(p2.x, 2 * deltaChipMainX);
    var p4 = new Point(p3.x - 2 * deltaChipMainX, 0);

    this.points3 = [p4, p3, p2, p1];

    this.dash3 = (2 + 3) * Math.sqrt(2) * deltaChipMainX + p2.y - p3.y;
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
    var p1 = new Point(chipMain.left, chipMain.top - chipMain.border);
    var p2 = new Point(p1.x, p1.y - deltaChipMainX);
    var p3 = new Point(p2.x - deltaChipMainX, p2.y - deltaChipMainX);
    var p4 = new Point(p3.x, 0);

    this.points1 = [p4, p3, p2, p1];

    this.dash1 = p3.y + Math.sqrt(2) * deltaChipMainX + deltaChipMainX;
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

canvas.width = screenWidth;
canvas.height = screenHeight;

var cannonballs = [];
var explosions = [];

function Particle(x, y, dx, dy, radius, color) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = -dy;
  this.radius = 5;
  this.color = color;
  this.timeToLive = 1;
  // this.mass = 0.2;

  this.update = function () {
    if (this.y + this.radius + this.dy > canvas.height) {
      this.dy = -this.dy;
    }

    if (this.x + this.radius + this.dx > canvas.width || this.x - this.radius + this.dx < 0) {
      this.dx = -this.dx;
    }
    // this.dy += gravity * this.mass;
    this.x += this.dx;
    this.y += this.dy;
    this.draw();

    this.timeToLive -= 0.01;
  };

  this.draw = function () {
    c.save();
    c.beginPath();
    c.arc(this.x, this.y, 2, 0, Math.PI * 2, false);
    c.shadowColor = this.color;
    c.shadowBlur = 10;
    c.shadowOffsetX = 0;
    c.shadowOffsetY = 0;
    c.fillStyle = this.color;
    c.fill();

    c.closePath();

    c.restore();
  };
}

function Explosion(cannonball) {
  this.particles = [];
  this.rings = [];
  this.source = cannonball;

  this.init = function () {
    for (var i = 0; i < 1; i++) {

      var dx = (Math.random() * 6) - 3;
      var dy = (Math.random() * 6) - 3;

      // var hue = (255 / 5) * i;
      // var color = "hsl(" + hue + ", 100%, 50%)";
      // var randomColorIndex = Math.floor(Math.random() * this.source.particleColors.length);
      // var randomParticleColor = this.source.particleColors[randomColorIndex];
      var randomParticleColor = "white";
      this.particles.push(new Particle(this.source.x, this.source.y, dx, dy, 1, randomParticleColor));
    }

    // Create ring once explosion is instantiated
    // this.rings.push(new Ring(this.source, "blue"));
  };

  this.init();

  this.update = function () {
    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].update();

      // Remove particles from scene one time to live is up
      if (this.particles[i].timeToLive < 0) {
        this.particles.splice(i, 1);
      }
    }

    // Render rings
    for (var j = 0; j < this.rings.length; j++) {
      this.rings[j].update();

      // Remove rings from scene one time to live is up
      if (this.rings[j].timeToLive < 0) {
        this.rings.splice(i, 1);
      }
    }
  };
}

function Cannonball(x, y, radius, color, points, dash) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.color = color;
  this.points = points;
  this.dash = dash;
  this.destroy = false;
  

  this.init = function () {
    // Initialize the cannonballs start coordinates (from muzzle of cannon)
    this.currIndex = 0;
    this.lastIndex = points.length - 1;
    this.x = points[0].x;
    this.y = points[0].y;
    this.d = distance(points[this.currIndex + 1], points[this.currIndex]);
    this.dx = (points[this.currIndex + 1].x - points[this.currIndex].x) * (this.dash/this.d) / lambda;
    this.dy = (points[this.currIndex + 1].y - points[this.currIndex].y) * (this.dash/this.d)/ lambda;
  };

  this.update = function () {
    if(this.currIndex<this.lastIndex){
      if (Math.abs(this.x - points[this.currIndex+1].x > 1 ||
        Math.abs(this.y - points[this.currIndex+1].y) > 1)){
          //nothing
        this.d = distance(points[this.currIndex + 1], points[this.currIndex]);
        this.dx = (points[this.currIndex + 1].x - points[this.currIndex].x) *(this.dash/this.d) / lambda;
        this.dy = (points[this.currIndex + 1].y - points[this.currIndex].y) *(this.dash/this.d)/ lambda;
      } else{
        this.currIndex++;
      }
    }else{
      this.destroy = true;
    }
   
    this.x += this.dx;
    this.y += this.dy;

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

// alert(pointsArray[0] +" "+ pointsArray[1]);
var end = false;
var count = 0;
function animate() {
  window.requestAnimationFrame(animate);

  // alert(svg1.getAttribute('stroke-dashoffset') );

  //   c.fillStyle = "rgba(18, 18, 18, 0.2)";
  //   c.fillRect(0, 0, canvas.width, canvas.height);		
  c.clearRect(0, 0, canvas.width, canvas.height);

  if (!end) {
    for (let i = 0; i < pointsArray.length; i++) {
      cannonballs.push(new Cannonball(canvas.width / 2, canvas.height / 2, 2, "white", pointsArray[i], dashArray[i]));
    }
  }
  end = true;

  for (let i = 0; i < cannonballs.length; i++) {
    cannonballs[i].update();
    if(count%10==0){
      explosions.push(new Explosion(cannonballs[i]));
    }
    if (cannonballs[i].destroy) {
      cannonballs.splice(i, 1);
    }
    // cannonballs.splice(i, 1);
  }

  for (let i = 0; i < explosions.length; i++) {
    explosions[i].update();
    if (explosions[0].particles.length <= 0) {
      explosions.splice(0, 1);
    }
  }
  if(count<1000){
    count++;
  }else{
    count=0;
  }
}
animate();