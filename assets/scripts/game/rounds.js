let round50Time = 0;

const levels = [
    /* 1 */ (game, first = false) => {
        if (game.frame % 30 === 0) {
            game.enemies.spawnEnemy("zombie");
        }
    },
    /* 2 */ (game, first = false) => {
        if (first) {
            game.enemies.types.Zombie.prototype.health = 30;
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 40 === 0) {
            game.enemies.spawnEnemy("butterfly");
        }

        if (game.frame % 30 === 0) {
            game.enemies.spawnEnemy("zombie");
        }
    },
    /* 3 */ (game, first = false) => {
        if (first) {
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 35 === 0) {
            game.enemies.spawnEnemy("butterfly");
        }

        if (game.frame % 25 === 0) {
            game.enemies.spawnEnemy("zombie");
        }
    },
    /* 4 */ (game, first = false) => {
        if (first) {
            game.enemies.types.Zombie.prototype.health = 35;
            game.enemies.types.Butterfly.prototype.health = 15;

            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 30 === 0) {
            game.enemies.spawnEnemy("butterfly");
        }

        if (game.frame % 20 === 0) {
            game.enemies.spawnEnemy("zombie");
        }
    },
    /* 5 */ (game, first = false) => {
        if (first) {
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 25 === 0) {
            game.enemies.spawnEnemy("zombie");
            game.enemies.spawnEnemy("zombie");
        }
    },
    /* 6 */ (game, first = false) => {
        if (first) {
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 30 === 0) {
            game.enemies.spawnEnemy("zombie");
            game.enemies.spawnEnemy("zombie");
        }
    },  
    /* 7 */ (game, first = false) => {
        if (first) {
            game.enemies.types.Zombie.prototype.health = 40;

            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 30 === 0) {
            game.enemies.spawnEnemy("zombie");
            game.enemies.spawnEnemy("zombie");
        }
    },
    /* 8 */ (game, first = false) => {
        if (first) {
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 30 === 0) {
            game.enemies.spawnEnemy("zombie");
            game.enemies.spawnEnemy("zombie");
        }
    },
    /* 9 */ (game, first = false) => {
        if (first) {
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 40 === 0) {
            game.enemies.spawnEnemy("zombie");
            game.enemies.spawnEnemy("zombie");
        }
    },
    /* 10 */ (game, first = false) => {
        if (first) {
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
            game.enemies.spawnEnemy("zombie_boss");
        }

        if (game.frame % 30 === 0) {
            game.enemies.spawnEnemy("zombie");
        }
    },
    /* 11 */ (game, first = false) => {
        if (first) {
            game.enemies.types.ZombieBoss.prototype.health = 1100;
            game.enemies.types.Butterfly.prototype.health = 20;

            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 30 === 0) {
            game.enemies.spawnEnemy("butterfly");
            game.enemies.spawnEnemy("butterfly");
        }

        if (game.frame % 20 === 0) {
            game.enemies.spawnEnemy("zombie");
        }
    },
    /* 12 */ (game, first = false) => {
        if (first) {
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 30 === 0) {
            game.enemies.spawnEnemy("butterfly");
        }

        if (game.frame % 20 === 0) {
            game.enemies.spawnEnemy("zombie");
            game.enemies.spawnEnemy("zombie");
        }
    },
    /* 13 */ (game, first = false) => {
        if (first) {
            game.enemies.types.Butterfly.prototype.health = 23;

            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 40 === 0) {
            game.enemies.spawnEnemy("butterfly");
            game.enemies.spawnEnemy("butterfly");
        }

        if (game.frame % 40 === 0) {
            game.enemies.spawnEnemy("zombie");
            game.enemies.spawnEnemy("zombie");
            game.enemies.spawnEnemy("zombie");
        }
    },
    /* 14 */ (game, first = false) => {
        if (first) {
            game.enemies.types.Butterfly.prototype.health = 25;

            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 40 === 0) {
            game.enemies.spawnEnemy("butterfly");
        }

        if (game.frame % 50 === 0) {
            game.enemies.spawnEnemy("zombie");
            game.enemies.spawnEnemy("zombie");
        }
    },
    /* 15 */ (game, first = false) => {
        if (first) {
            game.enemies.types.Zombie.prototype.health = 50;

            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 30 === 0) {
            game.enemies.spawnEnemy("zombie");
        }
    },
    /* 16 */ (game, first = false) => {
        if (first) {
            game.enemies.types.Zombie.prototype.health = 50;
            game.enemies.types.Butterfly.prototype.health = 25;

            game.alerts.addAlert("Enemies Incoming!", 300);

            setTimeout(() => {
                for (let i = 0; i < 80; i ++) {
                    game.enemies.spawnEnemy("butterfly");
                }

                for (let i = 0; i < 30; i ++) {
                    game.enemies.spawnEnemy("zombie");
                }
            }, 5000);

            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 60 === 0) {
            game.enemies.spawnEnemy("zombie");
        }
    },
    /* 17 */ (game, first = false) => {
        if (first) {
            game.enemies.types.ZombieBoss.prototype.health = 1200;
            game.enemies.types.Zombie.prototype.health = 45;
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 37 === 0) {
            game.enemies.spawnEnemy("butterfly");
        }

        if (game.frame % 35 === 0) {
            game.enemies.spawnEnemy("zombie");
            game.enemies.spawnEnemy("zombie");
        }
    },
    /* 18 */ (game, first = false) => {
        if (first) {
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 40 === 0) {
            game.enemies.spawnEnemy("butterfly");
            game.enemies.spawnEnemy("butterfly");
        }

        if (game.frame % 34 === 0) {
            game.enemies.spawnEnemy("zombie");
        }
    },
    /* 19 */ (game, first = false) => {
        if (first) {
            game.enemies.types.Butterfly.prototype.health = 18;
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 33 === 0) {
            game.enemies.spawnEnemy("butterfly");
            game.enemies.spawnEnemy("butterfly");
            game.enemies.spawnEnemy("zombie");
        }
    },
    /* 20 */ (game, first = false) => {
        if (first) {
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 32 === 0) {
            game.enemies.spawnEnemy("butterfly");
        }

        if (game.frame % 31 === 0) {
            game.enemies.spawnEnemy("zombie");
            game.enemies.spawnEnemy("zombie");
            game.enemies.spawnEnemy("zombie");
        }
    },
    /* 21 */ (game, first = false) => {
        if (first) {
            game.enemies.types.Butterfly.prototype.health = 19;
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 40 === 0) {
            for (let i = 0; i < 3; i++) {
                game.enemies.spawnEnemy("butterfly");
            }
        }

        if (game.frame % 29 === 0) {
            game.enemies.spawnEnemy("zombie");
        }
    },
    /* 22 */ (game, first = false) => {
        if (first) {
            game.enemies.types.Zombie.prototype.health = 48;
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 25 === 0) {
            game.enemies.spawnEnemy("zombie");
        }

        if (game.frame % 35 === 0) {
            game.enemies.spawnEnemy("butterfly");
        }
    },

    /* 23 */ (game, first = false) => {
        if (first) {
            game.enemies.types.Butterfly.prototype.health = 23;
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 24 === 0) {
            for (let i = 0; i < 2; i++) {
                game.enemies.spawnEnemy("zombie");
            }
        }

        if (game.frame % 34 === 0) {
            game.enemies.spawnEnemy("butterfly");
        }
    },

    /* 24 */ (game, first = false) => {
        if (first) {
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 23 === 0) {
            game.enemies.spawnEnemy("zombie");
        }

        if (game.frame % 33 === 0) {
            for (let i = 0; i < 2; i++) {
                game.enemies.spawnEnemy("butterfly");
            }
        }
    },

    /* 25 */ (game, first = false) => {
        if (first) {
            game.enemies.types.ZombieBoss.prototype.health = 1300;
            game.enemies.types.Zombie.prototype.health = 50;
            game.enemies.spawnEnemy("zombie_boss");
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 22 === 0) {
            for (let i = 0; i < 2; i++) {
                game.enemies.spawnEnemy("zombie");
            }
        }

        if (game.frame % 32 === 0) {
            game.enemies.spawnEnemy("butterfly");
        }
    },

    /* 26 */ (game, first = false) => {
        if (first) {
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 21 === 0) {
            game.enemies.spawnEnemy("zombie");
        }

        if (game.frame % 31 === 0) {
            for (let i = 0; i < 3; i++) {
                game.enemies.spawnEnemy("butterfly");
            }
        }
    },
    /* 27 */ (game, first = false) => {
        if (first) {
            game.enemies.types.Zombie.prototype.health = 52;
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 20 === 0) {
            for (let i = 0; i < 3; i++) {
                game.enemies.spawnEnemy("zombie");
            }
        }

        if (game.frame % 30 === 0) {
            game.enemies.spawnEnemy("butterfly");
        }
    },

    /* 28 */ (game, first = false) => {
        if (first) {
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 19 === 0) {
            game.enemies.spawnEnemy("zombie");
        }

        if (game.frame % 29 === 0) {
            for (let i = 0; i < 2; i++) {
                game.enemies.spawnEnemy("butterfly");
            }
        }
    },

    /* 29 */ (game, first = false) => {
        if (first) {
            game.enemies.spawnEnemy("zombie_boss");
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 18 === 0) {
            for (let i = 0; i < 2; i++) {
                game.enemies.spawnEnemy("zombie");
            }
        }

        if (game.frame % 28 === 0) {
            game.enemies.spawnEnemy("butterfly");
        }
    },

    /* 30 */ (game, first = false) => {
        if (first) {
            game.enemies.types.Butterfly.prototype.health = 25;
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 17 === 0) {
            for (let i = 0; i < 3; i++) {
                game.enemies.spawnEnemy("zombie");
            }
        }

        if (game.frame % 27 === 0) {
            game.enemies.spawnEnemy("butterfly");
        }
    },

    /* 31 */ (game, first = false) => {
        if (first) {
            game.enemies.types.ZombieBoss.prototype.health = 1400;
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 16 === 0) {
            game.enemies.spawnEnemy("zombie");
        }

        if (game.frame % 26 === 0) {
            for (let i = 0; i < 2; i++) {
                game.enemies.spawnEnemy("butterfly");
            }
        }
    },

    /* 32 */ (game, first = false) => {
        if (first) {
            game.enemies.spawnEnemy("zombie_boss");
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 15 === 0) {
            for (let i = 0; i < 2; i++) {
                game.enemies.spawnEnemy("zombie");
            }
        }

        if (game.frame % 25 === 0) {
            game.enemies.spawnEnemy("butterfly");
        }
    },
    /* 33 */ (game, first = false) => {
        if (first) {
            game.enemies.types.Zombie.prototype.health = 54;
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 14 === 0) {
            for (let i = 0; i < 2; i++) {
                game.enemies.spawnEnemy("zombie");
            }
        }

        if (game.frame % 24 === 0) {
            game.enemies.spawnEnemy("butterfly");
        }
    },

    /* 34 */ (game, first = false) => {
        if (first) {
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 13 === 0) {
            game.enemies.spawnEnemy("zombie");
        }

        if (game.frame % 23 === 0) {
            for (let i = 0; i < 2; i++) {
                game.enemies.spawnEnemy("butterfly");
            }
        }
    },

    /* 35 */ (game, first = false) => {
        if (first) {
            game.enemies.spawnEnemy("zombie_boss");
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 12 === 0) {
            for (let i = 0; i < 2; i++) {
                game.enemies.spawnEnemy("zombie");
            }
        }

        if (game.frame % 22 === 0) {
            game.enemies.spawnEnemy("butterfly");
        }
    },

    /* 36 */ (game, first = false) => {
        if (first) {
            game.enemies.types.Butterfly.prototype.health = 27;
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 11 === 0) {
            game.enemies.spawnEnemy("zombie");
        }

        if (game.frame % 21 === 0) {
            game.enemies.spawnEnemy("butterfly");
        }
    },

    /* 37 */ (game, first = false) => {
        if (first) {
            game.enemies.types.ZombieBoss.prototype.health = 1500;
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 10 === 0) {
            for (let i = 0; i < 3; i++) {
                game.enemies.spawnEnemy("zombie");
            }
        }

        if (game.frame % 20 === 0) {
            game.enemies.spawnEnemy("butterfly");
        }
    },

    /* 38 */ (game, first = false) => {
        if (first) {
            game.enemies.spawnEnemy("zombie_boss");
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 11 === 0) {
            game.enemies.spawnEnemy("zombie");
        }

        if (game.frame % 19 === 0) {
            for (let i = 0; i < 2; i++) {
                game.enemies.spawnEnemy("butterfly");
            }
        }
    },

    /* 39 */ (game, first = false) => {
        if (first) {
            game.enemies.types.Zombie.prototype.health = 56;
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 8 === 0) {
            for (let i = 0; i < 2; i++) {
                game.enemies.spawnEnemy("zombie");
            }
        }

        if (game.frame % 18 === 0) {
            game.enemies.spawnEnemy("butterfly");
        }
    },

    /* 40 */ (game, first = false) => {
        if (first) {
            game.enemies.types.ZombieBoss.prototype.health = 1700;
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 10 === 0) {
            game.enemies.spawnEnemy("zombie");
        }

        if (game.frame % 17 === 0) {
            for (let i = 0; i < 3; i++) {
                game.enemies.spawnEnemy("butterfly");
            }
        }
    },

    /* 41 */ (game, first = false) => {
        if (first) {
            game.enemies.types.Butterfly.prototype.health = 29;
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 6 === 0) {
            for (let i = 0; i < 2; i++) {
                game.enemies.spawnEnemy("zombie");
            }
        }

        if (game.frame % 16 === 0) {
            game.enemies.spawnEnemy("butterfly");
        }
    },

    /* 42 */ (game, first = false) => {
        if (first) {
            game.enemies.spawnEnemy("zombie_boss");
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 15 === 0) {
            game.enemies.spawnEnemy("zombie");
        }

        if (game.frame % 15 === 0) {
            for (let i = 0; i < 6; i++) {
                game.enemies.spawnEnemy("butterfly");
            }
        }
    },

    /* 43 */ (game, first = false) => {
        if (first) {
            game.enemies.types.ZombieBoss.prototype.health = 1800;
            game.enemies.types.Zombie.prototype.health = 58;
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 4 === 0) {
            for (let i = 0; i < 2; i++) {
                game.enemies.spawnEnemy("zombie");
            }
        }

        if (game.frame % 14 === 0) {
            game.enemies.spawnEnemy("butterfly");
        }
    },

    /* 44 */ (game, first = false) => {
        if (first) {
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 10 === 0) {
            game.enemies.spawnEnemy("zombie");
        }

        if (game.frame % 13 === 0) {
            for (let i = 0; i < 3; i++) {
                game.enemies.spawnEnemy("butterfly");
            }
        }
    },

    /* 45 */ (game, first = false) => {
        if (first) {
            game.enemies.spawnEnemy("zombie_boss");
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 5 === 0) {
            game.enemies.spawnEnemy("zombie");
        }

        if (game.frame % 12 === 0) {
            game.enemies.spawnEnemy("butterfly");
        }
    },

    /* 46 */ (game, first = false) => {
        if (first) {
            game.enemies.types.Butterfly.prototype.health = 30;
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        if (game.frame % 5 === 0) {
            game.enemies.spawnEnemy("zombie");
        }

        if (game.frame % 11 === 0) {
            for (let i = 0; i < 4; i++) {
                game.enemies.spawnEnemy("butterfly");
            }
        }
    },

    /* 47 */ (game, first = false) => {
        if (first) {
            game.enemies.types.ZombieBoss.prototype.health = 2000;
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        // Intense round with continuous spawning
        if (game.frame % 4 === 0) {
            game.enemies.spawnEnemy("zombie");
            game.enemies.spawnEnemy("butterfly");
        }
    },

    /* 48 */ (game, first = false) => {
        if (first) {
            game.enemies.spawnEnemy("zombie_boss");
            game.enemies.types.Zombie.prototype.health = 60;
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        // Another intense round with continuous spawning
        if (game.frame % 3 === 0) {
            game.enemies.spawnEnemy("zombie");
            game.enemies.spawnEnemy("butterfly");
        }
    },

    /* 49 */ (game, first = false) => {
        if (first) {
            game.objects.spawnObject("box", game.objects.randomSpawnPoint());
        }

        // Continuous spawning for a highly challenging round
        if (game.frame % 2 === 0) {
            game.enemies.spawnEnemy("zombie");
            game.enemies.spawnEnemy("butterfly");
        }
    },

    /* 50 */ (game, first = false) => {
        if (round50Time > 60 * 60) {
            const enemies = game.enemies.enemies;

            for (let i = 0; i < enemies.length; i++) {
                let enemy = enemies[i];
                enemy.dropChance = 0;
                enemy.hurt(1000000);
            }
        }

        if (first) {
            game.enemies.spawnEnemy("zombie_boss");
            game.enemies.types.Zombie.prototype.health = 100;
            game.enemies.types.Butterfly.prototype.health = 50;
            game.enemies.types.ZombieBoss.prototype.health = 2500;
            for (let i = 0; i < 5; i++) {
                game.objects.spawnObject("box", game.objects.randomSpawnPoint());
            }
        }

        if (game.frame % 10 === 0) {
            game.enemies.spawnEnemy("zombie");
            game.enemies.spawnEnemy("butterfly");
        }

        if (game.frame % 40 === 0) {
            game.enemies.spawnEnemy("zombie_boss");
        }

        round50Time ++;
    }
];

var unsavedLevel = 1;

function roundTime(num, dec) {
    return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
}

export default function runRounds(game) {
    if (game.player.dead === true) {
        return game.player.deathState <= 100;
    } else {
        if (game.timer > 30 && roundTime(game.timer, 6) % 30 === 0 && game.level < 50) {
            game.level ++;
        }

        if (game.level !== unsavedLevel) {
            unsavedLevel = game.level;
            levels[game.level - 1](game, true);
        }

        levels[game.level - 1](game);

        return true;
    }
}