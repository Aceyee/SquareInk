var strokeWidth = 5;
var screenWidth;
var screenHeight;
var ctx;
var detailPath;
var detailPath2;
var detailPath3;

var LeftBotX;
var LeftBotY;

var division = 25;
var circle;
var circle2;
var circle3;

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

function Circle(x, y, dx, dy, radius, detailPath) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.detailPath = detailPath;
    this.index = 0;
    this.sequence;

    this.draw = function () {
        var grd = ctx.createRadialGradient(this.x, this.y, this.radius / 2, this.x, this.y, this.radius);
        grd.addColorStop(0, 'hsla(180, 100%, 75%, 1)');
        grd.addColorStop(1, 'hsla(180, 100%, 75%, 0)');

        ctx.beginPath();
        ctx.fillStyle = grd;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();

        var followRadius = this.radius - 1;
        if (this.sequence.length > 0) {
            for (var i = 0; i < this.sequence.length; i += 2) {
                var grd2 = ctx.createRadialGradient(this.detailPath[this.sequence[i]], this.detailPath[this.sequence[i + 1]], followRadius / 2, this.detailPath[this.sequence[i]], this.detailPath[this.sequence[i + 1]], followRadius);
                grd2.addColorStop(0, 'hsla(180, 100%, 75%, 1)');
                grd2.addColorStop(1, 'hsla(180, 100%, 75%, 0)');

                ctx.fillStyle = grd2;
                ctx.arc(this.detailPath[this.sequence[i]], this.detailPath[this.sequence[i + 1]], followRadius, 0, Math.PI * 2, false);
                ctx.fill();
                followRadius -= 1;
            }
        }
    }


    this.update = function () {
        this.x = this.detailPath[this.index];
        this.y = this.detailPath[this.index + 1];
        this.sequence = [];
        if (this.index < this.detailPath.length - 2) {
            for (var i = this.index - 2; i > this.index - 10; i -= 2) {
                if (i >= 0 && i < this.detailPath.length) {
                    this.sequence.push(i);
                    this.sequence.push(i + 1);
                }
            }
            this.draw();
            this.index += 2;
        } else {
            this.index = 0;
            // circle = new Circle(0, 0, 1, 1, strokeWidth, detailPath);  

        }
    }
}

var animate = function () {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, screenWidth, screenHeight);
    circle.update();
    circle2.update();
    circle3.update();
}

var symmetryH = function (points) {
    for (var i = 0; i < points.length; i++) {
        if (i % 2 == 0) {
            points[i] = screenWidth - points[i];
        }
    }
    return points;
}

