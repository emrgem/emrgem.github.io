import { mouseHovering } from "../collision.js";

let time = 0;
let fontSize = 18;

let restartButton = {
    width: 200,
    height: 50,
    get x() {
        return width / 2;
    },
    get y() {
        return height / 2;
    } 
}

export function gameOver(game) {
    time ++;

    graphic.push();
    graphic.textFont(game.assets.fonts.roboto);
    graphic.rectMode(CORNER);
    graphic.fill(0, 0, 0, 255 * ((time > 30 ? 30 : time) / 30) * 0.5);
    graphic.rect(0, 0, width, height);
    graphic.fill(255);
    graphic.textSize(50);
    graphic.textAlign(CENTER, CENTER);
    graphic.text("Game Over", width / 2, 200);

    // restart button with rounded corners

    let buttonColor = "#fff";
    let cornerRadius = 10;

    graphic.noStroke();
    graphic.fill(buttonColor);
    graphic.rect(restartButton.x - restartButton.width / 2, restartButton.y - restartButton.height / 2, restartButton.width, restartButton.height, cornerRadius);

    // play button text
    graphic.noStroke();
    graphic.fill("black");
    graphic.textSize(fontSize);
    graphic.textAlign(CENTER);
    graphic.text("Main Menu", restartButton.x, restartButton.y - 3);

    // hover effect
    if (mouseHovering(restartButton)) {
        cursor(HAND);
        graphic.noFill();
        graphic.stroke("red");
        graphic.strokeWeight(2);
        graphic.rect(restartButton.x - restartButton.width / 2, restartButton.y - restartButton.height / 2, restartButton.width, restartButton.height, cornerRadius);

        if (mouseIsPressed) {
            game.restart();

            game.screen = "menu";
        }
    }
    
    graphic.stroke(0);
    graphic.fill(game.menuColor);
    graphic.rect(0, height - 175, width, 175);
    graphic.pop();
}