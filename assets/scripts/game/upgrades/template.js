// name, description

export default class Upgrade {
    level = 0;
    max = false;

    data = [
        // [ ..., name ]
        [
            0,
            ""
        ]
    ]

    constructor(game) {
        this.name = "";
        this.maxLevel = 0;
        this.description = this.data[0][4];
        this.image = null;
        this.game = game;
    }

    upgrade() {
        if (this.max === true) {
            return false;
        }

        this.level ++;

        var level = this.level - 1;
        var data = this.data[level];

        // ...

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
}