// heal health every time interval

export default class Upgrade {
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
    ]

    constructor(game) {
        this.name = "Healing";
        this.maxLevel = 5;
        this.description = this.data[0][1];
        this.image = game.assets.images.medbag;
        this.game = game;
    }

    heal = 0;

    upgrade() {
        if (this.max === true) {
            return false;
        }

        this.level ++;

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
}