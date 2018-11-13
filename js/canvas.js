/**
 *  Name: canvas.js
 *  Author: Zihan Ye
 *  Description: draw lines, circles, and poligons on canvas element
 */

/******************************* Parameters *********************************/
//get screen height and screen width
var screenWidth = $(window).width();
var screenHeight = $(window).height();

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
/******************************* Parameters End ******************************/

/******************************* SVG Draw *********************************/

// get the svg element on block1
var svg1 = document.getElementById("svg1"); // get svg1 element
var svg1after = document.getElementById("svg1after"); // get svg1 element


// create new Chip class: chipMain
var chipMain = new Chip('chipMain', 0);

// divide the width by 9 for drawing socket (circle)
var division = 9;
var deltaChipMainX = chipMain.width / division;

/* method for drawing polygons on bottom side */
var drawBottomSide = {
  // include three straght lines, use for loop to draw line, and shift X to draw next
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
    drawVertices(svg1, this.points1, this.dash, "bright", 0, 1, -1);
  },
  draw2: function () {
    this.points2 = copyPoints(this.points1);
    this.points2 = shiftPointsH(this.points2, deltaChipMainX);
    pointsArrayIntro.push(this.points2);
    dashArrayIntro.push(this.dash);
    drawVertices(svg1, this.points2, this.dash, "bright", 0, 1, -1);
  },
  draw3: function () {
    this.points3 = copyPoints(this.points2);
    this.points3 = shiftPointsH(this.points3, deltaChipMainX);
    drawVertices(svg1, this.points3, this.dash, "bright", 0, 1, -1);
  }
}

/* method for drawing polygons on left side */
var drawLeftSide = {
  // include three polygon lines, draw them separately in three methods
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
    drawVertices(svg1, this.points1, this.dash1, "bright", 1, 1, Math.sqrt(2) / 2);
  },

  draw2: function () {
    var p1 = new Point(chipMain.left - chipMain.border, chipMain.top + deltaChipMainX);
    var p2 = new Point(p1.x - 2 * deltaChipMainX, p1.y - 2 * deltaChipMainX);
    var p3 = new Point(p2.x, 2 * deltaChipMainX);
    var p4 = new Point(p3.x - 2 * deltaChipMainX, 0);

    this.points2 = [p4, p3, p2, p1];

    this.dash2 = 2 * Math.sqrt(2) * 2 * deltaChipMainX + p2.y - p3.y;
    pointsArrayIntro.push(this.points2);
    dashArrayIntro.push(this.dash2);
    drawVertices(svg1, this.points2, this.dash2, "bright", 1, 1, Math.sqrt(2) / 2);
  },

  draw3: function () {
    var p1 = new Point(chipMain.left - chipMain.border, chipMain.top + 2 * deltaChipMainX);
    var p2 = new Point(p1.x - 3 * deltaChipMainX, p1.y - 3 * deltaChipMainX);
    var p3 = new Point(p2.x, 2 * deltaChipMainX);
    var p4 = new Point(p3.x - 2 * deltaChipMainX, 0);

    this.points3 = [p4, p3, p2, p1];

    this.dash3 = (2 + 3) * Math.sqrt(2) * deltaChipMainX + p2.y - p3.y;
    drawVertices(svg1, this.points3, this.dash3, "bright", 1, 1, 0.5 * Math.sqrt(2));
  }
}

/* method for drawing polygons on right side */
var drawRightSide = {
  //include three polygon lines, draw them separately in three methods
  draw: function () {
    this.draw1();
    this.draw2();
    this.draw3();
  },
  // here call symmetry horzontal function to get the points in a easier way 
  draw1: function () {
    this.points1 = drawLeftSide.points1;
    this.dash1 = drawLeftSide.dash1;
    this.points1 = symmetryH(this.points1);
    drawVertices(svg1, this.points1, this.dash1, "bright", -1, 1, Math.sqrt(2) / 2);
  },
  draw2: function () {
    this.points2 = copyPoints(drawLeftSide.points2);
    this.dash2 = drawLeftSide.dash2;
    this.points2 = symmetryH(this.points2);
    pointsArrayIntro.push(this.points2);
    dashArrayIntro.push(this.dash2);
    drawVertices(svg1, this.points2, this.dash2, "bright", -1, 1, Math.sqrt(2) / 2);
  },
  draw3: function () {
    this.points3 = copyPoints(drawLeftSide.points3);
    this.dash3 = drawLeftSide.dash3;
    this.points3 = symmetryH(this.points3);
    drawVertices(svg1, this.points3, this.dash3, "bright", -1, 1, 0.5 * Math.sqrt(2));
  }
};

