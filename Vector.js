export default class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    concat(vec) {
        return new Vector(this.x + vec.x, this.y + vec.y);
    }
}
