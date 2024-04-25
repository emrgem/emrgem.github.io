// forcefield around player

import { isCollidingCircle } from "../collision.js";

export default class Upgrade {
    level = 0;
    max = false;

    data = [
        // [ radius add #, damage add %, name ]
        [
            30,
            0,
            "Spawns Forcefield around player"
        ],
        [
            15,
            25,
            "Increased Radius and Damage"
        ],
        [
            15,
            25,
            "Increased Radius and Damage"
        ],
        [
            15,
            50,
            "Increased Radius and Damage"
        ],
        [
            20,
            30,
            "Increased Radius and Damage"
        ]
    ]

    radius = 0;
    damage = 15;
    cooldown = 25;

    constructor(game) {
        this.name = "Forcefield";
        this.maxLevel = 5;
        this.description = this.data[0][2];
        this.image = game.assets.images.forcefield;
        this.game = game;
    }

    upgrade() {
        if (this.max === true) {
            return false;
        }

        this.level ++;

        var level = this.level - 1;
        var data = this.data[level];

        this.radius += data[0];
        this.damage *= 1 + (data[1] / 100);
        this.cooldown += 3;

        if (this.level + 1 <= this.maxLevel) {
            this.description = this.data[this.level][2];
        } else {
            this.max = true;
        }
    }

    get x() {
        return window.game.player.x;
    }

    get y() {
        return window.game.player.y;
    }

    render() {
        if (this.level > 0) {
            graphic.push();
            graphic.fill(100, 255, 0, 50);
            graphic.stroke(100, 255, 0);
            graphic.strokeWeight(1);
            graphic.ellipse(window.game.player.x, window.game.player.y, this.radius * 2, this.radius * 2);

            graphic.fill(255, 255, 255, 0);
            graphic.stroke(255, 255, 255, (frameCount % this.cooldown) * (this.radius / this.cooldown));
            graphic.ellipse(window.game.player.x, window.game.player.y, (frameCount % this.cooldown) * (this.radius * 2 / this.cooldown));
            graphic.pop();
        }
    }

    update() {
        if (this.level > 0) {
            var enemies = window.game.getTargets();

            for (var i = 0; i < enemies.length; i ++) {
                var enemy = enemies[i];

                if (isCollidingCircle(enemy, this)) {
                    if (frameCount % this.cooldown === 0) {
                        enemy.hurt(this.damage);
                    }
                }
            }
        }
    }
}