/* method for drawing polygons on top side */
var drawTopSide = {
  // include six polygon lines, draw them separately in three methods
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
    drawVertices(svg1, this.points1, this.dash1, "bright", 0, 1, 1);
  },

  //Note: here the points1 already changed due to object oriented
  /* here shift the privous set of points to obtain next set of points */
  draw2: function () {
    this.points2 = copyPoints(this.points1);
    this.points2 = shiftPointsH(this.points2, deltaChipMainX);
    this.dash2 = this.dash1;
    drawVertices(svg1, this.points2, this.dash2, "bright", 0, 1, 1);
  },
  draw3: function () {
    this.points3 = copyPoints(this.points2);
    this.points3 = shiftPointsH(this.points3, deltaChipMainX);
    this.dash3 = this.dash2;
    drawVertices(svg1, this.points3, this.dash3, "bright", 0, 1, 1);
  },

  /* here call symmetry horzontal function to get the points in a easier way */
  draw4: function () {
    this.points4 = copyPoints(this.points1);
    this.points4 = symmetryH(this.points4);
    this.dash4 = this.dash1;
    drawVertices(svg1, this.points4, this.dash4, "bright", 0, 1, 1);
  },
  draw5: function () {
    this.points5 = copyPoints(this.points2);
    this.points5 = symmetryH(this.points5);
    this.dash5 = this.dash2;
    drawVertices(svg1, this.points5, this.dash5, "bright", 0, 1, 1);
  },
  draw6: function () {
    this.points5 = copyPoints(this.points3);
    this.points6 = symmetryH(this.points5);
    this.dash6 = this.dash3;
    drawVertices(svg1, this.points6, this.dash6, "bright", 0, 1, 1);
  }
}

drawBottomSide.draw();
drawLeftSide.draw();
drawRightSide.draw();
drawTopSide.draw();

/******************************* SVG Draw End ********************************/

var drawLeftCenter = {
  // include three polygon lines, draw them separately in three methods
  draw: function () {
    this.points1 = [];
    this.tripleArray = [];
    this.tripleArrayReverse = [];
    this.draw1();
    this.draw2();
    this.draw3();
  },
  /* for each draw method, decide the way points one by one, 
      and then push these (x,y)'s to an array*/
  draw1: function () {
    var p1 = new Point(chipMain.left - chipMain.border, screenHeight / 2);
    var p2 = new Point(p1.x - 3 * deltaChipMainX, p1.y - 3 * deltaChipMainX);
    var p3 = new Point(0, p2.y);
    this.points1 = [p3, p2, p1];
    this.dash1 = p2.x + Math.sqrt(2) * 3 * deltaChipMainX;
    this.tripleArray.push(this.points1);
    dashArrayRandom.push(this.dash1);
    dashArrayRandomReverse.push(this.dash1);
    socketShift.push({
      h:1,
      v:1
    });
    // drawVertices(svg1, this.points1, this.dash1, "dark", 1, 1, Math.sqrt(2) / 2);
  },

  draw2: function () {
    this.points2 = copyPoints(this.points1);
    this.points2 = shiftPointsV(this.points2, -deltaChipMainX);
    this.dash2 = this.dash1;
    this.tripleArray.push(this.points2);
    // drawVertices(svg1, this.points2, this.dash2, "dark", 1, 1, Math.sqrt(2) / 2);
  },

  draw3: function () {
    this.points3 = copyPoints(this.points1);
    this.points3 = shiftPointsV(this.points3, deltaChipMainX);
    this.dash3 = this.dash1;
    this.tripleArray.push(this.points3);
    pointsArrayRandom.push(this.tripleArray);


    for (let i = 0; i < this.tripleArray.length; i++) {
      let tempPoints = copyPoints(this.tripleArray[i]);
      tempPoints = reverse(tempPoints);
      this.tripleArrayReverse.push(tempPoints);
    }
    pointsArrayRandomReverse.push(this.tripleArrayReverse);
    // drawVertices(svg1, this.points3, this.dash3, "dark", 1, 1, Math.sqrt(2) / 2);
  }
}

