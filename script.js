// function that finds the k nearest neighbors from a list using naive algorithm
function findKNearestNeighborsNaive(hopilites, k, hopilite) {
  // sort the list by distance to the point
  hopilites.sort((a, b) => b.distance(hopilite) - a.distance(hopilite));
  // return the k nearest neighbors
  return hopilites.slice(0, k);
} 

// runs in a browser
class Hoplite {

  constructor(authority, x, y, angle) {
    this.x = x;
    this.y = y;
    this.radius = 1;
    this.spearRadius = 5;
    this.angle = angle;
    this.authority = authority;
    this.goalCoords = [250, 250];
  }

  tick() {

    var goal;

    if (this.authority != -1) {
      goal = this.authority.goalCoords;
    } else {
      goal = [0, 0];
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
    var targets = findKNearestNeighborsNaive(this.authority.enemy_hopilites, 2, this);

    targets.map(t => {
      // draw a line to the target
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(t.x, t.y);
      ctx.strokeStyle = 'black';
      ctx.stroke();
    });
    // draw the hoplite
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.authority.color;
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

const WIDTH = 500;
const HEIGHT = 500;

const num_red = 11;
const num_blue = 11;
const hoplite_spacing = WIDTH / num_red;

class Team {
  constructor(color, startingY) {
    this.color = color;
    this.startingY = startingY;
    this.hopilites = [];
    this.enemy_hopilites = []
    this.goalCoords = [WIDTH / 2, HEIGHT / 2];
  }

  initKnn(enemy_hopilites) {
    this.enemy_hopilites = enemy_hopilites;
    //this.our_positions = new KdTree(this.hopilites.map(h => [h.x, h.y, h]));
  }

  tick() {
    //this.our_positions = new KdTree(this.hopilites.map(h => [h.x, h.y, h]));
    this.hopilites.forEach(h => h.tick());
  }

  draw(ctx) {
    this.hopilites.forEach(h => h.draw(ctx));
  }

  spawn(n) {
    for (let i = 0; i < n; i++) {
      const x = i * hoplite_spacing; // set the x position of the hoplite
      const y = this.startingY; // set the y position of the hoplite
      const angle = -Math.PI / 2; // set the angle of the hoplite
      const hoplite = new Hoplite(this, x, y, angle); // create a new hoplite
      hoplite.authority = this;
      this.hopilites.push(hoplite); // add the hoplite to the array
    }
  }
}


// create a canvas element
const canvas = document.createElement('canvas');

// set the canvas size
canvas.width = 500;
canvas.height = 500;

// get the canvas context
const ctx = canvas.getContext('2d');


const red = new Team("red", 20);
const blu = new Team("blue", HEIGHT - 20);

const teams = [red, blu];
red.spawn(num_red)
blu.spawn(num_blue)
red.initKnn(blu.hopilites)
blu.initKnn(red.hopilites)



function tick() {
  // loop through each hoplite and call its tick method
  teams.forEach(team => team.tick());
}

// draw the hoplites
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas
  teams.forEach(t => t.draw(ctx)); // draw each hoplite
}


// draw the arena border
canvas.style.border = '2px solid red';
canvas.onmousemove = (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  red.goalCoords = [x, y]
}

canvas.onmousedown = (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  blu.goalCoords = [x, y]
}



// add the canvas to the page
document.body.appendChild(canvas);


// tick and draw in a loop every 20 ms
setInterval(() => {
  console.log('ticking');
  tick();
  draw();
}, 20);