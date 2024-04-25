import { Loader } from './load.js';
import Player from './player.js';
import Background from './background.js';
import Enemies from "./enemies.js";
import Objects from "./objects.js";
import Currency from './currency.js';
import Upgrades from './upgrades.js';
import Damage from './damage.js';
import Alerts from './alert.js';

import { random as _random, distance } from "./math.js";

window.buttons = {
    power: null
};
let loader;
let power = true;
let started = false;

export function draw() {
    if (power) {
        if (loader.working) {
            return loader.render();
        } else {
            if (!started) {
                window.game.player = new Player(width / 2, height / 2);
                window.game.background = new Background();
                window.game.enemies = new Enemies(window.game);
                window.game.objects = new Objects(window.game);
                window.game.currency = new Currency(window.game);
                window.game.upgrades = new Upgrades(window.game);
                window.game.damage = new Damage(window.game);
                window.game.alerts = new Alerts(window.game);
            }

            started = true;

            return window.game.render();
        }
    } else {
        background(0);
    }
}

export function setup() {
    loader = new Loader();

    p5.disableFriendlyErrors = true;

    createCanvas(550, 700);
    imageMode(CENTER);
    rectMode(CENTER);
    angleMode(DEGREES);
    frameRate(60);
    
    window.random = _random;
    window.dist = distance;

    // funny power button

    /*buttons.power = createButton("Power");
    buttons.power.position(width / 2 + buttons.power.width, height);
    buttons.power.mousePressed(() => {
        power = !power;
        
        if (power === false) {
            loader.working = true;
            loader.loadTime = 1;
            loader.progress = 0;
            loader.state = 0;
            loader.frame = 0;

            window.game.player = new Player(width / 2, height / 2);
            window.game.background = new Background();
            window.game.enemies = new Enemies(window.game);
            window.game.objects = new Objects(window.game);
        }
    });*/
}