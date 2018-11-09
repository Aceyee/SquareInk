/**
 *  Name: canvas.js
 *  Author: Zihan Ye
 *  Description: draw lines, circles, and poligons on canvas element
 */

/* get screen height and screen width*/
var screenWidth = $(window).width();
var screenHeight = $(window).height();

/* set stroke width for drawing */
var strokeWidth = 5;

/* get the svg element on block1*/
var svg1 = document.getElementById("svg1"); // get svg1 element

/* create new Chip class: chipMain*/
var chipMain = new Chip('chipMain');

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
    draw:function(){
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
    draw:function(){
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
    draw:function(){
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
    draw4:function(){
        this.points4 = symmetryH(this.points1);

        this.dash4 = this.dash1;
        draw4Vertices(svg1, this.points4, this.dash4, 0, 1, 1);
    },
    draw5:function(){
        this.points5 = shiftPointsH(this.points2, deltaChipMainX);

        this.dash5 = this.dash2;
        draw4Vertices(svg1, this.points5, this.dash5, 0, 1, 1);
    },
    draw6:function(){
        this.points6 = shiftPointsH(this.points3, deltaChipMainX);

        this.dash6 = this.dash3;
        draw4Vertices(svg1, this.points6, this.dash6, 0, 1, 1);
    }
}


drawBottomSide.draw();
drawLeftSide.draw();
drawRightSide.draw();
drawTopSide.draw();