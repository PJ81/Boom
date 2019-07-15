const DELTA_TIME = 1 / 60,
	WIDTH = 500,
	HEIGHT = 800,
	MAX_ANGLE = Math.PI * .08,
	SHIP = 0,
	DISC = 1;

const STATES = {
	ALIVE: 1,
	BACK: 2,
	DEAD: 3,
	ENTER: 4,
	EXPLOSION: 5,
	FLY: 6,
	FLY_AWAY: 7,
	PLAYING: 8,
	PLAYER_DEAD: 9,
	PLAYER_MISSED: 10,
	PRE_ENTER: 11,
	RESET: 17,
	SCORE: 12,
	START: 13,
	STAY: 14,
	STOP: 15,
	SWING: 16
};

class Game {
	constructor() {
		let canvas = document.createElement('canvas');
		canvas.width = WIDTH;
		canvas.height = HEIGHT;
		document.body.appendChild(canvas);
		this.ctx = canvas.getContext('2d');
		this.lastTime = 0;
		this.accumulator = 0;
		this.state = STATES.SCORE;
		this.explosion = new Explosion();

		this.res = new Resources(() => {
			this.bg = new Background();
			this.dot = new Dot(this.res.images[DISC]);
			this.player = new Player(this.res.images[SHIP]);
			this.loop(0);
		});

		// Promise.all([
		// 	this.bg = new Background(),
		// 	this.dot = new Dot(),
		// 	this.player = new Player()
		// ]).then(() => {
		// 	this.loop(0);
		// });

		window.addEventListener("keydown", () => {
			if (this.state === STATES.SCORE) {
				this.state = STATES.RESET;
			} else {
				this.player.start();
			}
		});

		this.loop = (time) => {
			this.accumulator += (time - this.lastTime) / 1000;
			while (this.accumulator > DELTA_TIME) {
				this.accumulator -= DELTA_TIME;
				this.moveFrame();
			}
			this.draw();
			this.lastTime = time;
			requestAnimationFrame(this.loop);
		}
	}

	moveFrame() {
		this.bg.update(DELTA_TIME);

		switch (this.state) {
			case STATES.RESET:
				this.player.reset();
				this.state = STATES.START;
				break;
			case STATES.START:
				if (this.player.update(DELTA_TIME)) {
					this.player.state = STATES.STOP;
					this.dot.state = STATES.PRE_ENTER;
					this.state = STATES.PLAYING;
				}
				break;
			case STATES.PLAYING:
				this.dot.update(DELTA_TIME);
				this.player.update(DELTA_TIME);

				if (this.checkCollision()) {
					this.explosion.start(this.player.x + (this.player.wid >> 1), this.player.y);
					this.dot.die();
					this.player.upScore();
					this.state = STATES.EXPLOSION;
				} else if (this.player.y < 0) {
					this.player.state = STATES.FLY_AWAY;
					this.dot.flyAway();
					this.state = STATES.PLAYER_MISSED;
				} else if (this.player.y + this.player.hei > HEIGHT) {
					this.player.state = STATES.DEAD;
					this.dot.state = STATES.FLY_AWAY;
					this.explosion.start(this.player.x + (this.player.wid >> 1), this.player.y + (this.player.hei >> 1));
					this.state = STATES.PLAYER_DEAD;
				}
				break;
			case STATES.PLAYER_DEAD:
				if (this.dot.update(DELTA_TIME)) this.dot.die();
				this.explosion.update(DELTA_TIME);
				if (this.explosion.state === STATES.DEAD && this.dot.state === STATES.DEAD) {
					this.state = STATES.SCORE;
				}
				break;
			case STATES.PLAYER_MISSED:
				if (this.dot.update(DELTA_TIME)) this.dot.die();
				if (this.player.update(DELTA_TIME)) this.player.state = STATES.DEAD;
				if (this.player.state === STATES.DEAD && this.dot.state === STATES.DEAD) {
					this.state = STATES.SCORE;
				}
				break;
			case STATES.EXPLOSION:
				this.dot.update(DELTA_TIME);
				this.player.update(DELTA_TIME);
				this.explosion.update(DELTA_TIME);
				if (this.explosion.state === STATES.DEAD) {
					this.player.state = STATES.STAY;
					this.dot.state = STATES.PRE_ENTER;
					this.state = STATES.PLAYING;
				}
				break;
		}
	}

	draw() {
		this.ctx.clearRect(0, 0, WIDTH, HEIGHT);

		this.bg.draw(this.ctx, this.player.score);

		if (this.state === STATES.SCORE) {
			this.ctx.fillStyle = "#ddd";
			this.ctx.textAlign = "center";
			this.ctx.font = "40px Revalia";
			this.ctx.fillText("Press any key", WIDTH >> 1, HEIGHT * .54);
			this.ctx.fillText("to play", WIDTH >> 1, HEIGHT * .6);
		}


		this.player.draw(this.ctx);
		this.dot.draw(this.ctx);
		this.explosion.draw(this.ctx);
	}

	checkCollision() {
		let d = {
				l: this.dot.x,
				t: this.dot.y,
				r: this.dot.x + this.dot.wid,
				b: this.dot.y + this.dot.hei
			},
			s = {
				x: this.player.x + (this.player.wid >> 1),
				y: this.player.y
			};
		return (s.x > d.l && s.x < d.r && s.y < d.b && s.y > d.t);
	}
}