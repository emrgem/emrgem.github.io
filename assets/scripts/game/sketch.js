/*var player = {
  x: null,
  y: null,
  width: 20,
  height: 40,
  hitbox: {
    width: 10,
    height: 20
  },
  health: 100
}

var dimensions = {
  width: 2000,
  height: 2000,
  position: {
    x: 725,
    y: 650
  },
  center: {
    x: 725,
    y: 650
  }
}*/

//var weaponCooldown = 100;
//var weaponBullets = 6;
//var weaponAngle = 0;
//var bullets = [];
//var zombies = [];
//var butterimg;

//var timer = 0;

/*function preload() {
  butterimg = loadImage('assets/images/butterfly.png');
}*/

/*function setup() {
  createCanvas(550, 700);
  player.x = width / 2;
  player.y = height / 2;
  angleMode(DEGREES);
}*/

function draw() {
  drawBg();
  drawPlayer();
  drawStats();

  runRound();
  drawZombies();

  drawBullets();
  checkMouse();
}

/*function drawBg() {
  background(200);
}*/

// kinda done...

/*function runRound() {
  if (frameCount % 30 === 0) {
    spawnZombie();
  }
}*/

// Might need this??

/*function colRects(r1, r2) {
  return (
    r1.x < r2.x + r2.hitbox.width &&
    r1.x + r1.width > r2.x &&
    r1.y < r2.y + r2.hitbox.height &&
    r1.y + r1.hitbox.height > r2.y
  );
}*/

function drawZombies() {
  push();
  rectMode(CENTER);

  var sortZombies = zombies.toSorted((a, b) => {
    return dist(a.x, a.y, player.x, player.y) - dist(b.x, b.y, player.x, player.y);
  });

  for (let i = 0; i < sortZombies.length; i++) {
    var zombie = sortZombies[i];

    fill("green");
    imageMode(CENTER);
    image(zombie.img, zombie.x, zombie.y, zombie.width, zombie.height);
    //rect(zombie.x, zombie.y, zombie.width, zombie.height);

    if (!zombie) {
      continue;
    }

    var angle = atan2(player.y - zombie.y, player.x - zombie.x);
    var speedX = zombie.speed * cos(angle);
    var speedY = zombie.speed * sin(angle);

    zombie.x += speedX;
    zombie.y += speedY;

    // Handle collisions
    for (let j = 0; j < sortZombies.length; j++) {
      if (i !== j) {
        let other = sortZombies[j];
        if (isColliding(zombie, other)) {
          handleCollision(zombie, other);
        }
      }
    }
  }

  pop();
}

// function isColliding(z1, z2) {
//   return abs(z1.x - z2.x) < (z1.width + z2.width) / 2 && abs(z1.y - z2.y) < (z1.height + z2.height) / 2;
// }

// function handleCollision(z1, z2) {
//   let overlapX = (z1.width / 2 + z2.width / 2) - abs(z1.x - z2.x);
//   let overlapY = (z1.height / 2 + z2.height / 2) - abs(z1.y - z2.y);

//   let pushFactor = 0.2;

//   if (z1.x < z2.x) {
//     z1.x -= overlapX / 2 * pushFactor;
//     z2.x += overlapX / 2 * pushFactor;
//   } else {
//     z1.x += overlapX / 2 * pushFactor;
//     z2.x -= overlapX / 2 * pushFactor;
//   }

//   if (z1.y < z2.y) {
//     z1.y -= overlapY / 2 * pushFactor;
//     z2.y += overlapY / 2 * pushFactor;
//   } else {
//     z1.y += overlapY / 2 * pushFactor;
//     z2.y -= overlapY / 2 * pushFactor;
//   }
// }

function spawnZombie() {
  var r = Math.floor(random(0, 3));

  let x = 0;
  let y = random(-20, height + 20);

  switch(r) {
    case 0:
      x = -10;
      break;
    case 1:
      x = random(0, width);
      
      if (Math.floor(random(0, 2))) {
        y = random(-50, -20);
      } else {
        y = random(height + 50, height + 20);
      }
      break;
    case 2:
      x = width + 10;
      break;
    default:
      break;
  }
  
  return zombies.push({
    width: 20,
    height: 30,
    speed: 1,
    health: 20,
    x,
    y,
    hitbox: {
      width: 15,
      height: 22.5
    },
    damage: 2,
    img: butterimg
  });
}

/*function drawStats() {
  var min = Math.floor(timer / 60);
  var secs = Math.floor(timer - (min * 60));

  

  fill("black")
  textSize(25);
  textAlign(CENTER);
  text(`${min < 10 ? "0" + min : min}:${secs < 10 ? "0" + secs : secs}`, width / 2, 30)

  timer += (1 / 60);
}*/

