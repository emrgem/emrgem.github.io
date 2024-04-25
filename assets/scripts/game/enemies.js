import Butterfly from "./enemies/butterfly.js";
import Zombie from "./enemies/zombie.js";
import ZombieBoss from "./enemies/zombieBoss.js";
import FinalBoss from "./enemies/finalBoss.js";

export default class Enemies {
    types = {
        Zombie,
        Butterfly,
        FinalBoss,
        ZombieBoss
    }

    constructor(game) {
        this.enemies = game.enemies_arr;
        this.game = game;

        this.loadZombieSprites([
            game.assets.images.zombie_idle,
            game.assets.images.zombie_walk,
            game.assets.images.zombie_death,
            game.assets.images.zombie_attack
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
        // generate a few random ints to decide whether or not it spawns at the top, bottom, left, or right

        var rand = Math.floor(random(0, 3));

        let x = 0;
        let y = random(-20, height + 20);
      
        switch(rand) {
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

        if (
            (x - window.game.player.x) + window.game.player.coords.x > 3000 ||
            (x - window.game.player.x) + window.game.player.coords.x < 0 ||
            (y - window.game.player.y) + window.game.player.coords.y > 3000 ||
            (y - window.game.player.y) + window.game.player.coords.y < 0
        ) {
            return this.randomSpawnPoint();
        }

        return [x, y]
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

        for (let i = 0; i < 5; i ++) {
            for (let j = 0; j < 4; j ++) {
                var sprite = idleSheet.get(i * idleWidth, j * idleHeight, idleWidth, idleHeight);
                this.types.Zombie.prototype.sprites.idle[j].push(sprite);
            }
        }

        var walkingWidth = walkingSheet.width / 11;
        var walkingHeight = walkingSheet.height / 4;

        for (let i = 0; i < 10; i ++) {
            for (let j = 0; j < 4; j ++) {
                var sprite = walkingSheet.get(i * walkingWidth, j * walkingHeight, walkingWidth, walkingHeight);
                this.types.Zombie.prototype.sprites.walking[j].push(sprite);
            }
        }

        var dyingWidth = dyingSheet.width / 8;
        var dyingHeight = dyingSheet.height / 4;

        for (let i = 0; i < 7; i ++) {
            for (let j = 0; j < 4; j ++) {
                var sprite = dyingSheet.get(i * dyingWidth, j * dyingHeight, dyingWidth, dyingHeight);
                this.types.Zombie.prototype.sprites.dying[j].push(sprite);
            }
        }

        var attackingWidth = attackingSheet.width / 9;
        var attackingHeight = attackingSheet.height / 4;

        for (let i = 0; i < 8; i ++) {
            for (let j = 0; j < 4; j ++) {
                var sprite = attackingSheet.get(i * attackingWidth, j * attackingHeight, attackingWidth, attackingHeight);
                this.types.Zombie.prototype.sprites.attacking[j].push(sprite);
            }
        }

        return true;
    }
}