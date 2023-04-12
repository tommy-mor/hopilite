// runs in a browser
class Hoplite {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.radius = 1;
    this.spearRadius = 5;
    this.angle = angle;
    this.authority = -1;
    this.goalCoords = [0, 0];
  }

  tick() {
    const dx = this.goalCoords[0] - this.x;
    const dy = this.goalCoords[1] - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const speed = 2;
    const velocityX = (dx / distance) * speed;
    const velocityY = (dy / distance) * speed;
    this.x += velocityX;
    this.y += velocityY;
  }



  draw(ctx) {
    // draw the hoplite
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();

    // draw the spear
    ctx.beginPath();
    ctx.arc(this.x + this.spearRadius * Math.cos(this.angle), this.y + this.spearRadius * Math.sin(this.angle), 1, 0, 2 * Math.PI);
    ctx.fillStyle = 'black';
    ctx.fill();
  }
}


// create a canvas element
const canvas = document.createElement('canvas');

// set the canvas size
canvas.width = 500;
canvas.height = 500;

// get the canvas context
const ctx = canvas.getContext('2d');

// create an array to hold the hoplites
const hoplites = [];

// create 10 red hoplites in a row at the top of the screen
for (let i = 0; i < 10; i++) {
  const x = i * 50 + 25; // set the x position of the hoplite
  const y = 25; // set the y position of the hoplite
  const angle = -Math.PI / 2; // set the angle of the hoplite
  const hoplite = new Hoplite(x, y, angle); // create a new hoplite
  hoplites.push(hoplite); // add the hoplite to the array
}

// create 10 blue hoplites in a row at the bottom of the screen
for (let i = 0; i < 10; i++) {
  const x = i * 50 + 25; // set the x position of the hoplite
  const y = 475; // set the y position of the hoplite
  const angle = Math.PI / 2; // set the angle of the hoplite
  const hoplite = new Hoplite(x, y, angle); // create a new hoplite
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
ctx.beginPath();
ctx.rect(10, 10, canvas.width - 20, canvas.height - 20);
ctx.strokeStyle = 'red';
ctx.lineWidth = 2;
ctx.stroke();


// add the canvas to the page
document.body.appendChild(canvas);


// tick and draw in a loop every 20 ms
setInterval(() => {
    console.log('ticking');
    tick();
    draw();
}, 20);