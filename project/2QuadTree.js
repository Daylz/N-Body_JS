class QuadTree {
    constructor(range, capacity) {
        this.range = range;
        this.capacity = capacity;

        this.points = []
    }

    insert(point) {
        if (!this.range.contains(point)) {
            return false;
        }

        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        }

        if (this.northWest == null) {
            this.subdivide();
        }

        return (this.northWest.insert(point) || this.northEast.insert(point)
            || this.southWest.insert(point) || this.southEast.insert(point));
    }

    subdivide() {
        let x = this.range.x;
        let y = this.range.y;
        let w = this.range.w;
        let h = this.range.h;

        let nw = new Rectangle(x, y, w / 2, h / 2);
        this.northWest = new QuadTree(nw, this.capacity);
        let ne = new Rectangle(x + w / 2, y, w / 2, h / 2);
        this.northEast = new QuadTree(ne, this.capacity);
        let sw = new Rectangle(x, y + h / 2, w / 2, h / 2);
        this.southWest = new QuadTree(sw, this.capacity);
        let se = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2);
        this.southEast = new QuadTree(se, this.capacity);
    }

    query(range, found) {
        if (!found) {
            found = [];
        }

        if (!this.range.intersects(range)) {
            return found;
        }

        for (let point of this.points) {
            if (range.contains(this.points[i])) {
                found.push(this.points[i]);
            }
        }

        if (this.northWest == null) {
            return found;
        }

        this.northWest.query(range, found);
        this.northEast.query(range, found);
        this.southWest.query(range, found);
        this.southEast.query(range, found);

        return found;
    }
}

class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    contains(point) {
        return !(point.x < this.x
            || point.x >= this.x + this.w
            || point.y < this.y
            || point.y >= this.y + this.h)
    }

    intersects(other) {
        return !(other.x > this.x + this.w
            || other.y > this.y + this.h
            || other.x + other.w < this.x
            || other.y + other.h < this.y);
    }
}

class Circle {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.rSquared = this.r * this.r;
    }

    contains(point) {
        let d = Math.pow((point.x - this.x), 2) + Math.pow((point.y - this.y), 2);
        return d <= this.rSquared;
    }

    intersects(range) {
        let xDist = Math.abs(range.x - this.x);
        let yDist = Math.abs(range.y - this.y);

        // radius of the circle
        let r = this.r;

        let w = range.w;
        let h = range.h;

        let edges = Math.pow((xDist - w), 2) + Math.pow((yDist - h), 2);

        // no intersection
        if (xDist > (r + w) || yDist > (r + h))
            return false;

        // intersection within the circle
        if (xDist <= w || yDist <= h)
            return true;

        // intersection on the edge of the circle
        return edges <= this.rSquared;
    }
}