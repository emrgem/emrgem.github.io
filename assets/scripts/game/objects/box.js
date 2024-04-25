import Generic from './generic.js';

function probability(inp) {
    var rand = random(0, 1);

    var sorted = inp.toSorted((a, b) => a[1] - b[1]);

    var lastMin = 0;

    for (var i = 0; i < sorted.length; i ++) {
        var current = sorted[i];

        if (rand >= lastMin && rand <= lastMin + current[1]) {
            return current[0];
        } else {
            lastMin = current[1];
        }
    }
}

export default class Box extends Generic {
    drops = [
        ["magnet", 0.2],
        ["food", 0.1],
        ["emerald", 0.7]
    ]

    dead = false;

    constructor(x = 0, y = 0) {
        super(x, y, 40, 40, 1, 0, "brown", window.game.assets.images.box);
    }

    kill() {
        if (this.dead) {
            return false;
        }

        this.dead = true;

        const drop = probability(this.drops);

        if (drop) {
            var reward = window.game.objects.spawnObject(drop, [this._x, this._y]);

            if (drop === "emerald") {
                reward.value = random(10, 20) * window.game.level;
            }
        }

        this.draw = () => {};
    }

    hurt(dmg) {
        this.health -= dmg;

        window.game.damage.add(dmg, this.getCoords().x, this.getCoords().y);

        if (this.health <= 0) {
            this.kill();
        }
    }
}