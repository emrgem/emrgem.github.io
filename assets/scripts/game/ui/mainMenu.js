import { mouseHovering } from "../collision.js";

let fontSize = 17;

let titleImage = {
    width: 300,
    height: 300,
    get y() {
        return height / 2 - 100;
    },
    get x() {
        return width / 2;
    }
}

let playButton = {
    width: 200,
    height: 50,
    get x() {
        return width / 2;
    },
    get y() {
        return height / 2 + 100;
    } 
}

let tutorialButton = {
    width: 200,
    height: 50,
    get x() {
        return width / 2;
    },
    get y() {
        return height / 2 + 170;
    } 
}

export function mainMenu(game) {
    let menuColor = "#000004";

    graphic.push();
    graphic.rectMode(CORNER);
    graphic.fill(menuColor);
    graphic.textFont(game.assets.fonts.roboto);

    // background
    graphic.background(menuColor);

    // title img
    graphic.imageMode(CENTER);
    graphic.image(game.assets.images.logo, titleImage.x, titleImage.y, titleImage.width, titleImage.height);

    // play button with rounded corners
    let buttonColor = "#fff";
    let cornerRadius = 10;

    graphic.noStroke();
    graphic.fill(buttonColor);
    graphic.rect(playButton.x - playButton.width / 2, playButton.y - playButton.height / 2, playButton.width, playButton.height, cornerRadius);

    // play button text
    graphic.noStroke();
    graphic.fill("black");
    graphic.textSize(fontSize);
    graphic.textAlign(CENTER);
    graphic.text("Play", playButton.x, playButton.y + fontSize / 2 - 3);

    // hover effect
    if (mouseHovering(playButton)) {
        cursor(HAND);
        graphic.noFill();
        graphic.stroke("red");
        graphic.strokeWeight(2);
        graphic.rect(playButton.x - playButton.width / 2, playButton.y - playButton.height / 2, playButton.width, playButton.height, cornerRadius);

        if (mouseIsPressed) {
            game.screen = "game";
        }
    }

    // tutorial button

    graphic.noStroke();
    graphic.fill(buttonColor);
    graphic.rect(tutorialButton.x - tutorialButton.width / 2, tutorialButton.y - tutorialButton.height / 2, tutorialButton.width, tutorialButton.height, cornerRadius);

    // tutorial button text
    graphic.noStroke();
    graphic.fill("black");
    graphic.textSize(fontSize);
    graphic.textAlign(CENTER);
    graphic.text("Tutorial", tutorialButton.x, tutorialButton.y + fontSize / 2 - 3);

    // hover effect
    if (mouseHovering(tutorialButton)) {
        cursor(HAND);
        graphic.noFill();
        graphic.stroke("red");
        graphic.strokeWeight(2);
        graphic.rect(tutorialButton.x - tutorialButton.width / 2, tutorialButton.y - tutorialButton.height / 2, tutorialButton.width, tutorialButton.height, cornerRadius);

        if (mouseIsPressed) {
            game.screen = "tutorial";
        }
    }

    graphic.pop();
}