var drawRightCenter = {
  // include three polygon lines, draw them separately in three methods
  draw: function () {
    this.points1 = [];
    this.tripleArray = [];
    this.tripleArrayReverse = [];
    this.draw1();
    this.draw2();
    this.draw3();
  },
  /* for each draw method, decide the way points one by one, 
      and then push these (x,y)'s to an array*/
  draw1: function () {
    this.points1 = copyPoints(drawLeftCenter.points1);
    this.points1 = symmetryH(this.points1);
    this.dash1 = drawLeftCenter.dash1;
    this.tripleArray.push(this.points1);
    dashArrayRandom.push(this.dash1);
    dashArrayRandomReverse.push(this.dash1);
    socketShift.push({
      h:-1,
      v:1
    });
    // drawVertices(svg1, this.points1, this.dash1, "dark", -1, 1, Math.sqrt(2) / 2);
  },

  draw2: function () {
    this.points2 = copyPoints(this.points1);
    this.points2 = shiftPointsV(this.points2, -deltaChipMainX);
    this.dash2 = this.dash1;
    this.tripleArray.push(this.points2);
    // drawVertices(svg1, this.points2, this.dash2, "dark", -1, 1, Math.sqrt(2) / 2);
  },

  draw3: function () {
    this.points3 = copyPoints(this.points1);
    this.points3 = shiftPointsV(this.points3, deltaChipMainX);
    this.dash3 = this.dash1;
    this.tripleArray.push(this.points3);
    pointsArrayRandom.push(this.tripleArray);

    for (let i = 0; i < this.tripleArray.length; i++) {
      let tempPoints = copyPoints(this.tripleArray[i]);
      tempPoints = reverse(tempPoints);
      this.tripleArrayReverse.push(tempPoints);
    }
    pointsArrayRandomReverse.push(this.tripleArrayReverse);
    // drawVertices(svg1, this.points3, this.dash3, "dark", -1, 1, Math.sqrt(2) / 2);
  }
}

var drawLeftBottom = {
  // include three polygon lines, draw them separately in three methods
  draw: function () {
    this.points1 = [];
    this.tripleArray = [];
    this.tripleArrayReverse = [];
    this.draw1();
    this.draw2();
    this.draw3();
  },
  /* for each draw method, decide the way points one by one, 
      and then push these (x,y)'s to an array*/
  draw1: function () {
    var p1 = new Point(chipMain.left - chipMain.border, screenHeight - chipMain.top);
    var p2 = new Point(p1.x - 3 * deltaChipMainX, p1.y + 3 * deltaChipMainX);
    var p3 = new Point(0, p2.y);
    this.points1 = [p3, p2, p1];
    this.dash1 = p2.x + Math.sqrt(2) * 3 * deltaChipMainX;
    this.tripleArray.push(this.points1);
    dashArrayRandom.push(this.dash1);
    dashArrayRandomReverse.push(this.dash1);
    socketShift.push({
      h:1,
      v:-1
    });
    // drawVertices(svg1, this.points1, this.dash1, "dark", 1, -1, Math.sqrt(2) / 2);
  },

  draw2: function () {
    this.points2 = copyPoints(this.points1);
    this.points2 = shiftPointsV(this.points2, -deltaChipMainX);
    this.dash2 = this.dash1;
    this.tripleArray.push(this.points2);
    // drawVertices(svg1, this.points2, this.dash2, "dark", 1, -1, Math.sqrt(2) / 2);
  },

  draw3: function () {
    this.points3 = copyPoints(this.points2);
    this.points3 = shiftPointsV(this.points3, -deltaChipMainX);
    this.dash3 = this.dash1;
    this.tripleArray.push(this.points3);
    pointsArrayRandom.push(this.tripleArray);

    for (let i = 0; i < this.tripleArray.length; i++) {
      let tempPoints = copyPoints(this.tripleArray[i]);
      tempPoints = reverse(tempPoints);
      this.tripleArrayReverse.push(tempPoints);
    }
    pointsArrayRandomReverse.push(this.tripleArrayReverse);
    // drawVertices(svg1, this.points3, this.dash3, "dark", 1, -1, Math.sqrt(2) / 2);
  }
}

