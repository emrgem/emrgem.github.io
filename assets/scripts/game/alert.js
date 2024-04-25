export default class Alerts {
    constructor(game) {
        this.game = game;
        this.alerts = [];
    }

    addAlert(text, duration = 120) {
        this.alerts.push({
            text,
            duration
        });
    }

    render(alerts) {
        for (let i = 0; i < alerts.length; i++) {
            let alert = alerts[i];

            // red box with flashing warning text

            graphic.push();

            graphic.rectMode(CENTER);
            graphic.fill(255, 0, 0, 100 * (1 - sin(3 * (alert.duration % 60)) * 0.4));
            graphic.rect(width / 2, 150, 370, 50, 5);

            graphic.fill(0);
            graphic.textAlign(CENTER);
            graphic.textSize(26);
            graphic.text(alert.text, width / 2, 160, 340, 50);

            graphic.pop();

            // only update if player not choosing upgrade

            if (!this.game.upgradeScreen) {
                alert.duration --;

                if (alert.duration <= 0) {
                    this.alerts.splice(i, 1);
                }
            }
        }
    }
}