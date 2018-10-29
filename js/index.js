var strokeWidth = 5;
var screenWidth;
var screenHeight;
var ctx;
var detailPath;
var detailPath2;
var detailPath3;
var detailPath4;
var detailPath5;
var detailPath6;

var chipMainOffset;
var chipMainBorder;
var chipMainLeft;
var chipMainRight;
var chipMainTop;
var chipMainBot;
var chipMainWidth;
var chipMainHeight;
var deltaChipMainX;

var chipProject;
var chipProjectOffset;
var chipProjectBorder;
var chipProjectLeft;
var chipProjectRight;
var chipProjectTop;
var chipProjectBot;
var chipProjectWidth;
var chipProjectHeight;
var deltaChipProject;

var division = 100;

var drawTopSecond = function (svg, points, dash, deltaChipMainX, shiftDirection, moveCircleDirection) {
    var lastIndex = points.length - 1;
    for (var i = 0; i < 3; i++) {
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
        newElement.setAttribute("stroke-width", strokeWidth/2);
        svg.appendChild(newElement);

        /*deprecated */
        // ctx.beginPath();
        // ctx.arc(points[lastIndex - 1], points[lastIndex] - moveCircleDirection*strokeWidth, strokeWidth, 0, 2 * Math.PI);
        // ctx.stroke();
        points = shiftPointsH(points, shiftDirection * deltaChipMainX);
    }
    // newElement.addEventListener("webkitAnimationEnd", this.myEndFunction);
}

var drawTopThird = function (svg, points, dash, moveCircleDirection) {
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
    newElement.setAttribute("stroke-width", strokeWidth/2);
    svg.appendChild(newElement);
}

var shiftPointsH = function (points, deltaChipMainX) {
    for (var i = 0; i < points.length; i++) {
        if (i % 2 == 0) {
            points[i] += deltaChipMainX;
        }
    }
    return points;
}

