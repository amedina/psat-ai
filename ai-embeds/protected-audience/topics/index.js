const config = {
  canvas: {
    width: 1200,
  },
  timeline: {
    position: { x: 160, y: 0 },
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
      { website: "adv1.com", datetime: "2023-10-01 10:00" },
      { website: "adv2.com", datetime: "2023-10-01 11:00" },
      { website: "pub1.com", datetime: "2023-10-01 12:00" },
      { website: "adv3.com", datetime: "2023-10-01 13:00" },
      { website: "adv5.com", datetime: "2023-10-01 13:02" },
      { website: "pub2.com", datetime: "2023-10-01 14:00" },
      { website: "adv6.com", datetime: "2023-10-01 14:01" },
      { website: "adv7.com", datetime: "2023-10-01 15:00" },
    ],
  },
};

const app = {
  isPaused: false,
  circlePositions: [],
  currentIndex: 0,
  internval: undefined,
	visitedTopics: {},
  animated: {
    timelineVerticleLine: undefined,
    ssp: undefined,
  },
  utils: {},
};

const topics = [
  "sports",
  "news",
  "entertainment",
  "technology",
  "health",
  "science",
  "business",
  "education",
];

app.getTopicColors = () => ({
  sports: color(70, 130, 180), // Steel Blue
  news: color(60, 179, 113), // Medium Sea Green
  entertainment: color(255, 182, 193), // Light Pink
  technology: color(100, 149, 237), // Cornflower Blue
  health: color(144, 238, 144), // Light Green
  science: color(255, 160, 122), // Light Salmon
  business: color(218, 165, 32), // Goldenrod
  education: color(123, 104, 238), // Medium Slate Blue
});

app.getRandomTopics = () => {
  const numTopics = Math.floor(Math.random() * 4) + 2;
  const shuffledTopics = topics.sort(() => 0.5 - Math.random());
  return shuffledTopics.slice(0, numTopics);
};

// Function to gather data for the table
app.getTopicSites = () => {
  const topicSites = {};

  config.timeline.circles.forEach((circle) => {
    circle.topics.forEach((topic) => {
      if (!topicSites[topic]) {
        topicSites[topic] = [];
      }
      topicSites[topic].push(circle.website);
    });
  });

  return topicSites;
};

app.drawTable = () => {
  const topics = Object.keys(app.visitedTopics);
  const numRows = topics.length;
  const rowHeight = 30;
  const colWidth = 200;
  const tableOffsetX = 300;
  const tableOffsetY = 100;

  push();

  textSize(16);
  fill(0);

  text("Topic", tableOffsetX + 10, tableOffsetY + 10);
  text("Sites", tableOffsetX + colWidth + 10, tableOffsetY + 10);

  topics.forEach((topic, index) => {
    const y = (index + 1) * rowHeight + tableOffsetY + 10;
    text(topic, tableOffsetX + 10, y);
    text(app.visitedTopics[topic].join(", "), tableOffsetX + colWidth + 10, y);
  });

  pop();
};

app.play = () => {
  app.playButton.classList.add("hidden");
  app.pauseButton.classList.remove("hidden");
  app.timeline.isPaused = false;
  app.setupInterval();
};

app.pause = () => {
  app.pauseButton.classList.add("hidden");
  app.playButton.classList.remove("hidden");
  app.timeline.isPaused = true;
  clearInterval(app.timeline.internval);
};

app.setupInterval = () => {
  app.timeline.internval = setInterval(() => {
    if (!app.timeline.isPaused) {
      app.renderUserIcon();
      app.timeline.currentIndex++;
    }
  }, config.timeline.stepDelay);
};

app.handlePlayPauseButttons = () => {
  app.playButton = document.getElementById("play");
  app.pauseButton = document.getElementById("pause");

  app.playButton.addEventListener("click", app.play);
  app.pauseButton.addEventListener("click", app.pause);
};

