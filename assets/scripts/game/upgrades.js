import { mouseHovering } from "./collision.js";

export class UpgradeScreen {
    listeners = [
        // [event, callback]
    ];

    time = 0;
    selected = false;

    constructor(game, upgrades, level) {
        this.game = game;
        this.upgrades = upgrades;
        this.level = level; 

        this.on("select", upgrade => {
            this.selected = true;

            if (upgrade) {
                upgrade.upgrade();

                if (!this.game.upgrades.currentUpgrades.find(u => u[0] === upgrade)) {
                    this.game.upgrades.currentUpgrades.push([upgrade, upgrade.level]);
                } else {
                    this.game.upgrades.currentUpgrades.find(u => u[0] === upgrade)[1] = upgrade.level;
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
        // there are gonna be 3 of these

        const tempGraphic = createGraphics(120, 200);

        tempGraphic.background(this.game.menuColor);

        tempGraphic.rectMode(CORNER);

        tempGraphic.textWrap(WORD);

        tempGraphic.fill(0);
        tempGraphic.textAlign(CENTER);
        tempGraphic.textSize(20);
        tempGraphic.text(upgrade.name, 60, 30);

        // upgrade image and then description

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
            this.time --;

            graphic.push();
            graphic.rectMode(CORNER);
            graphic.fill(0, 0, 0, 255 * ((this.time > 30 ? 30 : this.time) / 30) * 0.5);
            graphic.rect(0, 0, width, height);
            graphic.pop();

            return;
        } else {
            this.time ++;
        }
        
        graphic.push();
        graphic.rectMode(CORNER);
        graphic.imageMode(CENTER);
        graphic.fill(0, 0, 0, 255 * ((this.time > 30 ? 30 : this.time) / 30) * 0.5);
        graphic.rect(0, 0, width, height);

        var graphic1 = this.createUpgradeGraphic(this.upgrades[0] || undefined);
        var graphic2 = this.createUpgradeGraphic(this.upgrades[1] || undefined);
        var graphic3 = this.createUpgradeGraphic(this.upgrades[2] || undefined);

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

}

import GunUpgrade from "./upgrades/gun.js";
import Spinner from "./upgrades/spinner.js";
import Lightning from "./upgrades/lightning.js";
import Healing from "./upgrades/heal.js";
import Forcefield from "./upgrades/forcefield.js";
import Speed from "./upgrades/speed.js";
import Ball from "./upgrades/ball.js";

export default class Upgrades {
    currentUpgrades = [];

    constructor(game) {
        this.game = game;

        this.upgrades = [
            new GunUpgrade(game),
            new Spinner(game),
            new Lightning(game),
            new Healing(game),
            new Forcefield(game),
            new Speed(game),
            new Ball(game)
        ];
    }

    select(number) {
        // select { number } of UNIQUE upgrades and return an array

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
            if (this.currentUpgrades.find(u => u[0] === selected[i]) && this.currentUpgrades.find(u => u[0] === selected[i])[1] >= selected[i].maxLevel) {
                selected.splice(i, 1, null);

                /*if (this.upgrades.filter(u => !this.currentUpgrades.find(u2 => u2[0] === u && u2[1] >= u.maxLevel) && selected.indexOf(u) === -1).length > 0) {
                    selected.push(this.upgrades.filter(u => !this.currentUpgrades.find(u2 => u2[0] === u && u2[1] >= u.maxLevel && selected.indexOf(u) === -1))[0]);
                }*/
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
}