var calcWaypoints = function (vertices) {
    var waypoints = [];
    var end = false;
    for (var i = 0; i < vertices.length - 2; i += 2) {
        var pt1X = vertices[i];
        var pt1Y = vertices[i + 1];

        var pt2X = vertices[i + 2];
        var pt2Y = vertices[i + 3];

        var dx = pt2X - pt1X;
        var dy = pt2Y - pt1Y;

        for (var j = 0; j < division; j++) {
            var x = pt1X + dx * j / division;
            if (x < 0) {
                x = 0;
                end = true;
            }
            waypoints.push(x);
            var y = pt1Y + dy * j / division;
            if (y < 0) {
                y = 0;
                end = true;
            }
            waypoints.push(y);
            if (end) {
                break;
            }

        }
        if (end) {
            break;
        }
    }
    return (waypoints);
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

var drawProjectLine = function(){
    // alert('adasda');
}

var setScrollAnimation = function(){
    $("a").on('click', function(event) {
        // Make sure this.hash has a value before overriding default behavior
        if (this.hash !== "") {
          // Prevent default anchor click behavior
          event.preventDefault();
    
          // Store hash
          var hash = this.hash;
    
          // Using jQuery's animate() method to add smooth page scroll
          // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
          $('html, body').animate({
            scrollTop: $(hash).offset().top
          }, 500, function(){
       
            // Add hash (#) to URL when done scrolling (default click behavior)
            window.location.hash = hash;
          });
        } // End if
      });
}

var mainPage = {
    onCreate: function () {
        // $(document).ready(function(){
        //     $(this).scrollTop(0);
        // });
        screenWidth = $(window).width();
        screenHeight = $(window).height();
        var c = document.getElementById("myCanvas");
        setScrollAnimation();
        // chipProject = document.getElementById("chipProject");
        // setTimeout(function(){
        //     chipProject.addEventListener("mouseover",function(){
        //         drawProjectLine();
        //     });
        // }, 3000);

        
        c.setAttribute('width', screenWidth);
        c.setAttribute('height', screenHeight);
        ctx = c.getContext("2d");

        this.drawTopLine();
        // this.drawSideLine();
    },

    drawTopLine: function () {
        var svg = document.getElementsByTagName('svg')[0]; //Get svg element

        chipMainBorder = 25;
        chipMainOffset = $('#chipMain').offset();
        chipMainWidth = $('#chipMain').width();
        chipMainHeight = $('#chipMain').height();

        chipMainLeft = chipMainOffset.left;
        chipMainRight = screenWidth - chipMainLeft;
        chipMainTop = chipMainOffset.top - chipMainBorder;
        chipMainBot = screenHeight - chipMainTop;

        // var d = 20;
        var count = 9;
        deltaChipMainX = chipMainWidth / count;

        /*Bottom Left Circuit*/
        var botLeftX = chipMainOffset.left - 0.5 * chipMainBorder;  ;
        var botY = screenHeight;

        var middlePointX = botLeftX;
        var middlePointY = botY - (botY - chipMainBot - deltaChipMainX) / 2;
        var dash = (botY - middlePointY) + (Math.sqrt(2) * deltaChipMainX) + ((middlePointY - deltaChipMainX) - chipMainBot);

        /*
        var points = [botLeftX, botY,
            middlePointX, middlePointY,
            middlePointX + d, middlePointY - d,
            chipMainLeft, chipMainBot];
        drawTopSecond(svg, points, dash, deltaChipMainX, 1, 1);*/

        /*Left Bottom Circuit */
        var LeftBotX = chipMainOffset.left - chipMainBorder;    
        var LeftBotY = chipMainOffset.top + chipMainHeight;
        /*
        for (var i = 0; i < 3; i++) {
            var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
            newElement.setAttribute("class", "socket");
            newElement.setAttribute("cx", LeftBotX);
            newElement.setAttribute("cy", LeftBotY - deltaChipMainX * i);
            newElement.setAttribute("r", strokeWidth);
            svg.appendChild(newElement);
        }*/


        // for (var i = 0; i < pathPoints.length; i++) {
        //     // console.log(pathPoints[i]);
        // }
        /*
        var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'polyline'); //Create a path in SVG's namespace
        newElement.setAttribute("class", "draw");
        newElement.setAttribute("points", pathPoints);
        // newElement.style.strokeDasharray = 1000;
        // newElement.style.strokeDashoffset = 1000;
        svg.appendChild(newElement);*/

        /*Bottom Center Circuit */
        var points = [botLeftX + 4* deltaChipMainX, screenHeight,
            botLeftX + 4*deltaChipMainX, chipMainBot];
        drawTopSecond(svg, points, screenHeight - chipMainBot, deltaChipMainX, 1, 1);

        /*Bottom Right Circuit*/
        var botX2 = screenWidth - botLeftX;
        var botY2 = botY;
        /*
        middlePointX = screenWidth - middlePointX;
        points = [botX2, botY2,
            middlePointX, middlePointY,
            middlePointX - d, middlePointY - d,
            chipMainRight, chipMainY2
        ];
        drawBotLeft(svg, points, dash, deltaChipMainX, -1, 1);
        */

        /* Right Bottom Circuit*/
        /*
        var RightBotX = screenWidth-LeftBotX;
        var RightBotY = LeftBotY;
        for (var i = 0; i < 3; i++) {
            var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
            newElement.setAttribute("class", "socket");
            newElement.setAttribute("cx", RightBotX);
            newElement.setAttribute("cy", RightBotY-deltaChipMainX*i);
            newElement.setAttribute("r", strokeWidth);
            svg.appendChild(newElement);
        }*/

        /*Top Left Circuit*/
        var topLeftX = chipMainLeft - deltaChipMainX;
        var topY1 = 0;
        var chipMainTopY1 = chipMainOffset.top - chipMainBorder;
        var middlePointX = topLeftX;
        var middlePointY = (chipMainOffset.top - chipMainBorder) / 2;

        var points = [topLeftX, topY1,
            middlePointX, middlePointY,
            middlePointX + deltaChipMainX, middlePointY + deltaChipMainX,
            chipMainLeft, chipMainTopY1];

        drawTopSecond(svg, points, dash, deltaChipMainX, 1, -1);

        var LeftTopX = LeftBotX;
        var LeftTopY = screenHeight - LeftBotY;


        /*Top right Circuit*/
        var topRightX = screenWidth - topLeftX;
        var topY2 = 0;
        var chipMainTopY2 = chipMainTopY1;

        var middlePointX = topRightX;
        var middlePointY = (chipMainOffset.top - chipMainBorder) / 2;

        var points = [topRightX, topY2,
            middlePointX, middlePointY,
            middlePointX - deltaChipMainX, middlePointY + deltaChipMainX,
            chipMainRight, chipMainTopY2];

        drawTopSecond(svg, points, dash, deltaChipMainX, -1, -1);

        /*Right Top Circuit*/
        var RightTopX = screenWidth - LeftTopX;
        var RightTopY = LeftTopY;

        /*
        for (var i = 0; i < 3; i++) {
            var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
            newElement.setAttribute("class", "socket");
            newElement.setAttribute("cx", RightTopX);
            newElement.setAttribute("cy", RightTopY + deltaChipMainX * i);
            newElement.setAttribute("r", strokeWidth);
            svg.appendChild(newElement);
        }*/

        var topRightX = LeftTopX - deltaChipMainX;
        var topY2 = 0;
        var middlePointX = topRightX;
        var middlePointY = LeftTopY - deltaChipMainX;

        var points1 = [topRightX, topY2,
            middlePointX, middlePointY,
            LeftTopX, LeftTopY]

        dash = (middlePointY - topY2) + Math.sqrt(2) * deltaChipMainX;
        drawTopThird(svg, points1, dash, 1);
        points1 = symmetryH(points1);
        drawTopThird(svg, points1, dash, -1);

        var topX3 = LeftTopX - 4 * deltaChipMainX;
        var topY3 = 0;
        LeftTopY += deltaChipMainX;
        var middlePointX = LeftTopX - 2 * deltaChipMainX;
        var middlePointY = LeftTopY - 2 * deltaChipMainX;
        var lengthBetween = LeftTopY - 2*2*deltaChipMainX;

        var points3 = [LeftTopX, LeftTopY,
            middlePointX, middlePointY,
            middlePointX, middlePointY-lengthBetween,
            topX3, topY3];
        points3 = reverse(points3);
        dash = LeftTopY - 4 * deltaChipMainX + 2 * Math.sqrt(2) * 2 * deltaChipMainX;
        drawTopThird(svg, points3, dash, 1);

        points3 = symmetryH(points3);
        drawTopThird(svg, points3, dash, -1);

        var topX3 = LeftTopX - 5 * deltaChipMainX;
        var topY3 = 0;
        LeftTopY += deltaChipMainX;
        var middlePointX = LeftTopX - 3 * deltaChipMainX;
        var middlePointY = LeftTopY - 3 * deltaChipMainX;

        var points3 = [LeftTopX, LeftTopY,
            middlePointX, middlePointY,
            middlePointX, middlePointY-lengthBetween,
            topX3, topY3];
        points3 = reverse(points3);
        dash = LeftTopY - (2 + 3) * deltaChipMainX + Math.sqrt(2) * (2 + 3) * deltaChipMainX;
        drawTopThird(svg, points3, dash, 1);
        points3 = symmetryH(points3);
        drawTopThird(svg, points3, dash, -1);
    },

    calcWaypoints: function (vertices) {
        var waypoints = [];
        for (var i = 1; i < vertices.length; i++) {
            var pt0 = vertices[i - 1];
            var pt1 = vertices[i];
            var dx = pt1.x - pt0.x;
            var dy = pt1.y - pt0.y;
            for (var j = 0; j < 100; j++) {
                var x = pt0.x + dx * j / 100;
                var y = pt0.y + dy * j / 100;
                waypoints.push({
                    x: x,
                    y: y
                });
            }
        }
        return (waypoints);
    }
}