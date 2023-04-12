// Define a class for a kd-tree node
class KdNode {
  constructor(point, axis, left, right) {
    this.point = point;
    this.axis = axis;
    this.left = left;
    this.right = right;
  }
}

// Define a class for the kd-tree
class KdTree {
  constructor(points) {
    this.root = this.buildTree(points, 0);
  }

  // Method to build the kd-tree recursively
  buildTree(points, depth) {
    if (points.length === 0) {
      return null;
    }

    const axis = depth % points[0].length;
    points.sort((a, b) => a[axis] - b[axis]);
    const medianIndex = Math.floor(points.length / 2);
    const medianPoint = points[medianIndex];

    const leftPoints = points.slice(0, medianIndex);
    const rightPoints = points.slice(medianIndex + 1);

    const left = this.buildTree(leftPoints, depth + 1);
    const right = this.buildTree(rightPoints, depth + 1);

    return new KdNode(medianPoint, axis, left, right);
  }

  // Method to find the nearest neighbor to a given point
  nearestNeighbor(point) {
    let best = null;
    let bestDist = Infinity;

    const search = (node, depth) => {
      if (node === null || node === undefined) {
        return;
      }

      const dist = this.distance(point, node.point);
      if (dist < bestDist) {
        best = node.point;
        bestDist = dist;
      }

      const axisDist = point[node.axis] - node.point[node.axis];
      const leftFirst = axisDist < 0;

      if (leftFirst) {
        search(node.left, depth + 1);
        if (axisDist * axisDist < bestDist) {
          search(node.right, depth + 1);
        }
      } else {
        search(node.right, depth + 1);
        if (axisDist * axisDist < bestDist) {
          search(node.left, depth + 1);
        }
      }
    };

    search(this.root, 0);
    return best;
  }

  // Method to calculate the Euclidean distance between two points
  distance(point1, point2) {
    let sum = 0;
    for (let i = 0; i < point1.length; i++) {
      sum += (point1[i] - point2[i]) ** 2;
    }
    return Math.sqrt(sum);
  }

  // Method to insert a new point into the kd-tree
  insert(point) {
    const insertNode = (node, depth) => {
      if (node === null || node == undefined) {
        return new KdNode(point, depth % point.length);
      }

      const axis = depth % point.length;
      if (point[axis] < node.point[axis]) {
        node.left = insertNode(node.left, depth + 1);
      } else {
        node.right = insertNode(node.right, depth + 1);
      }

      return node;
    };

    this.root = insertNode(this.root, 0);
  }
} 

// Function to draw the kd-tree to a canvas
function draw(points, kdtree, ctx) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  // Define canvas context properties
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 0.1;
  ctx.strokeWidth = 0.1;

  const xMin = Math.min(...points.map(p => p[0]));
  const xMax = Math.max(...points.map(p => p[0]));
  const yMin = Math.min(...points.map(p => p[1]));
  const yMax = Math.max(...points.map(p => p[1]));

  // Transform the coordinates to fit the canvas
  const xScale = width / xMax;
  const yScale = height / yMax;

  const drawNode = (node, xMin, xMax, yMin, yMax, depth) => {
    if (node === null || node === undefined) {
      return;
    }

    const axis = depth % 2;
    const point = node.point;
    console.log(point, axis);

    if (axis === 0) {
      const x = point[0] * xScale;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, yMin * yScale);
      ctx.lineTo(x, yMax * yScale);
      ctx.closePath();
      ctx.stroke();
      console.log('stroked', x, yMin, yMax, yScale)
      drawNode(node.left, xMin, point[0], yMin, yMax, depth + 1);
      drawNode(node.right, point[0], xMax, yMin, yMax, depth + 1);
    } else {
      const y = point[1] * yScale;
      ctx.beginPath();
      ctx.moveTo(xMin * xScale, y);
      ctx.lineTo(xMax * xScale, y);
      ctx.stroke();
      drawNode(node.left, xMin, xMax, yMin, point[1], depth + 1);
      drawNode(node.right, xMin, xMax, point[1], yMax, depth + 1);
    }

    ctx.beginPath();
    ctx.arc(point[0] * xScale, point[1] * yScale, 3, 0, 2 * Math.PI);
    ctx.fill();
  };


  // Transform the coordinates to fit the canvas


  drawNode(kdtree.root, xMin, xMax, yMin, yMax, 0);


}



function test_in_browser() {
  const points = [[0, 0], [50, 50], [100, 100]];
  const kdTree = new KdTree(points);
  const canvas = document.createElement('canvas');
  canvas.width = 500;
  canvas.height = 500;
  canvas.style.backgroundColor = 'white';
  canvas.style.border = '1px solid black';
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;

  canvas.onclick = (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const point = [x / 5, y / 5];
    console.log(point);
    kdTree.insert(point);
    ctx.clearRect(0, 0, 500, 500);
    draw(points, kdTree, ctx);
  }

  canvas.onmousemove = (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const point = [x / 5, y / 5];

    const nearestpoint = kdTree.nearestNeighbor(point);
    // Draw line from point to nearest point
    ctx.beginPath();
    ctx.moveTo(point[0] * 5, point[1] * 5);
    ctx.lineTo(nearestpoint[0] * 5, nearestpoint[1] * 5);
    ctx.stroke();

    console.log(point);
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fill();
  }

  document.body.appendChild(canvas);
}

if (typeof document !== 'undefined') {
  test_in_browser();
}