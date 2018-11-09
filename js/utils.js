/*  
    Name: utils.js  
    Author: Zihan Ye
    Date: 2018-11-08
    Description: provided helper functions for canvas
*/

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

var draw4Vertices = function (svg, points, dash, moveCircleH, moveCircleV, slopeFix) {
    var lastIndex = points.length - 1;

    var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'polyline'); //Create a path in SVG's namespace
    newElement.setAttribute("class", "draw");
    newElement.setAttribute("points", points);
    newElement.style.strokeDasharray = dash;
    newElement.style.strokeDashoffset = dash;
    svg.appendChild(newElement);

    newElement = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    newElement.setAttribute("class", "socket");
    newElement.setAttribute("cx", points[lastIndex - 1] + moveCircleH * strokeWidth * slopeFix);
    newElement.setAttribute("cy", points[lastIndex] + moveCircleV * strokeWidth * slopeFix);
    // newElement.setAttribute("cx", points[lastIndex - 1] + 0.5 * Math.sqrt(2) * moveCircleDirection * strokeWidth);
    // newElement.setAttribute("cy", points[lastIndex] + 0.5 * Math.sqrt(2) * strokeWidth);
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