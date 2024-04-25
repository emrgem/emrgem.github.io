import Enemy from "./generic.js";

export default class Butterfly extends Enemy {
    constructor(x = 0, y = 0) {
        super(x, y, 15, 15, 10, 2, 1.2, 0.45, "purple", window.game.assets.images.butterfly);
        
        if (Butterfly.prototype.health) {
            this.health = Butterfly.prototype.health;
        }

        this._update = this.update;

        this.update = () => {
            this._update();

            this.offsetY = sin((frameCount % 120) * (3/2)) * 5;
        }
    }
}