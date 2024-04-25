// p5.js

var setup = false;
var open = false;

var fontSize = 19;

var tutorialData = {
    page: 0,
    pages: [
        [
            "Welcome to the tutorial!",
            "This is a tutorial for the game, it will explain the basics of the game.",
            "Click the next button to continue."
        ],
        [
            "The goal of the game is to survive for as long as possible.",
            "You will be attacked in waves by enemies constantly.",
            "Each time you kill an enemy, they might drop emeralds or currency.",
            "Collecting the emeralds give you progress towards upgrading your game level.",
            "Reaching Round 50 will win you the game."
        ],
        [
            "You can select one upgrade every time you fill your upgrade bar and level up.",
            "There are many unique upgrades to pick from, and each has its own benefits and downsides.",
            "As you level up more, it takes longer to get upgrades."
        ],
        [
            "You can move your character by using the WASD keys.",
            "You can move your weapon by rotating the mouse around the player.",
            "Your weapon cooldown is located under the player, and player health is above that bar."
        ]
    ],
    next() {
        this.page ++;

        if (this.page >= this.pages.length) {
            this.page = 0;
        }
    },
    prev() {
        this.page --;

        if (this.page < 0) {
            this.page = this.pages.length - 1;
        }
    },
    render() {
        graphic.push();

        graphic.fill(game.menuColor);
        graphic.textSize(fontSize);
        graphic.textAlign(CENTER);
        graphic.textFont(game.assets.fonts.roboto);

        var text = this.pages[this.page].join("\n");

        graphic.text(text, width / 2, 200, width - 50);

        graphic.pop();
    },
    renderButton() {
        graphic.push();

        graphic.fill(game.menuColor);
        graphic.textSize(fontSize);
        graphic.textAlign(CENTER);
        graphic.textFont(game.assets.fonts.roboto);

        graphic.text("Close", width / 2, 30);

        if (mouseX > width / 2 - 50 && mouseX < width / 2 + 50 && mouseY > 15 && mouseY < 45) {
            graphic.fill(0, 0, 0, 100);
            graphic.rect(width / 2, 30, 100, 30);
        }

        graphic.pop();
    },
    update() {
        this.render();

        this.renderButton();
    },
    mousePressed(game) {
        this.next();

        if (mouseX > width / 2 - 50 && mouseX < width / 2 + 50 && mouseY > 15 && mouseY < 45) {
            game.screen = "menu";
        }
    },
    mouseWheel(event) {
        if (event.delta > 0) {
            this.next();
        } else {
            this.prev();
        }
    }
}

let g;

export function tutorial(game) {
    g = game;

    if (!setup) {
        game.on("mousePressed", () => tutorialData.mousePressed(g));
        game.on("mouseWheel", (event) => tutorialData.mouseWheel(event));
        
        setup = true;
    }

    // render tutorial

    tutorialData.update();
} 