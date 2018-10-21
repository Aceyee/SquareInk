var mainPage = {
    onCreate2: function () {
        var chipMainOffset = $('#chipMain').offset();
        var chipMainWidth = $('#chipMain').width();
        var chipMainHeight = $('#chipMain').height();
        var chipMainX1 = chipMainOffset.left;
        var chipMainX2 = chipMainOffset.left + chipMainWidth;
        var chipMainY1 = chipMainOffset.top + chipMainHeight;
        var chipMainY2 = chipMainY1;

        var svg = document.getElementsByTagName('svg')[0]; //Get svg element

        /*Bottom Line*/
        var d = chipMainWidth / 2;
        var slopeLength = Math.sqrt(2)*d;
        var botX1 = chipMainX1 - d;
        var botX2 = chipMainX2 + d;

        // var botX2 = $(window).width();
        var botY1 = $(window).height();
        var botY2 = botY1;

        var count = 10;
        var deltaChipMainX = chipMainWidth / count;
        var deltaX = $(window).width() / count;
        var middlePointX = botX1;
        var middlePointY = botY1 - (botY1 - chipMainY1 - d)/2;

        var svg = document.getElementsByTagName('svg')[0]; //Get svg element

        var points = [botX1, botY1,
            middlePointX, middlePointY, 
            middlePointX+d, middlePointY-d,
            chipMainX1, chipMainY1];

        var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'polyline'); //Create a path in SVG's namespace
        newElement.setAttribute("class", "draw");
        newElement.setAttribute("points", points);
        svg.appendChild(newElement);

        // for(var i=0; i<count+1; i++){
        //     var points = [botX1+deltaX*i, botY1, chipMainX1+deltaChipMainX*i, chipMainY1];
        //     var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'polyline'); //Create a path in SVG's namespace
        //     newElement.setAttribute("class", "draw");
        //     newElement.setAttribute("points", points);
        //     svg.appendChild(newElement);
        // }

        // alert(chipMainX1+", "+chipMainY1+"   "+ chipMainX2+", "+chipMainY2);        
    },
    onCreate: function () {
        var points = [
            168, 123,
            187, 378,
            261, 375,
            279, 248,
            367, 247,
            380, 370,
            477, 387,
            527, 268,
            534, 150,
            566, 355,
            616, 364,
            653, 338,
            647, 110,
            580, 116,
            570, 220,
            538, 113,
            502, 122,
            473, 260,
            452, 320,
            416, 313,
            391, 185,
            296, 191,
            248, 215,
            239, 321,
            224, 318,
            194, 125,
            188, 123];
        var svg = document.getElementsByTagName('svg')[0]; //Get svg element
        for (var i = 0; i < 3; i++) {
            var shift = 5;
            for (var j = 0; j < points.length; j++) {
                if (j % 2 == 0) {
                    points[j] += shift;
                }
            }
            var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'polyline'); //Create a path in SVG's namespace
            newElement.setAttribute("class", "draw");
            newElement.setAttribute("points", points);
            svg.appendChild(newElement);
        }
    }
}