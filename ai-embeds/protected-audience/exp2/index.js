const config = {
  timeline: { x: 160, y: 0 }, 
  circleDiameter: 50,  
  circleVerticalSpacing: 50,
  horizontalLineLength: 100,
  boxDimensions: { width: 100, height: 50 },
  circles: [
    { type: 'advertiser', website: 'adv1.com', datetime: '2023-10-01 10:00' },
    { type: 'advertiser', website: 'adv2.com', datetime: '2023-10-01 11:00' },
    { type: 'publisher', website: 'pub1.com', datetime: '2023-10-01 12:00' },
    { type: 'advertiser', website: 'adv3.com', datetime: '2023-10-01 13:00' },
    { type: 'advertiser', website: 'adv5.com', datetime: '2023-10-01 13:02' },
    { type: 'publisher', website: 'pub2.com', datetime: '2023-10-01 14:00' },
    { type: 'advertiser', website: 'adv6.com', datetime: '2023-10-01 14:01' },
    { type: 'advertiser', website: 'adv7.com', datetime: '2023-10-01 15:00' },
  ]
};

function setup() {
  const circleVerticalSpace = config.circleVerticalSpacing + config.circleDiameter;
  createCanvas(700, circleVerticalSpace * config.circles.length );
  background(245);
}

function draw() {
  textSize(12);
  drawTimeline(config);
  drawDiagram( 3 );
}

function drawTimeline({ timeline, circleDiameter, circleVerticalSpacing, circles }) {
  const circleVerticalSpace = circleVerticalSpacing + circleDiameter;
  const leftPaddding = 10;
  
  textAlign(LEFT, CENTER);
  
  // Vertical timeline line
  line(timeline.x, timeline.y, timeline.x, circleVerticalSpace * circles.length );
  
  // Circle at the timeline position
  for ( let i = 0; i < circles.length; i++ ) {
     circle(
       timeline.x, 
       circleVerticalSpacing + circleVerticalSpace * i, 
       circleDiameter
     );
    
    text( 
        circles[i].datetime,
        leftPaddding, 
        circleVerticalSpacing + circleVerticalSpace * i
      );
    
    text(
      circles[i].website,
      leftPaddding,
      circleVerticalSpacing + circleVerticalSpace * i + 20
    );
    
    line(
      timeline.x - 25, 
      circleVerticalSpacing + circleVerticalSpace * i, 
      timeline.x - 40,
      circleVerticalSpacing + circleVerticalSpace * i,
    );
  }
}

function drawDiagram( cirlceNumber ) {
  
  // Set text and rectangle styles
  const box = { width: 125, height: 80 };
  const smallBox = { width: 80, height: 50 };
  const mediumBox = { width: box.width, height: 50 };
  const lineWidth = 100;
  const lineHeight = 50;
  
  // Calculate (x, y) cordinates.
  const x = config.timeline.x + lineWidth + 20;
  const cirlceRadius = config.circleDiameter / 2;
  const circleHeights = config.circleDiameter * cirlceNumber - cirlceRadius;
  const circleVerticalHeights = config.circleVerticalSpacing * (cirlceNumber - 1) - config.circleVerticalSpacing/2 + 10;
  const y = circleHeights + circleVerticalHeights;
  
  textAlign(CENTER, CENTER);

  // Draw SSP block (rectangle 1)
  rect(x, y, box.width, box.height); // SSP rectangle
  text("SSP", x + box.width / 2, y + box.height / 2); // SSP text

  // Draw DSP blocks
  for ( let i = 0; i <= 1; i++ ) {
    const marginTop = -25;

     rect(
       x + box.width + lineWidth, 
       y + lineWidth * i + marginTop, 
       smallBox.width, 
       smallBox.height
     );

    text(
      "DSP " + (i + 1),
      x + box.width / 2 + lineWidth + smallBox.width + smallBox.width / 4, 
      y + smallBox.height / 2 + lineHeight * i + smallBox.height * i + marginTop
    );
  }
  
  const mediumBoxes = ['runAuction()', 'Show Winning Ad'];
  
  // Draw Medium blocks
  for ( let i = 0; i < mediumBoxes.length; i++ ) {
    const topHeight = y + box.height;

     rect(
       x, 
       topHeight + (lineHeight * i) + lineHeight * (i + 1), 
       mediumBox.width, 
       mediumBox.height
     );

    text(
      mediumBoxes[i],
      x + mediumBox.width / 2, 
      topHeight + (mediumBox.height / 2) + (lineHeight * ( i + 1)) + (mediumBox.height * i),
    ); 
  }
}

// function drawFlowBoxesAndLines({ timeline, horizontalLineLength, circleVerticalSpacing, boxDimensions, circleDiameter }) {
//   const cirlceNumber = 3;
//   const cirlceRadius = circleDiameter / 2;
//   const verticalLineSpacing = 15;
//   const SSPHeight = boxDimensions.height + 100;
//   const circleVerticalSpace = circleVerticalSpacing + circleDiameter;
//   const heightFromTop = circleVerticalSpace * ( cirlceNumber - 1 ) + cirlceRadius;
  
//   // Horizontal line 1 between circle and first box
//   line(  
//     timeline.x + cirlceRadius, 
//     heightFromTop + cirlceRadius,
//     timeline.x + cirlceRadius + horizontalLineLength, 
//     heightFromTop + cirlceRadius
//   );
  
//   // Second Line
//   line(  
//     timeline.x + cirlceRadius + boxDimensions.width, 
//     heightFromTop + cirlceRadius - verticalLineSpacing,
//     timeline.x + cirlceRadius + horizontalLineLength + boxDimensions.width + horizontalLineLength, 
//     heightFromTop + cirlceRadius - verticalLineSpacing
//   );
  
//   // Third Line
//   line(  
//     timeline.x + cirlceRadius + boxDimensions.width, 
//     heightFromTop + cirlceRadius + verticalLineSpacing,
//     timeline.x + cirlceRadius + horizontalLineLength + boxDimensions.width + horizontalLineLength, 
//     heightFromTop + cirlceRadius + verticalLineSpacing
//   );
  
//   // First box
//   rect(
//     timeline.x + horizontalLineLength, 
//     heightFromTop, 
//     boxDimensions.width, 
//     SSPHeight
//   );
  
//   rect(
//     timeline.x + horizontalLineLength * 2 + boxDimensions.width, 
//     heightFromTop - verticalLineSpacing, 
//     boxDimensions.width, 
//     boxDimensions.height
//   );
  
//   text( 
//     'SSP',
//     timeline.x + horizontalLineLength + boxDimensions.width / 2 - 12, 
//     heightFromTop + boxDimensions.height / 2 + 5
//   );
  
//   text( 
//     'DSP 1',
//     (timeline.x + horizontalLineLength * 3 + boxDimensions.width / 2 - 12), 
//     heightFromTop + boxDimensions.height / 2 + 5
//   );
// }