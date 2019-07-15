class Dot {
    constructor(img) {
        this.disc = img;
        this.maxSide = (WIDTH >> 1) - (this.disc.width >> 1);
        this.wid = this.disc.width;
        this.hei = this.disc.height;
        this.reset();
        this.state = STATES.DEAD;
    }

    reset() {
        this.x = Math.random() * WIDTH;
        this.dir = this.x > (WIDTH >> 1) ? -1 : 1;
        this.stop = this.dir < 0 ? 0 : (WIDTH - this.wid);
        this.y = -60;
        this.angle = 0;
        this.speed = Math.random() * 2 + 1;
        this.counter = 0;
        this.downSpeed = Math.random() * 200 + 150;
        this.state = STATES.ENTER;
    }

    update(dt) {
        switch (this.state) {
            case STATES.SWING:
                this.angle += (dt * this.dir);
                if (this.angle > MAX_ANGLE || this.angle < -MAX_ANGLE) this.dir = -this.dir;
                this.x = (this.maxSide * Math.cos(this.counter * Math.PI * .5)) + this.maxSide;
                this.counter += dt * this.speed;
                break;
            case STATES.FLY_AWAY:
                this.angle += (dt * this.dir);
                if (this.angle > MAX_ANGLE || this.angle < -MAX_ANGLE) this.dir = -this.dir;
                this.x += this.speed * dt * 4;
                if (this.x < -this.wid || this.x > WIDTH) return true;
                break;
            case STATES.PRE_ENTER:
                this.reset();
                break;
            case STATES.ENTER:
                this.counter += dt * 10;
                //Math.pow(this.counter, 2) * this.dir;
                this.x += Math.pow(this.counter, 3) * Math.pow(1 / this.counter, 2.2) * this.dir;
                this.y += dt * this.downSpeed;

                if (this.dir < 0 && this.x < this.stop || this.dir > 0 && this.x > this.stop) {
                    this.counter = this.dir < 0 ? 150 : 300;
                    this.state = STATES.SWING;
                }
                break;
        }
        return false;
    }

    die() {
        this.reset();
        this.state = STATES.DEAD;
    }

    flyAway() {
        this.state = STATES.FLY_AWAY;
        this.speed = this.x > (WIDTH >> 1) ? 90 : -90;
    }

    draw(ctx) {
        if (this.state === STATES.DEAD || this.state === STATES.DIEING) return;
        let w = this.wid >> 1,
            h = this.hei >> 1;
        ctx.save();
        ctx.translate(this.x + w, this.y + h);
        ctx.rotate(this.angle);
        ctx.drawImage(this.disc, -w, -h);
        ctx.restore();
    }
}