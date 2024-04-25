// Math functions for better performance

export function random(min, max) {
    if (Array.isArray(min)) {
        return min[Math.floor(Math.random() * min.length)];
    } else if (typeof min === "object") {
        let keys = Object.keys(min);
        return min[keys[Math.floor(Math.random() * keys.length)]];
    } else if (typeof min === "number" && typeof max === "number") {
        return Math.random() * (max - min) + min;
    } else if (typeof min === "number" && typeof max === "undefined") {
        return Math.random() * min;
    } else {
        return Math.random();
    }
}

export function distance(x1, y1, x2, y2) {
    let dx = x2 - x1;
    let dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}