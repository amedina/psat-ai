const config = {
  canvas: {
    width: 700,
    background: 245,
  },
  timeline: {
    position: {x: 160, y: 0},
    circleProps: {
      diameter: 50,
      verticalSpacing: 50,
    },
    stepDelay: 1500,
    user: {
      width: 30,
      height: 30,
    },
    circles: [
      { type: 'advertiser', website: 'adv1.com', datetime: '2023-10-01 10:00' },
      { type: 'publisher', website: 'pub1.com', datetime: '2023-10-01 12:00' },
      { type: 'advertiser', website: 'adv2.com', datetime: '2023-10-01 11:00' },
      { type: 'advertiser', website: 'adv3.com', datetime: '2023-10-01 13:00' },
      { type: 'advertiser', website: 'adv5.com', datetime: '2023-10-01 13:02' },
      { type: 'publisher', website: 'pub2.com', datetime: '2023-10-01 14:00' },
      { type: 'advertiser', website: 'adv6.com', datetime: '2023-10-01 14:01' },
      { type: 'advertiser', website: 'adv7.com', datetime: '2023-10-01 15:00' },
    ],
  },
};

const app = {
  isPaused: false,
  circlePositions: [],
  circlePublisherIndices: [],
  currentIndex: 0,
  internval: undefined,
  animated: {
    timelineVerticleLine: undefined,
    ssp: undefined
  },
  canDrawAuctionFlow: true,
  utils: {},
  flow: {
    config: {
      box: { width: 125, height: 100 },
      smallBox: { width: 80, height: 50 },
      mediumBox: { width: 125, height: 50 },
      lineWidth: 100,
      lineHeight: 50,
    },
    auctions: [],
    intervals: {},
  },
}

app.init = async () => {
  app.handlePlayPauseButttons();

  config.timeline.circles.forEach((circle, index) => {
    if (circle.type === 'publisher') {
      app.circlePublisherIndices.push(index);
    }
  });

  app.flow.setupAuctions();
  await app.flow.drawAuction( 0 );
}

app.play = () => {
  app.playButton.classList.add('hidden');
  app.pauseButton.classList.remove('hidden');
  app.timeline.isPaused = false;
  app.setupInterval();
}

app.pause = () => {
  app.pauseButton.classList.add('hidden');
  app.playButton.classList.remove('hidden');
  app.timeline.isPaused = true;
  app.utils.clearRequestInterval(app.timeline.internval);
}

app.setupInterval = () => {
  app.timeline.internval = app.utils.requestInterval( () => {
    if ( ! app.timeline.isPaused ) {
      app.renderUserIcon();
      // if ( app.circlePublisherIndices.includes(app.timeline.currentIndex) ) {
      //   app.canDrawAuctionFlow = true;
      //   app.utils.clearRequestInterval( app.timeline.internval );
      //   return;
      // }

      app.timeline.currentIndex++;
    }
  }, config.timeline.stepDelay);
}

app.handlePlayPauseButttons = () => {
  app.playButton = document.getElementById("play");
  app.pauseButton = document.getElementById("pause");

  app.playButton.addEventListener("click", app.play);
  app.pauseButton.addEventListener("click", app.pause);
}

app.drawTimeline = ({ position, circleProps, circles }) => {
  const { diameter, verticalSpacing } = circleProps;
  const circleVerticalSpace = verticalSpacing + diameter;
  const leftPadding = 10;
  
  textAlign(LEFT, CENTER);
  
  // Draw circles and text at the timeline position
  circles.forEach((circleItem, index) => {
    const yPosition = verticalSpacing + circleVerticalSpace * index;

    app.timeline.circlePositions.push({ x: position.x, y: yPosition });
    app.drawCircle( index );
    // app.drawSmallCircles( index );
    
    text(circleItem.datetime, leftPadding, yPosition);
    text(circleItem.website, leftPadding, yPosition + 20);
    
    // Draw line leading out of the circle
    line(position.x - 25, yPosition, position.x - 40, yPosition);
  });
}

