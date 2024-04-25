import Enemy from "./generic.js";

export default class FinalBoss extends Enemy {
    constructor(x = 0, y = 0) {
        super(x, y, 60, 60, 6000, 10, 0, 0, "black", null);
    }
}