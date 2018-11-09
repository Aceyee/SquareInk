/* canvas.js */
/* draw lines, circles, and poligons on canvas element */

var screenWidth = $(window).width();
var screenHeight = $(window).height();
var strokeWidth = 5;
var svg1 = document.getElementById("svg1"); // get svg1 element

var chipMain = new Chip('chipMain');
var division = 9;
var deltaChipMainX = chipMain.width / division;

var drawBottomSide = {
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

drawBottomSide.draw();

var drawLeftSide = {
    draw: function () {
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

drawLeftSide.draw();
drawLeftSide.draw2();
drawLeftSide.draw3();

var drawRightSide = {
    draw: function () {
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

drawRightSide.draw();
drawRightSide.draw2();
drawRightSide.draw3();

var drawTopSide = {
    draw: function () {
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
drawTopSide.draw();
drawTopSide.draw2();
drawTopSide.draw3();
drawTopSide.draw4();
drawTopSide.draw5();
drawTopSide.draw6();