var createPath = function (startX, startY, directionH, directionV) {
    var points = [];
    points.push(startX, startY);
    startCreatePath(points, startX, startY, directionH, directionV);
    points = reverse(points);
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

var startCreatePath = function (points, currX, currY, directionH, directionV) {
    var length = 50;
    var moveX = Math.random() > 0.5 ? true : false;
    var moveY = Math.random() > 0.5 ? true : false;
    var end = false;
    var zeroX = 0;
    var zeroY = 0;

    if (!moveX && !moveY) {
        moveX = true;
        moveY = true;
    }

    if (moveX) {
        var nextX = currX + directionH * length;
        if (nextX > 0 && nextX < screenWidth) {
            currX = nextX;
        } else {
            if (directionH > 0) {
                zeroX = screenWidth - currX;
                currX = screenWidth;
            } else {
                zeroX = currX;
                currX = 0;
            }
            end = true;
        }
    }

    if (moveY) {
        var nextY = currY + directionV * length;
        if (nextY > 0 && nextY < screenHeight) {
            currY = nextY;
        } else {
            if (directionV > 0) {
                zeroY = screenHeight - currY;
                currY = screenHeight;
            } else {
                zeroY = currY;
                currY = 0;
            }
            end = true;
        }
    }

    if (moveX && moveY) {
        if (zeroX > 0) {
            currY = currY + directionV * length - zeroX;
        }

        if (zeroY > 0) {
            currX = currX - directionH * length - zeroY;
        }
    }

    points.push(currX, currY);
    if (!end) {
        startCreatePath(points, currX, currY, directionH, directionV);
    }
}

var mainPage = {
    onCreate: function () {
        screenWidth = $(window).width();
        screenHeight = $(window).height();
        var c = document.getElementById("myCanvas");
        c.setAttribute('width', screenWidth);
        c.setAttribute('height', screenHeight);
        ctx = c.getContext("2d");

        this.drawTopLine();
        this.drawSideLine();
    },

    drawSideLine: function () {
        circle = new Circle(0, 0, 1, 1, strokeWidth, detailPath);
        circle2 = new Circle(0, 0, 1, 1, strokeWidth, detailPath2);
        circle3 = new Circle(0, 0, 1, 1, strokeWidth, detailPath3);
        
        setTimeout(animate, 3000);
    },

    drawTopLine: function () {
        var svg = document.getElementsByTagName('svg')[0]; //Get svg element

        var chipMainBorder = 50;
        var chipMainOffset = $('#chipMain').offset();
        var chipMainWidth = $('#chipMain').width();
        var chipMainHeight = $('#chipMain').height();

        var chipMainLeft = chipMainOffset.left;
        var chipMainRight = screenWidth -chipMainLeft;
        var chipMainTop =  chipMainOffset.top - chipMainBorder;
        var chipMainBot = screenHeight - chipMainTop;

        var d = 20;
        var count = 9;

        /*Bottom Left Circuit*/
        var botLeftX = chipMainLeft - d;
        var botY = screenHeight;

        var deltaChipMainX = chipMainWidth / count;
        var middlePointX = botLeftX;
        var middlePointY = botY - (botY - chipMainBot - d) / 2;
        var dash = (botY - middlePointY) + (Math.sqrt(2) * d) + ((middlePointY - d) - chipMainBot);

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

        var pathPoints = createPath(LeftBotX, LeftBotY, -1, 1);
        var pathPoints2 = [];
        var pathPoints3 = [];
        for(var i =0; i <pathPoints.length; i++){
            if(i%2==1){
                pathPoints2.push(pathPoints[i] - deltaChipMainX);
                pathPoints3.push(pathPoints[i]-2 * deltaChipMainX);
            }else{
                pathPoints2.push(pathPoints[i]);
                pathPoints3.push(pathPoints[i]);
            }
        }

        detailPath = calcWaypoints(pathPoints);
        detailPath2 = calcWaypoints(pathPoints2);
        detailPath3 = calcWaypoints(pathPoints3);

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
        var points = [chipMainLeft + deltaChipMainX * 4, screenHeight,
        chipMainLeft + deltaChipMainX * 4, chipMainBot];
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
        var topLeftX = chipMainLeft - d;
        var topY1 = 0;
        var chipMainTopY1 = chipMainOffset.top - chipMainBorder;
        var middlePointX = topLeftX;
        var middlePointY = (chipMainOffset.top - chipMainBorder) / 2;

        var points = [topLeftX, topY1,
            middlePointX, middlePointY,
            middlePointX + d, middlePointY + d,
            chipMainLeft, chipMainTopY1];

        drawTopSecond(svg, points, dash, deltaChipMainX, 1, -1);

        var LeftTopX = LeftBotX;
        var LeftTopY = screenHeight - LeftBotY;


        /*Top right Circuit*/
        var topX2 = screenWidth - topLeftX;
        var topY2 = 0;
        var chipMainTopY2 = chipMainTopY1;

        var middlePointX = topX2;
        var middlePointY = (chipMainOffset.top - chipMainBorder) / 2;

        var points = [topX2, topY2,
            middlePointX, middlePointY,
            middlePointX - d, middlePointY + d,
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

        var topX2 = LeftTopX - deltaChipMainX;
        var topY2 = 0;
        var middlePointX = topX2;
        var middlePointY = LeftTopY - deltaChipMainX;

        var points1 = [topX2, topY2,
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

        var points3 = [LeftTopX, LeftTopY,
            middlePointX, middlePointY,
            middlePointX, LeftTopY - 4 * deltaChipMainX,
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
            middlePointX, LeftTopY - 5 * deltaChipMainX,
            topX3, topY3];
        points3 = reverse(points3);
        dash = LeftTopY - 4 * deltaChipMainX + Math.sqrt(2) * (2 + 3) * deltaChipMainX;
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