/*function drawPlayer() {
  var speed = 2;

  if (keyIsDown(87) && keyIsDown(65)) {
    moveEntities(-speed * cos(45), speed * sin(45));
  } else if (keyIsDown(87) && keyIsDown(68)) {
    moveEntities(speed * cos(45), speed * sin(45));
  } else if (keyIsDown(83) && keyIsDown(65)) {
    moveEntities(-speed * cos(45), -speed * sin(45));
  } else if (keyIsDown(83) && keyIsDown(68)) {
    moveEntities(speed * cos(45), -speed * sin(45));
  } else {
    if (keyIsDown(87)) {
      moveEntities(0, speed);
    }

    if (keyIsDown(65)) {
      moveEntities(-speed, 0);
    }

    if (keyIsDown(68)) {
      moveEntities(speed, 0);
    }

    if (keyIsDown(83)) {
      moveEntities(0, -speed);
    }
  }

  push();
  rectMode(CENTER);
  fill("red");
  rect(player.x, player.y, player.width, player.height);

  drawWeapon();

  fill("red");
  rect(player.x, player.y + player.height / 2 + 15, 30, 5);
  fill("green");
  rectMode(CORNER);
  rect(player.x - player.width / 2 - 5, player.y + player.height / 2 + 12.5, (player.health / 100) * 30, 5);

  pop();

  for (var i = 0; i < zombies.length; i ++) {
    var z = zombies[i];

    if (colRects(player, z)) {
      player.health -= z.damage / 30;
    }
  }
}*/

/*function drawWeapon() {
  push();
  angleMode(DEGREES);
  var distX = dist(player.x, 0, mouseX, 0);
  var distY = dist(0, player.y, 0, mouseY);
  var angle = atan(distY / distX);

  if (mouseX >= player.x && mouseY >= player.y) {
    angle = 360 - angle;
  } else if (mouseX <= player.x && mouseY <= player.y) {
    angle = 180 - angle;
  } else if (mouseX <= player.x && mouseY >= player.y) {
    angle = 180 + angle;
  }

  weaponAngle = angle;

  translate(player.x, player.y);
  rotate(-angle);
  translate(20, 0);

  fill("brown");
  rect(0, 0, 12, 4);
  pop();

  push();
  fill("brown");
  rect(player.x, player.y + player.height / 2 + 25, 30, 5);
  fill("gold");
  rectMode(CORNER);
  rect(player.x - player.width / 2 - 5, player.y + player.height / 2 + 22.5, (weaponCooldown / 100) * 30, 5);

  weaponCooldown --;

  if (weaponCooldown < 1) {
    weaponCooldown = 100;

    shootWeapon();
  }

  pop();
}*/

// TODO: implement these two somewhere

function moveKeyDown() {
  return keyIsDown(87) || keyIsDown(65) || keyIsDown(68) || keyIsDown(83);
}

function checkMouse() {
  if (mouseIsPressed && !moveKeyDown()) {
    if (dist(mouseX, mouseY, player.x, player.y) < 3) {
      return;
    }
    
    var distX = dist(mouseX, 0, player.x, 0);
    var distY = dist(0, mouseY, 0, player.y);
    var angle = atan(distY / distX);

    var speed = Math.sqrt(8);

    var speedX = speed * cos(angle);
    var speedY = speed * sin(angle);

    if (mouseX >= player.x && mouseY >= player.y) {
      null;
    } else if (mouseX <= player.x && mouseY <= player.y) { 
      speedX = -speedX;
      speedY = -speedY;
    } else if (mouseX <= player.x && mouseY >= player.y) {
      speedX = -speedX;
    } else {
      speedY = -speedY;
    }

    player.x += speedX;
    player.y += speedY;
  }
}

// TODO: reimplement 6 bullet firing

/*function shootWeapon() {
  for (var i = 0; i < weaponBullets; i ++) {
    var angle = (weaponAngle - 10) + (i * 5);

    bullets.push({
      ...weaponBarrelCoords(),
      width: 5,
      height: 5,
      speed: 6,
      angle,
      hitbox: {
        width: 5,
        height: 5
      },
      time: 0
    });
  }
}*/

/*function drawBullets() {
  push();

  for (var i = 0; i < bullets.length; i ++) {
    var b = bullets[i];

    b.time ++;
    
    if (b.time > 50) {
      bullets.splice(i, 1);
    }

    fill("gold");

    rect(b.x, b.y, b.width, b.height);

    var angle = b.angle;

    var speedX = b.speed * cos(angle);
    var speedY = -b.speed * sin(angle);

    b.x += speedX;
    b.y += speedY;

    for (var j = 0; j < zombies.length; j ++) {
      var z = zombies[j];

      if (colRects(b, z)) {
        bullets.splice(i, 1);
        zombies.splice(j, 1);
        break;
      }
    }
  }

  pop();
}*/

/*function weaponBarrelCoords() {
  var angle = weaponAngle;

  // 32 because 12px for gun length, and 20px for circle radius

  var distX = 32 * cos(angle);
  var distY = 32 * sin(angle);

  console.log(distX, distY);

  return {
    x: player.x + distX,
    y: player.y - distY
  }
}*/

/*function moveEntities(offsetX, offsetY) {
  dimensions.position.x += offsetX;
  dimensions.position.y += offsetY;

  for (var i = 0; i < zombies.length; i ++) {
    var z = zombies[i];

    z.x -= offsetX;
    z.y += offsetY;
  }

  for (var i = 0; i < bullets.length; i ++) {
    var b = bullets[i];

    b.x -= offsetX;
    b.y += offsetY;
  }
}*/