app.drawTimeline = ({ position, circleProps, circles }) => {
  const { diameter, verticalSpacing } = circleProps;
  const circleVerticalSpace = verticalSpacing + diameter;
  const leftPadding = 10;

  textAlign(LEFT, CENTER);

  // Draw circles and text at the timeline position
  circles.forEach((circleItem, index) => {
    const yPosition = verticalSpacing + circleVerticalSpace * index;

    app.timeline.circlePositions.push({ x: position.x, y: yPosition });
    app.drawCircle(index);

    text(circleItem.datetime, leftPadding, yPosition);
    text(circleItem.website, leftPadding, yPosition + 20);

    // Draw line leading out of the circle
    line(position.x - 25, yPosition, position.x - 40, yPosition);
  });
};

app.drawCircle = (index) => {
  const position = app.timeline.circlePositions[index];
  const { diameter } = config.timeline.circleProps;

  circle(position.x, position.y, diameter);
};

app.drawSmallCircles = (index) => {
  const position = app.timeline.circlePositions[index];
  const { diameter } = config.timeline.circleProps;
  const smallCircleDiameter = diameter / 5;

  const distanceFromEdge = 6;

  const topics = config.timeline.circles[index].topics;
  const numSmallCircles = topics.length;

  const smallCirclePositions = [];

  for (let i = 0; i < numSmallCircles; i++) {
    let randomX, randomY, isOverlapping;

    do {
      const angle = Math.random() * 2 * Math.PI;

      randomX =
        position.x + (diameter / 2 + distanceFromEdge) * Math.cos(angle);
      randomY =
        position.y + (diameter / 2 + distanceFromEdge) * Math.sin(angle);

      isOverlapping = smallCirclePositions.some((pos) => {
        const dx = pos.x - randomX;
        const dy = pos.y - randomY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < smallCircleDiameter;
      });
    } while (isOverlapping);

    smallCirclePositions.push({ x: randomX, y: randomY });

    const topic = topics[i];
    const topicColor = app.getTopicColors()[topic];

    push();
    fill(topicColor);
    circle(randomX, randomY, smallCircleDiameter);
    pop();
  }
};

app.drawTimelineKiLine = () => {
  const position = config.timeline.position;
  const { diameter, verticalSpacing } = config.timeline.circleProps;
  const circleVerticalSpace = verticalSpacing + diameter;

  line(
    position.x,
    position.y,
    position.x,
    circleVerticalSpace * config.timeline.circles.length
  );
};

app.renderUserIcon = () => {
  const circlePosition = app.timeline.circlePositions[app.timeline.currentIndex];

  if (circlePosition === undefined) {
    return;
  }

  const user = config.timeline.user;

  if (app.timeline.currentIndex > 0) {
    app.drawCircle(app.timeline.currentIndex - 1);
  }

  image(
    userIcon,
    circlePosition.x - user.width / 2,
    circlePosition.y - user.height / 2,
    user.width,
    user.height
  );
  app.drawSmallCircles(app.timeline.currentIndex);

  const currentCircle = config.timeline.circles[app.timeline.currentIndex];
  const currentSite = currentCircle.website;

  currentCircle.topics.forEach((topic) => {
    if (!app.visitedTopics[topic]) {
      app.visitedTopics[topic] = [];
    }
    if (!app.visitedTopics[topic].includes(currentSite)) {
      app.visitedTopics[topic].push(currentSite);
    }
  });

  app.drawTable();
};

app.utils.animateLine = (
  startX,
  startY,
  endX,
  endY,
  speed = 0.01,
  direction = "right"
) => {
  let currentX = startX;
  let currentY = startY;
  let done = false;

  return function () {
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

      if (direction === "down") {
        image(arrowDownIcon, startX - 12.5, startY + 35, 25, 25);
      } else {
        image(arrowRightIcon, startX + 85, startY - 13, 25, 25);
      }
      done = true;
    }
  };
};

app.utils.animateLineOnce = (
  func,
  startX,
  startY,
  endX,
  endY,
  speed = 0.01,
  direction = "right"
) => {
  // Draw the vertical timeline line
  if (!app.animated[func]) {
    app.animated[func] = app.utils.animateLine(
      startX,
      startY,
      endX,
      endY,
      speed,
      direction
    );
  }

  app.animated[func]();
};

