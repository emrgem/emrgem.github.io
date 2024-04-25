// Ball, bounces around screen

import { isCollidingCircle } from "../collision.js";

export default class Upgrade {
    level = 0;
    max = false;

    data = [
        // [ balls add #, ball speed add %, ball shoot cooldown decrease %, ball damage increase %, name ]
        [
            1,
            0,
            0,
            0,
            "Ball bounces around the screen"
        ],
        [
            1,
            10,
            25,
            0,
            "+1 Ball, Increased Speed and Reduced Cooldown"
        ],
        [
            0,
            0,
            10,
            100,
            "Increased Damage and Reduced Cooldown"
        ],
        [
            1,
            10,
            0,
            25,
            "+1 Ball, Increased Speed and Damage"
        ],
        [
            1,
            10,
            10,
            50,
            "+1 Ball, Increased Speed, Damage and Reduced Cooldown"
        ]
    ]

    balls = []

    cooldown = 300;
    numBalls = 0;
    ballSpeed = 5;
    damage = 20;

    constructor(game) {
        this.name = "Ball";
        this.maxLevel = 5;
        this.description = this.data[0][4];
        this.image = game.assets.images.ball;
        this.game = game;
    }

    upgrade() {
        if (this.max === true) {
            return false;
        }

        this.level ++;

        var level = this.level - 1;
        var data = this.data[level];

        this.numBalls += data[0];
        this.ballSpeed *= 1 + (data[1] / 100);
        this.cooldown *= 1 - (data[2] / 100);
        this.damage *= 1 + (data[3] / 100);

        if (this.level + 1 <= this.maxLevel) {
            this.description = this.data[this.level][4];
        } else {
            this.max = true;
        }
    }

    render() {
        this.balls.forEach(ball => ball.render());
    }

    update() {
        var targets = this.game.getTargets();

        this.balls.forEach(ball => ball.update(targets));

        if (this.game.frames % this.cooldown === 0) {
            for (let i = 0; i < this.numBalls; i ++) {
                this.balls.push(new Ball(this.game, this.ballSpeed, this));
            }
        }
    }
}

class Ball {
    get damage() {
        return this.parent.damage;
    }

    constructor(game, speed, parent) {
        this.game = game;
        this.speed = speed;
        this.parent = parent;

        this.x = game.player.x;
        this.y = game.player.y;
        this.radius = 8;
        this.rotation = 0;
        this.time = 0;

        this.xSpeed = random(-this.speed, this.speed);
        this.ySpeed = random(-this.speed, this.speed);
    }

    render() {
        graphic.push();

        //graphic.fill(255);
        //graphic.ellipse(this.x, this.y, this.radius * 2);

        graphic.translate(this.x, this.y);
        graphic.imageMode(CENTER);
        graphic.rotate(this.rotation);
        graphic.image(this.parent.image, 0, 0, this.radius * 3, this.radius * 3);

        graphic.pop();
    }

    update(targets) {
        this.x += this.xSpeed;
        this.y += this.ySpeed;

        this.time ++;

        if (this.time > 600) {
            this.parent.balls.splice(this.parent.balls.indexOf(this), 1);
        }

        if (this.x < 0 || this.x > width) {
            this.xSpeed *= -1;
            this.x = this.x < 0 ? 0 : width;
        }

        if (this.y < 0 || this.y > height) {
            this.ySpeed *= -1;
            this.y = this.y < 0 ? 0 : height;
        }

        this.rotation += 10;

        targets.forEach(target => {
            if (isCollidingCircle(target, this)) {
                if (!target.lastHurtBall || (target.lastHurtBall && frameCount - target.lastHurtBall > 20)) {
                    target.lastHurtBall = frameCount;
                    target.hurt(this.damage);
                }
            }
        });
    }
}