let pathPoints = [
    { x: 20, y: 20 }, // Start at (20, 20)
    { x: 20, y: 100 }, // Move to (20, 100)
    { x: 100, y: 100 },  // Move to (100, 100)
    { x: 100, y: 150 },  // Move to (100, 150)
    { x: 150, y: 150 }   // Move to (150, 150)
  ];
  
  let currentPointIndex = 0;
  let nextPointIndex = 1;
  let arrowPos;
  let speed = 2; // Speed of the arrow movement
  
  function setup() {
    createCanvas(400, 400);
    // Start the arrow at the first point
    arrowPos = createVector(pathPoints[0].x, pathPoints[0].y);
  }
  
  function draw() {
    background(255);
    
    // Draw the path as lines for reference
    // stroke(0);
    // strokeWeight(2);
    // for (let i = 0; i < pathPoints.length - 1; i++) {
    //   line(pathPoints[i].x, pathPoints[i].y, pathPoints[i + 1].x, pathPoints[i + 1].y);
    // }
  
    // Draw the arrow at the current position
    drawArrow(arrowPos.x, arrowPos.y, getAngleToNextPoint());
  
    // Move the arrow towards the next point
    let target = createVector(pathPoints[nextPointIndex].x, pathPoints[nextPointIndex].y);
    let dir = p5.Vector.sub(target, arrowPos);
    let distance = dir.mag();
    
    if (distance > speed) {
      dir.normalize();
      dir.mult(speed);
      arrowPos.add(dir);
    } else {
      // If the arrow reaches the point, move to the next point
      arrowPos = target.copy();
      currentPointIndex = nextPointIndex;
  
      // Stop if the arrow reaches the last point
      if (nextPointIndex < pathPoints.length - 1) {
        nextPointIndex++;
      }
    }
  }
  
  function drawArrow(x, y, angle) {
    push();
    translate(x, y); // Move to the arrow's position
    rotate(angle);   // Rotate the arrow to face the next point
    fill(0);
    noStroke();
    
    // Draw the arrow shape
    beginShape();
    vertex(-10, -5); // Left side of the arrow
    vertex(-10, 5);  // Right side of the arrow
    vertex(0, 5);    // Right tip
    vertex(0, 10);   // Bottom right corner of the arrowhead
    vertex(10, 0);   // Arrowhead tip
    vertex(0, -10);  // Top left corner of the arrowhead
    vertex(0, -5);   // Left tip
    endShape(CLOSE);
    
    pop();
  }
  
  function getAngleToNextPoint() {
    // Get the angle between the arrow and the next point
    let target = createVector(pathPoints[nextPointIndex].x, pathPoints[nextPointIndex].y);
    let dir = p5.Vector.sub(target, arrowPos);
    return dir.heading(); // Returns the angle in radians
  }