app.drawCircle = ( index ) => {
  const position = app.timeline.circlePositions[index];
  const { diameter } = config.timeline.circleProps;

  circle(position.x, position.y, diameter);
}

app.drawSmallCircles = (index) => {
  const position = app.timeline.circlePositions[index];
  const { diameter } = config.timeline.circleProps;
  const smallCircleDiameter = diameter / 5;

  const distanceFromEdge = 6;

  const numSmallCircles = Math.floor(Math.random() * 3) + 1;

  const smallCirclePositions = [];

  for (let i = 0; i < numSmallCircles; i++) {
    let randomX, randomY, isOverlapping;

    do {
      const angle = Math.random() * 2 * Math.PI;

      randomX = position.x + (diameter / 2 + distanceFromEdge) * Math.cos(angle);
      randomY = position.y + (diameter / 2 + distanceFromEdge) * Math.sin(angle);

      isOverlapping = smallCirclePositions.some(pos => {
        const dx = pos.x - randomX;
        const dy = pos.y - randomY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < smallCircleDiameter;
      });
    } while (isOverlapping);

    smallCirclePositions.push({ x: randomX, y: randomY });

    const randomColor = color(random(255), random(255), random(255));

		push();
    stroke(randomColor);

    circle(randomX, randomY, smallCircleDiameter);
		pop();
  }
};

app.drawTimelineKiLine = () => {
  const position = config.timeline.position;
  const { diameter, verticalSpacing } = config.timeline.circleProps;
  const circleVerticalSpace = verticalSpacing + diameter;

  line( position.x, position.y, position.x, circleVerticalSpace * config.timeline.circles.length );
}

app.renderUserIcon = () => {
  const circlePosition = app.timeline.circlePositions[app.timeline.currentIndex];

  if ( circlePosition === undefined ) {
    return;
  }

  const user = config.timeline.user;

  if ( app.timeline.currentIndex > 0 ) {
    app.drawCircle( app.timeline.currentIndex - 1 );
  }

  image(userIcon, circlePosition.x - user.width/2, circlePosition.y - user.height/2, user.width, user.height);
}

app.flow.drawAuction = async (index) => {
  textAlign(CENTER, CENTER);

  const auction = app.flow.auctions[index];

  if (auction === undefined) {
    return;
  }

  // Helper function to draw lines and boxes
  const drawLineAndBox = async (item, direction = 'right') => {
    await app.flow.progressLine(item.line.x1, item.line.y1, item.line.x2, item.line.y2, direction);
    app.flow.createBox(item.name, item.box.x, item.box.y, item.box.width, item.box.height);
  };

  // Draw SSP box and line
  await drawLineAndBox(auction.ssp);

  // Sequentially draw DSP boxes and lines
  const dsp = auction.dsp;
  for (const dspItem of dsp) {
    await drawLineAndBox(dspItem);  // Sequential execution for DSP items
  }

  // Sequentially draw bottom flow boxes and lines
  const bottomFlow = auction.bottomFlow;
  for (const flowItem of bottomFlow) {
    await drawLineAndBox(flowItem, 'down');  // Sequential execution for bottom flow
  }
};

app.flow.progressLine = (x1, y1, x2, y2, direction = 'right') => {
  const arrowSize = 10;
  const width = app.flow.config.lineWidth - arrowSize;
  const height = app.flow.config.lineHeight - arrowSize;
  const incrementBy = 1;

  let _x2 = x1; // For horizontal direction
  let _y2 = y1; // For vertical direction

  return new Promise((resolve) => {
    app.flow.intervals['progressline'] = setInterval(() => {
      // Check the direction and adjust the respective coordinate
      if (direction === 'right') {
        _x2 = _x2 + incrementBy;

        // Check if the line has reached the target length for horizontal direction
        if ((_x2 - x1) > width) {
          clearInterval(app.flow.intervals['progressline']);
          resolve(); // Resolve the promise once the interval is cleared
        }

        // Draw the progressing line horizontally
        line(x1, y1, _x2, y2);

        // Draw the arrow in the correct direction
        app.utils.drawArrow(arrowSize, _x2, y1, direction); // Draw new arrow

      } else if (direction === 'down') {
        _y2 = _y2 + incrementBy;

        // Check if the line has reached the target length for vertical direction
        if ((_y2 - y1) > height) {
          clearInterval(app.flow.intervals['progressline']);
          resolve(); // Resolve the promise once the interval is cleared
        }

        // Draw the progressing line vertically
        line(x1, y1, x2, _y2);

        // Draw the arrow in the correct direction
        app.utils.drawArrow(arrowSize, x1, _y2, direction); // Draw new arrow
      }
    }, 10);
  });
}

