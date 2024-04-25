// energy drink for speed

export default class Upgrade {
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
    ]

    constructor(game) {
        this.name = "Energy Drink";
        this.maxLevel = 5;
        this.description = this.data[0][1];
        this.image = game.assets.images.energy;
        this.game = game;
    }

    upgrade() {
        if (this.max === true) {
            return false;
        }

        this.level ++;

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
}