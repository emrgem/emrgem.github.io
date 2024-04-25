import { draw, setup } from "./setup.js";
import runRounds from "./rounds.js";
import { inGame, mainMenu, pauseMenu, tutorial, gameOver } from "./ui.js";
import { UpgradeScreen } from "./upgrades.js";

import Player from './player.js';
import Background from './background.js';
import Enemies from "./enemies.js";
import Objects from "./objects.js";
import Currency from './currency.js';
import Upgrades from './upgrades.js';
import Damage from './damage.js';
import Alerts from './alert.js';

window.setup = setup;
window.draw = draw;

export default class Game {
    assets = {
        images: {},
        sounds: {},
        fonts: {}
    }

    dimensions = {
        width: 3000,
        height: 3000,
        position: {
            x: 1225,
            y: 1150
        },
        center: {
            x: 1225,
            y: 1150
        }
    }

    time = {
        min: 0,
        secs: 0
    }

    player = null;
    background = null;
    enemies = null;
    upgradeScreen = null;
    upgrades = null;

    timer = 0;
    kills = 0;
    score = 0;

    bullets = [];
    enemies_arr = [];

    paused = false;
    upgrading = false;

    menuColor = "#8793a4";

    _screen = "load";
    _level = 1;

    constructor() {
        window.mousePressed = (...args) => {
            this.fire("mousePressed", ...args);
        }

        window.mouseReleased = (...args) => {
            this.fire("mouseReleased", ...args);
        }

        window.mouseClicked = (...args) => {
            this.fire("mouseClicked", ...args);
        }

        window.mouseMoved = (...args) => {
            this.fire("mouseMoved", ...args);
        }

        window.mouseWheel = (...args) => {
            this.fire("mouseWheel", ...args);
        }
    };

    loadImage(src) {
        var i = new Image();
        i.src = src;

        i.onload = () => {
            i.loaded = true;

            return i;
        }

        return i;
    }

    render() {
        cursor(ARROW);

        this.draw();
    }

    get screen() {
        return this._screen;
    }

    set screen(val = "menu") {
        switch(val) {
            case "tutorial":
            case "menu": {
                if (!this.assets.sounds.game_menu.isPlaying()) {
                    this.assets.sounds.game_main.stop();
                    this.assets.sounds.game_menu.play();
                }
                break;
            }
            case "game": {
                if (!this.assets.sounds.game_main.isPlaying()) {
                    this.assets.sounds.game_menu.stop();
                    this.assets.sounds.game_main.play();
                }
            }

        }
        this._screen = val;
    }

    get level() {
        return this._level;
    }

    set level(val) {
        if (val > 50) {
            val = 50;
        }

        this._level = val;

        this.score += 10;
    }

    draw() {
        try {
            window.graphic = createGraphics(width, height);

            graphic.imageMode(CENTER);
            graphic.rectMode(CENTER);
            graphic.angleMode(DEGREES);

            switch(this.screen) {
                case "menu": {
                    mainMenu(this);
                    break;
                }
                case "pause":
                case "over":
                case "game": {
                    graphic.push();
                    this.background.draw(this);
                    if (this.upgradeScreen) {
                        this.player.weapon.drawBullets(this.bullets);
                        this.objects.render(this.objects.objects);
                        this.player.draw();
                        this.player.weapon.draw();
                        this.enemies.draw(this.enemies_arr);
                        this.upgrades.renderUpgrades(this.upgrades.currentUpgrades);
                        this.damage.render(this.damage.damages);
                        this.background.drawPost(this);
                        this.alerts.render(this.alerts.alerts);
                        inGame(this, false);
                        this.upgradeScreen.render();
                        inGame(this, true);
                    } else {
                        this.player.weapon.drawBullets(this.bullets);
                        this.player.weapon.updateBullets(this.bullets);
                        this.player.weapon.checkBullets(this.bullets, this.getTargets());
                        this.player.checkCollisions(this.enemies_arr);
                        this.upgrades.renderUpgrades(this.upgrades.currentUpgrades);
                        this.upgrades.update(this.upgrades.currentUpgrades);
                        this.damage.render(this.damage.damages);
                        if (runRounds(this)) {
                            this.objects.render(this.objects.objects);
                            this.player.draw();
                            this.player.update();
                            this.player.weapon.draw();
                            this.enemies.draw(this.enemies_arr);
                            this.enemies.update(this.enemies_arr);
                            this.background.drawPost(this);
                            this.alerts.render(this.alerts.alerts);
                            this.currency.checkUpgrades();
                            inGame(this);

                            this.updateStats();
                        } else {
                            this.objects.render(this.objects.objects);
                            this.player.draw();
                            this.enemies.draw(this.enemies_arr);
                            this.background.drawPost(this);
                            inGame(this);

                            if (this.screen === "over") {
                                gameOver(this);
                            }
                        }
                    }

                    if (this.screen === "pause") {
                        pauseMenu(this);
                    }

                    graphic.pop();
                    break;
                }
                case "tutorial": {
                    tutorial(this);
                    break;
                }
                case "load": {
                    this.screen = "menu";
                    break;
                }
                default: {
                    graphic.text("Error: Invalid screen", width / 2, height / 2)
                    break;
                }
            }

            background(0);
            image(window.graphic, width / 2, height / 2, width, height);

            graphic.remove();
        } catch (err) {
            console.error(err);
        }
    }
    
