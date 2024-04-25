export default class Damages {
    damages = [];

    constructor(game) {
        this.game = game;
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
        for (var i = 0; i < damages.length; i ++) {
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
}