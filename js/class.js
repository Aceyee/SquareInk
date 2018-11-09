/**
 *  Name: class.js
 *  Author: Zihan Ye
 *  Description: Create helper classes such as Chip and Point
 *      for easier conductions
 */

/* Chip class is used to calculate and store the positions and offsets
    of chips such as main chip, switch chip, and message board chip*/
class Chip {
    /* id is passed as parameter to determine if is is main chip, 
        switch chip, or message board chip*/
    constructor(id) {
        this.id = id;
        this.getOffset();
    }

    /* getOffset get the offset, width, and height of that chip */
    getOffset(id = this.id) {
        this.border = 25;
        this.offset = $('#' + id).offset();
        this.width = $('#' + id).width();
        this.height = $('#' + id).height();
        this.getOffsetDetail();
    }

    /* getOffsetDetail get the border position of each chip. */
    // left, right, top, and bottom
    getOffsetDetail(offset = this.offset, border = this.border) {
        this.left = offset.left;
        this.right = screenWidth - this.left;
        this.top = offset.top;
        this.bottom = screenHeight - this.top;
        this.getCorner();
    }

    /* getCorner get the corner's position as a Point */
    getCorner() {
        this.topLeft = new Point(this.left, this.top);
        this.topRight = new Point(this.right, this.top);
        this.botLeft = new Point(this.left, this.bottom);
        this.botRight = new Point(this.right, this.bottom);
    }
}

/* Point class contains x, y, and toString() */
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return this.x + " " + this.y;
    }
}