    updateStats() {
        this.timer += (1 / 60);

        var min = Math.floor(this.timer / 60);
        var secs = Math.floor(this.timer - (min * 60));    

        this.time = {
            min,
            secs
        }
    }

    getTargets() {
        return [
            ...this.enemies.enemies,
            ...this.objects.objects.filter(obj => {
                return obj.hasOwnProperty("health") && obj.health > 0;
            }).map(obj => {
                var coords = obj.getCoords();

                return new Proxy(obj, {
                    get(target, prop) {
                        if (prop === "x") {
                            return coords.x;
                        } else if (prop === "y") {
                            return coords.y;
                        } else if (prop === "_x") {
                            return obj.x;
                        } else if (prop === "_y") {
                            return obj.y;
                        } else {
                            return target[prop];
                        }
                    }
                })
            })
        ];
    }

    restart() {
        this.timer = 0;
        this.kills = 0;
        this.score = 0;

        this.time = {
            min: 0,
            secs: 0
        }

        this.dimensions = {
            width: 3000,
            height: 3000,
            position: {
                x: 1225,
                y: 1150
            },
            center: {
                x: 1225,
                y: 1150
            }
        }

        this.bullets = [];
        this.enemies_arr = [];

        this.paused = false;
        this.upgrading = false;

        this._level = 1;

        this.player = new Player(width / 2, height / 2);
        this.background = new Background();
        this.enemies = new Enemies(this);
        this.objects = new Objects(this);
        this.currency = new Currency(this);
        this.upgrades = new Upgrades(this);
        this.damage = new Damage(this);
        this.alerts = new Alerts(this);
    }

    debugStats() {
        var min = Math.floor(this.timer / 60);
        var secs = Math.floor(this.timer - (min * 60));    
      
        graphic.fill("black")
        graphic.textSize(25);
        graphic.textAlign(CENTER);
        graphic.text(`${min < 10 ? "0" + min : min}:${secs < 10 ? "0" + secs : secs}`, width / 2, 30)
      
        this.timer += (1 / 60);

        text(`Location: (${game.player.coords.x.toFixed(1)}, ${game.player.coords.y.toFixed(1)})`, width / 2, 60);
    }

    moveEntities(x, y) {
        for (var i = 0; i < this.enemies_arr.length; i ++) {
            var enemy = this.enemies_arr[i];
        
            enemy.x -= x;
            enemy.y += y;
        }
        
        for (var i = 0; i < this.bullets.length; i ++) {
            var bullet = this.bullets[i];
        
            bullet.x -= x;
            bullet.y += y;
        }

        if (this.upgrades.upgrades.find(upgrade => upgrade.name === "Lightning")) {
            var lightning = this.upgrades.upgrades.find(upgrade => upgrade.name === "Lightning")
            for (var i = 0; i < lightning.bolts.length; i ++) {
                var bolt = lightning.bolts[i];

                bolt.x -= x;
                bolt.y += y;
            }
        }

        if (this.upgrades.upgrades.find(upgrade => upgrade.name === "Ball")) {
            var ball = this.upgrades.upgrades.find(upgrade => upgrade.name === "Ball")
            for (var i = 0; i < ball.balls.length; i ++) {
                var bolt = ball.balls[i];

                bolt.x -= x;
                bolt.y += y;
            }
        }
    }

    requestUpgrade(level) {
        return new Promise((resolve, reject) => {
            this.upgrading = true;

            var upgrades = this.upgrades.select(3);
            this.upgradeScreen = new UpgradeScreen(this, upgrades, level);

            this.upgradeScreen.on("close", () => {
                this.upgrading = false;
                resolve();
            });

            this.upgradeScreen.on("upgrade", () => {
                this.upgrading = false;
                resolve();
            });
        }).then(() => {
            return this.upgradeScreen.fadeOut();
        }).catch((err) => {
            console.error(err);
        }).finally(() => {
            this.upgradeScreen = null;
        });
    }

    get frames() {
        return window.frameCount;
    }

    get frame() {
        return window.frameCount;
    }

    listeners = [];

    on(event, callback) {
        this.listeners.push([event, callback]);
    }

    fire(event, ...args) {
        for (let i = 0; i < this.listeners.length; i++) {
            if (this.listeners[i][0] === event) {
                this.listeners[i][1](...args);
            }
        }
    }
}