var drawRightBottom = {
  // include three polygon lines, draw them separately in three methods
  draw: function () {
    this.points1 = [];
    this.tripleArray = [];
    this.tripleArrayReverse = [];
    this.draw1();
    this.draw2();
    this.draw3();
  },
  /* for each draw method, decide the way points one by one, 
      and then push these (x,y)'s to an array*/
  draw1: function () {
    this.points1 = copyPoints(drawLeftBottom.points1);
    this.points1 = symmetryH(this.points1);
    this.dash1 = drawLeftBottom.dash1;
    this.tripleArray.push(this.points1);
    dashArrayRandom.push(this.dash1);
    dashArrayRandomReverse.push(this.dash1);
    socketShift.push({
      h:-1,
      v:-1
    });
    // drawVertices(svg1, this.points1, this.dash1, "dark", -1, -1, Math.sqrt(2) / 2);
  },

  draw2: function () {
    this.points2 = copyPoints(this.points1);
    this.points2 = shiftPointsV(this.points2, -deltaChipMainX);
    this.dash2 = this.dash1;
    this.tripleArray.push(this.points2);
    // drawVertices(svg1, this.points2, this.dash2, "dark", -1, -1, Math.sqrt(2) / 2);
  },

  draw3: function () {
    this.points3 = copyPoints(this.points2);
    this.points3 = shiftPointsV(this.points3, -deltaChipMainX);
    this.dash3 = this.dash1;
    this.tripleArray.push(this.points3);
    pointsArrayRandom.push(this.tripleArray);

    for (let i = 0; i < this.tripleArray.length; i++) {
      let tempPoints = copyPoints(this.tripleArray[i]);
      tempPoints = reverse(tempPoints);
      this.tripleArrayReverse.push(tempPoints);
    }
    pointsArrayRandomReverse.push(this.tripleArrayReverse);
    // drawVertices(svg1, this.points3, this.dash3, "dark", -1, -1, Math.sqrt(2) / 2);
  }
}

drawLeftCenter.draw();
drawLeftBottom.draw();
drawRightCenter.draw();
drawRightBottom.draw();

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
        cannonballs.push(new Cannonball(canvas.width / 2, canvas.height / 2, 2, cannonballColor, pointsArrayRandom[index][i], dashArrayRandom[index]));
        drawVerticesAfter(svg1after, pointsArrayRandom[index][i], dashArrayRandom[index], "bright", socketShift[index].h, socketShift[index].v, Math.sqrt(2) / 2, false);
      }
      // drawVertices(svg1, pointsArrayRandom[index][0], dashArrayRandom[index], "bright", -1, -1, Math.sqrt(2) / 2);
      // drawVertices(svg1, pointsArrayRandom[index][1], dashArrayRandom[index], "bright", -1, -1, Math.sqrt(2) / 2);
      // drawVertices(svg1, pointsArrayRandom[index][2], dashArrayRandom[index], "bright", -1, -1, Math.sqrt(2) / 2);
      input = true;
    }
  }

  if (input) {
    if (cannonballs.length < 3) {
      let index = Math.floor(Math.random() * 4);
      for (let i = 0; i < 3; i++) {
        cannonballs.push(new Cannonball(canvas.width / 2, canvas.height / 2, 2, cannonballColor, pointsArrayRandomReverse[index][i], dashArrayRandomReverse[index]));
        drawVerticesAfter(svg1after, pointsArrayRandomReverse[index][i], dashArrayRandom[index], "bright", socketShift[index].h, socketShift[index].v, Math.sqrt(2) / 2, true);
      }
      // cannonballs.push(new Cannonball(canvas.width / 2, canvas.height / 2, 2, cannonballColor, pointsArrayRandomReverse[index][0], dashArrayRandomReverse[index]));
      // cannonballs.push(new Cannonball(canvas.width / 2, canvas.height / 2, 2, cannonballColor, pointsArrayRandomReverse[index][1], dashArrayRandomReverse[index]));
      // cannonballs.push(new Cannonball(canvas.width / 2, canvas.height / 2, 2, cannonballColor, pointsArrayRandomReverse[index][2], dashArrayRandomReverse[index]));
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