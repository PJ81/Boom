
class Explosion {
    constructor() {
        this.state = STATES.DEAD;
        this.particles = []
    }

    start(x, y) {
        this.state = STATES.ALIVE;
        for(let z = 0; z < 30; z++) {
            let a = Math.random() * 2 * Math.PI;
            this.particles.push({
                x: x, y: y, a: 1,
                s:  Math.random() * 5 + 3,
                vx: Math.random() * Math.cos(a),
                vy: Math.random() * Math.sin(a)
            });
        }
    }

    update(dt) {
        if(this.state == STATES.DEAD) return;
        let cnt = 0;
        for(let z = 0; z < this.particles.length; z++) {
            let p = this.particles[z];
            if(p.a < 0) continue;
            cnt++;
            p.x += p.vx * dt * 250;
            p.y += p.vy * dt * 250;
            p.a -= dt * 2;
            this.particles[z] = p;
        }
        this.state = cnt < 1 ? STATES.DEAD : STATES.ALIVE;
    }

    draw(ctx) {
        if(this.state == STATES.DEAD) return;
        for(let z = 0; z < this.particles.length; z++) {
            let p = this.particles[z];
            if(p.a < 0) continue;
            ctx.fillStyle = `rgba(255, 255, 255, ${p.a})`;
            ctx.fillRect(p.x, p.y, p.s, p.s);

        }
    }
}