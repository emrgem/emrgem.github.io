export default new Promise((resolve, reject) => {
    let loaded = 0;

    for (var src of [
        "/assets/p5/p5.js",
        "/assets/p5/addons/p5.sound.min.js"
    ]) {
        document.head.appendChild(Object.assign(document.createElement("script"), {
            src,
            async: false,
            onload: () => {
                loaded ++;

                if (loaded === 2) {
                    resolve();
                }
            }
        }));
    }
})