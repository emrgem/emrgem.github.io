import Generic from './generic.js';

import { isColliding } from '../collision.js';

export default class Food extends Generic {
    constructor(x = 0, y = 0) {
        super(x, y, 30, 30, 0, 0, "brown", window.game.assets.images.food);

        this.heal = 40;
    }

    update() {
        var coords = this.getCoords()
        var distPlayer = dist(coords.x, coords.y, window.game.player.x, window.game.player.y);

        if (distPlayer < 3) {
            distPlayer = 3;
        }

        if (distPlayer < 40) {
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
            window.game.player.health += this.heal;

            if (window.game.player.health > window.game.player.maxHealth) {
                window.game.player.health = window.game.player.maxHealth;
            }

            this.kill();
        }
    }
}