function preload() {
  // Load the icon image in the preload() function to ensure it is loaded before use
  arrowRightIcon = loadImage(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAR1JREFUeF7t2cENg0AQA8ClsiSd8OBBF6EMHomUdEJnoJMoYF+2tWveJyHPeQMXpmh+Tc3zhwHcgOYCHoHmBfCPoEfAI9BcwCPQvAB+CngEPALNBTwCzQuAeQrMy/r8ffZDERsyAvOybucZj/93f6khIAHeEXGoIaABRgGkEBgAUggsABkEJoAEAhuAjqAAQEVQAaAhKAFQENQA4AiKAFAEAyAOJ/dhaJwFMhf0VVmtAdDwYzeUAODhlQAo4VUAaOEVAKjh2QD08EwAifAsAJnwDACp8GiA1n+L9/4wkjkAsNZAXoVZ4TL3NUBGqfIaN6Dy7mayuQEZpcpr3IDKu5vJ5gZklCqvcQMq724mmxuQUaq8xg2ovLuZbO0bcAF7yK5BD9q4CwAAAABJRU5ErkJggg=="
  );
  arrowDownIcon = loadImage(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAARpJREFUeF7tlkEOAVEQRL+bcRISFnMkCxJOYo4ms7MQMXT3W/SbxE6m1Ksq/29G82fT3P8QgA1oTsAJNC+Af4JOwAk0J+AEmhfAU8AJOIHmBJxA8wJ4CjgBJ9CcgBNoXoDYU+BwmrZjjOWT+cy3y3mOEgifwP44PRIhzPfreRdlfnlPOIDlpUkQws2nAUiAkGI+FUAghDTz6QACIKSaLwHwB4R082UAfoBQYr4UwAoIZebLAXwBodQ8AuADhHLzGIA3EBDzKIAXCCP6ervmqpxyFV7zA+jvCoBOgNa3AXQCtL4NoBOg9W0AnQCtbwPoBGh9G0AnQOvbADoBWt8G0AnQ+jaAToDWtwF0ArS+DaAToPVtAJ0Ard++AU9nS0BBPkjaVQAAAABJRU5ErkJggg=="
  );
  userIcon = loadImage(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAn9JREFUeF7tmktywjAMhp2TFU4CM7DILUpvkQXMwEmanixFnZgmxi85knAbsQQntj79kmWZxqz806zcfqMAVAErJ6AhsHIBaBLUENAQWDkBDYFXCmB/bDfXc9e/cg3iCtgf29MwmDdjzMYxvG8a83U9dydJIGIAwNvDYN49hj/Z2zTmQwqECIDR62B89kcKAjuAEuMtJQkI7AB2h3YIuH2a/Nx88Hjknhe2nImSFUDI+z7PRpTS3y7dNjt2kANZAfi8H5P1mCg/XRtul45tnWwv9hmTE9O7QwsAZiHBGQacAGC/n2X+HAABcGx5QBpA0pBS5SBD/zfJlj6Yeq7Uk75kmKOc1HpCv3MqACo/N6ElM3oAQFI51QGABRXsAk95A97zJ3cBWDhFHcApf1gjWwhYSfq2NfcUGDsgcXpfBECouMmJWW7viwCIhUIMgoTxYgCsoZknQ2iMQD9ApFPEngNcLwME+M7pCv10g+65oJcy/HHkzonF/zxGXAG1wVQAUh6B7dDu92P8z6Yec4D9TiwXsClg0gUGo4Itr4QDbHI0XF1iUgBERgeZcNQGJAAwPX+KkKMEsRhARq1PYbP3HRQgFgFAGP+o6mzBAxbZomeaICdFUm7uSPYYoiV3qXsyjCcpaSeVY+xmqRhCkQISNT2J4T7HpOYtuT8oAhDwPpvhvvOE23GGc4QkgNl1F0UywoYi1f0BWgHSbesQGKrmKQkAkJ9TymIdih7v+5NFyQ0SFQC0ARwPKICCq3RVAFaKS7q82Lmw40VCABY1lq7Y9bGPL+knokOA3QrhCRSAMPDqplMFVOcS4QWpAoSBVzedKqA6lwgvSBUgDLy66VavgG9uL15QKQoHkQAAAABJRU5ErkJggg=="
  );
  playIcon = loadImage(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAAAXNSR0IArs4c6QAAAqhJREFUeF7tm1FuwkAMRDcnKz0JSPCRW5Tego8ilZNAT0a7KEh8FBQnseyZnf7W2GSeZ9e4tCv6CVWgC62u4kUAgptAAAQgWIHg8nKAAAQrEFxeDhCAYAWCy8sBAhCsQHB5OUAAghUILi8HCECwAsHl5QABCFYguLwcIADBCgSXlwNaB7DZ9fvvr8M+WIew8uEOWG/7a336riufLYJIA6BVCKkA3M+BltyQEsAA4tJ15Yf9WMoM4MaB3Q3pAbAfSzAAWN0ABYDRDZAAmNwAC4DFDfAA0EdWFgCwIysVAMRjiRIA0iWdHsDpeOjqyvp6LR9TdsbZP0lDAKjCb3b9aoCwsoLIDAEGwF10NjfAAVgARKotKyyA4ViCvxugASzghvB1NwUAZDfQAEB1Ax2ABze8lVLSj6yUAJDcQA1gARDuI2sTADJf0s0AWMANLiNrcwDW2/485XL+e009jurXJy/WXdSr+GYAZN0h0QOYs0X16vpHR1ADyNr19ACydz01AISupwQwt+tPx8P7ktPN2FwUd0C20XKs+LcvD1iCPWLv/6L0LHf9o/yz36EdN/89BySAuceNxweqqc0JB4Ch6yEvYaauhwPA1vVQAOo6YOryLGq0tNwH6e8Ay8MMsS5bywnvY9RLqABk/griMxosAKC6Hu0OeGllxK5nAQDb9fAA0LseGcAFYbQcNf4MQSiXMMVxA7mMYzpu0ADQdn36O4C96zMDaKLrUwJoqeuzATizjZZQY6jlzTLGhn8OYBTV8kwCYFHLIVYAHES1pBQAi1oOsQLgIKolpQBY1HKIFQAHUS0pBcCilkOsADiIakkpABa1HGIFwEFUS0oBsKjlECsADqJaUgqARS2HWAFwENWSUgAsajnECoCDqJaUAmBRyyFWABxEtaT8BZvYv3DZ9JHwAAAAAElFTkSuQmCC"
  );
  pauseIcon = loadImage(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAZhJREFUeF7tm00OgjAQRoeb6Ukk0QW3UG/BAhM8idwMg9EgP+1IpyVGn4mrqlOfrx8w1Ex4eAlk8PETAJBiCIAAZAsRDMIgDLIRwCAbPzIIgzDIRgCDbPzIoFQG5YdiIyLd0/po6qps5j5kjRra5IMNyg/FqW3lqBXQxrNMznVVnhyAktdQ56e9wDUOIIUcgAD0IJAig2YD98l7EuqBGRSthhYxsQE110u5dRXd7Yt2PBYC6HopnfPe7Yvb+OjqqwGgbpl4jpQAAtDQAZaYiJBBTylc51oAAlCfGxzm3zKU8yARThRfQjgCFEAA0s69/UcYDMIgDBoQoN2hCAEgANEPGjhAu4N2Ry8E7Q6lHQogAE36xdz24b4YF6ufXYzRDwrbvEC7g3bHZytMWGIssST7g8ggJYO64Wibmzzb/KLV0BIldsNMqzcZD7mzurTIN+0PWjp37+amNTaKahPGoJVbrtoP8ldLjL8iLNbhB98QnEE/yGL2KwEoVUhj0L8QwCDbL00GYRAG2QhgkI0fGYRBGGQjgEE2fnfmq4R2jqXwowAAAABJRU5ErkJggg=="
  );
}

function setup() {
  const circleVerticalSpace =
    config.timeline.circleProps.verticalSpacing +
    config.timeline.circleProps.diameter;
  const canvas = createCanvas(
    config.canvas.width,
    circleVerticalSpace * config.timeline.circles.length
  );
  canvas.parent("ps-canvas");
  background(245);

  config.timeline.circles.forEach((circle) => {
    circle.topics = app.getRandomTopics();
  });
  app.drawTimelineKiLine();
  app.drawTimeline(config.timeline);
  app.handlePlayPauseButttons();

  app.play();
  // app.drawTable();
}

function draw() {
  textSize(12);
}
