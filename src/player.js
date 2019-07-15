class Player {
    constructor(img) {
        this.ship = img;
        this.wid = this.ship.width;
        this.hei = this.ship.height;
        this.startY = HEIGHT - this.hei - 100;
        this.jetParts = [];
        this.reset();
    }

    reset() {
        this.x = (WIDTH >> 1) - (this.wid >> 1);
        this.y = HEIGHT;
        this.dy = 2;
        this.score = 0;
        this.gravity = 4;
        this.state = STATES.ENTER;
    }

    start() {
        if (this.state === STATES.STAY || this.state === STATES.STOP)
            this.state = STATES.FLY;
    }

    update(dt) {
        let w = (this.wid >> 1);
        for (let r = 0; r < 16 + Math.random() * 5; r++) {
            let rnd = Math.random() * 5 - 2;
            this.jetParts.push({
                x: this.x + w + rnd,
                y: this.y + this.hei - Math.random() * 5,
                alpha: Math.random()
            });
        }


        for (let r = this.jetParts.length - 1; r > -1; r--) {
            this.jetParts[r].alpha -= 6 * dt;
            if (this.jetParts[r].alpha < 0) {
                this.jetParts.splice(r, 1);
            } else {
                this.jetParts[r].y += 150 * dt;
            }
        }

        switch (this.state) {
            case STATES.FLY:
                this.y -= dt * 50 * Math.pow(this.dy, 4);
                this.dy += dt;
                break;
            case STATES.BACK:
                this.y += dt * 60 * Math.pow(this.dy, 3);
                if (this.y > this.startY) {
                    this.y = this.startY;
                    this.dy = 2;
                }
                break;
            case STATES.STAY:
                this.y += dt * this.gravity;
                break;
            case STATES.FLY_AWAY:
                this.y -= dt * 60;
                if (this.y < -this.hei) {
                    this.y = HEIGHT;
                    return true;
                }
                break;
            case STATES.ENTER:
                this.y -= dt * 90;
                if (this.y < this.startY) {
                    this.y = this.startY;
                    return true;
                }
                break;
                return false;
        }
    }

    draw(ctx) {
        if (this.state === STATES.DEAD) return;
        ctx.drawImage(this.ship, this.x, this.y);

        for (let r = 0; r < this.jetParts.length; r++) {
            let p = this.jetParts[r];
            ctx.fillStyle = `rgba(255, 188, 10, ${p.alpha})`;
            ctx.fillRect(p.x, p.y, 1, 1);
        }
        ctx.globalAlpha = 1;
    }

    upScore() {
        this.score++;
        this.gravity += .3;
        this.state = STATES.BACK;
    }
}