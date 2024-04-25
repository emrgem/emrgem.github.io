// shotgun + 3 bullets, faster reload

export default class Upgrade {
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
    ]

    constructor(game) {
        this.name = "Shotgun";
        this.maxLevel = 5;
        this.description = this.data[0][4];
        this.image = window.game.player.weapon.sprites[0];
        this.game = game;
    }

    upgrade() {
        if (this.max === true) {
            return false;
        }

        this.level ++;

        var level = this.level - 1;
        var data = this.data[level];

        this.game.player.weapon.ammo += data[0];
        this.game.player.weapon.baseCooldown -= data[1];
        this.game.player.weapon.weaponCooldown -= data[1];
        this.game.player.weapon.damage *= ((100 + data[3]) / 100);
        this.game.player.weapon.Bullet.prototype.speed *= ((100 + data[2]) / 100);

        if (this.level + 1 <= this.maxLevel) {
            this.description = this.data[this.level][4];
        } else {
            this.max = true;
        }
    }

    render() {
        // gun needs no rendering
    }

    update() {
        // gun needs no updating
    }
}