app.flow.setupAuctions = () => {
  config.timeline.circles.forEach((circle, index) => {
    app.flow.setupAuction( index );
  });
}

app.flow.setupAuction = ( index ) => {
  const { position, circleProps } = config.timeline;
  const { diameter, verticalSpacing } = circleProps;
  const currentCircle = config.timeline.circles[index];
  const circleNumber = index + 1;
  const { box, smallBox, mediumBox, lineWidth, lineHeight } = app.flow.config;
  const auction = {};

  if ( currentCircle.type !== 'publisher' || ! app.canDrawAuctionFlow ) {
    return;
  }
  
  // Calculate (x, y) coordinates
  const spaceFromTimeline = lineWidth + diameter / 2;
  const x = position.x + spaceFromTimeline;
  const circleRadius = diameter / 2;
  const circleHeights = diameter * circleNumber - circleRadius;
  const circleVerticalHeights = verticalSpacing * (circleNumber - 1) - verticalSpacing / 2;
  const y = circleHeights + circleVerticalHeights;

  auction.ssp = {
    name: 'SSP',
    box: { x, y, width: box.width, height: box.height },
    line: {
      x1: x - spaceFromTimeline + diameter / 2,
      y1: y + box.height / 2,
      x2: x,
      y2: y + box.height / 2,
      speed: 0.6
    }
  }
  
  // Draw SSP block (rectangle 1)
  // app.flow.createBox( 'SSP', x, y, box.width, box.height );
  // app.utils.animateLineOnce( 'ssp', x - spaceFromTimeline + diameter / 2, y + box.height / 2, x, y + box.height / 2, 0.06);
  
  // Draw DSP blocks

  auction.dsp = [];

  for (let i = 0; i <= 1; i++) {
    const marginTop = -10;
    const verticalSpacing = 20;
    const textYPosition = y + smallBox.height / 2 + smallBox.height * i + marginTop + verticalSpacing * i;
    const title = "DSP " + (i + 1);

    auction.dsp.push( {
      name: title,
      box: { 
        x: x + box.width + lineWidth, 
        y: y + (smallBox.height + verticalSpacing) * i + marginTop,
        width: smallBox.width, 
        height: smallBox.height
      },
      line: {
        x1: x + box.width, 
        y1: textYPosition,
        x2: x + box.width + lineWidth,
        y2: textYPosition,
        speed: 0.05
      }
    } );
    // app.flow.createBox( title, x + box.width + lineWidth, y + (smallBox.height + verticalSpacing) * i + marginTop, smallBox.width, smallBox.height );
    // app.utils.animateLineOnce( title, x + box.width, textYPosition, x + box.width + lineWidth, textYPosition, 0.05);
  }
  
  const mediumBoxes = ['runAuction()', 'Show Winning Ad'];

  auction.bottomFlow = [];
  
  // Draw Medium blocks
  for (let i = 0; i < mediumBoxes.length; i++) {
    const topHeight = y + box.height;
    const textXPosition = x + mediumBox.width / 2;
    const boxYPosition = topHeight + (lineHeight * i) + lineHeight * (i + 1);
    const title = mediumBoxes[i];

    auction.bottomFlow.push( {
      name: title,
      box: { x, y: boxYPosition, width: mediumBox.width, height: mediumBox.height },
      line: {
        x1: textXPosition, 
        y1: boxYPosition - lineHeight,
        x2: textXPosition, 
        y2: boxYPosition + lineHeight * i - mediumBox.height * i,
        speed: 0.06,
        direction: 'down'
      }
    } );
    // app.flow.createBox(title, x, boxYPosition, mediumBox.width, mediumBox.height);
    // app.utils.animateLineOnce( title, textXPosition, boxYPosition - lineHeight, textXPosition, boxYPosition + lineHeight * i - mediumBox.height * i, 0.06, 'down');
  }

  app.flow.auctions.push(auction);
}

