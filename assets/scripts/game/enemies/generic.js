import { isColliding, handleCollision } from "../collision.js";
import GenericObject from "../objects/generic.js";

export default class Enemy {
    constructor(x = 0, y = 0, width = 10, height = 10, health = 20, damage = 2, speed = 1, dropChance = 0.5, color = "black", img = null) {
        this.x = x;
        this.y = y;
        this.health = health;
        this.damage = damage;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.color = color;
        this.img = img;
        this.dropChance = dropChance;
        this.offsetY = 0;
    }

    get coords() {
        var that = this;

        return {
            get x() {
                return window.game.dimensions.position.x + (that.x - window.game.player.x) + width / 2 + window.game.player.width;
            },
            get y() {
                return window.game.dimensions.position.y + (that.y - window.game.player.y) + height / 2 + window.game.player.height;
            },
            // because the player is always at the center of the screen so dist from player to wall on screen is the same as zombie position
            set x(val) {
                return that.x = window.game.player.x - window.game.player.coords.x + val;
            },
            set y(val) {
                return that.y = window.game.player.y - window.game.player.coords.y + val;
            }
        }
    }

    get onScreen() {
        return !(this.x < 0 - this.width || this.y < 0 - this.height || this.x > width + this.width || this.y > height + this.height)
    }

    draw() {
        if (!this.onScreen) {
            return;
        }

        graphic.push();

        if (this.img) {
            var imgWidth = this.width * 1.3;
            var imgHeight = this.img.height * (this.width / this.img.width) * 1.3;

            graphic.fill(this.color);

            graphic.image(this.img, this.x, this.y - (this.offsetY || 0), imgWidth, imgHeight);
        } else {
            graphic.fill(this.color);
            graphic.rect(this.x, this.y, this.width, this.height);
        }

        graphic.pop();
    }

    update() {
        this.checkBounds();

        var angle = atan2(window.game.player.y - this.y, window.game.player.x - this.x);
        var speedX = this.speed * cos(angle);
        var speedY = this.speed * sin(angle);
    
        this.x += speedX;
        this.y += speedY;
    }

    checkCollisions(enemies) {
        if (!this.onScreen) {
            return;
        }

        for (let i = 0; i < enemies.length; i++) {
            if (this !== enemies[i]) {
                let other = enemies[i];
                if (isColliding(this, other)) {
                    if (other instanceof GenericObject) {
                        var x = other._x;
                        var y = other._y;

                        handleCollision(this, other);

                        other.x = x;
                        other.y = y;
                    } else {
                        handleCollision(this, other);
                    }
                }
            }
        }

        //enemies.splice(enemies.indexOf(this), 1);
    }

    checkBounds() {
        var coords = this.coords;

        if (coords.x < 0) {
            coords.x = 0;
        }

        if (coords.y < -5) {
            coords.y = -5;
        }

        if (coords.x > 3000) {
            coords.x = 3000;
        }

        if (coords.y > 3005) {
            coords.y = 3005;
        }
    }

    hurt(dmg) {
        this.health -= dmg;

        window.game.damage.add(dmg, this.x, this.y);

        if (this.health <= 0) {
            this.kill();
        }
    }

    kill() {
        window.game.enemies_arr.splice(window.game.enemies_arr.indexOf(this), 1);

        if (Math.random() < this.dropChance) {
            window.game.currency.dropCurrency(this);
        }
    }
}