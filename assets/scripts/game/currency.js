export default class Currency {
    getLevelRequired(level) {
        return 20 * (level < 30 ? level ** 1.45 : level < 40 ? level ** 1.7 : level ** 2);
    }

    constructor(game) {
        this.total = 0;
        this.current = 0;
        this.required = this.getLevelRequired(1);
        this.game = game;

        this.startEmeralds();
    }

    startEmeralds() {
        // 15 emeralds in a ring around the player with a little bit of a deviation from the circle

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
}