app.flow.createBox = (title, x, y, width, height) => {
  textAlign(CENTER, CENTER);
  rect(x, y, width, height);
  text(title, x + width / 2, y + height / 2);
}

app.utils.animateLine = (startX, startY, endX, endY, speed = 0.01, direction = 'right') => {
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

      if ( direction === 'down' ) {
        image(arrowDownIcon, startX - 12.5, startY + 35, 25, 25);  
      } else {
        image(arrowRightIcon, startX + 85, startY - 13, 25, 25);
      }
      done = true;
    }
  };
}

app.utils.animateLineOnce = ( func, startX, startY, endX, endY, speed = 0.01, direction = 'right') => {
    // Draw the vertical timeline line
    if (!app.animated[func]) {
      app.animated[func] = app.utils.animateLine(startX, startY, endX, endY, speed, direction);
    }
  
    app.animated[func]();
}

app.utils.requestInterval = (fn, delay) => {
  let start = performance.now();
  let handle = { id: null };

  function loop() {
    let current = performance.now();
    let elapsed = current - start;

    if (elapsed >= delay) {
      fn(); // Execute the callback function
      start = performance.now(); // Reset start time
    }

    handle.id = requestAnimationFrame(loop); // Continue the loop
  }

  handle.id = requestAnimationFrame(loop); // Start the loop
  return handle;
}

app.utils.clearRequestInterval = (handle) => {
  cancelAnimationFrame(handle.id);
}

app.utils.drawArrow = (size, x, y, direction = 'right' ) => {
  // Clear previous one.
  app.utils.triangle( 
    size + 1, 
    direction === 'right' ? x - 1 : x, 
    direction === 'right' ? y : y - 1, 
    direction, 
    config.canvas.background 
  );

  app.utils.triangle( size, x, y , direction, 'black' );
}

app.utils.triangle = (size, x, y, direction = 'right', color = 'black') => {
  const height = (sqrt(3) / 2) * size; // Height of an equilateral triangle
  let angle;

  // Determine the angle of rotation based on the direction
  if (direction === 'right') {
    angle = radians(90); // Pointing right (default)
  } else if (direction === 'down') {
    angle = radians(180); // Pointing down
  }

  // Coordinates of the triangle's vertices
  const spacing = 6;
  const x1 = 0;
  const y1 = -height / 2; // Top vertex
  const x2 = -size / 2;
  const y2 = height / 2; // Bottom-left vertex
  const x3 = size / 2;
  const y3 = height / 2; // Bottom-right vertex

  // Save the current state of the canvas
  push();

  // Move the origin to the triangle's center
  if ( direction === 'right' ) {
    translate(x + spacing, y);
  } else {
    translate(x, y + spacing);
  }

  // Rotate the triangle based on the angle
  rotate(angle);
  noStroke();

  fill(color);

  // Draw the triangle using the calculated vertices
  triangle(x1, y1, x2, y2, x3, y3);

  // Restore the previous state of the canvas
  pop();
}


