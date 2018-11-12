/**
 *  Name: utils.js 
 *  Author: Zihan Ye
 *  Description: provided helper functions for canvas
 */

/* draw2Vertices() will draw a polygon that contains 4 vertices */
var drawVertices = function (svg, points, dash, moveCircleH, moveCircleV, slopeFix) {
    var lastIndex = points.length - 1;

    // draw polygon
    var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'polyline'); //Create a path in SVG's namespace
    newElement.setAttribute("class", "draw");
    newElement.setAttribute("points", points);
    newElement.style.strokeDasharray = dash;
    newElement.style.strokeDashoffset = dash;
    svg.appendChild(newElement);

    // draw socket/circle
    newElement = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    newElement.setAttribute("class", "socket");
    newElement.setAttribute("cx", points[lastIndex].x + moveCircleH * strokeWidth * slopeFix);
    newElement.setAttribute("cy", points[lastIndex].y + moveCircleV * strokeWidth * slopeFix);
    newElement.setAttribute("r", strokeWidth);
    newElement.setAttribute("stroke-width", strokeWidth / 2);
    svg.appendChild(newElement);
}

/* shiftPointsH() shifts points horizontally, given length */
var shiftPointsH = function (points, length) {
    for (var i = 0; i < points.length; i++) {
        points[i].x += length;
    }
    return points;
}

/* shiftPointsH() shifts points vertically, given length */
var shiftPointsV = function (points, length) {
    for (var i = 0; i < points.length; i++) {
        points[i].y += length;
    }
    return points;
}

/* symmetryH() symmetry points horizontally, by the screen width*/
var symmetryH = function (points) {
    for (var i = 0; i < points.length; i++) {
        points[i].x = screenWidth - points[i].x;
    }
    return points;
}

/* reverse() will reverse an array of points */
// e.g. a = [(4,2),(2,3)];
//      reverse(a) = [(2,3),(4,2)];
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

var copyPoints = function(points){
    var copiedPoints = [];
    for(let i=0; i<points.length; i++){
        var p = new Point(points[i].x, points[i].y);
        copiedPoints.push(p);
    }
    return copiedPoints;
}

var distance = function(p1, p2){
    return Math.sqrt(Math.pow(p1.x-p2.x, 2) + Math.pow(p1.y-p2.y, 2));
}