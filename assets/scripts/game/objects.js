import Box from './objects/box.js';
import Emerald from './objects/emerald.js';
import Magnet from './objects/magnet.js';
import Food from './objects/food.js';
import Diamond from './objects/diamond.js';

export default class Objects {
    constructor(game) {
        this.game = game;
        this.objects = [];

        // spawn a bunch of boxes off of the start

        for (let i = 0; i < 15; i++) {
            this.spawnObject("box", this.randomSpawnPoint());
        }
    }

    spawnObject(type, [x, y]) {
        let object = null;

        switch (type) {
            case "box":
                object = new Box(x, y);
                break;
            case "emerald":
                object = new Emerald(x, y);
                break;
            case "magnet":
                object = new Magnet(x, y);
                break;
            case "food":
                object = new Food(x, y);
                break;
            case "diamond":
                object = new Diamond(x, y);
                break;
        }

        this.objects.push(object);

        return object;
    }

    randomSpawnPoint() {
        return [
            random(0, 3000),
            random(0, 3000) 
        ];
    }

    render(objects = []) {
        for (let i = 0; i < objects.length; i++) {
            objects[i].draw();
        }
    }
}