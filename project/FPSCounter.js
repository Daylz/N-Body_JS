class FPSCounter {
    constructor(x, y, size = 20, bufferSize = 10) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.fps = new Array(bufferSize).fill(0);
        this.fpsIndex = 0;
    }

    update() {
        if (this.fpsIndex >= this.fps.length) {
            this.fpsIndex = 0;
        }

        this.fps[this.fpsIndex] = getFrameRate();
        this.fpsIndex++;
    }

    draw() {
        textSize(this.size)
        fill(255);
        noStroke();
        text(this.getAverageFPS().toFixed(0), this.x, this.y)
    }

    show() {
        this.update();
        this.draw();
    }

    getAverageFPS() {
        let averageFPS = 0;

        for (let i = 0; i < this.fps.length; i++) {
            averageFPS += this.fps[i];
        }

        return averageFPS / this.fps.length;
    }
}