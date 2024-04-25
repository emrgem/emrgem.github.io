// spinner around player

import { isCollidingCircle } from "../collision.js";

export default class Upgrade {
    level = 0;
    max = false;

    data = [
        // [ spinner add #, spinner spin speed add %, spinner damage add %, spinner cooldown reduce %, name ]
        [
            2,
            0,
            0,
            0,
            "Rotates around player"
        ],
        [
            1,
            10,
            25,
            0,
            "+1 Spinner, Faster Spin and Increased Damage"
        ],
        [
            0,
            0,
            50,
            25,
            "Increased Damage and Reduced Cooldown"
        ],
        [
            0,
            15,
            0,
            0,
            "Faster Spin"
        ],
        [
            2,
            0,
            50,
            25,
            "+1 Spinner, Increased Damage and Reduced Cooldown"
        ]
    ]

    spinners = [
        // { x, y, angle }
    ]

    numSpinners = 0;
    spinnerSpeed = 2.5;
    damage = 15;
    cooldown = 3500;

    constructor(game) {
        this.name = "Spinner";
        this.maxLevel = 5;
        this.description = this.data[0][4];
        this.image = game.assets.images.spinner; // window.game.player.weapon.sprites[0];
        this.game = game;
    }

    upgrade() {
        if (this.max === true) {
            return false;
        }

        this.level ++;

        var level = this.level - 1;
        var data = this.data[level];

        for (let i = 0; i < data[0]; i++) {
            this.spinners.push(
                new Spinner(this)
            );
        }

        this.numSpinners += data[0];
        this.spinnerSpeed *= ((100 + data[1]) / 100);
        this.damage *= ((100 + data[2]) / 100);
        this.cooldown *= ((100 - data[3]) / 100);

        this.spaceSpinners();

        if (this.level <= this.maxLevel - 1) {
            this.description = this.data[this.level][4];
        } else {
            this.max = true;
        }
    }

    render() {
        this.spinners.forEach(spinner => spinner.draw());
    }

    update() {
        this.spinners.forEach(spinner => spinner.update());
    }

    spaceSpinners() {
        var angle = 360 / this.numSpinners;

        this.spinners.forEach((spinner, index) => {
            spinner.angle = angle * (index + 1);
        });
    }
}

class Spinner  {
    constructor(parent) {
        this.parent = parent;
        this.angle = 0;
        this.radius = 6;
        this.rotation = 0;
    }

    draw() {
        graphic.push();
        graphic.translate(this.parent.game.player.x, this.parent.game.player.y);
        graphic.rotate(this.angle);
        graphic.translate(0, -65);
        // graphic.image(window.game.assets.images.spinner, 0, 0, 50, 50);
        graphic.rectMode(CENTER);
        graphic.fill("red");
        graphic.rotate(this.rotation);
        graphic.image(this.parent.image, 0, 0, 25, 25);
        graphic.pop();
    }

    // adding 85 degrees just works and i cant figure out the math

    get x() {
        return this.parent.game.player.x - (65 * cos(this.angle + 85));
    }

    get y() {
        return this.parent.game.player.y - (65 * sin(this.angle + 85));
    }

    update() {
        // this.x = window.game.player.x;
        // this.y = window.game.player.y;

        if (this.angle >= 360) {
            this.angle = this.angle - 360;
        }

        this.angle += this.parent.spinnerSpeed;

        this.rotation += 30;

        this.checkCollisions(this.parent.game.getTargets());
    }

    checkCollisions(enemies) {
        for (let i = 0; i < enemies.length; i++) {
            let enemy = enemies[i];
            if (isCollidingCircle(enemy, this)) {
                if (!enemy.lastHurt || (enemy.lastHurt && frameCount - enemy.lastHurt > 20)) {
                    enemy.lastHurt = frameCount;
                    enemy.hurt(this.parent.damage);
                }
            }
        }
    }
}