var mainPage = {
    onCreate2: function () {
        var screenWidth = $(window).width();
        var screenHeight = $(window).height();

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
        /*Bottom Circuit*/
        
        var botX1 = chipMainX1 - d;
        var botY1 = screenHeight;

        var count = 9;
        var deltaChipMainX = chipMainWidth / count;
        var deltaX = screenWidth / count;
        var middlePointX = botX1;
        var middlePointY = botY1 - (botY1 - chipMainY1 - d) / 2;

        var svg = document.getElementsByTagName('svg')[0]; //Get svg element

        var points = [botX1, botY1,
            middlePointX, middlePointY,
            middlePointX + d, middlePointY - d,
            chipMainX1, chipMainY1];
        var dash = (botY1 - middlePointY)+(Math.sqrt(2)*d)+( (middlePointY - d)-chipMainY1);
        // alert(dash);

        var newElement;
        for (var i = 0; i < 3; i++) {
            newElement = document.createElementNS("http://www.w3.org/2000/svg", 'polyline'); //Create a path in SVG's namespace
            newElement.setAttribute("class", "draw");
            newElement.setAttribute("points", points);
            newElement.style.strokeDasharray=dash;
            newElement.style.strokeDashoffset=dash;
            svg.appendChild(newElement);
            points = this.shiftPointsH(points, deltaChipMainX);
        }

        var botX2 = screenWidth-botX1;
        var botY2 = botY1;
        middlePointX = screenWidth- middlePointX;
        points = [botX2, botY2,
            middlePointX, middlePointY,
            middlePointX-d, middlePointY-d,
            chipMainX2, chipMainY2
        ];
        for (var i = 0; i < 3; i++) {
            newElement = document.createElementNS("http://www.w3.org/2000/svg", 'polyline'); //Create a path in SVG's namespace
            newElement.setAttribute("class", "draw");
            newElement.setAttribute("points", points);
            newElement.style.strokeDasharray=dash;
            newElement.style.strokeDashoffset=dash;
            svg.appendChild(newElement);
            points = this.shiftPointsH(points, -1 * deltaChipMainX);
        }

        newElement.addEventListener("webkitAnimationEnd", this.myEndFunction);


        /*Top Circuit*/
        var topX1 = chipMainX1 - d;
        var topY1 = 0;
        var chipMainTopY1 = chipMainOffset.top -d;

        var middlePointX = topX1;
        var middlePointY = (chipMainOffset.top - d) / 2;
        // var middlePointY = (botY1 - chipMainY1 - d) / 2;
        

        var points = [topX1, topY1,
            middlePointX, middlePointY,
            middlePointX + d, middlePointY + d,
            chipMainX1, chipMainTopY1];
        // var dash = (botY1 - middlePointY)+(Math.sqrt(2)*d)+( (middlePointY - d)-chipMainY1);
        // alert(dash);

        var newElement;
        for (var i = 0; i < 3; i++) {
            newElement = document.createElementNS("http://www.w3.org/2000/svg", 'polyline'); //Create a path in SVG's namespace
            newElement.setAttribute("class", "draw");
            newElement.setAttribute("points", points);
            newElement.style.strokeDasharray=dash;
            newElement.style.strokeDashoffset=dash;
            svg.appendChild(newElement);
            points = this.shiftPointsH(points, deltaChipMainX);
        }


        var topX2 = screenWidth - topX1;
        var topY2 = 0;
        var chipMainTopY2 = chipMainTopY1;

        var middlePointX = topX2;
        var middlePointY = (chipMainOffset.top - d) / 2;
        // var middlePointY = (botY1 - chipMainY1 - d) / 2;
        

        var points = [topX2, topY2,
            middlePointX, middlePointY,
            middlePointX - d, middlePointY + d,
            chipMainX2, chipMainTopY2];
        // var dash = (botY1 - middlePointY)+(Math.sqrt(2)*d)+( (middlePointY - d)-chipMainY1);
        // alert(dash);

        var newElement;
        for (var i = 0; i < 3; i++) {
            newElement = document.createElementNS("http://www.w3.org/2000/svg", 'polyline'); //Create a path in SVG's namespace
            newElement.setAttribute("class", "draw");
            newElement.setAttribute("points", points);
            newElement.style.strokeDasharray=dash;
            newElement.style.strokeDashoffset=dash;
            svg.appendChild(newElement);
            points = this.shiftPointsH(points, -1*deltaChipMainX);
        }
    },

    myEndFunction : function(){
        // alert("end");
    },

    shiftPointsH: function (points, deltaChipMainX) {
        for (var i = 0; i < points.length; i++) {
            if (i % 2 == 0) {
                points[i] += deltaChipMainX;
            }
        }
        return points;
    }
}