function nearestNeighbor(hoplites, point) {
  let minDistance = Infinity;
  let nearestHoplite = null;

  for (let i = 0; i < hoplites.length; i++) {
    const hoplite = hoplites[i];
    const dx = hoplite.x - point[0];
    const dy = hoplite.y - point[1];
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < minDistance) {
      minDistance = distance;
      nearestHoplite = hoplite;
    }
  }

  return nearestHoplite;
}


// runs in a browser
class Hoplite {

  constructor(color, x, y, angle, role='pawn') {
    this.x = x;
    this.y = y;
    this.radius = 1;
    this.spearRadius = 5;
    this.angle = angle;
    this.authority = -1;
    this.color = color;
    this.goalCoords = [250, 250];
    this.role = role;
  }

  tick() {
    // if there is an enemy (person of different authority) within radius 10, charge run towards that.
    // otherwise, run towards goalCoords
    let enemy = nearestNeighbor(hoplites.filter(hoplite => hoplite.authority !== this.authority),
                                [this.x, this.y]);

    var goal;

    if (this.distance(enemy) < 10) {
        goal = [enemy.x, enemy.y];
    } else if (this.role === "pawn" && this.authority != -1) {
        goal = this.authority.goalCoords;
    } else {
        console.log(this.role)
        goal = [0,0];
    }

    const dx = goal[0] - this.x;
    const dy = goal[1] - this.y;

    const angle = Math.atan2(dy, dx);
    this.angle = angle;
    this.x += 2 * Math.cos(angle);
    this.y += 2 * Math.sin(angle);
    // add random skew to angle
  }





  draw(ctx) {
    // draw the hoplite
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();

    // draw the spear
    ctx.beginPath();
    ctx.arc(this.x + this.spearRadius * Math.cos(this.angle), this.y + this.spearRadius * Math.sin(this.angle), 1, 0, 2 * Math.PI);
    ctx.fillStyle = 'black';
    ctx.fill();
  }

  distance(other) {
    // calculate the distance between this hoplite and another hoplite "other"
    return Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2);
  }
}


// create a canvas element
const canvas = document.createElement('canvas');

// set the canvas size
canvas.width = 500;
canvas.height = 500;

// get the canvas context
const ctx = canvas.getContext('2d');

const red_commander = new Hoplite("red", 490, 10, 0, role="commander");
const blu_commander  = new Hoplite("blue", 10, 490, 0, role="commander");
// create an array to hold the hoplites
const hoplites = [];

// create 10 red hoplites in a row at the top of the screen
for (let i = 0; i < 10; i++) {
  const x = i * 50 + 25; // set the x position of the hoplite
  const y = 25; // set the y position of the hoplite
  const angle = -Math.PI / 2; // set the angle of the hoplite
  const hoplite = new Hoplite("red", x, y, angle); // create a new hoplite
  hoplite.authority = red_commander;
  hoplites.push(hoplite); // add the hoplite to the array
}

// create 10 blue hoplites in a row at the bottom of the screen
for (let i = 0; i < 10; i++) {
  const x = i * 50 + 25; // set the x position of the hoplite
  const y = 475; // set the y position of the hoplite
  const angle = Math.PI / 2; // set the angle of the hoplite
  const hoplite = new Hoplite("blue", x, y, angle); // create a new hoplite
  hoplite.authority = blu_commander;
  hoplites.push(hoplite); // add the hoplite to the array
}


function tick() {
    // loop through each hoplite and call its tick method
    hoplites.forEach(hoplite => hoplite.tick()); 
}

// draw the hoplites
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas
  hoplites.forEach(hoplite => hoplite.draw(ctx)); // draw each hoplite
}

// call the draw function to draw the hoplites
draw();


// draw the arena border
canvas.style.border = '2px solid red';
canvas.onmousemove = (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    red_commander.goalCoords = [x,y]
}

canvas.onmousedown = (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    blu_commander.goalCoords = [x,y]
}



// add the canvas to the page
document.body.appendChild(canvas);


// tick and draw in a loop every 20 ms
setInterval(() => {
    console.log('ticking');
    tick();
    draw();
}, 20);