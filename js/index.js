var t = 1;
var breakpoints;
var strokeWidth = 5;
var screenWidth;
var screenHeight;
var ctx;
var detailPath;
var division = 25;

var drawBotLeft = function (svg, points, dash, deltaChipMainX, shiftDirection, moveCircleDirection) {
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

var shiftPointsH = function (points, deltaChipMainX) {
    for (var i = 0; i < points.length; i++) {
        if (i % 2 == 0) {
            points[i] += deltaChipMainX;
        }
    }
    return points;
}

var calcWaypoints= function (vertices) {
    var waypoints = [];
    var end = false;
    for (var i = 0; i < vertices.length-2; i+=2) {
        var pt1X = vertices[i];
        var pt1Y = vertices[i+1];

        var pt2X = vertices[i+2];
        var pt2Y = vertices[i+3];

        var dx = pt2X- pt1X;
        var dy = pt2Y - pt1Y;

        for (var j = 0; j < division; j++) {
            var x = pt1X + dx * j / division;
            if(x<0){
                x=0;
                end=true;
            }
            waypoints.push(x);
            var y = pt1Y + dy * j / division;
            if(y<0){
                y=0;
                end=true;
            }
            waypoints.push(y);
            if(end){
                break;
            }
        
        }
        if(end){
            break;
        }
    }
    return (waypoints);
}

function Circle2(x, y, dx, dy, radius, detailPath) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.detailPath = detailPath;
    this.index = 0;
    this.sequence;

    this.draw = function () {
        // var grd = ctx.createLinearGradient(75,50,5,90,60,100);
        var grd = ctx.createRadialGradient(this.x, this.y, this.radius / 2, this.x, this.y, this.radius);
        grd.addColorStop(0, 'hsla(180, 100%, 75%, 1)');
        grd.addColorStop(1, 'hsla(180, 100%, 75%, 0)');

        ctx.fillStyle = grd;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();

        if(this.sequence.length>0){
            var grd2 = ctx.createRadialGradient(this.detailPath[this.sequence[0]], this.detailPath[this.sequence[1]], this.radius / 2,this.detailPath[this.sequence[0]], this.detailPath[this.sequence[1]], this.radius);
            grd2.addColorStop(0, 'hsla(180, 100%, 75%, 1)');
            grd2.addColorStop(1, 'hsla(180, 100%, 75%, 0)');

            ctx.fillStyle = grd2;
            ctx.arc(this.detailPath[this.sequence[0]],  this.detailPath[this.sequence[1]], this.radius, 0, Math.PI * 2, false);
            ctx.fill();
        }
            
        // ctx.lineTo(this.x-100, this.y+100);
    }

    this.update = function () {
        // console.log();
        this.x = this.detailPath[this.index];
        this.y = this.detailPath[this.index+1];
        this.sequence = [];
        if(this.index<this.detailPath.length-2){
            for(var i=this.index-4; i<this.index; i+=2){
                if(i>=0 &&i<this.detailPath.length){
                    this.sequence.push(i);
                    this.sequence.push(i+1);
                }
            }
            this.draw();
            this.index+=2;
        }else{
            
        }
    }
}

var circle2;
var animate3 = function(){
    requestAnimationFrame(animate3);
    ctx.clearRect(0, 0, screenWidth, screenHeight);
    circle2.update();
}

var createPath = function (startX, startY, directionH, directionV) {
    // alert(startX+" "+stratY);
    var points = [];
    // console.log(length);
    points.push(startX,startY);
    startCreatePath(points, startX, startY, directionH, directionV);
    points = reverse(points);
    return points;
}

var reverse = function(points){
    var reversePoints = [];
    for(var i=0; i<points.length-1; i+=2){
        var x = points[i];
        var y = points[i+1];
        reversePoints.unshift(y);
        reversePoints.unshift(x);
    }
    return reversePoints;
}

