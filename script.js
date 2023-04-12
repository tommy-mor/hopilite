// runs in a browser

// create a canvas element
const canvas = document.createElement('canvas');

// set the canvas size
canvas.width = 500;
canvas.height = 500;

// get the canvas context
const ctx = canvas.getContext('2d');

// draw a pig
ctx.beginPath();
ctx.arc(250, 250, 200, 0, 2 * Math.PI);
ctx.fillStyle = 'pink';
ctx.fill();
ctx.stroke();

// draw the pig's nose
ctx.beginPath();
ctx.arc(250, 300, 50, 0, 2 * Math.PI);
ctx.fillStyle = 'black';
ctx.fill();
ctx.stroke();

// draw the pig's eyes
ctx.beginPath();
ctx.arc(200, 200, 25, 0, 2 * Math.PI);
ctx.fillStyle = 'black';
ctx.fill();
ctx.stroke();
ctx.beginPath();
ctx.arc(300, 200, 25, 0, 2 * Math.PI);
ctx.fillStyle = 'black';
ctx.fill();
ctx.stroke();

// draw the pig's ears
ctx.beginPath();
ctx.arc(150, 150, 50, 0, 1.5 * Math.PI);
ctx.fillStyle = 'pink';
ctx.fill();
ctx.stroke();
ctx.beginPath();
ctx.arc(350, 150, 50, 1.5 * Math.PI, 2 * Math.PI);
ctx.fillStyle = 'pink';
ctx.fill();
ctx.stroke();


// add the canvas to the page
document.body.appendChild(canvas);
