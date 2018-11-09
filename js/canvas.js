/* canvas.js */
/* draw lines, circles, and poligons on canvas element */

var screenWidth = $(window).width();
var screenHeight = $(window).height();
var strokeWidth = 5;
var svg1 = document.getElementById("svg1"); // get svg1 element

var draw2Vertices = function (svg, points, dash, moveCircleDirection) {
    var lastIndex = points.length - 1;
    var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'polyline'); //Create a path in SVG's namespace
    newElement.setAttribute("class", "draw");
    newElement.setAttribute("points", points);
    newElement.style.strokeDasharray = dash;
    newElement.style.strokeDashoffset = dash;
    svg.appendChild(newElement);

    newElement = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    newElement.setAttribute("class", "socket");
    newElement.setAttribute("cx", points[lastIndex - 1]);
    newElement.setAttribute("cy", points[lastIndex] - moveCircleDirection * strokeWidth);
    newElement.setAttribute("r", strokeWidth);
    newElement.setAttribute("stroke-width", strokeWidth / 2);
    svg.appendChild(newElement);
}

var draw3Vertices = function (svg, points, dash, moveCircleDirection) {
    var lastIndex = points.length - 1;

    var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'polyline'); //Create a path in SVG's namespace
    newElement.setAttribute("class", "draw");
    newElement.setAttribute("points", points);
    newElement.style.strokeDasharray = dash;
    newElement.style.strokeDashoffset = dash;
    svg.appendChild(newElement);

    newElement = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    newElement.setAttribute("class", "socket");
    newElement.setAttribute("cx", points[lastIndex - 1] + 0.5 * Math.sqrt(2) * moveCircleDirection * strokeWidth);
    newElement.setAttribute("cy", points[lastIndex] + 0.5 * Math.sqrt(2) * strokeWidth);
    newElement.setAttribute("r", strokeWidth);
    newElement.setAttribute("stroke-width", strokeWidth / 2);
    svg.appendChild(newElement);
}

var draw4Vertices = function (svg, points, dash, moveCircleDirection) {
    var lastIndex = points.length - 1;

    var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'polyline'); //Create a path in SVG's namespace
    newElement.setAttribute("class", "draw");
    newElement.setAttribute("points", points);
    newElement.style.strokeDasharray = dash;
    newElement.style.strokeDashoffset = dash;
    svg.appendChild(newElement);

    newElement = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    newElement.setAttribute("class", "socket");
    newElement.setAttribute("cx", points[lastIndex - 1] + 0.5 * Math.sqrt(2) * moveCircleDirection * strokeWidth);
    newElement.setAttribute("cy", points[lastIndex] + 0.5 * Math.sqrt(2) * strokeWidth);
    newElement.setAttribute("r", strokeWidth);
    newElement.setAttribute("stroke-width", strokeWidth / 2);
    svg.appendChild(newElement);
}

var shiftPointsH = function (points, length) {
    for (var i = 0; i < points.length; i++) {
        if (i % 2 == 0) {
            points[i] += length;
        }
    }
    return points;
}

var symmetryH = function (points) {
    for (var i = 0; i < points.length; i++) {
        if (i % 2 == 0) {
            points[i] = screenWidth - points[i];
        }
    }
    return points;
}

var reverse = function (points) {
    var reversePoints = [];
    for (var i = 0; i < points.length - 1; i += 2) {
        var x = points[i];
        var y = points[i + 1];
        reversePoints.unshift(y);
        reversePoints.unshift(x);
    }
    return reversePoints;
}

var chipMain = new Chip('chipMain');
// alert(chipMain.topLeft);
var division = 9;
var deltaChipMainX = chipMain.width / division;

/*Bottom Center Circuit*/
var drawBottomSide ={
    draw:function(){
        var dash = screenHeight - chipMain.bottom-chipMain.border;
        var points = [screenWidth/2 - deltaChipMainX, screenHeight,
            screenWidth/2 - deltaChipMainX, chipMain.bottom+chipMain.border];
        for (var count = 0; count < 3; count++) {
            draw2Vertices(svg1, points, dash, 1);
            points = shiftPointsH(points, deltaChipMainX);
        }
    }
}

drawBottomSide.draw();

var drawLeftSide={
    draw:function(){
        var x1 = chipMain.left-chipMain.border;
        var y1 = chipMain.top;
        var x2 = x1-deltaChipMainX;
        var y2 = y1- deltaChipMainX;
        var x3 = x2;
        var y3 = 0;

        var points = [x3, y3,
            x2, y2,
            x1, y1]

        dash = y2 + Math.sqrt(2) * deltaChipMainX;
        draw3Vertices(svg1, points, dash, 1);
    },
    draw2:function(){
        var x1 = chipMain.left-chipMain.border;
        var y1 = chipMain.top+deltaChipMainX;
        var x2 = x1 - 2*deltaChipMainX;
        var y2 = y1 - 2*deltaChipMainX;
        var x3 = x2;
        var y3 = 2 * deltaChipMainX;
        var x4 = x3 - 2 * deltaChipMainX;
        var y4 = 0;

        var points = [x4, y4,
            x3, y3,
            x2, y2,
            x1, y1];

        dash = 2 * Math.sqrt(2) * 2 * deltaChipMainX + y2-y3;
        draw4Vertices(svg1, points, dash, 1);
    },

    draw3:function(){
        var x1 = chipMain.left-chipMain.border;
        var y1 = chipMain.top+2*deltaChipMainX;
        var x2 = x1 - 3*deltaChipMainX;
        var y2 = y1 - 3*deltaChipMainX;
        var x3 = x2;
        var y3 = 2 * deltaChipMainX;
        var x4 = x3 - 2 * deltaChipMainX;
        var y4 = 0;

        var points = [x4, y4,
            x3, y3,
            x2, y2,
            x1, y1];

        dash = (2+3) * Math.sqrt(2) * deltaChipMainX + y2-y3;
        draw4Vertices(svg1, points, dash, 1);
    }
}
drawLeftSide.draw();
drawLeftSide.draw2();
drawLeftSide.draw3();

// var drawRightSide={
//     draw:function(){
//         var points = drawLeftSide.points1;
//         points = reverse(points);
//         draw4Vertices(svg1, points, 500, 1);
//     }
// };
// drawRightSide.draw();