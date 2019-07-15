
class Stars {
    constructor() {
        this.stars = [];
        this.fill();

    }

    update(dt) {
        for(let r = 0; r < this.stars.length; r++) {
            this.stars[r].y += dt * 3 * this.stars[r].s;
            this.stars[r].a += (dt * this.stars[r].d);

            if(this.stars[r].a > 1) {
                this.stars[r].a = 1;
                this.stars[r].d = -.25;
            } else if(this.stars[r].a < 0) {
                this.stars[r].x = Math.random() * WIDTH;
                this.stars[r].y = Math.random() * HEIGHT;
                this.stars[r].d = .25;
                this.stars[r].a = 0;
            }
        }
    }

    draw(ctx) {
        for(let r = 0; r < this.stars.length; r++) {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.stars[r].a})`;
            ctx.fillRect(this.stars[r].x, this.stars[r].y, this.stars[r].s, this.stars[r].s);
        }
    }

    fill() {
        for(let r = 0; r < 80; r++) {
            let p = Math.random();
            this.stars.push({
                x: Math.random() * WIDTH,
                y: Math.random() * HEIGHT,
                s: Math.random() * 2 + 1,
                d: .25,
                a: p
            });
        }
    }
}