let WIDTH = 2560;
let HEIGHT = 1080;

let dampening = 100

let objects = new Array(1000);

let fpsCounter

function setup() {
    frameRate(60);
    createCanvas(WIDTH, HEIGHT);

    for (let i = 0; i < objects.length; i++) {
        objects[i] = new PObject(random() * WIDTH, random() * HEIGHT, 1, 0.1, false);
    }

    fpsCounter = new FPSCounter(10, 32, 32, 20);
}

function draw() {
    background(0);

    let quadTreeRange = new Rectangle(0, 0, WIDTH, HEIGHT);
    let quadTree = new QuadTree(quadTreeRange, 10);

    for (let i = 0; i < objects.length; i++) {
        quadTree.insert(objects[i]);

        objects[i].update();
        objects[i].draw();
        objects[i].resetForce();
    }

    for (let i = 0; i < objects.length; i++) {
        let objA = objects[i];

        let found = []
        let checkRange = new Circle(objA.x, objA.y, 128);
        quadTree.query(checkRange, found)

        for (let objB of found) {
            let posA = createVector(objA.x, objA.y);
            let posB = createVector(objB.x, objB.y);

            let distance = posA.dist(posB);
            let direction = p5.Vector.sub(posB, posA);
            let force = (objA.mass * objB.mass) / (distance * distance + dampening * dampening) * 100;
            direction.normalize();
            force = p5.Vector.mult(direction, force);
            objA.addForce(force);
            objB.addForce(force.mult(-1));
        }

        /*for (let j = i + 1; j < objects.length; j++) {
            let objB = objects[j];

            let distance = objA.pos.dist(objB.pos);
            let direction = p5.Vector.sub(objB.pos, objA.pos);
            let force = (objA.mass * objB.mass) / (distance * distance + dampening * dampening) * 100;
            direction.normalize();
            force = p5.Vector.mult(direction, force);
            objA.addForce(force);
            objB.addForce(force.mult(-1));
        }*/
    }

    // Framerate
    fpsCounter.show();
}