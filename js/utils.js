/**
 *  Name: utils.js 
 *  Author: Zihan Ye
 *  Description: provided helper functions for canvas
 */

/* draw2Vertices() will draw a polygon that contains 2 vertices only */
var draw2Vertices = function (svg, points, dash, moveCircleDirection) {
    // draw polygon
    var lastIndex = points.length - 1;
    var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'polyline'); //Create a path in SVG's namespace
    newElement.setAttribute("class", "draw");
    newElement.setAttribute("points", points);
    newElement.style.strokeDasharray = dash;
    newElement.style.strokeDashoffset = dash;
    svg.appendChild(newElement);

    // draw socket/circle
    newElement = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    newElement.setAttribute("class", "socket");
    newElement.setAttribute("cx", points[lastIndex - 1]);
    newElement.setAttribute("cy", points[lastIndex] - moveCircleDirection * strokeWidth);
    newElement.setAttribute("r", strokeWidth);
    newElement.setAttribute("stroke-width", strokeWidth / 2);
    svg.appendChild(newElement);
}

/* draw2Vertices() will draw a polygon that contains 3 vertices */
var draw3Vertices = function (svg, points, dash, moveCircleDirection) {
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
    newElement.setAttribute("cx", points[lastIndex - 1] + 0.5 * Math.sqrt(2) * moveCircleDirection * strokeWidth);
    newElement.setAttribute("cy", points[lastIndex] + 0.5 * Math.sqrt(2) * strokeWidth);
    newElement.setAttribute("r", strokeWidth);
    newElement.setAttribute("stroke-width", strokeWidth / 2);
    svg.appendChild(newElement);
}

/* draw2Vertices() will draw a polygon that contains 4 vertices */
var draw4Vertices = function (svg, points, dash, moveCircleH, moveCircleV, slopeFix) {
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
    newElement.setAttribute("cx", points[lastIndex - 1] + moveCircleH * strokeWidth * slopeFix);
    newElement.setAttribute("cy", points[lastIndex] + moveCircleV * strokeWidth * slopeFix);
    newElement.setAttribute("r", strokeWidth);
    newElement.setAttribute("stroke-width", strokeWidth / 2);
    svg.appendChild(newElement);
}

/* shiftPointsH() shifts points horizontally, given length */
var shiftPointsH = function (points, length) {
    for (var i = 0; i < points.length; i++) {
        if (i % 2 == 0) {
            points[i] += length;
        }
    }
    return points;
}

/* symmetryH() symmetry points horizontally, by the screen width*/
var symmetryH = function (points) {
    for (var i = 0; i < points.length; i++) {
        if (i % 2 == 0) {
            points[i] = screenWidth - points[i];
        }
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