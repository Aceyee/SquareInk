class Chip {
    constructor(id) {
        this.id = id;
        this.getOffset();
    }

    getOffset(id = this.id) {
        this.border = 25;
        this.offset = $('#' + id).offset();
        this.width = $('#' + id).width();
        this.height = $('#' + id).height();
        this.getOffsetDetail();
    }

    getOffsetDetail(offset = this.offset, border = this.border) {
        this.left = offset.left;
        this.right = screenWidth - this.left;
        this.top = offset.top;
        this.bottom = screenHeight - this.top;
        this.getCorner();
    }

    getCorner() {
        this.topLeft = new Point(this.left, this.top);
        this.topRight = new Point(this.right, this.top);
        this.botLeft = new Point(this.left, this.bottom);
        this.botRight = new Point(this.right, this.bottom);
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return this.x + " " + this.y;
    }
}