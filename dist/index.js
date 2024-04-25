(() => {
  // assets/scripts/preload.js
  var preload_default = new Promise((resolve, reject) => {
    let loaded = 0;
    for (var src of [
      "/assets/p5/p5.js",
      "/assets/p5/addons/p5.sound.min.js"
    ]) {
      document.head.appendChild(Object.assign(document.createElement("script"), {
        src,
        async: false,
        onload: () => {
          loaded++;
          if (loaded === 2) {
            resolve();
          }
        }
      }));
    }
  });

  // assets/scripts/game/load.js
  var Loader = class {
    audio = false;
    weight = {
      images: 3 / 6,
      sounds: 1 / 6,
      fonts: 2 / 6
    };
    constructor() {
      this.btImage = loadImage("assets/images/BCTS.png");
      this.gameImage = loadImage("assets/images/logo.png");
      this.loadingFont = loadFont("assets/fonts/Roboto_Mono/static/RobotoMono-ExtraLight.ttf");
      this.startSound = loadSound("assets/sounds/startup.mp3");
      this.working = true;
      this.frame = 0;
      this.state = 0;
      this.progress = 0;
      this.loadTime = 0;
      this.startSound.setLoop(false);
    }
    render() {
      if (!this.audio) {
        return this.requestAudio();
      } else {
        this.frame++;
        if (!this.startSound.isPlaying()) {
          this.startSound.play();
        }
        if (this.state <= 3) {
          this.renderBCTS();
        } else if (this.state > 3) {
          this.renderSplash();
        }
      }
    }
    requestAudio() {
      push();
      background(0);
      textFont(this.loadingFont);
      textSize(20);
      textAlign(CENTER);
      fill(255);
      text("Click to enable audio", width / 2, height / 2);
      if (window.focused === true) {
        if (mouseIsPressed || keyIsPressed) {
          this.audio = true;
          this.frame = -30;
        }
      }
      pop();
    }
    load() {
      if (this.loadTime === 0) {
        this.assets = {
          images: [
            ["butterfly", window.game.loadImage("assets/images/butterfly.png")],
            ["logo", window.game.loadImage("assets/images/logo.png")],
            ["bt_logo", window.game.loadImage("assets/images/BCTS.png")],
            ["barricade", window.game.loadImage("assets/images/barricade.png")],
            ["box", window.game.loadImage("assets/images/box.png")],
            ["exit_image", window.game.loadImage("assets/images/exit.svg")],
            ["pause_image", window.game.loadImage("assets/images/pause.svg")],
            ["icon", window.game.loadImage("/assets/images/icon.png")],
            ["background", window.game.loadImage("/assets/images/background.png")],
            ["background_texture", window.game.loadImage("/assets/images/texture.png")],
            ["shotgun", window.game.loadImage("/assets/images/sheets/shotgun.png")],
            ["bullet", window.game.loadImage("/assets/images/sheets/bullet.png")],
            ["player_idle", window.game.loadImage("/assets/images/sheets/player_idle.png")],
            ["player_walk", window.game.loadImage("/assets/images/sheets/player_walk.png")],
            ["player_death", window.game.loadImage("/assets/images/sheets/player_death.png")],
            ["zombie_idle", window.game.loadImage("/assets/images/sheets/zombie_idle.png")],
            ["zombie_walk", window.game.loadImage("/assets/images/sheets/zombie_walk.png")],
            ["zombie_death", window.game.loadImage("/assets/images/sheets/zombie_death.png")],
            ["zombie_attack", window.game.loadImage("/assets/images/sheets/zombie_attack.png")],
            ["magnet", window.game.loadImage("/assets/images/magnet.png")],
            ["food", window.game.loadImage("/assets/images/food.png")],
            ["medbag", window.game.loadImage("/assets/images/medbag.png")],
            ["energy", window.game.loadImage("/assets/images/energy.png")],
            ["forcefield", window.game.loadImage("/assets/images/forcefield.png")],
            ["spinner", window.game.loadImage("/assets/images/spinner.png")],
            ["lightning", window.game.loadImage("/assets/images/lightning.png")],
            ["ball", window.game.loadImage("/assets/images/ball.png")],
            ["portal", window.game.loadImage("/assets/images/portal.png")]
          ],
          sounds: [
            ["game_main", "assets/sounds/game_main.mp3"],
            ["game_intro", "assets/sounds/game_intro.mp3"],
            ["game_menu", "assets/sounds/game_menu.mp3"]
          ],
          fonts: [
            ["roboto", "assets/fonts/Roboto_Mono/static/RobotoMono-Regular.ttf"],
            ["roboto_light", "assets/fonts/Roboto_Mono/static/RobotoMono-Light.ttf"]
          ]
        };
        this.loadedPts = 0;
        this.totalPts = 0;
        for (var type in this.assets) {
          for (var i = 0; i < this.assets[type].length; i++) {
            this.totalPts += this.weight[type];
          }
        }
      }
      this.loadTime++;
      if (this.progress >= 99.99) {
        setTimeout(() => {
          return this.working = false;
        }, 1e3);
      }
      for (var type in this.assets) {
        for (var i = 0; i < this.assets[type].length; i++) {
          if (typeof this.assets[type][i][1] === "string") {
            if (type === "images") {
            } else if (type === "fonts") {
              this.assets[type][i][1] = {
                get loaded() {
                  return !!this.font.font;
                },
                font: window.loadFont(this.assets[type][i][1])
              };
              continue;
            } else if (type === "sounds") {
              this.assets[type][i][1] = {
                get loaded() {
                  return this.sound.isLoaded();
                },
                sound: window.loadSound(this.assets[type][i][1])
              };
              continue;
            }
          }
          if (this.assets[type][i][1].loaded) {
            if (window.game.assets[type][this.assets[type][i][0]] !== void 0) {
              continue;
            }
            if (type === "images") {
              let img = window.loadImage(this.toBase64(this.assets[type][i][1]));
              window.game.assets[type][this.assets[type][i][0]] = img;
              this.loadedPts += this.weight[type];
            } else if (type === "fonts") {
              window.game.assets[type][this.assets[type][i][0]] = this.assets[type][i][1].font;
              this.loadedPts += this.weight[type];
            } else if (type === "sounds") {
              window.game.assets[type][this.assets[type][i][0]] = this.assets[type][i][1].sound;
              this.assets[type][i][1].sound.setLoop(true);
              this.loadedPts += this.weight[type];
            }
          }
        }
      }
      this.progress = this.loadedPts / this.totalPts * 100;
    }
    toBase64(img) {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d", {
        willReadFrequently: true
      });
      ctx.drawImage(img, 0, 0);
      return canvas.toDataURL();
    }
    changeState() {
      this.state++;
      this.frame = 0;
    }
    renderBCTS() {
      push();
      background(10);
      if (this.state === 0) {
        if (this.frame <= 50) {
          return;
        } else {
          return this.changeState();
        }
      } else if (this.state === 1) {
        if (this.frame < 50) {
          tint(255, this.frame % 50 * 2 * 5.1);
        } else {
          this.changeState();
        }
      } else if (this.state === 2) {
        if (this.frame > 100) {
          this.changeState();
        } else {
          tint(255, 255);
        }
      } else if (this.state === 3) {
        if (this.frame < 20) {
          tint(255, 255 - this.frame % 50 * 3 * 5.1);
        } else if (this.frame < 50) {
          return;
        } else {
          return this.changeState();
        }
      }
      var ratio = this.btImage.width / this.btImage.height;
      image(this.btImage, width / 2, height / 2, ratio * 250, 250);
      pop();
    }
    renderSplash() {
      push();
      background("#000004");
      if (this.state === 4) {
        if (this.frame > 80) {
          this.changeState();
        }
      }
      image(this.gameImage, width / 2, height / 2 - 100, 350, 350);
      if (this.state >= 5) {
        this.load();
        fill(0);
        strokeWeight(2);
        stroke(255);
        rect(width / 2, height / 2 + 100, 300, 36);
        fill("red");
        rectMode(CORNER);
        noStroke();
        rect(width / 2 - 148, height / 2 + 84, this.progress / 100 * 296, 32);
        if (this.progress > 100) {
          this.progress = 100;
        }
      }
      pop();
    }
  };

  // assets/scripts/game/collision.js
  function isColliding(z1, z2) {
    return abs(z1.x - z2.x) < (z1.width + z2.width) / 2 && abs(z1.y - z2.y) < (z1.height + z2.height) / 2;
  }
  function isCollidingCircle(z1, c1) {
    return abs(c1.x - z1.x) <= z1.width / 2 + c1.radius && abs(c1.y - z1.y) <= z1.height / 2 + c1.radius;
  }
  function handleCollision(z1, z2) {
    let overlapX = z1.width / 2 + z2.width / 2 - abs(z1.x - z2.x);
    let overlapY = z1.height / 2 + z2.height / 2 - abs(z1.y - z2.y);
    let pushFactor = 0.3;
    if (z1.x < z2.x) {
      z1.x -= overlapX / 2 * pushFactor;
      z2.x += overlapX / 2 * pushFactor;
    } else {
      z1.x += overlapX / 2 * pushFactor;
      z2.x -= overlapX / 2 * pushFactor;
    }
    if (z1.y < z2.y) {
      z1.y -= overlapY / 2 * pushFactor;
      z2.y += overlapY / 2 * pushFactor;
    } else {
      z1.y += overlapY / 2 * pushFactor;
      z2.y -= overlapY / 2 * pushFactor;
    }
  }
  function mouseHovering(z1) {
    let z2 = mouseX;
    let z3 = mouseY;
    return z2 > z1.x - z1.width / 2 && z2 < z1.x + z1.width / 2 && z3 > z1.y - z1.height / 2 && z3 < z1.y + z1.height / 2;
  }

  // assets/scripts/game/player.js
  var Player = class {
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
      this.facing = 0;
      this.weapon = new this.Weapon(this);
      this.loadSprites([
        window.game.assets.images.player_idle,
        window.game.assets.images.player_walk,
        window.game.assets.images.player_death
      ]);
    }
    loadSprites([
      idleSheet = [],
      walkingSheet = [],
      dyingSheet = []
    ]) {
      var idleWidth = idleSheet.width / 3;
      var idleHeight = idleSheet.height / 4;
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 4; j++) {
          var sprite = idleSheet.get(i * idleWidth, j * idleHeight, idleWidth, idleHeight);
          this.sprites.idle[j].push(sprite);
        }
      }
      var walkingWidth = walkingSheet.width / 5;
      var walkingHeight = walkingSheet.height / 4;
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          var sprite = walkingSheet.get(i * walkingWidth, j * walkingHeight, walkingWidth, walkingHeight);
          this.sprites.walking[j].push(sprite);
        }
      }
      var dyingWidth = dyingSheet.width / 5;
      var dyingHeight = dyingSheet.height / 4;
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
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
      };
    }
    checkBounds() {
      var coords = this.coords;
      if (coords.x < 0) {
        coords.x = 0;
      }
      if (coords.y < 0) {
        coords.y = 0;
      }
      if (coords.x > 3e3) {
        coords.x = 3e3;
      }
      if (coords.y > 3e3) {
        coords.y = 3e3;
      }
    }
    drawDeath() {
      this.deathState++;
      if (this.deathState > 20 && (this.deathState - 20) % 30 === 0 && this.currentSprite < 3) {
        this.currentSprite++;
      }
      graphic.push();
      graphic.rectMode(CENTER);
      var imgHeight = this.height;
      var imgWidth = this.sprites[this.state][this.facing][this.currentSprite].width / this.sprites[this.state][this.facing][this.currentSprite].height * imgHeight;
      graphic.image(this.sprites["dying"][this.facing][this.currentSprite], this.x, this.y, imgWidth, imgHeight);
      graphic.pop();
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
      health = Math.max(0, Math.min(100, health));
      let red = 0, green = 0;
      if (health > 50) {
        let factor = (1 - 2 * (health - 50) / 100) ** 2;
        red = Math.floor(255 * factor);
        green = 128;
      } else {
        let factor = (2 * health / 100) ** 2;
        red = 255;
        green = Math.floor(128 * factor);
      }
      return "#" + red.toString(16).padStart(2, "0") + green.toString(16).padStart(2, "0") + "00";
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
      var imgHeight = this.height;
      var imgWidth = this.sprites[this.state][this.facing][this.currentSprite].width / this.sprites[this.state][this.facing][this.currentSprite].height * imgHeight;
      graphic.image(this.sprites[this.state][this.facing][this.currentSprite], this.x, this.y, imgWidth, imgHeight);
      graphic.fill("red");
      graphic.rect(this.x, this.y + this.height / 2 + 15, 30, 5);
      graphic.fill("green");
      graphic.rectMode(CORNER);
      graphic.rect(this.x - this.width / 2 - 3, this.y + this.height / 2 + 12.5, this.health / this.maxHealth * 31, 5);
      graphic.pop();
    }
    update() {
      if (this.dead === true) {
        return false;
      }
      var [x, y] = this.getMovement();
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
        this.currentSprite++;
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
    }
    checkCollisions(enemies) {
      for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];
        if (isColliding(this, enemy)) {
          this.healthQueue += enemy.damage / 30;
        }
      }
    }
  };
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
    loadSprites(image2) {
      var imgWidth = image2.width;
      var imgHeight = image2.height / 18;
      for (let i = 0; i < 18; i++) {
        var sprite = image2.get(0, i * imgHeight, imgWidth, imgHeight);
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
      graphic.pop();
      graphic.push();
      graphic.fill("black");
      graphic.rect(this.player.x, this.player.y + this.player.height / 2 + 25, 30, 5);
      graphic.fill("gold");
      graphic.rectMode(CORNER);
      graphic.rect(this.player.x - this.player.width / 2 - 3, this.player.y + this.player.height / 2 + 22.5, 30 - this.weaponCooldown / this.baseCooldown * 30, 5);
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
      this.weaponCooldown--;
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
      };
    }
    shoot() {
      for (var i = 0; i < this.ammo; i++) {
        var bullet = new Bullet(this, this.player, this.weaponAngle - this.ammo / 2 * 5 + 5 + i * 5);
        window.game.bullets.push(bullet);
      }
    }
    getBarrelPosition() {
      var distX = (15 + this.height) * cos(this.weaponAngle);
      var distY = (15 + this.height) * sin(this.weaponAngle);
      return {
        x: this.player.x + distX,
        y: this.player.y - distY
      };
    }
    checkBullets(bullets = [], enemies = []) {
      if (!bullets.length) {
        return false;
      }
      for (var i = 0; i < bullets.length; i++) {
        var bullet = bullets[i];
        var coords = this.getCoords(bullet);
        if (coords.x < 0 || coords.y < 0 || coords.x > 3e3 || coords.y > 3e3) {
          bullets.splice(i, 1);
        }
        for (var j = 0; j < enemies.length; j++) {
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
      for (var i = 0; i < bullets.length; i++) {
        var bullet = bullets[i];
        bullet.draw();
      }
    }
    updateBullets(bullets = []) {
      for (var i = 0; i < bullets.length; i++) {
        var bullet = bullets[i];
        bullet.update();
      }
    }
  };
  var Bullet = class {
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
      this.time++;
      this.x += this.speed * cos(this.angle);
      this.y -= this.speed * sin(this.angle);
      if (this.time > this.timeLimit) {
        this.kill();
      }
    }
    collide() {
      this.collisions++;
      if (this.collisions > this.penetration) {
        this.kill();
      }
    }
    kill() {
      window.game.bullets.splice(window.game.bullets.indexOf(this), 1);
    }
  };
  Player.prototype.Weapon.prototype.Bullet = Bullet;
  var player_default = Player;

  // assets/scripts/game/background.js
  var Background = class {
    constructor() {
      this.bossBattle = false;
    }
    currentDimensions = null;
    draw({ dimensions: { position, center } }) {
      this.currentDimensions = { position, center };
      graphic.push();
      graphic.background(200);
      graphic.fill(0);
      graphic.rect(3e3 - position.x - center.x - width / 2 - 20, 3e3 - position.y - center.y - height / 2 - 40, 3060, 3080);
      graphic.fill(200);
      graphic.rect(3e3 - position.x - center.x - width / 2 - 20, 3e3 - position.y - center.y - height / 2 - 40, 3020, 3040);
      for (let i = -900; i < 3900; i += 300) {
        for (let j = -900; j < 3900; j += 300) {
          graphic.image(window.game.assets.images.background_texture, 1500 - position.x - center.x - width / 2 - 20 + i, 1500 - position.y - center.y - height / 2 - 40 + j, 300, 300);
        }
      }
      graphic.image(window.game.assets.images.background, 3e3 - position.x - center.x - width / 2 - 20, 3e3 - position.y - center.y - height / 2 - 40, 3040, 3040);
      graphic.pop();
    }
    drawPost({ dimensions: { position, center } }) {
      this.drawBorders({ dimensions: this.currentDimensions });
    }
    drawBorders({ dimensions: { position, center } }) {
      graphic.push();
      graphic.fill(0);
      var ratio = 996 / 230;
      var imgHeight = 22;
      var imgWidth = imgHeight * ratio;
      for (let i = 0; i < 3e3; i += imgWidth) {
        graphic.image(window.game.assets.images.barricade, 1500 - position.x - center.x - width / 2 + i, 1500 - position.y - center.y - height / 2 - 40 - 30, imgWidth, imgHeight);
      }
      graphic.image(window.game.assets.images.barricade, 1500 - position.x - center.x - width / 2 + 3e3 - imgWidth / 2 + 10 + 1, 1500 - position.y - center.y - height / 2 - 40 - 30, imgWidth, imgHeight);
      graphic.image(window.game.assets.images.barricade, 1500 - position.x - center.x - width / 2 - 3, 1500 - position.y - center.y - height / 2 - 40 - 30, imgWidth, imgHeight);
      "";
      for (let i = 0; i < 3e3; i += imgWidth) {
        graphic.push();
        graphic.translate(1500 - position.x - center.x - width / 2 + i, 1500 - position.y - center.y - height / 2 - 40 + 3e3 + 30);
        graphic.rotate(180);
        graphic.image(window.game.assets.images.barricade, 0, 0, imgWidth, imgHeight);
        graphic.pop();
      }
      graphic.push();
      graphic.translate(1500 - position.x - center.x - width / 2 + 3e3 - imgWidth / 2 + 10 + 1, 1500 - position.y - center.y - height / 2 - 40 + 3e3 + 30);
      graphic.rotate(180);
      graphic.image(window.game.assets.images.barricade, 0, 0, imgWidth, imgHeight);
      graphic.pop();
      graphic.push();
      graphic.translate(1500 - position.x - center.x - width / 2 - 3, 1500 - position.y - center.y - height / 2 - 40 + 3e3 + 30);
      graphic.rotate(180);
      graphic.image(window.game.assets.images.barricade, 0, 0, imgWidth, imgHeight);
      graphic.pop();
      for (let i = 0; i < 3e3 - imgWidth; i += imgWidth) {
        graphic.push();
        graphic.translate(1500 - position.x - center.x - width / 2 - 40, 1500 - position.y - center.y - height / 2 + i);
        graphic.rotate(-90);
        graphic.image(window.game.assets.images.barricade, 0, 0, imgWidth, imgHeight);
        graphic.pop();
      }
      graphic.push();
      graphic.translate(1500 - position.x - center.x - width / 2 - 40, 1500 - position.y - center.y - height / 2 - 15 + 1);
      graphic.rotate(-90);
      graphic.image(window.game.assets.images.barricade, 0, 0, imgWidth, imgHeight);
      graphic.pop();
      graphic.push();
      graphic.translate(1500 - position.x - center.x - width / 2 - 40, 1500 - position.y - center.y - height / 2 + 3e3 - imgWidth / 2 - 20);
      graphic.rotate(-90);
      graphic.image(window.game.assets.images.barricade, 0, 0, imgWidth, imgHeight);
      graphic.pop();
      for (let i = 0; i < 3e3 - imgWidth; i += imgWidth) {
        graphic.push();
        graphic.translate(1500 - position.x - center.x - width / 2 + 3e3, 1500 - position.y - center.y - height / 2 + i);
        graphic.rotate(90);
        graphic.image(window.game.assets.images.barricade, 0, 0, imgWidth, imgHeight);
        graphic.pop();
      }
      graphic.push();
      graphic.translate(1500 - position.x - center.x - width / 2 + 3e3, 1500 - position.y - center.y - height / 2 - 15 + 1);
      graphic.rotate(90);
      graphic.image(window.game.assets.images.barricade, 0, 0, imgWidth, imgHeight);
      graphic.pop();
      graphic.push();
      graphic.translate(1500 - position.x - center.x - width / 2 + 3e3, 1500 - position.y - center.y - height / 2 + 3e3 - imgWidth / 2 - 20);
      graphic.rotate(90);
      graphic.image(window.game.assets.images.barricade, 0, 0, imgWidth, imgHeight);
      graphic.pop();
      graphic.pop();
    }
  };

  // assets/scripts/game/objects/generic.js
  var GenericObject = class {
    constructor(x = 0, y = 0, width2 = 0, height2 = 0, health = 0, damage = 0, color = "white", image2 = null) {
      this.x = x;
      this.y = y;
      this.width = width2;
      this.height = height2;
      this.health = health;
      this.damage = damage;
      this.color = color;
      this.image = image2;
    }
    getCoords() {
      return {
        x: this.x - window.game.player.coords.x + width / 2,
        y: this.y - window.game.player.coords.y + height / 2
      };
    }
    draw() {
      const coords = this.getCoords();
      graphic.push();
      graphic.noStroke();
      this.update?.call(this);
      graphic.fill(this.color);
      if (this.image) {
        graphic.image(this.image, coords.x, coords.y, this.width, this.height);
      } else {
        graphic.fill(this.color);
        graphic.rect(coords.x, coords.y, this.width, this.height);
      }
      graphic.pop();
    }
    hurt(dmg) {
      this.health -= dmg;
      window.game.damage.add(dmg, this.getCoords().x, this.getCoords().y);
      if (this.health <= 0) {
        this.kill();
      }
    }
    kill() {
      window.game.objects.objects.splice(window.game.objects.objects.indexOf(this), 1);
    }
  };

  // assets/scripts/game/enemies/generic.js
  var Enemy = class {
    constructor(x = 0, y = 0, width2 = 10, height2 = 10, health = 20, damage = 2, speed = 1, dropChance = 0.5, color = "black", img = null) {
      this.x = x;
      this.y = y;
      this.health = health;
      this.damage = damage;
      this.width = width2;
      this.height = height2;
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
      };
    }
    get onScreen() {
      return !(this.x < 0 - this.width || this.y < 0 - this.height || this.x > width + this.width || this.y > height + this.height);
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
    }
    checkBounds() {
      var coords = this.coords;
      if (coords.x < 0) {
        coords.x = 0;
      }
      if (coords.y < -5) {
        coords.y = -5;
      }
      if (coords.x > 3e3) {
        coords.x = 3e3;
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
  };

  // assets/scripts/game/enemies/butterfly.js
  var Butterfly = class _Butterfly extends Enemy {
    constructor(x = 0, y = 0) {
      super(x, y, 15, 15, 10, 2, 1.2, 0.45, "purple", window.game.assets.images.butterfly);
      if (_Butterfly.prototype.health) {
        this.health = _Butterfly.prototype.health;
      }
      this._update = this.update;
      this.update = () => {
        this._update();
        this.offsetY = sin(frameCount % 120 * (3 / 2)) * 5;
      };
    }
  };

  // assets/scripts/game/enemies/zombie.js
  var Zombie = class _Zombie extends Enemy {
    constructor(x = 0, y = 0) {
      super(x, y, 20, 30, 20, 3.5, 0.7, 0.55, "green", null);
      if (_Zombie.prototype.health) {
        this.health = _Zombie.prototype.health;
      }
      this.state = "idle";
      this.facing = 0;
      this.currentSprite = 0;
      this.offsetY = 2;
      this.update = () => {
        if (frameCount % 15 === 0) {
          this.currentSprite++;
        }
        if (this.currentSprite >= this.sprites[this.state][0].length) {
          this.currentSprite = 0;
        }
        this.img = this.sprites[this.state][this.facing][this.currentSprite];
        this.checkBounds();
        var angle = atan2(window.game.player.y - this.y, window.game.player.x - this.x);
        var speedX = this.speed * cos(angle);
        var speedY = this.speed * sin(angle);
        if (abs(speedX) > 0.1 || abs(speedY) > 0.1) {
          this.state = "walking";
          if (abs(this.speedY) > abs(this.speedX)) {
            this.facing = 0;
          }
          if (abs(this.speedY) < abs(this.speedX)) {
            if (this.speedX > 0) {
              this.facing = 2;
            } else {
              this.facing = 3;
            }
          }
        } else {
          this.state = "idle";
        }
        this.x += speedX;
        this.y += speedY;
      };
      this.draw = () => {
        if (!this.onScreen) {
          return;
        }
        graphic.push();
        if (this.img) {
          var imgWidth = 30 * 1.7;
          var imgHeight = this.img.height * (this.width / (this.img.width * 0.75)) * 1.7;
          graphic.fill(this.color);
          graphic.image(this.img, this.x, this.y - (this.offsetY || 0), imgWidth, imgHeight);
        } else {
          graphic.fill(this.color);
          graphic.rect(this.x, this.y, this.width, this.height);
        }
        graphic.pop();
      };
    }
  };
  Zombie.prototype.sprites = {
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
    ],
    attacking: [
      [],
      [],
      [],
      []
    ]
  };

  // assets/scripts/game/enemies/zombieBoss.js
  var ZombieBoss = class _ZombieBoss extends Enemy {
    get sprites() {
      return window.game.enemies.types.Zombie.prototype.sprites;
    }
    constructor(x = 0, y = 0) {
      super(x, y, 34, 51, 1e3, 5, 0.8, 1, "green", null);
      if (_ZombieBoss.prototype.health) {
        this.health = _ZombieBoss.prototype.health;
      }
      this.state = "idle";
      this.facing = 0;
      this.currentSprite = 0;
      this.offsetY = 2;
      this.update = () => {
        if (frameCount % 15 === 0) {
          this.currentSprite++;
        }
        if (this.currentSprite >= this.sprites[this.state][0].length) {
          this.currentSprite = 0;
        }
        this.img = this.sprites[this.state][this.facing][this.currentSprite];
        this.checkBounds();
        var angle = atan2(window.game.player.y - this.y, window.game.player.x - this.x);
        var speedX = this.speed * cos(angle);
        var speedY = this.speed * sin(angle);
        if (abs(speedX) > 0.1 || abs(speedY) > 0.1) {
          this.state = "walking";
          if (abs(this.speedY) > abs(this.speedX)) {
            this.facing = 0;
          }
          if (abs(this.speedY) < abs(this.speedX)) {
            if (this.speedX > 0) {
              this.facing = 2;
            } else {
              this.facing = 3;
            }
          }
        } else {
          this.state = "idle";
        }
        this.x += speedX;
        this.y += speedY;
      };
      this.draw = () => {
        if (!this.onScreen) {
          return;
        }
        graphic.push();
        if (this.img) {
          var imgWidth = 42 * 1.7;
          var imgHeight = this.img.height * (this.width / (this.img.width * 0.75)) * 1.7;
          graphic.fill(this.color);
          graphic.image(this.img, this.x, this.y - (this.offsetY || 0), imgWidth, imgHeight);
        } else {
          graphic.fill(this.color);
          graphic.rect(this.x, this.y, this.width, this.height);
        }
        graphic.pop();
      };
      this.kill = () => {
        window.game.enemies_arr.splice(window.game.enemies_arr.indexOf(this), 1);
        var drop = window.game.objects.spawnObject("diamond", [this.coords.x, this.coords.y]);
        drop.value = 100 * window.game.level;
      };
    }
  };

  // assets/scripts/game/enemies/finalBoss.js
  var FinalBoss = class extends Enemy {
    constructor(x = 0, y = 0) {
      super(x, y, 60, 60, 6e3, 10, 0, 0, "black", null);
    }
  };

  // assets/scripts/game/enemies.js
  var Enemies = class {
    types = {
      Zombie,
      Butterfly,
      FinalBoss,
      ZombieBoss
    };
    constructor(game2) {
      this.enemies = game2.enemies_arr;
      this.game = game2;
      this.loadZombieSprites([
        game2.assets.images.zombie_idle,
        game2.assets.images.zombie_walk,
        game2.assets.images.zombie_death,
        game2.assets.images.zombie_attack
      ]);
    }
    spawnEnemy(type = "zombie") {
      switch (type) {
        default:
        case "zombie":
          this.enemies.push(new Zombie(...this.randomSpawnPoint()));
          break;
        case "butterfly":
          this.enemies.push(new Butterfly(...this.randomSpawnPoint()));
          break;
        case "zombie_boss":
          this.enemies.push(new ZombieBoss(...this.randomSpawnPoint()));
          break;
      }
    }
    randomSpawnPoint() {
      var rand = Math.floor(random(0, 3));
      let x = 0;
      let y = random(-20, height + 20);
      switch (rand) {
        case 0:
          x = -10;
          break;
        case 1:
          x = random(0, width);
          if (Math.floor(random(0, 2))) {
            y = random(-50, -20);
          } else {
            y = random(height + 50, height + 20);
          }
          break;
        case 2:
          x = width + 10;
          break;
        default:
          break;
      }
      if (x - window.game.player.x + window.game.player.coords.x > 3e3 || x - window.game.player.x + window.game.player.coords.x < 0 || y - window.game.player.y + window.game.player.coords.y > 3e3 || y - window.game.player.y + window.game.player.coords.y < 0) {
        return this.randomSpawnPoint();
      }
      return [x, y];
    }
    draw(enemies) {
      for (var i = 0; i < enemies.length; i++) {
        enemies[i].draw();
      }
    }
    update(enemies) {
      var cloned = this.game.getTargets().slice(0);
      for (var i = 0; i < enemies.length; i++) {
        enemies[i].update();
        enemies[i].checkCollisions(cloned);
      }
    }
    loadZombieSprites([
      idleSheet = [],
      walkingSheet = [],
      dyingSheet = [],
      attackingSheet = []
    ]) {
      var idleWidth = idleSheet.width / 6;
      var idleHeight = idleSheet.height / 4;
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 4; j++) {
          var sprite = idleSheet.get(i * idleWidth, j * idleHeight, idleWidth, idleHeight);
          this.types.Zombie.prototype.sprites.idle[j].push(sprite);
        }
      }
      var walkingWidth = walkingSheet.width / 11;
      var walkingHeight = walkingSheet.height / 4;
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 4; j++) {
          var sprite = walkingSheet.get(i * walkingWidth, j * walkingHeight, walkingWidth, walkingHeight);
          this.types.Zombie.prototype.sprites.walking[j].push(sprite);
        }
      }
      var dyingWidth = dyingSheet.width / 8;
      var dyingHeight = dyingSheet.height / 4;
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 4; j++) {
          var sprite = dyingSheet.get(i * dyingWidth, j * dyingHeight, dyingWidth, dyingHeight);
          this.types.Zombie.prototype.sprites.dying[j].push(sprite);
        }
      }
      var attackingWidth = attackingSheet.width / 9;
      var attackingHeight = attackingSheet.height / 4;
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 4; j++) {
          var sprite = attackingSheet.get(i * attackingWidth, j * attackingHeight, attackingWidth, attackingHeight);
          this.types.Zombie.prototype.sprites.attacking[j].push(sprite);
        }
      }
      return true;
    }
  };

  // assets/scripts/game/objects/box.js
  function probability(inp) {
    var rand = random(0, 1);
    var sorted = inp.toSorted((a, b) => a[1] - b[1]);
    var lastMin = 0;
    for (var i = 0; i < sorted.length; i++) {
      var current = sorted[i];
      if (rand >= lastMin && rand <= lastMin + current[1]) {
        return current[0];
      } else {
        lastMin = current[1];
      }
    }
  }
  var Box = class extends GenericObject {
    drops = [
      ["magnet", 0.2],
      ["food", 0.1],
      ["emerald", 0.7]
    ];
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
      this.draw = () => {
      };
    }
    hurt(dmg) {
      this.health -= dmg;
      window.game.damage.add(dmg, this.getCoords().x, this.getCoords().y);
      if (this.health <= 0) {
        this.kill();
      }
    }
  };

  // assets/scripts/game/objects/emerald.js
  var Emerald = class extends GenericObject {
    constructor(x = 0, y = 0) {
      super(x, y, 7, 7, 0, 0, "#44ba38", null);
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
      var coords = this.getCoords();
      var distPlayer = dist(coords.x, coords.y, window.game.player.x, window.game.player.y);
      if (distPlayer < 3) {
        distPlayer = 3;
      }
      if (distPlayer < 50) {
        var angle = atan2(window.game.player.y - coords.y, window.game.player.x - coords.x);
        var speedX = 50 * cos(angle) / distPlayer;
        var speedY = 50 * sin(angle) / distPlayer;
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
  };

  // assets/scripts/game/objects/magnet.js
  var Magnet = class extends GenericObject {
    constructor(x = 0, y = 0) {
      super(x, y, 30, 30, 0, 0, "blue", window.game.assets.images.magnet);
    }
    update() {
      if (this.collecting) {
        return this.updateCollection();
      }
      var coords = this.getCoords();
      var distPlayer = dist(coords.x, coords.y, window.game.player.x, window.game.player.y);
      if (distPlayer < 3) {
        distPlayer = 3;
      }
      if (distPlayer < 40) {
        var angle = atan2(window.game.player.y - coords.y, window.game.player.x - coords.x);
        var speedX = 50 * cos(angle) / distPlayer;
        var speedY = 50 * sin(angle) / distPlayer;
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
      return window.game.objects.objects.filter((obj) => obj instanceof Emerald);
    }
    updateCollection() {
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
        var speedX = 8 * cos(angle);
        var speedY = 8 * sin(angle);
        emerald.x += speedX;
        emerald.y += speedY;
      }
    }
  };

  // assets/scripts/game/objects/food.js
  var Food = class extends GenericObject {
    constructor(x = 0, y = 0) {
      super(x, y, 30, 30, 0, 0, "brown", window.game.assets.images.food);
      this.heal = 40;
    }
    update() {
      var coords = this.getCoords();
      var distPlayer = dist(coords.x, coords.y, window.game.player.x, window.game.player.y);
      if (distPlayer < 3) {
        distPlayer = 3;
      }
      if (distPlayer < 40) {
        var angle = atan2(window.game.player.y - coords.y, window.game.player.x - coords.x);
        var speedX = 50 * cos(angle) / distPlayer;
        var speedY = 50 * sin(angle) / distPlayer;
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
  };

  // assets/scripts/game/objects/diamond.js
  var Diamond = class extends GenericObject {
    constructor(x = 0, y = 0) {
      super(x, y, 7, 7, 0, 0, "#0070a2", null);
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
      var coords = this.getCoords();
      var distPlayer = dist(coords.x, coords.y, window.game.player.x, window.game.player.y);
      if (distPlayer < 3) {
        distPlayer = 3;
      }
      if (distPlayer < 50) {
        var angle = atan2(window.game.player.y - coords.y, window.game.player.x - coords.x);
        var speedX = 50 * cos(angle) / distPlayer;
        var speedY = 50 * sin(angle) / distPlayer;
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
  };

  // assets/scripts/game/objects.js
  var Objects = class {
    constructor(game2) {
      this.game = game2;
      this.objects = [];
      for (let i = 0; i < 15; i++) {
        this.spawnObject("box", this.randomSpawnPoint());
      }
    }
    spawnObject(type, [x, y]) {
      let object = null;
      switch (type) {
        case "box":
          object = new Box(x, y);
          break;
        case "emerald":
          object = new Emerald(x, y);
          break;
        case "magnet":
          object = new Magnet(x, y);
          break;
        case "food":
          object = new Food(x, y);
          break;
        case "diamond":
          object = new Diamond(x, y);
          break;
      }
      this.objects.push(object);
      return object;
    }
    randomSpawnPoint() {
      return [
        random(0, 3e3),
        random(0, 3e3)
      ];
    }
    render(objects = []) {
      for (let i = 0; i < objects.length; i++) {
        objects[i].draw();
      }
    }
  };

  // assets/scripts/game/currency.js
  var Currency = class {
    getLevelRequired(level) {
      return 20 * (level < 30 ? level ** 1.45 : level < 40 ? level ** 1.7 : level ** 2);
    }
    constructor(game2) {
      this.total = 0;
      this.current = 0;
      this.required = this.getLevelRequired(1);
      this.game = game2;
      this.startEmeralds();
    }
    startEmeralds() {
      const player = this.game.player;
      const angle = 360 / 15;
      const deviation = () => random(-10, 10);
      const radius = 100;
      for (let i = 0; i < 15; i++) {
        const ang = angle * i;
        const dev = deviation();
        const x = player.coords.x + radius * cos(ang + dev);
        const y = player.coords.y + radius * sin(ang + dev);
        var emerald = this.game.objects.spawnObject("emerald", [x, y]);
        emerald.value = 3;
      }
    }
    dropCurrency(enemy) {
      const drop = this.game.objects.spawnObject("emerald", [enemy.coords.x, enemy.coords.y]);
      drop.value = Math.floor(random(1, 5) * this.game.level);
    }
    collected(currency) {
      const value = currency.value;
      this.current += value;
      this.total += value;
      this.game.score += value / 5;
    }
    checkUpgrades() {
      if (this.current > this.required) {
        var original = this.current;
        this.current = this.required;
        this.game.level++;
        this.game.requestUpgrade(this.game.level).then(() => {
          this.current = original - this.required;
          this.required = this.getLevelRequired(this.game.level);
        }).catch((err) => {
          console.error(err);
          this.current = original;
        });
      }
    }
  };

  // assets/scripts/game/upgrades/gun.js
  var Upgrade = class {
    level = 0;
    max = false;
    data = [
      // [ gun bullets add #, reload speed decrease %, bullet speed increase %, bullet damage increase %, name ]
      [
        3,
        5,
        0,
        25,
        "+3 Bullets, Faster Reload and Increased Damage"
      ],
      [
        0,
        10,
        10,
        20,
        "Faster Reload, Bullet Speed and Increased Damage"
      ],
      [
        2,
        5,
        0,
        0,
        "+2 Bullets and Faster Reload"
      ],
      [
        0,
        10,
        10,
        10,
        "Faster Reload, Bullet Speed and Increased Damage"
      ],
      [
        2,
        3,
        0,
        30,
        "+2 Bullets, Faster Reload and Increased Damage"
      ]
    ];
    constructor(game2) {
      this.name = "Shotgun";
      this.maxLevel = 5;
      this.description = this.data[0][4];
      this.image = window.game.player.weapon.sprites[0];
      this.game = game2;
    }
    upgrade() {
      if (this.max === true) {
        return false;
      }
      this.level++;
      var level = this.level - 1;
      var data = this.data[level];
      this.game.player.weapon.ammo += data[0];
      this.game.player.weapon.baseCooldown -= data[1];
      this.game.player.weapon.weaponCooldown -= data[1];
      this.game.player.weapon.damage *= (100 + data[3]) / 100;
      this.game.player.weapon.Bullet.prototype.speed *= (100 + data[2]) / 100;
      if (this.level + 1 <= this.maxLevel) {
        this.description = this.data[this.level][4];
      } else {
        this.max = true;
      }
    }
    render() {
    }
    update() {
    }
  };

  // assets/scripts/game/upgrades/spinner.js
  var Upgrade2 = class {
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
    ];
    spinners = [
      // { x, y, angle }
    ];
    numSpinners = 0;
    spinnerSpeed = 2.5;
    damage = 15;
    cooldown = 3500;
    constructor(game2) {
      this.name = "Spinner";
      this.maxLevel = 5;
      this.description = this.data[0][4];
      this.image = game2.assets.images.spinner;
      this.game = game2;
    }
    upgrade() {
      if (this.max === true) {
        return false;
      }
      this.level++;
      var level = this.level - 1;
      var data = this.data[level];
      for (let i = 0; i < data[0]; i++) {
        this.spinners.push(
          new Spinner(this)
        );
      }
      this.numSpinners += data[0];
      this.spinnerSpeed *= (100 + data[1]) / 100;
      this.damage *= (100 + data[2]) / 100;
      this.cooldown *= (100 - data[3]) / 100;
      this.spaceSpinners();
      if (this.level <= this.maxLevel - 1) {
        this.description = this.data[this.level][4];
      } else {
        this.max = true;
      }
    }
    render() {
      this.spinners.forEach((spinner) => spinner.draw());
    }
    update() {
      this.spinners.forEach((spinner) => spinner.update());
    }
    spaceSpinners() {
      var angle = 360 / this.numSpinners;
      this.spinners.forEach((spinner, index) => {
        spinner.angle = angle * (index + 1);
      });
    }
  };
  var Spinner = class {
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
      graphic.rectMode(CENTER);
      graphic.fill("red");
      graphic.rotate(this.rotation);
      graphic.image(this.parent.image, 0, 0, 25, 25);
      graphic.pop();
    }
    // adding 85 degrees just works and i cant figure out the math
    get x() {
      return this.parent.game.player.x - 65 * cos(this.angle + 85);
    }
    get y() {
      return this.parent.game.player.y - 65 * sin(this.angle + 85);
    }
    update() {
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
          if (!enemy.lastHurt || enemy.lastHurt && frameCount - enemy.lastHurt > 20) {
            enemy.lastHurt = frameCount;
            enemy.hurt(this.parent.damage);
          }
        }
      }
    }
  };

  // assets/scripts/game/upgrades/lightning.js
  var Upgrade3 = class {
    level = 0;
    max = false;
    data = [
      // [ radius add #, damage add #, num bolts add #, filler, name ]
      [
        10,
        100,
        1,
        0,
        "Strikes random target on screen"
      ],
      [
        5,
        50,
        0,
        0,
        "Greater Radius and Increased Damage"
      ],
      [
        5,
        50,
        1,
        0,
        "+1 Bolt"
      ]
    ];
    bolts = [];
    numBolts = 0;
    cooldown = 180;
    // 3s 180 frames
    radius = 5;
    damage = 10;
    frames = 0;
    constructor(game2) {
      this.name = "Lightning";
      this.maxLevel = 3;
      this.description = this.data[0][4];
      this.image = game2.assets.images.lightning;
      this.game = game2;
    }
    upgrade() {
      if (this.max === true) {
        return false;
      }
      this.level++;
      var level = this.level - 1;
      var data = this.data[level];
      this.radius += data[0];
      this.damage += data[1];
      this.numBolts += data[2];
      if (this.level + 1 <= this.maxLevel) {
        this.description = this.data[this.level][4];
      } else {
        this.max = true;
      }
    }
    render() {
      this.frames++;
      this.bolts.forEach((bolt) => bolt.draw());
    }
    update() {
      if (this.frames % this.cooldown === 0) {
        for (let i = 0; i < this.numBolts; i++) {
          this.bolts.push(
            new LightningBolt(this)
          );
        }
      } else {
        this.bolts.forEach((bolt) => bolt.update());
      }
    }
  };
  var LightningBolt = class {
    constructor(parent) {
      this.parent = parent;
      this.angle = Math.random() * 360;
      this.radius = this.parent.radius;
      this.damage = this.parent.damage;
      this.frames = 0;
      this.target = this.selectTarget();
      if (this.target === null) {
        return this.destroy();
      }
      this.x = this.target.x, this.y = this.target.y;
      if (this.radius < 5) {
        this.radius = 5;
      }
      if (this.damage < 1) {
        this.damage = 1;
      }
    }
    selectTarget() {
      var targets = window.game.getTargets().filter((enemy) => {
        var { x, y } = enemy;
        return x > 0 && x < width && y > 0 && y < height;
      });
      if (targets.length === 0) {
        return null;
      }
      return targets[Math.floor(Math.random() * targets.length)];
    }
    draw() {
      try {
        if (this.target === null) {
          return;
        }
        var { x, y } = this;
        graphic.push();
        graphic.translate(x, y);
        graphic.fill("blue");
        graphic.circle(0, 0, this.radius * 2);
        graphic.pop();
      } catch (e) {
        console.error(e);
      }
    }
    update() {
      this.frames++;
      if (this.frames > 80) {
        this.destroy();
      }
      if (this.frames < 2) {
        this.checkCollisions(window.game.getTargets());
      }
    }
    checkCollisions(targets) {
      for (let i = 0; i < targets.length; i++) {
        var target = targets[i];
        if (isCollidingCircle(target, this)) {
          target.hurt(this.damage);
        }
      }
    }
    destroy() {
      var index = this.parent.bolts.indexOf(this);
      if (index > -1) {
        this.parent.bolts.splice(index, 1);
      }
    }
  };

  // assets/scripts/game/upgrades/heal.js
  var Upgrade4 = class {
    level = 0;
    max = false;
    data = [
      // [ # health, name ]
      [
        1,
        "Heal 1% every 5 seconds"
      ],
      [
        2,
        "Heal 2% every 5 seconds"
      ],
      [
        3,
        "Heal 3% every 5 seconds"
      ],
      [
        4,
        "Heal 4% every 5 seconds"
      ],
      [
        5,
        "Heal 5% every 5 seconds"
      ]
    ];
    constructor(game2) {
      this.name = "Healing";
      this.maxLevel = 5;
      this.description = this.data[0][1];
      this.image = game2.assets.images.medbag;
      this.game = game2;
    }
    heal = 0;
    upgrade() {
      if (this.max === true) {
        return false;
      }
      this.level++;
      var level = this.level - 1;
      var data = this.data[level];
      this.heal = data[0];
      if (this.level + 1 <= this.maxLevel) {
        this.description = this.data[this.level][1];
      } else {
        this.max = true;
      }
    }
    render() {
    }
    update() {
      if (this.game.frames % 300 === 0) {
        this.game.player.health += this.heal;
      }
      if (this.game.player.health > this.game.player.maxHealth) {
        this.game.player.health = this.game.player.maxHealth;
      }
    }
  };

  // assets/scripts/game/upgrades/forcefield.js
  var Upgrade5 = class {
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
    ];
    radius = 0;
    damage = 15;
    cooldown = 25;
    constructor(game2) {
      this.name = "Forcefield";
      this.maxLevel = 5;
      this.description = this.data[0][2];
      this.image = game2.assets.images.forcefield;
      this.game = game2;
    }
    upgrade() {
      if (this.max === true) {
        return false;
      }
      this.level++;
      var level = this.level - 1;
      var data = this.data[level];
      this.radius += data[0];
      this.damage *= 1 + data[1] / 100;
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
        graphic.stroke(255, 255, 255, frameCount % this.cooldown * (this.radius / this.cooldown));
        graphic.ellipse(window.game.player.x, window.game.player.y, frameCount % this.cooldown * (this.radius * 2 / this.cooldown));
        graphic.pop();
      }
    }
    update() {
      if (this.level > 0) {
        var enemies = window.game.getTargets();
        for (var i = 0; i < enemies.length; i++) {
          var enemy = enemies[i];
          if (isCollidingCircle(enemy, this)) {
            if (frameCount % this.cooldown === 0) {
              enemy.hurt(this.damage);
            }
          }
        }
      }
    }
  };

  // assets/scripts/game/upgrades/speed.js
  var Upgrade6 = class {
    level = 0;
    max = false;
    data = [
      // [ speed increase %, name ]
      [
        5,
        "+5% Speed"
      ],
      [
        5,
        "+10% Speed"
      ],
      [
        5,
        "+15% Speed"
      ],
      [
        5,
        "+20% Speed"
      ],
      [
        5,
        "+25% Speed"
      ]
    ];
    constructor(game2) {
      this.name = "Energy Drink";
      this.maxLevel = 5;
      this.description = this.data[0][1];
      this.image = game2.assets.images.energy;
      this.game = game2;
    }
    upgrade() {
      if (this.max === true) {
        return false;
      }
      this.level++;
      var level = this.level - 1;
      var data = this.data[level];
      this.game.player.speed *= 1 + data[0] / 100;
      if (this.level + 1 <= this.maxLevel) {
        this.description = this.data[this.level][1];
      } else {
        this.max = true;
      }
    }
    render() {
    }
    update() {
    }
  };

  // assets/scripts/game/upgrades/ball.js
  var Upgrade7 = class {
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
    ];
    balls = [];
    cooldown = 300;
    numBalls = 0;
    ballSpeed = 5;
    damage = 20;
    constructor(game2) {
      this.name = "Ball";
      this.maxLevel = 5;
      this.description = this.data[0][4];
      this.image = game2.assets.images.ball;
      this.game = game2;
    }
    upgrade() {
      if (this.max === true) {
        return false;
      }
      this.level++;
      var level = this.level - 1;
      var data = this.data[level];
      this.numBalls += data[0];
      this.ballSpeed *= 1 + data[1] / 100;
      this.cooldown *= 1 - data[2] / 100;
      this.damage *= 1 + data[3] / 100;
      if (this.level + 1 <= this.maxLevel) {
        this.description = this.data[this.level][4];
      } else {
        this.max = true;
      }
    }
    render() {
      this.balls.forEach((ball) => ball.render());
    }
    update() {
      var targets = this.game.getTargets();
      this.balls.forEach((ball) => ball.update(targets));
      if (this.game.frames % this.cooldown === 0) {
        for (let i = 0; i < this.numBalls; i++) {
          this.balls.push(new Ball(this.game, this.ballSpeed, this));
        }
      }
    }
  };
  var Ball = class {
    get damage() {
      return this.parent.damage;
    }
    constructor(game2, speed, parent) {
      this.game = game2;
      this.speed = speed;
      this.parent = parent;
      this.x = game2.player.x;
      this.y = game2.player.y;
      this.radius = 8;
      this.rotation = 0;
      this.time = 0;
      this.xSpeed = random(-this.speed, this.speed);
      this.ySpeed = random(-this.speed, this.speed);
    }
    render() {
      graphic.push();
      graphic.translate(this.x, this.y);
      graphic.imageMode(CENTER);
      graphic.rotate(this.rotation);
      graphic.image(this.parent.image, 0, 0, this.radius * 3, this.radius * 3);
      graphic.pop();
    }
    update(targets) {
      this.x += this.xSpeed;
      this.y += this.ySpeed;
      this.time++;
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
      targets.forEach((target) => {
        if (isCollidingCircle(target, this)) {
          if (!target.lastHurtBall || target.lastHurtBall && frameCount - target.lastHurtBall > 20) {
            target.lastHurtBall = frameCount;
            target.hurt(this.damage);
          }
        }
      });
    }
  };

  // assets/scripts/game/upgrades.js
  var UpgradeScreen = class {
    listeners = [
      // [event, callback]
    ];
    time = 0;
    selected = false;
    constructor(game2, upgrades, level) {
      this.game = game2;
      this.upgrades = upgrades;
      this.level = level;
      this.on("select", (upgrade) => {
        this.selected = true;
        if (upgrade) {
          upgrade.upgrade();
          if (!this.game.upgrades.currentUpgrades.find((u) => u[0] === upgrade)) {
            this.game.upgrades.currentUpgrades.push([upgrade, upgrade.level]);
          } else {
            this.game.upgrades.currentUpgrades.find((u) => u[0] === upgrade)[1] = upgrade.level;
          }
        }
        this.emit("upgrade");
      });
    }
    createUpgradeGraphic(upgrade = {
      name: "None",
      description: "No upgrade available",
      image: null
    }) {
      const tempGraphic = createGraphics(120, 200);
      tempGraphic.background(this.game.menuColor);
      tempGraphic.rectMode(CORNER);
      tempGraphic.textWrap(WORD);
      tempGraphic.fill(0);
      tempGraphic.textAlign(CENTER);
      tempGraphic.textSize(20);
      tempGraphic.text(upgrade.name, 60, 30);
      if (upgrade.image) {
        tempGraphic.imageMode(CENTER);
        var imgWidth = 100;
        var imgHeight = upgrade.image.height * (imgWidth / upgrade.image.width);
        tempGraphic.image(upgrade.image, 65, 85, imgWidth, imgHeight);
      }
      tempGraphic.textSize(13);
      tempGraphic.text(upgrade.description || "", 10, 135, 100, 60);
      tempGraphic.fill(0);
      tempGraphic.rect(0, 0, 120, 2);
      tempGraphic.rect(0, 0, 2, 200);
      tempGraphic.rect(0, 198, 120, 2);
      tempGraphic.rect(118, 0, 2, 200);
      return tempGraphic;
    }
    render() {
      if (this.fading) {
        this.time--;
        graphic.push();
        graphic.rectMode(CORNER);
        graphic.fill(0, 0, 0, 255 * ((this.time > 30 ? 30 : this.time) / 30) * 0.5);
        graphic.rect(0, 0, width, height);
        graphic.pop();
        return;
      } else {
        this.time++;
      }
      graphic.push();
      graphic.rectMode(CORNER);
      graphic.imageMode(CENTER);
      graphic.fill(0, 0, 0, 255 * ((this.time > 30 ? 30 : this.time) / 30) * 0.5);
      graphic.rect(0, 0, width, height);
      var graphic1 = this.createUpgradeGraphic(this.upgrades[0] || void 0);
      var graphic2 = this.createUpgradeGraphic(this.upgrades[1] || void 0);
      var graphic3 = this.createUpgradeGraphic(this.upgrades[2] || void 0);
      graphic1.x = width / 2 - 150;
      graphic2.x = width / 2;
      graphic3.x = width / 2 + 150;
      graphic1.y = height / 2 + 75;
      graphic2.y = height / 2 + 75;
      graphic3.y = height / 2 + 75;
      graphic1.width = 120;
      graphic2.width = 120;
      graphic3.width = 120;
      graphic1.height = 200;
      graphic2.height = 200;
      graphic3.height = 200;
      graphic.fill("gold");
      graphic.rectMode(CENTER);
      graphic.strokeWeight(3);
      graphic.stroke(0);
      graphic.rect(width / 2, 200, 200, 40);
      graphic.noStroke();
      graphic.fill("black");
      graphic.textSize(22);
      graphic.textAlign(CENTER);
      graphic.text("Upgrades", width / 2, 208);
      graphic.imageMode(CORNER);
      if (mouseHovering(graphic1)) {
        cursor(HAND);
        graphic.push();
        graphic.image(graphic1, graphic1.x - 60, graphic1.y - 100);
        graphic.pop();
      } else {
        graphic.image(graphic1, graphic1.x - 60, graphic1.y - 100);
      }
      if (mouseHovering(graphic2)) {
        cursor(HAND);
        graphic.push();
        graphic.image(graphic2, graphic2.x - 60, graphic2.y - 100);
        graphic.pop();
      } else {
        graphic.image(graphic2, graphic2.x - 60, graphic2.y - 100);
      }
      if (mouseHovering(graphic3)) {
        cursor(HAND);
        graphic.push();
        graphic.image(graphic3, graphic3.x - 60, graphic3.y - 100);
        graphic.pop();
      } else {
        graphic.image(graphic3, graphic3.x - 60, graphic3.y - 100);
      }
      if (mouseIsPressed && !this.selected) {
        if (mouseHovering(graphic1)) {
          this.emit("select", this.upgrades[0]);
        } else if (mouseHovering(graphic2)) {
          this.emit("select", this.upgrades[1]);
        } else if (mouseHovering(graphic3)) {
          this.emit("select", this.upgrades[2]);
        }
      }
      graphic1.remove();
      graphic2.remove();
      graphic3.remove();
      graphic.pop();
    }
    on(event, callback) {
      this.listeners.push([event, callback]);
    }
    emit(event, ...args) {
      for (let i = 0; i < this.listeners.length; i++) {
        if (this.listeners[i][0] === event) {
          this.listeners[i][1](...args);
        }
      }
    }
    fadeOut() {
      return new Promise((resolve, reject) => {
        this.time = 30;
        this.fading = true;
        let interval = setInterval(() => {
          if (this.time < 15) {
            this.fading = false;
            clearInterval(interval);
            resolve();
          }
        }, 100);
      });
    }
  };
  var Upgrades = class {
    currentUpgrades = [];
    constructor(game2) {
      this.game = game2;
      this.upgrades = [
        new Upgrade(game2),
        new Upgrade2(game2),
        new Upgrade3(game2),
        new Upgrade4(game2),
        new Upgrade5(game2),
        new Upgrade6(game2),
        new Upgrade7(game2)
      ];
    }
    select(number) {
      var selected = [];
      if (number > this.upgrades.length) {
        for (let i = 0; i < number; i++) {
          selected.push(this.upgrades[i] || null);
        }
      } else {
        var unique = this.upgrades.slice(0);
        for (let i = 0; i < number; i++) {
          var rand = Math.floor(random(0, unique.length));
          selected.push(unique[rand]);
          unique.splice(rand, 1);
        }
      }
      for (let i = 0; i < selected.length; i++) {
        if (this.currentUpgrades.find((u) => u[0] === selected[i]) && this.currentUpgrades.find((u) => u[0] === selected[i])[1] >= selected[i].maxLevel) {
          selected.splice(i, 1, null);
        }
      }
      return selected;
    }
    renderUpgrades(upgrades) {
      for (let i = 0; i < upgrades.length; i++) {
        var upgrade = upgrades[i][0];
        var level = upgrades[i][1];
        upgrade.render(level);
      }
    }
    update(upgrades) {
      for (let i = 0; i < upgrades.length; i++) {
        var upgrade = upgrades[i][0];
        var level = upgrades[i][1];
        upgrade.update(level);
      }
    }
  };

  // assets/scripts/game/damage.js
  var Damages = class {
    damages = [];
    constructor(game2) {
      this.game = game2;
    }
    add(damage, x, y) {
      this.damages.push({
        damage,
        x,
        y,
        time: 20
      });
    }
    render(damages) {
      for (var i = 0; i < damages.length; i++) {
        var damage = damages[i];
        damage.time -= 1;
        graphic.push();
        graphic.rectMode(CENTER);
        graphic.fill("gold");
        graphic.textSize(12);
        graphic.stroke(0);
        graphic.strokeWeight(2);
        graphic.textAlign(CENTER);
        graphic.text(Math.round(damage.damage), damage.x, damage.y + (60 - damage.time) * 0.6);
        graphic.pop();
        if (damage.time < 1) {
          damages.splice(i, 1);
        }
      }
    }
  };

  // assets/scripts/game/alert.js
  var Alerts = class {
    constructor(game2) {
      this.game = game2;
      this.alerts = [];
    }
    addAlert(text2, duration = 120) {
      this.alerts.push({
        text: text2,
        duration
      });
    }
    render(alerts) {
      for (let i = 0; i < alerts.length; i++) {
        let alert = alerts[i];
        graphic.push();
        graphic.rectMode(CENTER);
        graphic.fill(255, 0, 0, 100 * (1 - sin(3 * (alert.duration % 60)) * 0.4));
        graphic.rect(width / 2, 150, 370, 50, 5);
        graphic.fill(0);
        graphic.textAlign(CENTER);
        graphic.textSize(26);
        graphic.text(alert.text, width / 2, 160, 340, 50);
        graphic.pop();
        if (!this.game.upgradeScreen) {
          alert.duration--;
          if (alert.duration <= 0) {
            this.alerts.splice(i, 1);
          }
        }
      }
    }
  };

  // assets/scripts/game/math.js
  function random2(min, max) {
    if (Array.isArray(min)) {
      return min[Math.floor(Math.random() * min.length)];
    } else if (typeof min === "object") {
      let keys = Object.keys(min);
      return min[keys[Math.floor(Math.random() * keys.length)]];
    } else if (typeof min === "number" && typeof max === "number") {
      return Math.random() * (max - min) + min;
    } else if (typeof min === "number" && typeof max === "undefined") {
      return Math.random() * min;
    } else {
      return Math.random();
    }
  }
  function distance(x1, y1, x2, y2) {
    let dx = x2 - x1;
    let dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // assets/scripts/game/setup.js
  window.buttons = {
    power: null
  };
  var loader;
  var power = true;
  var started = false;
  function draw() {
    if (power) {
      if (loader.working) {
        return loader.render();
      } else {
        if (!started) {
          window.game.player = new player_default(width / 2, height / 2);
          window.game.background = new Background();
          window.game.enemies = new Enemies(window.game);
          window.game.objects = new Objects(window.game);
          window.game.currency = new Currency(window.game);
          window.game.upgrades = new Upgrades(window.game);
          window.game.damage = new Damages(window.game);
          window.game.alerts = new Alerts(window.game);
        }
        started = true;
        return window.game.render();
      }
    } else {
      background(0);
    }
  }
  function setup() {
    loader = new Loader();
    p5.disableFriendlyErrors = true;
    createCanvas(550, 700);
    imageMode(CENTER);
    rectMode(CENTER);
    angleMode(DEGREES);
    frameRate(60);
    window.random = random2;
    window.dist = distance;
  }

  // assets/scripts/game/rounds.js
  var round50Time = 0;
  var levels = [
    /* 1 */
    (game2, first = false) => {
      if (game2.frame % 30 === 0) {
        game2.enemies.spawnEnemy("zombie");
      }
    },
    /* 2 */
    (game2, first = false) => {
      if (first) {
        game2.enemies.types.Zombie.prototype.health = 30;
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 40 === 0) {
        game2.enemies.spawnEnemy("butterfly");
      }
      if (game2.frame % 30 === 0) {
        game2.enemies.spawnEnemy("zombie");
      }
    },
    /* 3 */
    (game2, first = false) => {
      if (first) {
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 35 === 0) {
        game2.enemies.spawnEnemy("butterfly");
      }
      if (game2.frame % 25 === 0) {
        game2.enemies.spawnEnemy("zombie");
      }
    },
    /* 4 */
    (game2, first = false) => {
      if (first) {
        game2.enemies.types.Zombie.prototype.health = 35;
        game2.enemies.types.Butterfly.prototype.health = 15;
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 30 === 0) {
        game2.enemies.spawnEnemy("butterfly");
      }
      if (game2.frame % 20 === 0) {
        game2.enemies.spawnEnemy("zombie");
      }
    },
    /* 5 */
    (game2, first = false) => {
      if (first) {
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 25 === 0) {
        game2.enemies.spawnEnemy("zombie");
        game2.enemies.spawnEnemy("zombie");
      }
    },
    /* 6 */
    (game2, first = false) => {
      if (first) {
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 30 === 0) {
        game2.enemies.spawnEnemy("zombie");
        game2.enemies.spawnEnemy("zombie");
      }
    },
    /* 7 */
    (game2, first = false) => {
      if (first) {
        game2.enemies.types.Zombie.prototype.health = 40;
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 30 === 0) {
        game2.enemies.spawnEnemy("zombie");
        game2.enemies.spawnEnemy("zombie");
      }
    },
    /* 8 */
    (game2, first = false) => {
      if (first) {
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 30 === 0) {
        game2.enemies.spawnEnemy("zombie");
        game2.enemies.spawnEnemy("zombie");
      }
    },
    /* 9 */
    (game2, first = false) => {
      if (first) {
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 40 === 0) {
        game2.enemies.spawnEnemy("zombie");
        game2.enemies.spawnEnemy("zombie");
      }
    },
    /* 10 */
    (game2, first = false) => {
      if (first) {
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
        game2.enemies.spawnEnemy("zombie_boss");
      }
      if (game2.frame % 30 === 0) {
        game2.enemies.spawnEnemy("zombie");
      }
    },
    /* 11 */
    (game2, first = false) => {
      if (first) {
        game2.enemies.types.ZombieBoss.prototype.health = 1100;
        game2.enemies.types.Butterfly.prototype.health = 20;
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 30 === 0) {
        game2.enemies.spawnEnemy("butterfly");
        game2.enemies.spawnEnemy("butterfly");
      }
      if (game2.frame % 20 === 0) {
        game2.enemies.spawnEnemy("zombie");
      }
    },
    /* 12 */
    (game2, first = false) => {
      if (first) {
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 30 === 0) {
        game2.enemies.spawnEnemy("butterfly");
      }
      if (game2.frame % 20 === 0) {
        game2.enemies.spawnEnemy("zombie");
        game2.enemies.spawnEnemy("zombie");
      }
    },
    /* 13 */
    (game2, first = false) => {
      if (first) {
        game2.enemies.types.Butterfly.prototype.health = 23;
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 40 === 0) {
        game2.enemies.spawnEnemy("butterfly");
        game2.enemies.spawnEnemy("butterfly");
      }
      if (game2.frame % 40 === 0) {
        game2.enemies.spawnEnemy("zombie");
        game2.enemies.spawnEnemy("zombie");
        game2.enemies.spawnEnemy("zombie");
      }
    },
    /* 14 */
    (game2, first = false) => {
      if (first) {
        game2.enemies.types.Butterfly.prototype.health = 25;
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 40 === 0) {
        game2.enemies.spawnEnemy("butterfly");
      }
      if (game2.frame % 50 === 0) {
        game2.enemies.spawnEnemy("zombie");
        game2.enemies.spawnEnemy("zombie");
      }
    },
    /* 15 */
    (game2, first = false) => {
      if (first) {
        game2.enemies.types.Zombie.prototype.health = 50;
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 30 === 0) {
        game2.enemies.spawnEnemy("zombie");
      }
    },
    /* 16 */
    (game2, first = false) => {
      if (first) {
        game2.enemies.types.Zombie.prototype.health = 50;
        game2.enemies.types.Butterfly.prototype.health = 25;
        game2.alerts.addAlert("Enemies Incoming!", 300);
        setTimeout(() => {
          for (let i = 0; i < 80; i++) {
            game2.enemies.spawnEnemy("butterfly");
          }
          for (let i = 0; i < 30; i++) {
            game2.enemies.spawnEnemy("zombie");
          }
        }, 5e3);
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 60 === 0) {
        game2.enemies.spawnEnemy("zombie");
      }
    },
    /* 17 */
    (game2, first = false) => {
      if (first) {
        game2.enemies.types.ZombieBoss.prototype.health = 1200;
        game2.enemies.types.Zombie.prototype.health = 45;
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 37 === 0) {
        game2.enemies.spawnEnemy("butterfly");
      }
      if (game2.frame % 35 === 0) {
        game2.enemies.spawnEnemy("zombie");
        game2.enemies.spawnEnemy("zombie");
      }
    },
    /* 18 */
    (game2, first = false) => {
      if (first) {
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 40 === 0) {
        game2.enemies.spawnEnemy("butterfly");
        game2.enemies.spawnEnemy("butterfly");
      }
      if (game2.frame % 34 === 0) {
        game2.enemies.spawnEnemy("zombie");
      }
    },
    /* 19 */
    (game2, first = false) => {
      if (first) {
        game2.enemies.types.Butterfly.prototype.health = 18;
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 33 === 0) {
        game2.enemies.spawnEnemy("butterfly");
        game2.enemies.spawnEnemy("butterfly");
        game2.enemies.spawnEnemy("zombie");
      }
    },
    /* 20 */
    (game2, first = false) => {
      if (first) {
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 32 === 0) {
        game2.enemies.spawnEnemy("butterfly");
      }
      if (game2.frame % 31 === 0) {
        game2.enemies.spawnEnemy("zombie");
        game2.enemies.spawnEnemy("zombie");
        game2.enemies.spawnEnemy("zombie");
      }
    },
    /* 21 */
    (game2, first = false) => {
      if (first) {
        game2.enemies.types.Butterfly.prototype.health = 19;
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 40 === 0) {
        for (let i = 0; i < 3; i++) {
          game2.enemies.spawnEnemy("butterfly");
        }
      }
      if (game2.frame % 29 === 0) {
        game2.enemies.spawnEnemy("zombie");
      }
    },
    /* 22 */
    (game2, first = false) => {
      if (first) {
        game2.enemies.types.Zombie.prototype.health = 48;
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 25 === 0) {
        game2.enemies.spawnEnemy("zombie");
      }
      if (game2.frame % 35 === 0) {
        game2.enemies.spawnEnemy("butterfly");
      }
    },
    /* 23 */
    (game2, first = false) => {
      if (first) {
        game2.enemies.types.Butterfly.prototype.health = 23;
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 24 === 0) {
        for (let i = 0; i < 2; i++) {
          game2.enemies.spawnEnemy("zombie");
        }
      }
      if (game2.frame % 34 === 0) {
        game2.enemies.spawnEnemy("butterfly");
      }
    },
    /* 24 */
    (game2, first = false) => {
      if (first) {
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 23 === 0) {
        game2.enemies.spawnEnemy("zombie");
      }
      if (game2.frame % 33 === 0) {
        for (let i = 0; i < 2; i++) {
          game2.enemies.spawnEnemy("butterfly");
        }
      }
    },
    /* 25 */
    (game2, first = false) => {
      if (first) {
        game2.enemies.types.ZombieBoss.prototype.health = 1300;
        game2.enemies.types.Zombie.prototype.health = 50;
        game2.enemies.spawnEnemy("zombie_boss");
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 22 === 0) {
        for (let i = 0; i < 2; i++) {
          game2.enemies.spawnEnemy("zombie");
        }
      }
      if (game2.frame % 32 === 0) {
        game2.enemies.spawnEnemy("butterfly");
      }
    },
    /* 26 */
    (game2, first = false) => {
      if (first) {
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 21 === 0) {
        game2.enemies.spawnEnemy("zombie");
      }
      if (game2.frame % 31 === 0) {
        for (let i = 0; i < 3; i++) {
          game2.enemies.spawnEnemy("butterfly");
        }
      }
    },
    /* 27 */
    (game2, first = false) => {
      if (first) {
        game2.enemies.types.Zombie.prototype.health = 52;
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 20 === 0) {
        for (let i = 0; i < 3; i++) {
          game2.enemies.spawnEnemy("zombie");
        }
      }
      if (game2.frame % 30 === 0) {
        game2.enemies.spawnEnemy("butterfly");
      }
    },
    /* 28 */
    (game2, first = false) => {
      if (first) {
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 19 === 0) {
        game2.enemies.spawnEnemy("zombie");
      }
      if (game2.frame % 29 === 0) {
        for (let i = 0; i < 2; i++) {
          game2.enemies.spawnEnemy("butterfly");
        }
      }
    },
    /* 29 */
    (game2, first = false) => {
      if (first) {
        game2.enemies.spawnEnemy("zombie_boss");
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 18 === 0) {
        for (let i = 0; i < 2; i++) {
          game2.enemies.spawnEnemy("zombie");
        }
      }
      if (game2.frame % 28 === 0) {
        game2.enemies.spawnEnemy("butterfly");
      }
    },
    /* 30 */
    (game2, first = false) => {
      if (first) {
        game2.enemies.types.Butterfly.prototype.health = 25;
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 17 === 0) {
        for (let i = 0; i < 3; i++) {
          game2.enemies.spawnEnemy("zombie");
        }
      }
      if (game2.frame % 27 === 0) {
        game2.enemies.spawnEnemy("butterfly");
      }
    },
    /* 31 */
    (game2, first = false) => {
      if (first) {
        game2.enemies.types.ZombieBoss.prototype.health = 1400;
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 16 === 0) {
        game2.enemies.spawnEnemy("zombie");
      }
      if (game2.frame % 26 === 0) {
        for (let i = 0; i < 2; i++) {
          game2.enemies.spawnEnemy("butterfly");
        }
      }
    },
    /* 32 */
    (game2, first = false) => {
      if (first) {
        game2.enemies.spawnEnemy("zombie_boss");
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 15 === 0) {
        for (let i = 0; i < 2; i++) {
          game2.enemies.spawnEnemy("zombie");
        }
      }
      if (game2.frame % 25 === 0) {
        game2.enemies.spawnEnemy("butterfly");
      }
    },
    /* 33 */
    (game2, first = false) => {
      if (first) {
        game2.enemies.types.Zombie.prototype.health = 54;
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 14 === 0) {
        for (let i = 0; i < 2; i++) {
          game2.enemies.spawnEnemy("zombie");
        }
      }
      if (game2.frame % 24 === 0) {
        game2.enemies.spawnEnemy("butterfly");
      }
    },
    /* 34 */
    (game2, first = false) => {
      if (first) {
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 13 === 0) {
        game2.enemies.spawnEnemy("zombie");
      }
      if (game2.frame % 23 === 0) {
        for (let i = 0; i < 2; i++) {
          game2.enemies.spawnEnemy("butterfly");
        }
      }
    },
    /* 35 */
    (game2, first = false) => {
      if (first) {
        game2.enemies.spawnEnemy("zombie_boss");
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 12 === 0) {
        for (let i = 0; i < 2; i++) {
          game2.enemies.spawnEnemy("zombie");
        }
      }
      if (game2.frame % 22 === 0) {
        game2.enemies.spawnEnemy("butterfly");
      }
    },
    /* 36 */
    (game2, first = false) => {
      if (first) {
        game2.enemies.types.Butterfly.prototype.health = 27;
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 11 === 0) {
        game2.enemies.spawnEnemy("zombie");
      }
      if (game2.frame % 21 === 0) {
        game2.enemies.spawnEnemy("butterfly");
      }
    },
    /* 37 */
    (game2, first = false) => {
      if (first) {
        game2.enemies.types.ZombieBoss.prototype.health = 1500;
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 10 === 0) {
        for (let i = 0; i < 3; i++) {
          game2.enemies.spawnEnemy("zombie");
        }
      }
      if (game2.frame % 20 === 0) {
        game2.enemies.spawnEnemy("butterfly");
      }
    },
    /* 38 */
    (game2, first = false) => {
      if (first) {
        game2.enemies.spawnEnemy("zombie_boss");
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 11 === 0) {
        game2.enemies.spawnEnemy("zombie");
      }
      if (game2.frame % 19 === 0) {
        for (let i = 0; i < 2; i++) {
          game2.enemies.spawnEnemy("butterfly");
        }
      }
    },
    /* 39 */
    (game2, first = false) => {
      if (first) {
        game2.enemies.types.Zombie.prototype.health = 56;
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 8 === 0) {
        for (let i = 0; i < 2; i++) {
          game2.enemies.spawnEnemy("zombie");
        }
      }
      if (game2.frame % 18 === 0) {
        game2.enemies.spawnEnemy("butterfly");
      }
    },
    /* 40 */
    (game2, first = false) => {
      if (first) {
        game2.enemies.types.ZombieBoss.prototype.health = 1700;
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 10 === 0) {
        game2.enemies.spawnEnemy("zombie");
      }
      if (game2.frame % 17 === 0) {
        for (let i = 0; i < 3; i++) {
          game2.enemies.spawnEnemy("butterfly");
        }
      }
    },
    /* 41 */
    (game2, first = false) => {
      if (first) {
        game2.enemies.types.Butterfly.prototype.health = 29;
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 6 === 0) {
        for (let i = 0; i < 2; i++) {
          game2.enemies.spawnEnemy("zombie");
        }
      }
      if (game2.frame % 16 === 0) {
        game2.enemies.spawnEnemy("butterfly");
      }
    },
    /* 42 */
    (game2, first = false) => {
      if (first) {
        game2.enemies.spawnEnemy("zombie_boss");
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 15 === 0) {
        game2.enemies.spawnEnemy("zombie");
      }
      if (game2.frame % 15 === 0) {
        for (let i = 0; i < 6; i++) {
          game2.enemies.spawnEnemy("butterfly");
        }
      }
    },
    /* 43 */
    (game2, first = false) => {
      if (first) {
        game2.enemies.types.ZombieBoss.prototype.health = 1800;
        game2.enemies.types.Zombie.prototype.health = 58;
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 4 === 0) {
        for (let i = 0; i < 2; i++) {
          game2.enemies.spawnEnemy("zombie");
        }
      }
      if (game2.frame % 14 === 0) {
        game2.enemies.spawnEnemy("butterfly");
      }
    },
    /* 44 */
    (game2, first = false) => {
      if (first) {
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 10 === 0) {
        game2.enemies.spawnEnemy("zombie");
      }
      if (game2.frame % 13 === 0) {
        for (let i = 0; i < 3; i++) {
          game2.enemies.spawnEnemy("butterfly");
        }
      }
    },
    /* 45 */
    (game2, first = false) => {
      if (first) {
        game2.enemies.spawnEnemy("zombie_boss");
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 5 === 0) {
        game2.enemies.spawnEnemy("zombie");
      }
      if (game2.frame % 12 === 0) {
        game2.enemies.spawnEnemy("butterfly");
      }
    },
    /* 46 */
    (game2, first = false) => {
      if (first) {
        game2.enemies.types.Butterfly.prototype.health = 30;
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 5 === 0) {
        game2.enemies.spawnEnemy("zombie");
      }
      if (game2.frame % 11 === 0) {
        for (let i = 0; i < 4; i++) {
          game2.enemies.spawnEnemy("butterfly");
        }
      }
    },
    /* 47 */
    (game2, first = false) => {
      if (first) {
        game2.enemies.types.ZombieBoss.prototype.health = 2e3;
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 4 === 0) {
        game2.enemies.spawnEnemy("zombie");
        game2.enemies.spawnEnemy("butterfly");
      }
    },
    /* 48 */
    (game2, first = false) => {
      if (first) {
        game2.enemies.spawnEnemy("zombie_boss");
        game2.enemies.types.Zombie.prototype.health = 60;
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 3 === 0) {
        game2.enemies.spawnEnemy("zombie");
        game2.enemies.spawnEnemy("butterfly");
      }
    },
    /* 49 */
    (game2, first = false) => {
      if (first) {
        game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
      }
      if (game2.frame % 2 === 0) {
        game2.enemies.spawnEnemy("zombie");
        game2.enemies.spawnEnemy("butterfly");
      }
    },
    /* 50 */
    (game2, first = false) => {
      if (round50Time > 60 * 60) {
        const enemies = game2.enemies.enemies;
        for (let i = 0; i < enemies.length; i++) {
          let enemy = enemies[i];
          enemy.dropChance = 0;
          enemy.hurt(1e6);
        }
      }
      if (first) {
        game2.enemies.spawnEnemy("zombie_boss");
        game2.enemies.types.Zombie.prototype.health = 100;
        game2.enemies.types.Butterfly.prototype.health = 50;
        game2.enemies.types.ZombieBoss.prototype.health = 2500;
        for (let i = 0; i < 5; i++) {
          game2.objects.spawnObject("box", game2.objects.randomSpawnPoint());
        }
      }
      if (game2.frame % 10 === 0) {
        game2.enemies.spawnEnemy("zombie");
        game2.enemies.spawnEnemy("butterfly");
      }
      if (game2.frame % 40 === 0) {
        game2.enemies.spawnEnemy("zombie_boss");
      }
      round50Time++;
    }
  ];
  var unsavedLevel = 1;
  function roundTime(num, dec) {
    return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
  }
  function runRounds(game2) {
    if (game2.player.dead === true) {
      return game2.player.deathState <= 100;
    } else {
      if (game2.timer > 30 && roundTime(game2.timer, 6) % 30 === 0 && game2.level < 50) {
        game2.level++;
      }
      if (game2.level !== unsavedLevel) {
        unsavedLevel = game2.level;
        levels[game2.level - 1](game2, true);
      }
      levels[game2.level - 1](game2);
      return true;
    }
  }

  // assets/scripts/game/ui/inGame.js
  var timer = {
    width: 48,
    height: 34,
    y: 12,
    triangle: {
      width: 8,
      height: 6
    }
  };
  var pauseButton = {
    width: 25,
    height: 25,
    get x() {
      return width / 2 - 55;
    },
    y: 18
  };
  var stopButton = {
    width: 25,
    height: 25,
    get x() {
      return width / 2 + 55;
    },
    y: 18
  };
  var fontSize = 19;
  var fakeCurrency = 0;
  function inGame(game2, bar = false) {
    let menuColor = game2.menuColor;
    graphic.push();
    if (!bar) {
      graphic.rectMode(CORNER);
      graphic.fill(menuColor);
      graphic.textFont(game2.assets.fonts.roboto);
      graphic.rect(0, 0, width, 36);
      graphic.fill("black");
      graphic.rect(0, 35, width, 2);
      graphic.push();
      graphic.fill(menuColor);
      graphic.beginShape();
      graphic.vertex((width - timer.width) / 2, timer.y);
      graphic.vertex((width + timer.width) / 2, timer.y);
      graphic.vertex((width + timer.width) / 2 + timer.triangle.width, timer.y + timer.triangle.height);
      graphic.vertex((width + timer.width) / 2 + timer.triangle.width, timer.y + (timer.height - timer.triangle.height));
      graphic.vertex((width + timer.width) / 2, timer.y + timer.height);
      graphic.vertex((width - timer.width) / 2, timer.y + timer.height);
      graphic.vertex((width - timer.width) / 2 - timer.triangle.width, timer.y + (timer.height - timer.triangle.height));
      graphic.vertex((width - timer.width) / 2 - timer.triangle.width, timer.y + timer.triangle.height);
      graphic.endShape(CLOSE);
      graphic.textAlign(CENTER);
      graphic.textSize(fontSize);
      graphic.fill("black");
      graphic.text(`${game2.time.min < 10 ? "0" + game2.time.min : game2.time.min}:${game2.time.secs < 10 ? "0" + game2.time.secs : game2.time.secs}`, width / 2 - timer.width / 2, timer.y + timer.height / 2 + fontSize / 2 - 3, timer.width, timer.height);
      graphic.pop();
      graphic.rectMode(CENTER);
      graphic.imageMode(CENTER);
      graphic.image(game2.assets.images.icon, 20, 18, 25, 25);
      graphic.fill("black");
      graphic.textSize(8);
      graphic.textAlign(CENTER);
      graphic.text("GEMICI.IO", width / 2, 9);
      graphic.fill("yellow");
      graphic.rect(pauseButton.x, pauseButton.y, pauseButton.width, pauseButton.height);
      graphic.image(game2.assets.images.pause_image, pauseButton.x, pauseButton.y, pauseButton.width * 0.65, pauseButton.height * 0.65);
      graphic.fill("red");
      graphic.rect(stopButton.x, stopButton.y, stopButton.width, stopButton.height);
      graphic.image(game2.assets.images.exit_image, stopButton.x, stopButton.y, stopButton.width * 0.65, stopButton.height * 0.65);
      graphic.fill("gray");
      graphic.rect(width - 15, 18, 25, 25);
      graphic.fill("gray");
      graphic.rect(width - 50, 18, 25, 25);
      if (mouseHovering(pauseButton)) {
        if (mouseIsPressed) {
          game2.pause();
        }
        cursor(HAND);
      }
      if (mouseHovering(stopButton)) {
        if (mouseIsPressed) {
          game2.exit();
        }
        cursor(HAND);
      }
    }
    var w = 215 * 2;
    graphic.push();
    graphic.rectMode(CORNER);
    graphic.fill("black");
    graphic.beginShape();
    graphic.vertex(width / 2 - 215, 52);
    graphic.vertex(width / 2 + 215 + 10, 52);
    graphic.vertex(width / 2 + 215, 52 + 22);
    graphic.vertex(width / 2 - 215 - 10, 52 + 22);
    graphic.endShape(CLOSE);
    graphic.fill(menuColor);
    graphic.beginShape();
    graphic.vertex(width / 2 - 213, 54);
    graphic.vertex(width / 2 + 213 + 8, 54);
    graphic.vertex(width / 2 + 213, 52 + 20);
    graphic.vertex(width / 2 - 213 - 8, 52 + 20);
    graphic.endShape(CLOSE);
    graphic.fill("#44ba38");
    var currency = game2.currency.current;
    if (fakeCurrency > currency || fakeCurrency + 0.1 >= currency) {
      fakeCurrency = currency;
    } else {
      fakeCurrency += (currency - fakeCurrency) / 5;
    }
    var progress = fakeCurrency / game2.currency.required;
    var barWidth = progress * w;
    if (barWidth + 4 > w) {
      barWidth = w - 4;
    }
    graphic.beginShape();
    graphic.vertex(width / 2 - 213, 54);
    graphic.vertex(width / 2 - 213 + barWidth + 8, 54);
    graphic.vertex(width / 2 - 213 + barWidth, 52 + 20);
    graphic.vertex(width / 2 - 213 - 8, 52 + 20);
    graphic.endShape(CLOSE);
    graphic.fill("black");
    for (let i = 13; i < w; i += 30) {
      graphic.rect(width / 2 - 215 + i, 52, 2, 22);
    }
    graphic.pop();
    graphic.push();
    graphic.fill(menuColor);
    graphic.stroke(0);
    graphic.strokeWeight(3);
    graphic.beginShape();
    graphic.vertex(width, height);
    graphic.vertex(0, height);
    graphic.vertex(0, height - 13);
    graphic.vertex(width / 2 - 50, height - 13);
    graphic.vertex(width / 2 - 43, height - 27);
    graphic.vertex(width / 2 + 43, height - 27);
    graphic.vertex(width / 2 + 50, height - 13);
    graphic.vertex(width, height - 13);
    graphic.endShape();
    graphic.pop();
    graphic.textSize(14);
    graphic.fill(0);
    graphic.textAlign(CENTER);
    graphic.text(`Round ${game2.level}`, width / 2, height - 10, 80);
    graphic.pop();
  }

  // assets/scripts/game/ui/mainMenu.js
  var fontSize2 = 17;
  var titleImage = {
    width: 300,
    height: 300,
    get y() {
      return height / 2 - 100;
    },
    get x() {
      return width / 2;
    }
  };
  var playButton = {
    width: 200,
    height: 50,
    get x() {
      return width / 2;
    },
    get y() {
      return height / 2 + 100;
    }
  };
  var tutorialButton = {
    width: 200,
    height: 50,
    get x() {
      return width / 2;
    },
    get y() {
      return height / 2 + 170;
    }
  };
  function mainMenu(game2) {
    let menuColor = "#000004";
    graphic.push();
    graphic.rectMode(CORNER);
    graphic.fill(menuColor);
    graphic.textFont(game2.assets.fonts.roboto);
    graphic.background(menuColor);
    graphic.imageMode(CENTER);
    graphic.image(game2.assets.images.logo, titleImage.x, titleImage.y, titleImage.width, titleImage.height);
    let buttonColor = "#fff";
    let cornerRadius = 10;
    graphic.noStroke();
    graphic.fill(buttonColor);
    graphic.rect(playButton.x - playButton.width / 2, playButton.y - playButton.height / 2, playButton.width, playButton.height, cornerRadius);
    graphic.noStroke();
    graphic.fill("black");
    graphic.textSize(fontSize2);
    graphic.textAlign(CENTER);
    graphic.text("Play", playButton.x, playButton.y + fontSize2 / 2 - 3);
    if (mouseHovering(playButton)) {
      cursor(HAND);
      graphic.noFill();
      graphic.stroke("red");
      graphic.strokeWeight(2);
      graphic.rect(playButton.x - playButton.width / 2, playButton.y - playButton.height / 2, playButton.width, playButton.height, cornerRadius);
      if (mouseIsPressed) {
        game2.screen = "game";
      }
    }
    graphic.noStroke();
    graphic.fill(buttonColor);
    graphic.rect(tutorialButton.x - tutorialButton.width / 2, tutorialButton.y - tutorialButton.height / 2, tutorialButton.width, tutorialButton.height, cornerRadius);
    graphic.noStroke();
    graphic.fill("black");
    graphic.textSize(fontSize2);
    graphic.textAlign(CENTER);
    graphic.text("Tutorial", tutorialButton.x, tutorialButton.y + fontSize2 / 2 - 3);
    if (mouseHovering(tutorialButton)) {
      cursor(HAND);
      graphic.noFill();
      graphic.stroke("red");
      graphic.strokeWeight(2);
      graphic.rect(tutorialButton.x - tutorialButton.width / 2, tutorialButton.y - tutorialButton.height / 2, tutorialButton.width, tutorialButton.height, cornerRadius);
      if (mouseIsPressed) {
        game2.screen = "tutorial";
      }
    }
    graphic.pop();
  }

  // assets/scripts/game/ui/pauseMenu.js
  function pauseMenu(game2) {
  }

  // assets/scripts/game/ui/tutorial.js
  var setup2 = false;
  var fontSize3 = 19;
  var tutorialData = {
    page: 0,
    pages: [
      [
        "Welcome to the tutorial!",
        "This is a tutorial for the game, it will explain the basics of the game.",
        "Click the next button to continue."
      ],
      [
        "The goal of the game is to survive for as long as possible.",
        "You will be attacked in waves by enemies constantly.",
        "Each time you kill an enemy, they might drop emeralds or currency.",
        "Collecting the emeralds give you progress towards upgrading your game level.",
        "Reaching Round 50 will win you the game."
      ],
      [
        "You can select one upgrade every time you fill your upgrade bar and level up.",
        "There are many unique upgrades to pick from, and each has its own benefits and downsides.",
        "As you level up more, it takes longer to get upgrades."
      ],
      [
        "You can move your character by using the WASD keys.",
        "You can move your weapon by rotating the mouse around the player.",
        "Your weapon cooldown is located under the player, and player health is above that bar."
      ]
    ],
    next() {
      this.page++;
      if (this.page >= this.pages.length) {
        this.page = 0;
      }
    },
    prev() {
      this.page--;
      if (this.page < 0) {
        this.page = this.pages.length - 1;
      }
    },
    render() {
      graphic.push();
      graphic.fill(game.menuColor);
      graphic.textSize(fontSize3);
      graphic.textAlign(CENTER);
      graphic.textFont(game.assets.fonts.roboto);
      var text2 = this.pages[this.page].join("\n");
      graphic.text(text2, width / 2, 200, width - 50);
      graphic.pop();
    },
    renderButton() {
      graphic.push();
      graphic.fill(game.menuColor);
      graphic.textSize(fontSize3);
      graphic.textAlign(CENTER);
      graphic.textFont(game.assets.fonts.roboto);
      graphic.text("Close", width / 2, 30);
      if (mouseX > width / 2 - 50 && mouseX < width / 2 + 50 && mouseY > 15 && mouseY < 45) {
        graphic.fill(0, 0, 0, 100);
        graphic.rect(width / 2, 30, 100, 30);
      }
      graphic.pop();
    },
    update() {
      this.render();
      this.renderButton();
    },
    mousePressed(game2) {
      this.next();
      if (mouseX > width / 2 - 50 && mouseX < width / 2 + 50 && mouseY > 15 && mouseY < 45) {
        game2.screen = "menu";
      }
    },
    mouseWheel(event) {
      if (event.delta > 0) {
        this.next();
      } else {
        this.prev();
      }
    }
  };
  var g;
  function tutorial(game2) {
    g = game2;
    if (!setup2) {
      game2.on("mousePressed", () => tutorialData.mousePressed(g));
      game2.on("mouseWheel", (event) => tutorialData.mouseWheel(event));
      setup2 = true;
    }
    tutorialData.update();
  }

  // assets/scripts/game/ui/gameOver.js
  var time = 0;
  var fontSize4 = 18;
  var restartButton = {
    width: 200,
    height: 50,
    get x() {
      return width / 2;
    },
    get y() {
      return height / 2;
    }
  };
  function gameOver(game2) {
    time++;
    graphic.push();
    graphic.textFont(game2.assets.fonts.roboto);
    graphic.rectMode(CORNER);
    graphic.fill(0, 0, 0, 255 * ((time > 30 ? 30 : time) / 30) * 0.5);
    graphic.rect(0, 0, width, height);
    graphic.fill(255);
    graphic.textSize(50);
    graphic.textAlign(CENTER, CENTER);
    graphic.text("Game Over", width / 2, 200);
    let buttonColor = "#fff";
    let cornerRadius = 10;
    graphic.noStroke();
    graphic.fill(buttonColor);
    graphic.rect(restartButton.x - restartButton.width / 2, restartButton.y - restartButton.height / 2, restartButton.width, restartButton.height, cornerRadius);
    graphic.noStroke();
    graphic.fill("black");
    graphic.textSize(fontSize4);
    graphic.textAlign(CENTER);
    graphic.text("Main Menu", restartButton.x, restartButton.y - 3);
    if (mouseHovering(restartButton)) {
      cursor(HAND);
      graphic.noFill();
      graphic.stroke("red");
      graphic.strokeWeight(2);
      graphic.rect(restartButton.x - restartButton.width / 2, restartButton.y - restartButton.height / 2, restartButton.width, restartButton.height, cornerRadius);
      if (mouseIsPressed) {
        game2.restart();
        game2.screen = "menu";
      }
    }
    graphic.stroke(0);
    graphic.fill(game2.menuColor);
    graphic.rect(0, height - 175, width, 175);
    graphic.pop();
  }

  // assets/scripts/game/main.js
  window.setup = setup;
  window.draw = draw;
  var Game = class {
    assets = {
      images: {},
      sounds: {},
      fonts: {}
    };
    dimensions = {
      width: 3e3,
      height: 3e3,
      position: {
        x: 1225,
        y: 1150
      },
      center: {
        x: 1225,
        y: 1150
      }
    };
    time = {
      min: 0,
      secs: 0
    };
    player = null;
    background = null;
    enemies = null;
    upgradeScreen = null;
    upgrades = null;
    timer = 0;
    kills = 0;
    score = 0;
    bullets = [];
    enemies_arr = [];
    paused = false;
    upgrading = false;
    menuColor = "#8793a4";
    _screen = "load";
    _level = 1;
    constructor() {
      window.mousePressed = (...args) => {
        this.fire("mousePressed", ...args);
      };
      window.mouseReleased = (...args) => {
        this.fire("mouseReleased", ...args);
      };
      window.mouseClicked = (...args) => {
        this.fire("mouseClicked", ...args);
      };
      window.mouseMoved = (...args) => {
        this.fire("mouseMoved", ...args);
      };
      window.mouseWheel = (...args) => {
        this.fire("mouseWheel", ...args);
      };
    }
    loadImage(src) {
      var i = new Image();
      i.src = src;
      i.onload = () => {
        i.loaded = true;
        return i;
      };
      return i;
    }
    render() {
      cursor(ARROW);
      this.draw();
    }
    get screen() {
      return this._screen;
    }
    set screen(val = "menu") {
      switch (val) {
        case "tutorial":
        case "menu": {
          if (!this.assets.sounds.game_menu.isPlaying()) {
            this.assets.sounds.game_main.stop();
            this.assets.sounds.game_menu.play();
          }
          break;
        }
        case "game": {
          if (!this.assets.sounds.game_main.isPlaying()) {
            this.assets.sounds.game_menu.stop();
            this.assets.sounds.game_main.play();
          }
        }
      }
      this._screen = val;
    }
    get level() {
      return this._level;
    }
    set level(val) {
      if (val > 50) {
        val = 50;
      }
      this._level = val;
      this.score += 10;
    }
    draw() {
      try {
        window.graphic = createGraphics(width, height);
        graphic.imageMode(CENTER);
        graphic.rectMode(CENTER);
        graphic.angleMode(DEGREES);
        switch (this.screen) {
          case "menu": {
            mainMenu(this);
            break;
          }
          case "pause":
          case "over":
          case "game": {
            graphic.push();
            this.background.draw(this);
            if (this.upgradeScreen) {
              this.player.weapon.drawBullets(this.bullets);
              this.objects.render(this.objects.objects);
              this.player.draw();
              this.player.weapon.draw();
              this.enemies.draw(this.enemies_arr);
              this.upgrades.renderUpgrades(this.upgrades.currentUpgrades);
              this.damage.render(this.damage.damages);
              this.background.drawPost(this);
              this.alerts.render(this.alerts.alerts);
              inGame(this, false);
              this.upgradeScreen.render();
              inGame(this, true);
            } else {
              this.player.weapon.drawBullets(this.bullets);
              this.player.weapon.updateBullets(this.bullets);
              this.player.weapon.checkBullets(this.bullets, this.getTargets());
              this.player.checkCollisions(this.enemies_arr);
              this.upgrades.renderUpgrades(this.upgrades.currentUpgrades);
              this.upgrades.update(this.upgrades.currentUpgrades);
              this.damage.render(this.damage.damages);
              if (runRounds(this)) {
                this.objects.render(this.objects.objects);
                this.player.draw();
                this.player.update();
                this.player.weapon.draw();
                this.enemies.draw(this.enemies_arr);
                this.enemies.update(this.enemies_arr);
                this.background.drawPost(this);
                this.alerts.render(this.alerts.alerts);
                this.currency.checkUpgrades();
                inGame(this);
                this.updateStats();
              } else {
                this.objects.render(this.objects.objects);
                this.player.draw();
                this.enemies.draw(this.enemies_arr);
                this.background.drawPost(this);
                inGame(this);
                if (this.screen === "over") {
                  gameOver(this);
                }
              }
            }
            if (this.screen === "pause") {
              pauseMenu(this);
            }
            graphic.pop();
            break;
          }
          case "tutorial": {
            tutorial(this);
            break;
          }
          case "load": {
            this.screen = "menu";
            break;
          }
          default: {
            graphic.text("Error: Invalid screen", width / 2, height / 2);
            break;
          }
        }
        background(0);
        image(window.graphic, width / 2, height / 2, width, height);
        graphic.remove();
      } catch (err) {
        console.error(err);
      }
    }
    updateStats() {
      this.timer += 1 / 60;
      var min = Math.floor(this.timer / 60);
      var secs = Math.floor(this.timer - min * 60);
      this.time = {
        min,
        secs
      };
    }
    getTargets() {
      return [
        ...this.enemies.enemies,
        ...this.objects.objects.filter((obj) => {
          return obj.hasOwnProperty("health") && obj.health > 0;
        }).map((obj) => {
          var coords = obj.getCoords();
          return new Proxy(obj, {
            get(target, prop) {
              if (prop === "x") {
                return coords.x;
              } else if (prop === "y") {
                return coords.y;
              } else if (prop === "_x") {
                return obj.x;
              } else if (prop === "_y") {
                return obj.y;
              } else {
                return target[prop];
              }
            }
          });
        })
      ];
    }
    restart() {
      this.timer = 0;
      this.kills = 0;
      this.score = 0;
      this.time = {
        min: 0,
        secs: 0
      };
      this.dimensions = {
        width: 3e3,
        height: 3e3,
        position: {
          x: 1225,
          y: 1150
        },
        center: {
          x: 1225,
          y: 1150
        }
      };
      this.bullets = [];
      this.enemies_arr = [];
      this.paused = false;
      this.upgrading = false;
      this._level = 1;
      this.player = new player_default(width / 2, height / 2);
      this.background = new Background();
      this.enemies = new Enemies(this);
      this.objects = new Objects(this);
      this.currency = new Currency(this);
      this.upgrades = new Upgrades(this);
      this.damage = new Damages(this);
      this.alerts = new Alerts(this);
    }
    debugStats() {
      var min = Math.floor(this.timer / 60);
      var secs = Math.floor(this.timer - min * 60);
      graphic.fill("black");
      graphic.textSize(25);
      graphic.textAlign(CENTER);
      graphic.text(`${min < 10 ? "0" + min : min}:${secs < 10 ? "0" + secs : secs}`, width / 2, 30);
      this.timer += 1 / 60;
      text(`Location: (${game.player.coords.x.toFixed(1)}, ${game.player.coords.y.toFixed(1)})`, width / 2, 60);
    }
    moveEntities(x, y) {
      for (var i = 0; i < this.enemies_arr.length; i++) {
        var enemy = this.enemies_arr[i];
        enemy.x -= x;
        enemy.y += y;
      }
      for (var i = 0; i < this.bullets.length; i++) {
        var bullet = this.bullets[i];
        bullet.x -= x;
        bullet.y += y;
      }
      if (this.upgrades.upgrades.find((upgrade) => upgrade.name === "Lightning")) {
        var lightning = this.upgrades.upgrades.find((upgrade) => upgrade.name === "Lightning");
        for (var i = 0; i < lightning.bolts.length; i++) {
          var bolt = lightning.bolts[i];
          bolt.x -= x;
          bolt.y += y;
        }
      }
      if (this.upgrades.upgrades.find((upgrade) => upgrade.name === "Ball")) {
        var ball = this.upgrades.upgrades.find((upgrade) => upgrade.name === "Ball");
        for (var i = 0; i < ball.balls.length; i++) {
          var bolt = ball.balls[i];
          bolt.x -= x;
          bolt.y += y;
        }
      }
    }
    requestUpgrade(level) {
      return new Promise((resolve, reject) => {
        this.upgrading = true;
        var upgrades = this.upgrades.select(3);
        this.upgradeScreen = new UpgradeScreen(this, upgrades, level);
        this.upgradeScreen.on("close", () => {
          this.upgrading = false;
          resolve();
        });
        this.upgradeScreen.on("upgrade", () => {
          this.upgrading = false;
          resolve();
        });
      }).then(() => {
        return this.upgradeScreen.fadeOut();
      }).catch((err) => {
        console.error(err);
      }).finally(() => {
        this.upgradeScreen = null;
      });
    }
    get frames() {
      return window.frameCount;
    }
    get frame() {
      return window.frameCount;
    }
    listeners = [];
    on(event, callback) {
      this.listeners.push([event, callback]);
    }
    fire(event, ...args) {
      for (let i = 0; i < this.listeners.length; i++) {
        if (this.listeners[i][0] === event) {
          this.listeners[i][1](...args);
        }
      }
    }
  };

  // assets/scripts/index.js
  preload_default.then(() => {
    window.game = new Game();
  }).catch((err) => {
    document.write("ERROR: " + err);
  });
  window.addEventListener("blur", () => {
    noLoop();
  });
  window.addEventListener("focus", () => {
    loop();
  });
})();
//# sourceMappingURL=index.js.map
