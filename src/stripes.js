
class Stripes {
    constructor() {
        let c1 = document.createElement("canvas"),
            c2 = document.createElement("canvas");
        c1.width = c2.width = WIDTH;
        c1.height = c2.height = HEIGHT;


        let cx1 = c1.getContext("2d");
        this.drawStripes(cx1);
        this.img1 = new Image();
        this.img1.src = c1.toDataURL();

        this.y = 0;
    }

    drawOneStripe(c, z, s, sh, sw) {
        c.beginPath();
        c.moveTo(z, s);
        c.lineTo(0, s + sh);
        c.lineTo(0, s + sh + sw);
        c.lineTo(z, s + sw);
        c.lineTo(WIDTH, s + sh + sw);
        c.lineTo(WIDTH, s + sh);
        c.closePath();
        c.fill();
    }

    drawStripes(c) {
        c.fillStyle = "#111";
        let z = WIDTH >> 1, sh = 180, sw = 110;
        for(let s = -120; s < 700; s+= 200) {
            this.drawOneStripe(c, z, s, sh, sw);
        }
    }

    update(dt) {
        this.y += dt * 10;
        if(this.y > HEIGHT) this.y = 0;
    }

    draw(ctx) {
        ctx.drawImage(this.img1, 0, this.y);
        ctx.drawImage(this.img1, 0, this.y - HEIGHT + 1);
    }
}