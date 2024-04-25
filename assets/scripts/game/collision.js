export function isColliding(z1, z2) {
    return abs(z1.x - z2.x) < (z1.width + z2.width) / 2 && abs(z1.y - z2.y) < (z1.height + z2.height) / 2;
}

export function isCollidingCircle(z1, c1) {
    return abs(c1.x - z1.x) <= z1.width / 2 + c1.radius && abs(c1.y - z1.y) <= z1.height / 2 + c1.radius;
}

export function handleCollision(z1, z2) {
    let overlapX = (z1.width / 2 + z2.width / 2) - abs(z1.x - z2.x);
    let overlapY = (z1.height / 2 + z2.height / 2) - abs(z1.y - z2.y);

    let pushFactor = 0.3;

    if (z1.x < z2.x) {
        z1.x -= overlapX / 2 * pushFactor;
        z2.x += overlapX / 2 * pushFactor;
    } else {
        z1.x += overlapX / 2 * pushFactor;
        z2.x -= overlapX / 2 * pushFactor;
    }

    if (z1.y < z2.y) {
        z1.y -= overlapY / 2 * pushFactor;
        z2.y += overlapY / 2 * pushFactor;
    } else {
        z1.y += overlapY / 2 * pushFactor;
        z2.y -= overlapY / 2 * pushFactor;
    }
}

export function mouseHovering(z1) {
    let z2 = mouseX;
    let z3 = mouseY;

    return z2 > z1.x - z1.width / 2 && z2 < z1.x + z1.width / 2 && z3 > z1.y - z1.height / 2 && z3 < z1.y + z1.height / 2;
}