var startCreatePath = function (points, currX, currY, directionH, directionV) {
    var length = Math.random() * 50 + 25;
    var moveX = Math.random()>0.5 ? true:false;
    var moveY = Math.random()>0.5 ? true:false;
    var end = false;
    var zeroX=0;
    var zeroY=0;

    if(!moveX && !moveY){
        moveX=true;
        moveY=true;
    }

    if(moveX){
        var nextX = currX + directionH * length;
        if (nextX>0 && nextX<screenWidth) {
            currX = nextX;
        }else{
            if(directionH>0){
                zeroX = screenWidth - currX;
                currX = screenWidth;
            }else{
                zeroX = currX;  
                currX = 0;
            }
            end = true;
        }
    }

    if(moveY){
        var nextY = currY + directionV * length;
        if(nextY>0 && nextY<screenHeight){
            currY = nextY;
        }else{
            if(directionV>0){
                zeroY = screenHeight-currY;
                currY = screenHeight;
            }else{
                zeroY = currY;
                currY = 0;
            }
            end = true;
        }
    }

    
    if(moveX && moveY){
        if(zeroX>0){
            currY = currY + directionV* length - zeroX;
        }
    
        if(zeroY>0){
            currX = currX - directionH* length - zeroY;
        }
    }

    points.push(currX, currY);
    if(!end){
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
        // ctx.strokeStyle = "aqua";

        this.drawTopDownLine();
        // this.drawTest(ctx);
        this.drawSideLine();
    },

    drawSideLine: function () {
        animate3();
    },

    drawTopDownLine: function () {
        var chipMainBorder = 50;
        var chipMainOffset = $('#chipMain').offset();
        var chipMainWidth = $('#chipMain').width();
        var chipMainHeight = $('#chipMain').height();

        var chipMainX1 = chipMainOffset.left;
        var chipMainX2 = screenWidth - chipMainOffset.left;
        var chipMainY1 = chipMainOffset.top + chipMainHeight + chipMainBorder;
        var chipMainY2 = chipMainY1;

        var svg = document.getElementsByTagName('svg')[0]; //Get svg element

        var d = 20;
        var count = 9;

        /*Bottom Left Circuit*/
        var botX1 = chipMainX1 - d;
        var botY1 = screenHeight;

        var deltaChipMainX = chipMainWidth / count;
        var middlePointX = botX1;
        var middlePointY = botY1 - (botY1 - chipMainY1 - d) / 2;

        var points = [botX1, botY1,
            middlePointX, middlePointY,
            middlePointX + d, middlePointY - d,
            chipMainX1, chipMainY1];
        var dash = (botY1 - middlePointY) + (Math.sqrt(2) * d) + ((middlePointY - d) - chipMainY1);
        drawBotLeft(svg, points, dash, deltaChipMainX, 1, 1);

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
        
        detailPath = calcWaypoints(pathPoints);
        for(var i=0; i<detailPath.length; i++){
            // console.log(detailPath[i]);
        }
        circle2 = new Circle2(0, 0, 1, 1, strokeWidth+10, detailPath);



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

        /*Bottom Right Circuit*/
        var botX2 = screenWidth - botX1;
        var botY2 = botY1;
        middlePointX = screenWidth - middlePointX;
        points = [botX2, botY2,
            middlePointX, middlePointY,
            middlePointX - d, middlePointY - d,
            chipMainX2, chipMainY2
        ];
        drawBotLeft(svg, points, dash, deltaChipMainX, -1, 1);


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
        var topX1 = chipMainX1 - d;
        var topY1 = 0;
        var chipMainTopY1 = chipMainOffset.top - d;
        var middlePointX = topX1;
        var middlePointY = (chipMainOffset.top - d) / 2;

        var points = [topX1, topY1,
            middlePointX, middlePointY,
            middlePointX + d, middlePointY + d,
            chipMainX1, chipMainTopY1];

        drawBotLeft(svg, points, dash, deltaChipMainX, 1, -1);

        /*
        var LeftTopX = LeftBotX;
        var LeftTopY = screenHeight-LeftBotY;

        for (var i = 0; i < 3; i++) {
            var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
            newElement.setAttribute("class", "socket");
            newElement.setAttribute("cx", LeftTopX);
            newElement.setAttribute("cy", LeftTopY+deltaChipMainX*i);
            newElement.setAttribute("r", strokeWidth);
            svg.appendChild(newElement);
        }*/

        /*Top right Circuit*/
        var topX2 = screenWidth - topX1;
        var topY2 = 0;
        var chipMainTopY2 = chipMainTopY1;

        var middlePointX = topX2;
        var middlePointY = (chipMainOffset.top - d) / 2;

        var points = [topX2, topY2,
            middlePointX, middlePointY,
            middlePointX - d, middlePointY + d,
            chipMainX2, chipMainTopY2];

        drawBotLeft(svg, points, dash, deltaChipMainX, -1, -1);

        /*Right Top Circuit*/

        /*
        var RightTopX = screenWidth- LeftTopX;
        var RightTopY = LeftTopY;

        for (var i = 0; i < 3; i++) {
            var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
            newElement.setAttribute("class", "socket");
            newElement.setAttribute("cx", RightTopX);
            newElement.setAttribute("cy", RightTopY+deltaChipMainX*i);
            newElement.setAttribute("r", strokeWidth);
            svg.appendChild(newElement);
        }*/
    },

    drawTest: function (ctx) {
        // ctx.save();
        // ctx.beginPath();
        // ctx.moveTo(0,0);
        // ctx.lineTo(300,150);
        // ctx.stroke();
        // ctx.restore();

        var vertices = [];
        vertices.push({
            x: 0,
            y: 0
        });
        vertices.push({
            x: 300,
            y: 100
        });
        vertices.push({
            x: 80,
            y: 200
        });
        vertices.push({
            x: 10,
            y: 100
        });
        vertices.push({
            x: 0,
            y: 0
        });

        ctx.lineWidth = 1;
        // tell canvas you are beginning a new path
        ctx.beginPath();
        // draw the path with moveTo and multiple lineTo's
        ctx.moveTo(0, 0);
        ctx.lineTo(300, 100);
        ctx.lineTo(80, 200);
        ctx.lineTo(10, 100);
        ctx.lineTo(0, 0);
        // stroke the path
        ctx.stroke();


        ctx.lineWidth = 5;
        // calculate incremental points along the path
        breakpoints = this.calcWaypoints(vertices);
        // extend the line from start to finish with animation
        // animate();
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
    },

    onCreate2: function () {
        /* super inefficient right now, could be improved */
        var screenWidth = $(window).width();
        var screenHeight = $(window).height();

        var c = document.getElementById('myCanvas'),
            ctx = c.getContext('2d'),
            cw = c.width = screenWidth,
            ch = c.height = screenHeight,
            rand = function (a, b) { return ~~((Math.random() * (b - a + 1)) + a); },
            dToR = function (degrees) {
                return degrees * (Math.PI / 180);
            },
            circle = {
                x: (cw / 2) + 5,
                y: (ch / 2) + 22,
                radius: 90,
                speed: 2,
                rotation: 0,
                angleStart: 270,
                angleEnd: 90,
                hue: 220,
                thickness: 18,
                blur: 25
            },
            particles = [],
            particleMax = 100,
            updateCircle = function () {
                if (circle.rotation < 360) {
                    circle.rotation += circle.speed;
                } else {
                    circle.rotation = 0;
                }
            },
            renderCircle = function () {
                ctx.save();
                ctx.translate(circle.x, circle.y);
                ctx.rotate(dToR(circle.rotation));
                ctx.beginPath();
                ctx.arc(0, 0, circle.radius, dToR(circle.angleStart), dToR(circle.angleEnd), true);
                ctx.lineWidth = circle.thickness;
                ctx.strokeStyle = gradient1;
                ctx.stroke();
                ctx.restore();
            },
            renderCircleBorder = function () {
                ctx.save();
                ctx.translate(circle.x, circle.y);
                ctx.rotate(dToR(circle.rotation));
                ctx.beginPath();
                ctx.arc(0, 0, circle.radius + (circle.thickness / 2), dToR(circle.angleStart), dToR(circle.angleEnd), true);
                ctx.lineWidth = 2;
                ctx.strokeStyle = gradient2;
                ctx.stroke();
                ctx.restore();
            },
            renderCircleFlare = function () {
                ctx.save();
                ctx.translate(circle.x, circle.y);
                ctx.rotate(dToR(circle.rotation + 185));
                ctx.scale(1, 1);
                ctx.beginPath();
                ctx.arc(0, circle.radius, 30, 0, Math.PI * 2, false);
                ctx.closePath();
                var gradient3 = ctx.createRadialGradient(0, circle.radius, 0, 0, circle.radius, 30);
                gradient3.addColorStop(0, 'hsla(330, 50%, 50%, .35)');
                gradient3.addColorStop(1, 'hsla(330, 50%, 50%, 0)');
                ctx.fillStyle = gradient3;
                ctx.fill();
                ctx.restore();
            },
            renderCircleFlare2 = function () {
                ctx.save();
                ctx.translate(circle.x, circle.y);
                ctx.rotate(dToR(circle.rotation + 165));
                ctx.scale(1.5, 1);
                ctx.beginPath();
                ctx.arc(0, circle.radius, 25, 0, Math.PI * 2, false);
                ctx.closePath();
                var gradient4 = ctx.createRadialGradient(0, circle.radius, 0, 0, circle.radius, 25);
                gradient4.addColorStop(0, 'hsla(30, 100%, 50%, .2)');
                gradient4.addColorStop(1, 'hsla(30, 100%, 50%, 0)');
                ctx.fillStyle = gradient4;
                ctx.fill();
                ctx.restore();
            },
            createParticles = function () {
                if (particles.length < particleMax) {
                    particles.push({
                        x: (circle.x + circle.radius * Math.cos(dToR(circle.rotation - 85))) + (rand(0, circle.thickness * 2) - circle.thickness),
                        y: (circle.y + circle.radius * Math.sin(dToR(circle.rotation - 85))) + (rand(0, circle.thickness * 2) - circle.thickness),
                        vx: (rand(0, 100) - 50) / 1000,
                        vy: (rand(0, 100) - 50) / 1000,
                        radius: rand(1, 6) / 2,
                        alpha: rand(10, 20) / 100
                    });
                }
            },
            updateParticles = function () {
                var i = particles.length;
                while (i--) {
                    var p = particles[i];
                    p.vx += (rand(0, 100) - 50) / 750;
                    p.vy += (rand(0, 100) - 50) / 750;
                    p.x += p.vx;
                    p.y += p.vy;
                    p.alpha -= .01;

                    if (p.alpha < .02) {
                        particles.splice(i, 1)
                    }
                }
            },
            renderParticles = function () {
                var i = particles.length;
                while (i--) {
                    var p = particles[i];
                    ctx.beginPath();
                    ctx.fillRect(p.x, p.y, p.radius, p.radius);
                    ctx.closePath();
                    ctx.fillStyle = 'hsla(0, 0%, 100%, ' + p.alpha + ')';
                }
            },
            clear = function () {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.fillStyle = 'rgba(0, 0, 0, .1)';
                ctx.fillRect(0, 0, cw, ch);
                ctx.globalCompositeOperation = 'lighter';
            }
        loop = function () {
            clear();
            updateCircle();
            renderCircle();
            renderCircleBorder();
            renderCircleFlare();
            renderCircleFlare2();
            createParticles();
            updateParticles();
            renderParticles();
        }

        /* Append Canvas */
        //document.body.appendChild(c);

        /* Set Constant Properties */
        ctx.shadowBlur = circle.blur;
        ctx.shadowColor = 'hsla(' + circle.hue + ', 80%, 60%, 1)';
        ctx.lineCap = 'round'

        var gradient1 = ctx.createLinearGradient(0, -circle.radius, 0, circle.radius);
        gradient1.addColorStop(0, 'hsla(' + circle.hue + ', 60%, 50%, .25)');
        gradient1.addColorStop(1, 'hsla(' + circle.hue + ', 60%, 50%, 0)');

        var gradient2 = ctx.createLinearGradient(0, -circle.radius, 0, circle.radius);
        gradient2.addColorStop(0, 'hsla(' + circle.hue + ', 100%, 50%, 0)');
        gradient2.addColorStop(.1, 'hsla(' + circle.hue + ', 100%, 100%, .7)');
        gradient2.addColorStop(1, 'hsla(' + circle.hue + ', 100%, 50%, 0)');

        /* Loop It, Loop It Good */
        setInterval(loop, 16);

    },

    myEndFunction: function () {
        // alert("end");
    },
}



