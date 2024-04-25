import Generic from './generic.js';
import { isColliding } from '../collision.js';

export default class Emerald extends Generic {
    constructor(x = 0, y = 0) {
        super(x, y, 7, 7, 0, 0, "#44ba38" /* emerald */, null);
    }

    draw() {
        const coords = this.getCoords();

        graphic.push();
        this.update?.call(this);
        graphic.fill(this.color);
        graphic.translate(coords.x, coords.y);
        if (this.image) {
            graphic.image(this.image, 0, 0, this.width, this.height);
        } else {
            graphic.rotate(45);
            graphic.rect(0, 0, this.width, this.height);
        }
        graphic.pop();
    }

    update() {
        var coords = this.getCoords()
        var distPlayer = dist(coords.x, coords.y, window.game.player.x, window.game.player.y);

        if (distPlayer < 3) {
            distPlayer = 3;
        }

        if (distPlayer < 50) {
            var angle = atan2(window.game.player.y - coords.y, window.game.player.x - coords.x);
            var speedX = (50 * cos(angle)) / distPlayer;
            var speedY = (50 * sin(angle)) / distPlayer;

            this.x += speedX;
            this.y += speedY;
        }

        if (isColliding({
            x: coords.x,
            y: coords.y,
            width: this.width,
            height: this.height
        }, window.game.player)) {
            this.kill();

            window.game.currency.collected(this);
        }
    }
}