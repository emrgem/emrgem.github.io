export default class GenericObject {
    constructor(x = 0, y = 0, width = 0, height = 0, health = 0, damage = 0, color = "white", image = null) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.health = health;
        this.damage = damage;
        this.color = color;
        this.image = image;
    }

    getCoords() {
        // coordinates in relation to player.coords and this.x/y

        return {
            x: this.x - window.game.player.coords.x + width / 2,
            y: this.y - window.game.player.coords.y + height / 2
        }
    }

    draw() {
        const coords = this.getCoords();

        graphic.push();
        graphic.noStroke();
        this.update?.call(this);
        graphic.fill(this.color);
        if (this.image) {
            graphic.image(this.image, coords.x, coords.y, this.width, this.height);
        } else {
            graphic.fill(this.color);
            graphic.rect(coords.x, coords.y, this.width, this.height);
        }
        graphic.pop();
    }
    
    hurt(dmg) {
        this.health -= dmg;

        window.game.damage.add(dmg, this.getCoords().x, this.getCoords().y);

        if (this.health <= 0) {
            this.kill();
        }
    }

    kill() {
        window.game.objects.objects.splice(window.game.objects.objects.indexOf(this), 1);
    }
}