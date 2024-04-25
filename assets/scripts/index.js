import loading from './preload.js';
import Game from './game/main.js';

loading.then(() => {
    window.game = new Game();
}).catch((err) => {
    document.write("ERROR: " + err)
})

window.addEventListener("blur", () => {
    noLoop();
});

window.addEventListener("focus", () => {
    loop();
});