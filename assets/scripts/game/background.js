export default class Background {
    constructor() {
        this.bossBattle = false;
    }

    currentDimensions = null;

    draw({ dimensions: { position, center } }) {
        this.currentDimensions = { position, center };

        graphic.push();
        graphic.background(200);

        // 3000 (map width) - position.x (screen position on map x) - center.x (distance from edge of start center of screen to edge of map) - width / 2 (character is in screen center so subtract half width) - 20 (wall thickness so (0, 0) is in the game field) = ? (x pos for the bounds rect)

        graphic.fill(0);
        graphic.rect((3000 - position.x) - center.x - (width / 2) - 20, (3000 - position.y) - center.y - (height / 2) - 40, 3060, 3080);

        graphic.fill(200);
        graphic.rect((3000 - position.x) - center.x - (width / 2) - 20, (3000 - position.y) - center.y - (height / 2) - 40, 3020, 3040);

        for (let i = -900; i < 3900; i += 300) {
            for (let j = -900; j < 3900; j += 300) {
                graphic.image(window.game.assets.images.background_texture, (1500 - position.x) - center.x - (width / 2) - 20 + i, (1500 - position.y) - center.y - (height / 2) - 40 + j, 300, 300);
            }
        }

        graphic.image(window.game.assets.images.background, (3000 - position.x) - center.x - (width / 2) - 20, (3000 - position.y) - center.y - (height / 2) - 40, 3040, 3040);
        graphic.pop();
    }

    drawPost({ dimensions: { position, center } }) {
        this.drawBorders({ dimensions: this.currentDimensions });
    }

    drawBorders({ dimensions: { position, center } }) {
        graphic.push();
        graphic.fill(0);
        // TODO: draw map borders made out of the barricade image

        // top

        var ratio = 996 / 230;
        var imgHeight = 22;
        var imgWidth = imgHeight * ratio;

        // random 1px additions/subtractions to make images more visually appealing

        for (let i = 0; i < 3000; i += imgWidth) {
            graphic.image(window.game.assets.images.barricade, ((1500 - position.x) - center.x - (width / 2)) + i, (1500 - position.y) - center.y - (height / 2) - 40 - 30, imgWidth, imgHeight);
        }

        graphic.image(window.game.assets.images.barricade, ((1500 - position.x) - center.x - (width / 2)) + 3000 - (imgWidth / 2) + 10 + 1, (1500 - position.y) - center.y - (height / 2) - 40 - 30, imgWidth, imgHeight);
        graphic.image(window.game.assets.images.barricade, ((1500 - position.x) - center.x - (width / 2)) - 3, (1500 - position.y) - center.y - (height / 2) - 40 - 30, imgWidth, imgHeight);

        // bottom
        // translations to flip the images
''
        for (let i = 0; i < 3000; i += imgWidth) {
            graphic.push();
            graphic.translate(((1500 - position.x) - center.x - (width / 2)) + i, (1500 - position.y) - center.y - (height / 2) - 40 + 3000 + 30);
            graphic.rotate(180);
            graphic.image(window.game.assets.images.barricade, 0, 0, imgWidth, imgHeight);
            graphic.pop();
        }

        graphic.push();
        graphic.translate(((1500 - position.x) - center.x - (width / 2)) + 3000 - (imgWidth / 2) + 10 + 1, (1500 - position.y) - center.y - (height / 2) - 40 + 3000 + 30);
        graphic.rotate(180);
        graphic.image(window.game.assets.images.barricade, 0, 0, imgWidth, imgHeight);
        graphic.pop();

        graphic.push();
        graphic.translate(((1500 - position.x) - center.x - (width / 2)) - 3, (1500 - position.y) - center.y - (height / 2) - 40 + 3000 + 30);
        graphic.rotate(180);
        graphic.image(window.game.assets.images.barricade, 0, 0, imgWidth, imgHeight);
        graphic.pop();

        // for left and right, rotate the image so that it looks good and then draw it
        // left

        for (let i = 0; i < 3000 - imgWidth; i += imgWidth) {
            graphic.push();
            graphic.translate(((1500 - position.x) - center.x - (width / 2)) - 40, ((1500 - position.y) - center.y - (height / 2)) + i);
            graphic.rotate(-90);
            graphic.image(window.game.assets.images.barricade, 0, 0, imgWidth, imgHeight);
            graphic.pop();
        }

        graphic.push();
        graphic.translate(((1500 - position.x) - center.x - (width / 2)) - 40, ((1500 - position.y) - center.y - (height / 2)) - 15 + 1);
        graphic.rotate(-90);
        graphic.image(window.game.assets.images.barricade, 0, 0, imgWidth, imgHeight);
        graphic.pop();

        graphic.push();
        graphic.translate(((1500 - position.x) - center.x - (width / 2)) - 40, ((1500 - position.y) - center.y - (height / 2)) + 3000 - imgWidth / 2 - 20);
        graphic.rotate(-90);
        graphic.image(window.game.assets.images.barricade, 0, 0, imgWidth, imgHeight);
        graphic.pop();

        // right

        for (let i = 0; i < 3000 - imgWidth; i += imgWidth) {
            graphic.push();
            graphic.translate(((1500 - position.x) - center.x - (width / 2)) + 3000, ((1500 - position.y) - center.y - (height / 2)) + i);
            graphic.rotate(90);
            graphic.image(window.game.assets.images.barricade, 0, 0, imgWidth, imgHeight);
            graphic.pop();
        }

        graphic.push();
        graphic.translate(((1500 - position.x) - center.x - (width / 2)) + 3000, ((1500 - position.y) - center.y - (height / 2)) - 15 + 1);
        graphic.rotate(90);
        graphic.image(window.game.assets.images.barricade, 0, 0, imgWidth, imgHeight);
        graphic.pop();

        graphic.push();
        graphic.translate(((1500 - position.x) - center.x - (width / 2)) + 3000, ((1500 - position.y) - center.y - (height / 2)) + 3000 - imgWidth / 2 - 20);
        graphic.rotate(90);
        graphic.image(window.game.assets.images.barricade, 0, 0, imgWidth, imgHeight);
        graphic.pop();

        graphic.pop();
    }
}