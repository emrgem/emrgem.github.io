import { handleCollision, isColliding } from "./collision.js";

class Player {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
        this.width = 25;
        this.height = 50;
        this.speed = 1.7;
        this.health = 100;
        this.maxHealth = 100;
        this.healthQueue = 0;
        this.kills = 0;
        this.hitbox = {
            width: this.width,
            height: this.height
        };
        this.dead = false;
        this.deathState = 0;
        this.sprites = {
            idle: [
                [],
                [],
                [],
                []
            ],
            walking: [
                [],
                [],
                [],
                []
            ],
            dying: [
                [],
                [],
                [],
                []
            ]
        };
        this.state = "idle";
        this.currentSprite = 0;
        this.facing = 0; // 0 = down, 1 = up, 2 = right, 3 = left

        this.weapon = new this.Weapon(this);

        this.loadSprites([
            window.game.assets.images.player_idle,
            window.game.assets.images.player_walk,
            window.game.assets.images.player_death,
        ]);
    }

    loadSprites([
        idleSheet = [],
        walkingSheet = [],
        dyingSheet = []
    ]) {
        var idleWidth = idleSheet.width / 3;
        var idleHeight = idleSheet.height / 4;

        for (let i = 0; i < 2; i ++) {
            for (let j = 0; j < 4; j ++) {
                var sprite = idleSheet.get(i * idleWidth, j * idleHeight, idleWidth, idleHeight);
                this.sprites.idle[j].push(sprite);
            }
        }

        var walkingWidth = walkingSheet.width / 5;
        var walkingHeight = walkingSheet.height / 4;

        for (let i = 0; i < 4; i ++) {
            for (let j = 0; j < 4; j ++) {
                var sprite = walkingSheet.get(i * walkingWidth, j * walkingHeight, walkingWidth, walkingHeight);
                this.sprites.walking[j].push(sprite);
            }
        }

        var dyingWidth = dyingSheet.width / 5;
        var dyingHeight = dyingSheet.height / 4;

        for (let i = 0; i < 4; i ++) {
            for (let j = 0; j < 4; j ++) {
                var sprite = dyingSheet.get(i * dyingWidth, j * dyingHeight, dyingWidth, dyingHeight);
                this.sprites.dying[j].push(sprite);
            }
        }

        return true;
    }

    get coords() {
        var that = this;

        return {
            get x() {
                return window.game.dimensions.position.x + width / 2 + that.width;
            },
            get y() {
                return window.game.dimensions.position.y + height / 2 + that.height;
            },
            set x(val) {
                return window.game.dimensions.position.x = val - width / 2 - that.width;
            },
            set y(val) {
                return window.game.dimensions.position.y = val - height / 2 - that.height;
            }
        }
    }

    checkBounds() {
        var coords = this.coords;

        if (coords.x < 0) {
            coords.x = 0;
        }

        if (coords.y < 0) {
            coords.y = 0;
        }

        if (coords.x > 3000) {
            coords.x = 3000;
        }

        if (coords.y > 3000) {
            coords.y = 3000;
        }
    }

    drawDeath() {
        this.deathState ++;

        if (this.deathState > 20 && (this.deathState - 20) % 30 === 0 && this.currentSprite < 3) {
            this.currentSprite ++;
        }

        graphic.push();
        graphic.rectMode(CENTER);
        var imgHeight = this.height;
        var imgWidth = (this.sprites[this.state][this.facing][this.currentSprite].width / this.sprites[this.state][this.facing][this.currentSprite].height) * imgHeight;

        graphic.image(this.sprites["dying"][this.facing][this.currentSprite], this.x, this.y, imgWidth, imgHeight);
        graphic.pop();

        // push all enemies away from the player

        for (var enemy of window.game.getTargets()) {
            var x = this.x;
            var y = this.y;

            if (isColliding(this, enemy)) {
                handleCollision(this, enemy);
            }

            this.x = x;
            this.y = y;
        }
    }

    // TODO: unused, might be deleted
    healthToColor(health) {
        // Clamp the health value between 0 and 100
        health = Math.max(0, Math.min(100, health));
    
        let red = 0, green = 0;

        if (health > 50) {
            // Health is more than 50, green is 128 and red is increasing
            let factor = (1 - 2 * (health - 50) / 100) ** 2;
            red = Math.floor(255 * factor);
            green = 128;
        } else {
            // Health is 50 or less, red is full and green is decreasing
            let factor = (2 * health / 100) ** 2;
            red = 255;
            green = Math.floor(128 * factor);
        }
    
        // Convert RGB values to hex string
        return "#" + red.toString(16).padStart(2, '0') + green.toString(16).padStart(2, '0') + "00";
    }

    draw() {
        if (this.dead) {
            if (this.deathState > 150) {
                window.game.screen = "over";
            }

            return this.drawDeath();
        }

        graphic.push();
        graphic.rectMode(CENTER);
        /*fill("black");
        rect(this.x, this.y, this.width, this.height);*/

        var imgHeight = this.height;
        var imgWidth = (this.sprites[this.state][this.facing][this.currentSprite].width / this.sprites[this.state][this.facing][this.currentSprite].height) * imgHeight;

        graphic.image(this.sprites[this.state][this.facing][this.currentSprite], this.x, this.y, imgWidth, imgHeight);
      
        graphic.fill("red");
        graphic.rect(this.x, this.y + this.height / 2 + 15, 30, 5);
        graphic.fill("green");
        graphic.rectMode(CORNER);
        graphic.rect(this.x - this.width / 2 - 3, this.y + this.height / 2 + 12.5, (this.health / this.maxHealth) * 31, 5);
      
        graphic.pop();

        // sprites viewer

        /*var i = 1;
        var j = 1;

        for (var type in this.sprites) {
            for (var sprite of this.sprites[type]) {
                if (i > 5) {
                    i = 1;
                    j ++;
                }
                image(sprite, i * 50, j * 50, 30, 30);
                i ++;
            }
        }*/
    }

    update() {
        if (this.dead === true) {
            return false;
        }

        var [ x, y ] = this.getMovement();

        this.weapon.update();

        var initialX = window.game.dimensions.position.x;
        var initialY = window.game.dimensions.position.y;

        window.game.dimensions.position.x += x;
        window.game.dimensions.position.y -= y;

        this.checkBounds();

        var finalX = window.game.dimensions.position.x;
        var finalY = window.game.dimensions.position.y;

        var deltaX = finalX - initialX;
        var deltaY = finalY - initialY;

        window.game.moveEntities(deltaX, -deltaY);

        if (frameCount % 15 === 0) {
            this.currentSprite ++;
        }

        if (this.currentSprite > this.sprites[this.state][this.facing].length - 1) {
            this.currentSprite = 0;
        }

        if (window.frameCount % 10 === 0) {
            this.hurt(this.healthQueue);

            this.healthQueue = 0;
        }

        this.checkCollisions(window.game.getTargets());
    }

    getMovement() {
        this.state = "walking";

        if (keyIsDown(87) && keyIsDown(65)) {
            this.facing = 3;

            return [-this.speed * cos(45), this.speed * sin(45)];
        } else if (keyIsDown(87) && keyIsDown(68)) {
            this.facing = 2;

            return [this.speed * cos(45), this.speed * sin(45)];
        } else if (keyIsDown(83) && keyIsDown(65)) {
            this.facing = 3;

            return [-this.speed * cos(45), -this.speed * sin(45)];
        } else if (keyIsDown(83) && keyIsDown(68)) {
            this.facing = 2;

            return [this.speed * cos(45), -this.speed * sin(45)];
        } else {
            if (keyIsDown(87)) {
                this.facing = 0;

                return [0, this.speed];
            }
        
            if (keyIsDown(65)) {
                this.facing = 3;

                return [-this.speed, 0];
            }
        
            if (keyIsDown(68)) {
                this.facing = 2;

                return [this.speed, 0];
            }
      
            if (keyIsDown(83)) {
                this.facing = 0;

                return [0, -this.speed];
            }
        }

        this.facing = 0;
        this.state = "idle";

        return [0, 0];
    }

    hurt(damage) {
        this.health -= damage;

        if (this.health <= 0) {
            this.health = 0;
        
            this.kill();
        }
    }

    kill() {
        if (this.dead === true) {
            return false;
        }

        this.dead = true;
        this.currentSprite = 0;
        this.state = "dying";

        //window.game.gameOver();
    }

    checkCollisions(enemies) {
        for (let i = 0; i < enemies.length; i++) {
            let enemy = enemies[i];
            if (isColliding(this, enemy)) {
                this.healthQueue += (enemy.damage / 30);

                //handleCollision(this, enemy);
            }
        }
    }
}

