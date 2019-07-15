class Resources {
  constructor(cb) {
    this.images = new Array(2);

    Promise.all([
      (this.loadImage("./img/ship.png")).then((i) => {
        this.images[SHIP] = i;
      }),
      (this.loadImage("./img/disc.png")).then((i) => {
        this.images[DISC] = i;
      })
    ]).then(() => {
      cb();
    });
  }

  loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = url;
    });
  }
}