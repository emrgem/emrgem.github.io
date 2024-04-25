import Generic from './generic.js';
import Emerald from './emerald.js';

import { isColliding } from '../collision.js';

export default class Magnet extends Generic {
    constructor(x = 0, y = 0) {
        super(x, y, 30, 30, 0, 0, "blue", window.game.assets.images.magnet);
    }

    update() {
        if (this.collecting) {
            return this.updateCollection();
        }

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
            this.collecting = true;

            this.draw = this.update;
        }
    }

    get emeralds() {
        return window.game.objects.objects.filter(obj => obj instanceof Emerald);
    }

    updateCollection() {
        // if the player is choosing an upgrade no move

        if (window.game.upgradeScreen) {
            return false;
        }

        var emeralds = this.emeralds;

        if (emeralds.length === 0) {
            this.kill();
            return;
        }

        var coords = window.game.player.coords;

        for (let i = 0; i < emeralds.length; i++) {
            let emerald = emeralds[i];

            var angle = atan2(coords.y - emerald.y, coords.x - emerald.x);
            var speedX = (8 * cos(angle));
            var speedY = (8 * sin(angle));

            emerald.x += speedX;
            emerald.y += speedY;
        }
    }   
}