function preload() {
  // Load the icon image in the preload() function to ensure it is loaded before use
  arrowRightIcon = loadImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAR1JREFUeF7t2cENg0AQA8ClsiSd8OBBF6EMHomUdEJnoJMoYF+2tWveJyHPeQMXpmh+Tc3zhwHcgOYCHoHmBfCPoEfAI9BcwCPQvAB+CngEPALNBTwCzQuAeQrMy/r8ffZDERsyAvOybucZj/93f6khIAHeEXGoIaABRgGkEBgAUggsABkEJoAEAhuAjqAAQEVQAaAhKAFQENQA4AiKAFAEAyAOJ/dhaJwFMhf0VVmtAdDwYzeUAODhlQAo4VUAaOEVAKjh2QD08EwAifAsAJnwDACp8GiA1n+L9/4wkjkAsNZAXoVZ4TL3NUBGqfIaN6Dy7mayuQEZpcpr3IDKu5vJ5gZklCqvcQMq724mmxuQUaq8xg2ovLuZbO0bcAF7yK5BD9q4CwAAAABJRU5ErkJggg=='); 
  arrowDownIcon = loadImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAARpJREFUeF7tlkEOAVEQRL+bcRISFnMkCxJOYo4ms7MQMXT3W/SbxE6m1Ksq/29G82fT3P8QgA1oTsAJNC+Af4JOwAk0J+AEmhfAU8AJOIHmBJxA8wJ4CjgBJ9CcgBNoXoDYU+BwmrZjjOWT+cy3y3mOEgifwP44PRIhzPfreRdlfnlPOIDlpUkQws2nAUiAkGI+FUAghDTz6QACIKSaLwHwB4R082UAfoBQYr4UwAoIZebLAXwBodQ8AuADhHLzGIA3EBDzKIAXCCP6ervmqpxyFV7zA+jvCoBOgNa3AXQCtL4NoBOg9W0AnQCtbwPoBGh9G0AnQOvbADoBWt8G0AnQ+jaAToDWtwF0ArS+DaAToPVtAJ0Ard++AU9nS0BBPkjaVQAAAABJRU5ErkJggg==');
  userIcon = loadImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAn9JREFUeF7tmktywjAMhp2TFU4CM7DILUpvkQXMwEmanixFnZgmxi85knAbsQQntj79kmWZxqz806zcfqMAVAErJ6AhsHIBaBLUENAQWDkBDYFXCmB/bDfXc9e/cg3iCtgf29MwmDdjzMYxvG8a83U9dydJIGIAwNvDYN49hj/Z2zTmQwqECIDR62B89kcKAjuAEuMtJQkI7AB2h3YIuH2a/Nx88Hjknhe2nImSFUDI+z7PRpTS3y7dNjt2kANZAfi8H5P1mCg/XRtul45tnWwv9hmTE9O7QwsAZiHBGQacAGC/n2X+HAABcGx5QBpA0pBS5SBD/zfJlj6Yeq7Uk75kmKOc1HpCv3MqACo/N6ElM3oAQFI51QGABRXsAk95A97zJ3cBWDhFHcApf1gjWwhYSfq2NfcUGDsgcXpfBECouMmJWW7viwCIhUIMgoTxYgCsoZknQ2iMQD9ApFPEngNcLwME+M7pCv10g+65oJcy/HHkzonF/zxGXAG1wVQAUh6B7dDu92P8z6Yec4D9TiwXsClg0gUGo4Itr4QDbHI0XF1iUgBERgeZcNQGJAAwPX+KkKMEsRhARq1PYbP3HRQgFgFAGP+o6mzBAxbZomeaICdFUm7uSPYYoiV3qXsyjCcpaSeVY+xmqRhCkQISNT2J4T7HpOYtuT8oAhDwPpvhvvOE23GGc4QkgNl1F0UywoYi1f0BWgHSbesQGKrmKQkAkJ9TymIdih7v+5NFyQ0SFQC0ARwPKICCq3RVAFaKS7q82Lmw40VCABY1lq7Y9bGPL+knokOA3QrhCRSAMPDqplMFVOcS4QWpAoSBVzedKqA6lwgvSBUgDLy66VavgG9uL15QKQoHkQAAAABJRU5ErkJggg==');
  playIcon = loadImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAAAXNSR0IArs4c6QAAAqhJREFUeF7tm1FuwkAMRDcnKz0JSPCRW5Tego8ilZNAT0a7KEh8FBQnseyZnf7W2GSeZ9e4tCv6CVWgC62u4kUAgptAAAQgWIHg8nKAAAQrEFxeDhCAYAWCy8sBAhCsQHB5OUAAghUILi8HCECwAsHl5QABCFYguLwcIADBCgSXlwNaB7DZ9fvvr8M+WIew8uEOWG/7a336riufLYJIA6BVCKkA3M+BltyQEsAA4tJ15Yf9WMoM4MaB3Q3pAbAfSzAAWN0ABYDRDZAAmNwAC4DFDfAA0EdWFgCwIysVAMRjiRIA0iWdHsDpeOjqyvp6LR9TdsbZP0lDAKjCb3b9aoCwsoLIDAEGwF10NjfAAVgARKotKyyA4ViCvxugASzghvB1NwUAZDfQAEB1Ax2ABze8lVLSj6yUAJDcQA1gARDuI2sTADJf0s0AWMANLiNrcwDW2/485XL+e009jurXJy/WXdSr+GYAZN0h0QOYs0X16vpHR1ADyNr19ACydz01AISupwQwt+tPx8P7ktPN2FwUd0C20XKs+LcvD1iCPWLv/6L0LHf9o/yz36EdN/89BySAuceNxweqqc0JB4Ch6yEvYaauhwPA1vVQAOo6YOryLGq0tNwH6e8Ay8MMsS5bywnvY9RLqABk/griMxosAKC6Hu0OeGllxK5nAQDb9fAA0LseGcAFYbQcNf4MQSiXMMVxA7mMYzpu0ADQdn36O4C96zMDaKLrUwJoqeuzATizjZZQY6jlzTLGhn8OYBTV8kwCYFHLIVYAHES1pBQAi1oOsQLgIKolpQBY1HKIFQAHUS0pBcCilkOsADiIakkpABa1HGIFwEFUS0oBsKjlECsADqJaUgqARS2HWAFwENWSUgAsajnECoCDqJaUAmBRyyFWABxEtaT8BZvYv3DZ9JHwAAAAAElFTkSuQmCC');
  pauseIcon = loadImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAZhJREFUeF7tm00OgjAQRoeb6Ukk0QW3UG/BAhM8idwMg9EgP+1IpyVGn4mrqlOfrx8w1Ex4eAlk8PETAJBiCIAAZAsRDMIgDLIRwCAbPzIIgzDIRgCDbPzIoFQG5YdiIyLd0/po6qps5j5kjRra5IMNyg/FqW3lqBXQxrNMznVVnhyAktdQ56e9wDUOIIUcgAD0IJAig2YD98l7EuqBGRSthhYxsQE110u5dRXd7Yt2PBYC6HopnfPe7Yvb+OjqqwGgbpl4jpQAAtDQAZaYiJBBTylc51oAAlCfGxzm3zKU8yARThRfQjgCFEAA0s69/UcYDMIgDBoQoN2hCAEgANEPGjhAu4N2Ry8E7Q6lHQogAE36xdz24b4YF6ufXYzRDwrbvEC7g3bHZytMWGIssST7g8ggJYO64Wibmzzb/KLV0BIldsNMqzcZD7mzurTIN+0PWjp37+amNTaKahPGoJVbrtoP8ldLjL8iLNbhB98QnEE/yGL2KwEoVUhj0L8QwCDbL00GYRAG2QhgkI0fGYRBGGQjgEE2fnfmq4R2jqXwowAAAABJRU5ErkJggg==');
}

function setup() {
  const circleVerticalSpace = config.timeline.circleProps.verticalSpacing + config.timeline.circleProps.diameter;
  const canvas = createCanvas(config.canvas.width, circleVerticalSpace * config.timeline.circles.length);
  canvas.parent('ps-canvas');
  background(245);
  textSize(12);

  ( async () => {
    await app.init();
  } )();
  app.drawTimelineKiLine();
  app.drawTimeline(config.timeline);

  // On first render.
  app.renderUserIcon();
  // app.play();
}
