const config = {
  timeline: { 
    position: {x: 160, y: 0},
    circleProps: {
      diameter: 50,
      verticalSpacing: 50,
    },
    circles: [
      { type: 'advertiser', website: 'adv1.com', datetime: '2023-10-01 10:00' },
      { type: 'advertiser', website: 'adv2.com', datetime: '2023-10-01 11:00' },
      { type: 'publisher', website: 'pub1.com', datetime: '2023-10-01 12:00' },
      { type: 'advertiser', website: 'adv3.com', datetime: '2023-10-01 13:00' },
      { type: 'advertiser', website: 'adv5.com', datetime: '2023-10-01 13:02' },
      { type: 'publisher', website: 'pub2.com', datetime: '2023-10-01 14:00' },
      { type: 'advertiser', website: 'adv6.com', datetime: '2023-10-01 14:01' },
      { type: 'advertiser', website: 'adv7.com', datetime: '2023-10-01 15:00' },
    ],
  }, 
};

const animated = {
  timelineVerticleLine: undefined,
  ssp: undefined
}

function setup() {
  const circleVerticalSpace = config.timeline.circleProps.verticalSpacing + config.timeline.circleProps.diameter;
  createCanvas(700, circleVerticalSpace * config.timeline.circles.length);
  background(245);
}

function draw() {
  textSize(12);
  drawTimeline(config.timeline);
  drawDiagram(3);
}

function drawTimeline({ position, circleProps, circles }) {
  const { diameter, verticalSpacing } = circleProps;
  const circleVerticalSpace = verticalSpacing + diameter;
  const leftPadding = 10;
  
  textAlign(LEFT, CENTER);

  animateLineOnce('timelineVerticleLine', position.x, position.y, position.x, circleVerticalSpace * circles.length );
  
  // Draw circles and text at the timeline position
  circles.forEach((circleItem, index) => {
    const yPosition = verticalSpacing + circleVerticalSpace * index;
    
    circle(position.x, yPosition, diameter);
    
    text(circleItem.datetime, leftPadding, yPosition);
    text(circleItem.website, leftPadding, yPosition + 20);
    
    // Draw line leading out of the circle
    line(position.x - 25, yPosition, position.x - 40, yPosition);
  });
}

function drawDiagram(circleNumber) {
  const { position, circleProps } = config.timeline;
  const { diameter, verticalSpacing } = circleProps;
  
  const box = { width: 125, height: 100 };
  const smallBox = { width: 80, height: 50 };
  const mediumBox = { width: 125, height: 50 };
  const lineWidth = 100;
  const lineHeight = 50;
  
  // Calculate (x, y) coordinates
  const spaceFromTimeline = lineWidth + diameter / 2;
  const x = position.x + spaceFromTimeline;
  const circleRadius = diameter / 2;
  const circleHeights = diameter * circleNumber - circleRadius;
  const circleVerticalHeights = verticalSpacing * (circleNumber - 1) - verticalSpacing / 2;
  const y = circleHeights + circleVerticalHeights;
  
  textAlign(CENTER, CENTER);
  
  // Draw SSP block (rectangle 1)
  rect(x, y, box.width, box.height);
  text("SSP", x + box.width / 2, y + box.height / 2);
  animateLineOnce( 'ssp', x - spaceFromTimeline + diameter / 2, y + box.height / 2, x, y + box.height / 2, 0.06);
  
  // Draw DSP blocks
  for (let i = 0; i <= 1; i++) {
    const marginTop = -10;
    const verticalSpacing = 20;
    const textYPosition = y + smallBox.height / 2 + smallBox.height * i + marginTop + verticalSpacing * i;
    const title = "DSP " + (i + 1);
    
    rect(x + box.width + lineWidth, y + (smallBox.height + verticalSpacing) * i + marginTop, smallBox.width, smallBox.height);
    
    text(title, x + box.width / 2 + lineWidth + smallBox.width + smallBox.width / 4, textYPosition);
    
    animateLineOnce( title, x + box.width, textYPosition, x + box.width + lineWidth, textYPosition, 0.05);
  }
  
  const mediumBoxes = ['runAuction()', 'Show Winning Ad'];
  
  // Draw Medium blocks
  for (let i = 0; i < mediumBoxes.length; i++) {
    const topHeight = y + box.height;
    const textXPosition = x + mediumBox.width / 2;
    const textYPosition = topHeight + (mediumBox.height / 2) + (lineHeight * (i + 1)) + (mediumBox.height * i);
    const boxYPosition = topHeight + (lineHeight * i) + lineHeight * (i + 1);
    const title = mediumBoxes[i];
    
    rect(x, boxYPosition, mediumBox.width, mediumBox.height);
    text(title, textXPosition, textYPosition);
    
    animateLineOnce( title, textXPosition, boxYPosition - lineHeight, textXPosition, boxYPosition + lineHeight * i - mediumBox.height * i, 0.06);
  }
}

function animateLine(startX, startY, endX, endY, speed = 0.01) {
  let currentX = startX;
  let currentY = startY;
  let done = false;

  return function() {
    if (done) return; // Stop animation when the line is fully drawn

    // Calculate progress for x and y
    let progressX = (endX - currentX) * speed;
    let progressY = (endY - currentY) * speed;

    // Draw the incremental line
    line(startX, startY, currentX, currentY);

    // Update currentX and currentY
    currentX += progressX;
    currentY += progressY;

    // Check if the line has reached the destination
    if (dist(currentX, currentY, endX, endY) < 1) {
      // Draw the final line and mark it as done
      line(startX, startY, endX, endY);
      done = true;
    }
  };
}

function animateLineOnce( func, startX, startY, endX, endY, speed = 0.01) {
    // Draw the vertical timeline line
    if (!animated[func]) {
      animated[func] = animateLine(startX, startY, endX, endY, speed);
    }
  
    animated[func]();
}