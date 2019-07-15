
class Background {
	constructor() {
        this.stars = new Stars();
        this.stripes = new Stripes();
    }

    update(dt) {
        this.stars.update(dt);
        this.stripes.update(dt);
    }

    draw(ctx, s) {
        this.stripes.draw(ctx);
        this.stars.draw(ctx);
        
        ctx.fillStyle = "#444";
        ctx.textAlign = "center";
        ctx.font = "180px Revalia";
        ctx.fillText(s + '', WIDTH >> 1, HEIGHT * .45);
    }
}