var mainPage = {
    onCreate2: function () {
        var screenWidth = $(window).width();
        var screenHeight = $(window).height();

        var chipMainBorder = 10;
        var chipMainOffset = $('#chipMain').offset();
        var chipMainWidth = $('#chipMain').width();
        var chipMainHeight = $('#chipMain').height();
        var chipMainX1 = chipMainOffset.left;
        var chipMainX2 = screenWidth - chipMainOffset.left;
        var chipMainY1 = chipMainOffset.top + chipMainHeight + chipMainBorder;
        var chipMainY2 = chipMainY1;

        var svg = document.getElementsByTagName('svg')[0]; //Get svg element

        /*Bottom Circuit*/
        var d = chipMainWidth / 2;
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

        for (var i = 0; i < 3; i++) {
            var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'polyline'); //Create a path in SVG's namespace
            newElement.setAttribute("class", "draw");
            newElement.setAttribute("points", points);
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
            var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'polyline'); //Create a path in SVG's namespace
            newElement.setAttribute("class", "draw");
            newElement.setAttribute("points", points);
            svg.appendChild(newElement);
            points = this.shiftPointsH(points, -1 * deltaChipMainX);
        }

        /*Left Circuit*/

        // for(var i=0; i<count+1; i++){
        //     var points = [botX1+deltaX*i, botY1, chipMainX1+deltaChipMainX*i, chipMainY1];
        //     var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'polyline'); //Create a path in SVG's namespace
        //     newElement.setAttribute("class", "draw");
        //     newElement.setAttribute("points", points);
        //     svg.appendChild(newElement);
        // }

        // alert(chipMainX1+", "+chipMainY1+"   "+ chipMainX2+", "+chipMainY2);        
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