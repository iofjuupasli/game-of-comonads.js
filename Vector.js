export default class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    concat(vec) {
        return new Vector(this.x + vec.x, this.y + vec.y);
    }

    isInBounds() {
        return this.x >= 0 && this.y >= 0 &&
            this.x < size && this.y < size;
    }
}