Player.prototype.Weapon = class Weapon {
    sprites = [
        // 0-3: idle animation, all the same
        // 4-9: shooting animation
        // 10-17: reloading animation
    ];
    currentSprite = 0;

    constructor(player) {
        this.loadSprites(window.game.assets.images.shotgun);

        this.player = player;
        this.width = 40;
        this.height = 20;
        this.damage = 20;
        this.ammo = 5;
        this.weaponCooldown = 100;
        this.baseCooldown = 100;
        this.weaponAngle = 0;
        this.penetration = 0;
    }
    
    loadSprites(image) {
        var imgWidth = image.width;
        var imgHeight = image.height / 18;

        for (let i = 0; i < 18; i ++) {
            var sprite = image.get(0, i * imgHeight, imgWidth, imgHeight);
            this.sprites.push(sprite);
        }
    }

    draw() {
        graphic.push();

        switch (this.weaponCooldown) {
            case 60:
                this.currentSprite = 10;
                break;
            case 57:
                this.currentSprite = 11;
                break;
            case 54:
                this.currentSprite = 12;
                break;
            case 51:
                this.currentSprite = 13;
                break;
            case 48:
                this.currentSprite = 14;
                break;
            case 45:
                this.currentSprite = 15;
                break;
            case 42:
                this.currentSprite = 16;
                break;
            case 39:
                this.currentSprite = 17;
                break;
            case 36:
                this.currentSprite = 17;
                break;
            case 20:
                this.currentSprite = 16;
                break;
            case 17:
                this.currentSprite = 17;
                break;
            case 24:
                this.currentSprite = 1;
                break;
            case 11:
                this.currentSprite = 2;
                break;
            case 8:
                this.currentSprite = 3;
                break;
            case 5:
                this.currentSprite = 4;
                break;
            case 2:
                this.currentSprite = 5;
                break;
            case 99:
                this.currentSprite = 6;
                break;
            case 96:
                this.currentSprite = 7;
                break;
            case 93:
                this.currentSprite = 8;
                break;
            case 90:
                this.currentSprite = 9;
                break;
            case 87:
                this.currentSprite = 0;
                break;
        }
      
        graphic.translate(this.player.x, this.player.y);
        graphic.rotate(-this.weaponAngle);
        graphic.translate(15, 0);
        graphic.rotate(180);

        if (this.weaponAngle < 90 || this.weaponAngle > 270) {
            graphic.scale(1, -1);
            graphic.image(this.sprites[this.currentSprite], 0, 5, this.width, this.height);
        } else {
            graphic.image(this.sprites[this.currentSprite], 0, 5, this.width, this.height);
        }
        // fill("brown");
        // rect(0, 0, this.width, this.height);
        graphic.pop();
      
        graphic.push();
        graphic.fill("black");
        graphic.rect(this.player.x, this.player.y + this.player.height / 2 + 25, 30, 5);
        graphic.fill("gold");
        graphic.rectMode(CORNER);
        graphic.rect(this.player.x - this.player.width / 2 - 3, this.player.y + this.player.height / 2 + 22.5, 30 - (this.weaponCooldown / this.baseCooldown) * 30, 5);
      
        graphic.pop();
    }

    update() {
        var distX = dist(this.player.x, 0, mouseX, 0);
        var distY = dist(0, this.player.y, 0, mouseY);
        var angle = atan(distY / distX);
      
        if (mouseX >= this.player.x && mouseY >= this.player.y) {
          angle = 360 - angle;
        } else if (mouseX <= this.player.x && mouseY <= this.player.y) {
          angle = 180 - angle;
        } else if (mouseX <= this.player.x && mouseY >= this.player.y) {
          angle = 180 + angle;
        }
      
        this.weaponAngle = angle;

        this.weaponCooldown --;
      
        if (this.weaponCooldown < 1) {
          this.weaponCooldown = this.baseCooldown;
      
          this.shoot();
        }
    }

    getCoords(bullet) {
        var that = this;

        return {
            get x() {
                return window.game.dimensions.position.x + (bullet.x - that.player.x) + width / 2 + that.player.width;
            },
            get y() {
                return window.game.dimensions.position.y + (bullet.y - that.player.y) + height / 2 + that.player.height;
            }
        }
    }

    shoot() {
        for (var i = 0; i < this.ammo; i ++) {
            var bullet = new Bullet(this, this.player, (this.weaponAngle - ((this.ammo / 2) * 5) + 5) + (i * 5));
            window.game.bullets.push(bullet);
        }
    }

    getBarrelPosition() {
        // (20 + this.width) because this.length for gun length, and 20px for circle radius
      
        var distX = (15 + this.height) * cos(this.weaponAngle);
        var distY = (15 + this.height) * sin(this.weaponAngle);
      
        return {
          x: this.player.x + distX,
          y: this.player.y - distY
        }
    }

    checkBullets(bullets = [], enemies = []) {
        if (!bullets.length) {
            return false;
        }

        for (var i = 0; i < bullets.length; i ++) {
            var bullet = bullets[i];
            var coords = this.getCoords(bullet);

            if (coords.x < 0 || coords.y < 0 || coords.x > 3000 || coords.y > 3000) {
                bullets.splice(i, 1);
            }

            for (var j = 0; j < enemies.length; j ++) {
                var enemy = enemies[j];

                if (isColliding(bullet, enemy)) {
                    bullet.collide();
                    enemy.hurt(this.damage);
                    break;
                }
            }
        }

        return true;
    }

    drawBullets(bullets = []) {
        for (var i = 0; i < bullets.length; i ++) {
            var bullet = bullets[i];

            bullet.draw();
        }
    }

    updateBullets(bullets = []) {
        for (var i = 0; i < bullets.length; i ++) {
            var bullet = bullets[i];

            bullet.update();
        }
    }
}

class Bullet {
    constructor(weapon, player, angle) {
        this.weapon = weapon;
        this.player = player;
        this.angle = angle;

        this.x = this.weapon.getBarrelPosition().x;
        this.y = this.weapon.getBarrelPosition().y;
        this.width = 5;
        this.height = 5;
        this.speed = 4;
        this.penetration = weapon.penetration;
        this.time = 0;
        this.timeLimit = 60;

        this.collisions = 0;
    }

    draw() {
        graphic.push();
        graphic.fill("gold");
        graphic.rect(this.x, this.y, this.width, this.height);
        graphic.pop();
    }

    update() {
        this.time ++;
        // negative y bc positive y is downwards and thats inverse of the trig fn

        this.x += this.speed * cos(this.angle);
        this.y -= this.speed * sin(this.angle);

        if (this.time > this.timeLimit) {
            this.kill();
        }
    }

    collide() {
        this.collisions ++;

        if (this.collisions > this.penetration) {
            this.kill();
        }
    }

    kill() {
        window.game.bullets.splice(window.game.bullets.indexOf(this), 1);
    }
}

Player.prototype.Weapon.prototype.Bullet = Bullet;

export default Player;