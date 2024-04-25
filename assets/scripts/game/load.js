export class Loader {
    audio = false;

    weight = {
        images: 3 / 6,
        sounds: 1 / 6,
        fonts: 2 / 6
    }

    constructor() {
        this.btImage = loadImage('assets/images/BCTS.png');
        this.gameImage = loadImage('assets/images/logo.png');
        this.loadingFont = loadFont('assets/fonts/Roboto_Mono/static/RobotoMono-ExtraLight.ttf');
        this.startSound = loadSound('assets/sounds/startup.mp3');
        this.working = true;
        this.frame = 0;
        this.state = 0;
        this.progress = 0;
        this.loadTime = 0;

        this.startSound.setLoop(false);
    }

    render() {
        if (!this.audio) {
            return this.requestAudio();
        } else {
            this.frame ++;

            if (!this.startSound.isPlaying()) {
                this.startSound.play();
            }

            if (this.state <= 3) {
                this.renderBCTS();
            } else if (this.state > 3) {
                this.renderSplash();
            }
        }
    }

    requestAudio() {
        push();
        background(0);
        textFont(this.loadingFont);
        textSize(20);
        textAlign(CENTER);
        fill(255);
        text("Click to enable audio", width / 2, height / 2);

        if (window.focused === true) {
            if (mouseIsPressed || keyIsPressed) {
                this.audio = true;
                this.frame = -30;
            }
        }
        
        pop();
    }

    load() {
        // custom p5js image lazyloader

        if (this.loadTime === 0) {
            this.assets = {
                images: [
                    ["butterfly", window.game.loadImage('assets/images/butterfly.png')],
                    ["logo", window.game.loadImage('assets/images/logo.png')],
                    ["bt_logo", window.game.loadImage('assets/images/BCTS.png')],
                    ["barricade", window.game.loadImage('assets/images/barricade.png')],
                    ["box", window.game.loadImage('assets/images/box.png')],
                    ["exit_image", window.game.loadImage('assets/images/exit.svg')],
                    ["pause_image", window.game.loadImage('assets/images/pause.svg')],
                    ["icon", window.game.loadImage('/assets/images/icon.png')],
                    ["background", window.game.loadImage('/assets/images/background.png')],
                    ["background_texture", window.game.loadImage('/assets/images/texture.png')],
                    ["shotgun", window.game.loadImage('/assets/images/sheets/shotgun.png')],
                    ["bullet", window.game.loadImage('/assets/images/sheets/bullet.png')],
                    ["player_idle", window.game.loadImage('/assets/images/sheets/player_idle.png')],
                    ["player_walk", window.game.loadImage('/assets/images/sheets/player_walk.png')],
                    ["player_death", window.game.loadImage('/assets/images/sheets/player_death.png')],
                    ["zombie_idle", window.game.loadImage('/assets/images/sheets/zombie_idle.png')],
                    ["zombie_walk", window.game.loadImage('/assets/images/sheets/zombie_walk.png')],
                    ["zombie_death", window.game.loadImage('/assets/images/sheets/zombie_death.png')],
                    ["zombie_attack", window.game.loadImage('/assets/images/sheets/zombie_attack.png')],
                    ["magnet", window.game.loadImage('/assets/images/magnet.png')],
                    ["food", window.game.loadImage('/assets/images/food.png')],
                    ["medbag", window.game.loadImage('/assets/images/medbag.png')],
                    ["energy", window.game.loadImage('/assets/images/energy.png')],
                    ["forcefield", window.game.loadImage('/assets/images/forcefield.png')],
                    ["spinner", window.game.loadImage('/assets/images/spinner.png')],
                    ["lightning", window.game.loadImage('/assets/images/lightning.png')],
                    ["ball", window.game.loadImage('/assets/images/ball.png')],
                    ["portal", window.game.loadImage('/assets/images/portal.png')]
                ],
                sounds: [
                    ["game_main", 'assets/sounds/game_main.mp3'],
                    ["game_intro", 'assets/sounds/game_intro.mp3'],
                    ["game_menu", 'assets/sounds/game_menu.mp3']
                ],
                fonts: [
                    ["roboto", 'assets/fonts/Roboto_Mono/static/RobotoMono-Regular.ttf'],
                    ["roboto_light", 'assets/fonts/Roboto_Mono/static/RobotoMono-Light.ttf']
                ]
            }

            this.loadedPts = 0;
            this.totalPts = 0;

            for (var type in this.assets) {
                for (var i = 0; i < this.assets[type].length; i++) {
                    this.totalPts += this.weight[type];
                }
            }
        }

        this.loadTime ++;

        if (this.progress >= 99.99) {
            setTimeout(() => {
                return this.working = false;
            }, 1000);
        }

        for (var type in this.assets) {
            for (var i = 0; i < this.assets[type].length; i++) {
                if (typeof this.assets[type][i][1] === "string") {
                    if (type === "images") {

                    } else if (type === "fonts") {
                        this.assets[type][i][1] = {
                            get loaded() {
                                return !!this.font.font;
                            },
                            font: window.loadFont(this.assets[type][i][1])
                        }
                        
                        continue;
                    } else if (type === "sounds") {
                        this.assets[type][i][1] = {
                            get loaded() {
                                return this.sound.isLoaded();
                            },
                            sound: window.loadSound(this.assets[type][i][1])
                        }

                        continue;
                    }
                }

                if (this.assets[type][i][1].loaded) {
                    if (window.game.assets[type][this.assets[type][i][0]] !== undefined) {
                        continue;
                    }

                    if (type === "images") {
                        let img = window.loadImage(this.toBase64(this.assets[type][i][1]));

                        window.game.assets[type][this.assets[type][i][0]] = img;

                        this.loadedPts += this.weight[type];
                    } else if (type === "fonts") {
                        window.game.assets[type][this.assets[type][i][0]] = this.assets[type][i][1].font;

                        this.loadedPts += this.weight[type];
                    } else if (type === "sounds") {
                        window.game.assets[type][this.assets[type][i][0]] = this.assets[type][i][1].sound;

                        this.assets[type][i][1].sound.setLoop(true);

                        this.loadedPts += this.weight[type];
                    }
                }
            }
        }

        this.progress = (this.loadedPts / this.totalPts) * 100;
    }

    toBase64(img) {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext('2d', {
            willReadFrequently: true
        });

        ctx.drawImage(img, 0, 0);

        return canvas.toDataURL();
    }

    changeState() {
        this.state ++;
        this.frame = 0;
    }

    renderBCTS() {
        push();

        background(10);

        if (this.state === 0) {
            if (this.frame <= 50) {
                return;
            } else {
                return this.changeState();
            }
        } else if (this.state === 1) {
            if (this.frame < 50) {
                // 5.1 standard full fade in rate (2 * 2.55)

                tint(255, (this.frame % 50) * 2 * 5.1);
            } else {
                this.changeState();
            }
        } else if (this.state === 2) {
            if (this.frame > 100) {
                this.changeState();
            } else {
                tint(255, 255);
            }
        } else if (this.state === 3) {
            if (this.frame < 20) {
                tint(255, 255 - ((this.frame % 50) * 3 * 5.1));
            } else if (this.frame < 50) {
                return;
            } else {
                return this.changeState();
            }
        }

        var ratio = this.btImage.width / this.btImage.height;

        image(this.btImage, width / 2, height / 2, ratio * 250, 250);

        pop();
    }

    renderSplash() {
        push();

        background("#000004");

        if (this.state === 4) {
            if (this.frame > 80) {
                this.changeState();
            }
        }

        image(this.gameImage, width / 2, height / 2 - 100, 350, 350);

        if (this.state >= 5) {
            this.load();

            fill(0);
            strokeWeight(2);
            stroke(255);
            rect(width / 2, height / 2 + 100, 300, 36);

            fill("red");
            rectMode(CORNER);
            noStroke();
            rect(width / 2 - 148, height / 2 + 84, (this.progress / 100) * 296, 32);

            if (this.progress > 100) {
                this.progress = 100;
            }
        }


        pop();
    }
}