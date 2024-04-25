import { mouseHovering } from "../collision.js";

let timer = {
    width: 48,
    height: 34,
    y: 12,
    triangle: {
        width: 8,
        height: 6
    }
}

let pauseButton = {
    width: 25,
    height: 25,
    get x() {
        return width / 2 - 55;
    },
    y: 18
}

let stopButton = {
    width: 25,
    height: 25,
    get x() {
        return width / 2 + 55;
    },
    y: 18
}

let fontSize = 19;

let fakeCurrency = 0;

export function inGame(game, bar = false) {
    let menuColor = game.menuColor;
    
    graphic.push();
    if (!bar) {
        graphic.rectMode(CORNER);
        graphic.fill(menuColor);
        graphic.textFont(game.assets.fonts.roboto);

        // background bar
        graphic.rect(0, 0, width, 36);
        // bottom border;
        graphic.fill("black");
        graphic.rect(0, 35, width, 2);

        // timer area
        graphic.push();
        graphic.fill(menuColor);
        graphic.beginShape();
        graphic.vertex((width - timer.width) / 2, timer.y);
        graphic.vertex((width + timer.width) / 2, timer.y);
        graphic.vertex(((width + timer.width) / 2) + timer.triangle.width, timer.y + timer.triangle.height);
        graphic.vertex(((width + timer.width) / 2) + timer.triangle.width, timer.y + (timer.height - timer.triangle.height));
        graphic.vertex((width + timer.width) / 2, timer.y + timer.height);
        graphic.vertex((width - timer.width) / 2, timer.y + timer.height);
        graphic.vertex(((width - timer.width) / 2) - timer.triangle.width, timer.y + (timer.height - timer.triangle.height));
        graphic.vertex(((width - timer.width) / 2) - timer.triangle.width, timer.y + timer.triangle.height);
        graphic.endShape(CLOSE);
        graphic.textAlign(CENTER);
        graphic.textSize(fontSize);
        graphic.fill("black");
        graphic.text(`${game.time.min < 10 ? "0" + game.time.min : game.time.min}:${game.time.secs < 10 ? "0" + game.time.secs : game.time.secs}`, width / 2 - timer.width / 2, timer.y + (timer.height) / 2 + fontSize / 2 - 3, timer.width, timer.height);
        graphic.pop();

        // buttons/indicators on top menu

        graphic.rectMode(CENTER);

        // gemici.io logo

        graphic.imageMode(CENTER);
        graphic.image(game.assets.images.icon, 20, 18, 25, 25);

        // gemici.io text

        graphic.fill("black");
        graphic.textSize(8);
        graphic.textAlign(CENTER);
        graphic.text("GEMICI.IO", width / 2, 9);

        // pause button

        graphic.fill("yellow");
        graphic.rect(pauseButton.x, pauseButton.y, pauseButton.width, pauseButton.height);
        graphic.image(game.assets.images.pause_image, pauseButton.x, pauseButton.y, pauseButton.width * 0.65, pauseButton.height * 0.65)

        // exit button

        graphic.fill("red");
        graphic.rect(stopButton.x, stopButton.y, stopButton.width, stopButton.height);
        graphic.image(game.assets.images.exit_image, stopButton.x, stopButton.y, stopButton.width * 0.65, stopButton.height * 0.65)

        // # kills

        graphic.fill("gray");
        graphic.rect(width - 15, 18, 25, 25);

        // # coins

        graphic.fill("gray");
        graphic.rect(width - 50, 18, 25, 25);

        if (mouseHovering(pauseButton)) {
            if (mouseIsPressed) {
                game.pause();
            }
    
            cursor(HAND);
        }
    
        if (mouseHovering(stopButton)) {
            if (mouseIsPressed) {
                game.exit();
            }
    
            cursor(HAND);
        }
    }
    // upgrade progress bar

    var w = 215 * 2;

    graphic.push();
    graphic.rectMode(CORNER);

    graphic.fill("black");
    graphic.beginShape();
    graphic.vertex(width / 2 - 215, 52);
    graphic.vertex(width / 2 + 215 + 10, 52);
    graphic.vertex(width / 2 + 215, 52 + 22);
    graphic.vertex(width / 2 - 215 - 10, 52 + 22);
    graphic.endShape(CLOSE);

    graphic.fill(menuColor);
    graphic.beginShape();
    graphic.vertex(width / 2 - 213, 54);
    graphic.vertex(width / 2 + 213 + 8, 54);
    graphic.vertex(width / 2 + 213, 52 + 20);
    graphic.vertex(width / 2 - 213 - 8, 52 + 20);
    graphic.endShape(CLOSE);

    graphic.fill("#44ba38");
    var currency = game.currency.current;

    if (fakeCurrency > currency || fakeCurrency + 0.1 >= currency) {
        fakeCurrency = currency;
    } else {
        fakeCurrency += (currency - fakeCurrency) / 5;
    }

    var progress = fakeCurrency / game.currency.required;
    var barWidth = progress * w;

    if (barWidth + 4 > w) {
        barWidth = w - 4;
    }

    graphic.beginShape();
    graphic.vertex(width / 2 - 213, 54);
    graphic.vertex(width / 2 - 213 + barWidth + 8, 54);
    graphic.vertex(width / 2 - 213 + barWidth, 52 + 20);
    graphic.vertex(width / 2 - 213 - 8, 52 + 20);
    graphic.endShape(CLOSE);

    graphic.fill("black");
    for (let i = 13; i < w; i += 30) {
        graphic.rect(width / 2 - 215 + i, 52, 2, 22);
    }

    graphic.pop();

    // bottom ui

    graphic.push();
    graphic.fill(menuColor);
    graphic.stroke(0);
    graphic.strokeWeight(3);
    graphic.beginShape();
    graphic.vertex(width, height);
    graphic.vertex(0, height);
    graphic.vertex(0, height - 13);
    graphic.vertex(width / 2 - 50, height - 13);
    graphic.vertex(width / 2 - 43, height - 27);
    graphic.vertex(width / 2 + 43, height - 27);
    graphic.vertex(width / 2 + 50, height - 13);
    graphic.vertex(width, height - 13);
    graphic.endShape();
    graphic.pop();

    graphic.textSize(14);
    graphic.fill(0);
    graphic.textAlign(CENTER);
    graphic.text(`Round ${game.level}`, width / 2, height - 10, 80);

    graphic.pop();
}