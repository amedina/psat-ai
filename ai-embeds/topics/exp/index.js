const config = {
  canvas: {
    width: 2000,
  },
  timeline: {
    position: { x: 160, y: 100 },
    circleProps: {
      diameter: 50,
      verticalSpacing: 80,
    },
    stepDelay: 1500,
    user: {
      width: 30,
      height: 30,
    },
    circles: [],
  },
};

const app = {
  isPaused: false,
  circlePositions: [[], [], []],
  currentIndex: 0,
  epochIndex: 0,
  weekCount: 1,
  internval: undefined,
  visitedTopics: [[], [], []],
  topicsVisitCount: [{}, {}, {}],
  utils: {},
};

const topics = [
  'sports',
  'news',
  'entertainment',
  'technology',
  'health',
  'science',
];

const websites = [
  'example-news.com',
  'tech-insights.com',
  'daily-sports.com',
  'health-today.com',
  'travel-guide.com',
  'foodie-heaven.com',
  'fashion-hub.com',
  'business-world.com',
  'education-portal.com',
  'entertainment-zone.com',
  'global-news.com',
  'tech-trends.com',
  'sports-daily.com',
  'wellness-today.com',
  'world-traveler.com',
  'gourmet-paradise.com',
  'style-hub.com',
  'finance-world.com',
  'learning-portal.com',
  'fun-zone.com',
];

const websiteToTopicMapping = {
  'example-news.com': 'news',
  'tech-insights.com': 'technology',
  'daily-sports.com': 'sports',
  'health-today.com': 'health',
  'travel-guide.com': 'travel',
  'foodie-heaven.com': 'food',
  'fashion-hub.com': 'fashion',
  'business-world.com': 'business',
  'education-portal.com': 'education',
  'entertainment-zone.com': 'entertainment',
  'global-news.com': 'news',
  'tech-trends.com': 'technology',
  'sports-daily.com': 'sports',
  'wellness-today.com': 'health',
  'world-traveler.com': 'travel',
  'gourmet-paradise.com': 'food',
  'style-hub.com': 'fashion',
  'finance-world.com': 'business',
  'learning-portal.com': 'education',
  'fun-zone.com': 'entertainment',
};

const adtechs = [
  'GoogleAds',
  'FacebookAds',
  'AmazonAds',
  'TradeDesk',
  'AdobeAdvertising',
  'MediaMath',
  'AppNexus',
  'Criteo',
  'PubMatic',
  'VerizonMedia',
  'Taboola',
  'Outbrain',
  'AdRoll',
  'Quantcast',
  'RocketFuel',
  'Sizmek',
  'Choozle',
  'Centro',
  'ZetaGlobal',
  'LiveRamp',
];

const assignAdtechsToSites = (sites, adtechs) => {
  const siteAdtechs = {};
  sites.forEach((site) => {
    const numAdtechs = Math.floor(Math.random() * 3) + 1; // Random number between 1 and 3
    const assignedAdtechs = [];
    for (let i = 0; i < numAdtechs; i++) {
      const randomAdtech = adtechs[Math.floor(Math.random() * adtechs.length)];
      if (!assignedAdtechs.includes(randomAdtech)) {
        assignedAdtechs.push(randomAdtech);
      }
    }
    siteAdtechs[site] = assignedAdtechs;
  });
  return siteAdtechs;
};

const siteAdtechs = assignAdtechsToSites(websites, adtechs);

app.getAdtechsColors = () => ({
  GoogleAds: color(255, 99, 71), // Tomato
  FacebookAds: color(135, 206, 250), // Light Sky Blue
  AmazonAds: color(255, 182, 193), // Light Pink
  TradeDesk: color(100, 149, 237), // Cornflower Blue
  AdobeAdvertising: color(144, 238, 144), // Light Green
  MediaMath: color(255, 160, 122), // Light Salmon
  AppNexus: color(255, 215, 0), // Gold
  Criteo: color(0, 255, 255), // Cyan
  PubMatic: color(255, 105, 180), // Hot Pink
  VerizonMedia: color(255, 165, 0), // Orange
  Taboola: color(0, 0, 255), // Blue
  Outbrain: color(0, 255, 0), // Lime
  AdRoll: color(255, 0, 0), // Red
  Quantcast: color(128, 0, 128), // Purple
  RocketFuel: color(0, 0, 0), // Black
  Sizmek: color(255, 140, 0), // Dark Orange
  Choozle: color(128, 128, 128), // Gray
  Centro: color(128, 0, 0), // Maroon
  ZetaGlobal: color(0, 128, 0), // Green
  LiveRamp: color(0, 128, 128), // Teal
});

app.handlePlayPauseButttons = () => {
  app.playButton = document.getElementById('play');
  app.pauseButton = document.getElementById('pause');

  app.playButton.addEventListener('click', app.play);
  app.pauseButton.addEventListener('click', app.pause);
};

app.play = () => {
  app.playButton.classList.add('hidden');
  app.pauseButton.classList.remove('hidden');
  app.isPaused = false;
  app.setupInterval();
};

app.pause = () => {
  app.pauseButton.classList.add('hidden');
  app.playButton.classList.remove('hidden');
  app.isPaused = true;
  clearInterval(app.internval);
};

app.getTopicColors = () => ({
  sports: color(255, 99, 71), // Tomato
  news: color(135, 206, 235), // Sky Blue
  entertainment: color(255, 182, 193), // Light Pink
  technology: color(100, 149, 237), // Cornflower Blue
  health: color(144, 238, 144), // Light Green
  science: color(255, 160, 122), // Light Salmon
});

app.getWebsiteToTopic = (website) => {
  return [websiteToTopicMapping[website]];
};

app.getIncrementalDateTime = (startDate, incrementMinutes) => {
  const date = new Date(startDate);
  date.setMinutes(date.getMinutes() + incrementMinutes);
  return date.toISOString().slice(0, 16).replace('T', ' ');
};

app.generateTimelineVisits = (
  websites,
  numVisitsPerEpoch,
  startDate = new Date()
) => {
  const visits = [];
  let currentDateTime = new Date(startDate);

  const incrementMinutes = (7 * 24 * 60) / numVisitsPerEpoch; // Total minutes in a week divided by visits per epoch

  for (let visit = 0; visit < numVisitsPerEpoch; visit++) {
    const website = websites[Math.floor(Math.random() * websites.length)];
    const datetime = app.getIncrementalDateTime(
      currentDateTime,
      incrementMinutes
    );
    const topics = app.getWebsiteToTopic(website);
    visits.push({ website, datetime, topics });
    currentDateTime = new Date(datetime); // Update currentDateTime for the next visit
  }

  return visits;
};

app.calculateMaxSiteWidth = (epochIndex) => {
  const topicSites = app.visitedTopics[epochIndex];
  let maxWidth = 0;

  Object.values(topicSites).forEach((sites) => {
    const uniqueSites = [...new Set(sites)];
    const siteText = uniqueSites.join(', ');
    const textWidthValue = textWidth(siteText);
    if (textWidthValue > maxWidth) {
      maxWidth = textWidthValue;
    }
  });

  return maxWidth;
};

app.drawTable = (epochIndex, weekCount, position = undefined) => {
  const topics = Object.keys(app.visitedTopics[epochIndex]);
  const numRows = topics.length;
  const rowHeight = 30;
  const colWidth = 150;
  const tableOffsetX = position?.x || 800;
  const tableOffsetY = position?.y || 50;
  const maxSiteWidth = app.calculateMaxSiteWidth(epochIndex);

  push();
  textSize(16);
  text('Epoch Week ' + weekCount + ' Summary', tableOffsetX, tableOffsetY - 30);

  fill(255);
  textSize(12);
  rect(
    tableOffsetX,
    tableOffsetY,
    Math.max(2 * colWidth + maxSiteWidth * 1.75, 400),
    numRows * rowHeight + 40
  );

  textSize(16);
  fill(0);

  text('Topic', tableOffsetX + 10, tableOffsetY + 20);
  text('Count', tableOffsetX + colWidth + 10, tableOffsetY + 20);
  text('Ad Techs', tableOffsetX + 2 * colWidth + 10, tableOffsetY + 20);
  line(
    tableOffsetX,
    tableOffsetY + 40,
    tableOffsetX + Math.max(2 * colWidth + maxSiteWidth * 1.75, 400),
    tableOffsetY + 40
  );

  topics
    .sort(
      (a, b) =>
        app.topicsVisitCount[epochIndex][b] -
        app.topicsVisitCount[epochIndex][a]
    )
    .forEach((topic, index) => {
      const y = (index + 1) * rowHeight + tableOffsetY + 30;
      fill(255);
      rect(tableOffsetX, y - 20, colWidth, rowHeight);

      fill(0);
      text(topic, tableOffsetX + 10, y);

      const topicCounts = app.topicsVisitCount[epochIndex];
      text(topicCounts[topic] || 0, tableOffsetX + colWidth + 10, y);

      const sortedAdTechs = [
        ...new Set(app.visitedTopics[epochIndex][topic].slice().sort()),
      ];
      // text(sortedAdTechs.join(', '), tableOffsetX + 2 * colWidth + 10, y);
      let widthTracker = 0;
      for (let i = 0; i < sortedAdTechs.length; i++) {
				const textWidthValue = textWidth(sortedAdTechs[i]);
        fill(app.getAdtechsColors()[sortedAdTechs[i]]);
        rect(tableOffsetX + 2 * colWidth + 5 + widthTracker, y - 15, textWidthValue + 10, 25);
        fill(255);
        text(
          sortedAdTechs[i],
          tableOffsetX + 2 * colWidth + 10 + widthTracker,
          y
        );

        widthTracker += textWidthValue + 20;
      }

      line(
        tableOffsetX,
        y + 10,
        tableOffsetX + Math.max(2 * colWidth + maxSiteWidth * 1.75, 400),
        y + 10
      );
    });

  line(
    tableOffsetX + colWidth,
    tableOffsetY,
    tableOffsetX + colWidth,
    tableOffsetY + numRows * rowHeight + 40
  );

  line(
    tableOffsetX + 2 * colWidth,
    tableOffsetY,
    tableOffsetX + 2 * colWidth,
    tableOffsetY + numRows * rowHeight + 40
  );

  pop();
};

app.setupInterval = () => {
  app.internval = setInterval(() => {
    if (!app.isPaused) {
      app.renderUserIcon(app.epochIndex, app.currentIndex);
      app.drawTable(app.epochIndex, app.weekCount);

      app.currentIndex++;
      if (app.currentIndex >= config.timeline.circles[app.epochIndex].length) {
        clearInterval(app.internval);

        setTimeout(() => {
          app.currentIndex = 0;

          clear();
          app.epochIndex++;
          app.weekCount++;
          const nextStartDate = new Date(
            config.timeline.circles[app.epochIndex - 1][5].datetime
          );
          nextStartDate.setDate(nextStartDate.getDate() + 1);
          config.timeline.circles.push(
            app.generateTimelineVisits(websites, 6, nextStartDate)
          );

          if (config.timeline.circles.length > 3) {
            config.timeline.circles.shift();
            app.visitedTopics.push([]);
            app.visitedTopics.shift();
            app.topicsVisitCount.push([]);
            app.topicsVisitCount.shift();
            app.epochIndex = 2;
          }

          if (app.epochIndex >= 2) {
            app.moveEpochTimeline(app.epochIndex - 2, 500, app.weekCount - 2);
            app.drawTable(app.epochIndex - 2, app.weekCount - 2, {
              y: config.timeline.position.y + 600,
            });
          }
          app.moveEpochTimeline(app.epochIndex - 1, 250, app.weekCount - 1);
          app.drawTable(app.epochIndex - 1, app.weekCount - 1, {
            y: config.timeline.position.y + 300,
          });

          app.drawEpoch(app.epochIndex, app.weekCount);
          app.drawTable(app.epochIndex, app.weekCount);
        }, 1000);
      }
    }
  }, config.timeline.stepDelay);
};

app.drawTimelineKiLine = (position) => {
  const { diameter, verticalSpacing } = config.timeline.circleProps;
  const circleVerticalSpace = verticalSpacing + diameter;

  line(position.x, position.y, position.x, circleVerticalSpace * 8);
};

app.drawTimeline = (
  { position, circleProps, circles },
  epochIndex,
  weekCount
) => {
  const { diameter, verticalSpacing } = circleProps;
  const circleVerticalSpace = verticalSpacing - 30 + diameter;
  const leftPadding = position.x - 150;

  textAlign(CENTER, CENTER);
  textSize(16);
  text('Epoch Week ' + weekCount, position.x, 25);

  textAlign(LEFT, CENTER);
  textSize(12);

  // Draw circles and text at the timeline position
  circles.forEach((circleItem, index) => {
    const yPosition = verticalSpacing + circleVerticalSpace * index;

    app.circlePositions[epochIndex].push({ x: position.x, y: yPosition });
    app.drawCircle(epochIndex, index);

    text(circleItem.datetime, leftPadding, yPosition);
    text(circleItem.website, leftPadding, yPosition + 20);
    text(circleItem.topics.join(', '), leftPadding, yPosition + 40);

    // Draw line leading out of the circle
    line(position.x - 25, yPosition, position.x - 40, yPosition);
  });
};

app.drawCircle = (epoch, index) => {
  const position = app.circlePositions[epoch][index];
  const { diameter } = config.timeline.circleProps;

  circle(position.x, position.y, diameter);
};

app.drawSmallCircles = (epoch, index, currentSite) => {
  const position = app.circlePositions[epoch][index];
  const { diameter } = config.timeline.circleProps;
  const smallCircleDiameter = diameter / 5;

  const distanceFromEdge = 6;

  const adTechs = siteAdtechs[currentSite];
  const numSmallCircles = adTechs.length;

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

    const adTechColor = app.getAdtechsColors()[adTechs[i]];

    push();
    fill(adTechColor);
    circle(randomX, randomY, smallCircleDiameter);
    pop();
  }
};

app.renderUserIcon = (epochIndex, visitIndex, skiptopics = false) => {
  if (epochIndex >= config.timeline.circles.length) {
    app.pause();
    return;
  }

  const circlePosition = app.circlePositions[epochIndex][visitIndex];

  if (circlePosition === undefined) {
    return;
  }

  const user = config.timeline.user;

  if (visitIndex > 0) {
    app.drawCircle(epochIndex, visitIndex - 1);
  }

  image(
    userIcon,
    circlePosition.x - user.width / 2,
    circlePosition.y - user.height / 2,
    user.width,
    user.height
  );

  const currentCircle = config.timeline.circles[epochIndex][visitIndex];
  const currentSite = currentCircle.website;

  app.drawSmallCircles(epochIndex, visitIndex, currentSite);

  if (!skiptopics) {
    currentCircle.topics.forEach((topic) => {
      if (!app.visitedTopics[epochIndex][topic]) {
        app.visitedTopics[epochIndex][topic] = [];
      }

      app.visitedTopics[epochIndex][topic].push(...siteAdtechs[currentSite]);
    });

    currentCircle.topics.forEach((topic) => {
      if (!app.topicsVisitCount[epochIndex]) {
        app.topicsVisitCount[epochIndex] = {};
      }

      if (!app.topicsVisitCount[epochIndex][topic]) {
        app.topicsVisitCount[epochIndex][topic] = 0;
      }

      app.topicsVisitCount[epochIndex][topic]++;
    });
  }
};

app.moveEpochTimeline = (epochIndex, moveBy, weekCount) => {
  const epoch = config.timeline.circles[epochIndex];
  const position = {
    x: config.timeline.position.x + moveBy,
    y: config.timeline.position.y,
  };
  app.circlePositions[epochIndex + 1] = [];
  app.circlePositions[epochIndex] = [];

  app.drawTimelineKiLine(position);
  app.drawTimeline(
    {
      position,
      circleProps: config.timeline.circleProps,
      circles: epoch,
    },
    epochIndex,
    weekCount
  );

  let visitIndex = 0;
  while (visitIndex < epoch.length) {
    app.renderUserIcon(epochIndex, visitIndex, true);
    visitIndex++;
  }
};

app.drawEpoch = (epochIndex, weekCount) => {
  const epoch = config.timeline.circles[epochIndex];
  console.log(epoch);

  app.circlePositions[epochIndex] = [];
  app.drawTimelineKiLine(config.timeline.position);
  app.drawTimeline(
    {
      position: config.timeline.position,
      circleProps: config.timeline.circleProps,
      circles: epoch,
    },
    epochIndex,
    weekCount
  );
  app.handlePlayPauseButttons();
  app.play();
};

function preload() {
  userIcon = loadImage(
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAn9JREFUeF7tmktywjAMhp2TFU4CM7DILUpvkQXMwEmanixFnZgmxi85knAbsQQntj79kmWZxqz806zcfqMAVAErJ6AhsHIBaBLUENAQWDkBDYFXCmB/bDfXc9e/cg3iCtgf29MwmDdjzMYxvG8a83U9dydJIGIAwNvDYN49hj/Z2zTmQwqECIDR62B89kcKAjuAEuMtJQkI7AB2h3YIuH2a/Nx88Hjknhe2nImSFUDI+z7PRpTS3y7dNjt2kANZAfi8H5P1mCg/XRtul45tnWwv9hmTE9O7QwsAZiHBGQacAGC/n2X+HAABcGx5QBpA0pBS5SBD/zfJlj6Yeq7Uk75kmKOc1HpCv3MqACo/N6ElM3oAQFI51QGABRXsAk95A97zJ3cBWDhFHcApf1gjWwhYSfq2NfcUGDsgcXpfBECouMmJWW7viwCIhUIMgoTxYgCsoZknQ2iMQD9ApFPEngNcLwME+M7pCv10g+65oJcy/HHkzonF/zxGXAG1wVQAUh6B7dDu92P8z6Yec4D9TiwXsClg0gUGo4Itr4QDbHI0XF1iUgBERgeZcNQGJAAwPX+KkKMEsRhARq1PYbP3HRQgFgFAGP+o6mzBAxbZomeaICdFUm7uSPYYoiV3qXsyjCcpaSeVY+xmqRhCkQISNT2J4T7HpOYtuT8oAhDwPpvhvvOE23GGc4QkgNl1F0UywoYi1f0BWgHSbesQGKrmKQkAkJ9TymIdih7v+5NFyQ0SFQC0ARwPKICCq3RVAFaKS7q82Lmw40VCABY1lq7Y9bGPL+knokOA3QrhCRSAMPDqplMFVOcS4QWpAoSBVzedKqA6lwgvSBUgDLy66VavgG9uL15QKQoHkQAAAABJRU5ErkJggg=='
  );
  playIcon = loadImage(
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAAAXNSR0IArs4c6QAAAqhJREFUeF7tm1FuwkAMRDcnKz0JSPCRW5Tego8ilZNAT0a7KEh8FBQnseyZnf7W2GSeZ9e4tCv6CVWgC62u4kUAgptAAAQgWIHg8nKAAAQrEFxeDhCAYAWCy8sBAhCsQHB5OUAAghUILi8HCECwAsHl5QABCFYguLwcIADBCgSXlwNaB7DZ9fvvr8M+WIew8uEOWG/7a336riufLYJIA6BVCKkA3M+BltyQEsAA4tJ15Yf9WMoM4MaB3Q3pAbAfSzAAWN0ABYDRDZAAmNwAC4DFDfAA0EdWFgCwIysVAMRjiRIA0iWdHsDpeOjqyvp6LR9TdsbZP0lDAKjCb3b9aoCwsoLIDAEGwF10NjfAAVgARKotKyyA4ViCvxugASzghvB1NwUAZDfQAEB1Ax2ABze8lVLSj6yUAJDcQA1gARDuI2sTADJf0s0AWMANLiNrcwDW2/485XL+e009jurXJy/WXdSr+GYAZN0h0QOYs0X16vpHR1ADyNr19ACydz01AISupwQwt+tPx8P7ktPN2FwUd0C20XKs+LcvD1iCPWLv/6L0LHf9o/yz36EdN/89BySAuceNxweqqc0JB4Ch6yEvYaauhwPA1vVQAOo6YOryLGq0tNwH6e8Ay8MMsS5bywnvY9RLqABk/griMxosAKC6Hu0OeGllxK5nAQDb9fAA0LseGcAFYbQcNf4MQSiXMMVxA7mMYzpu0ADQdn36O4C96zMDaKLrUwJoqeuzATizjZZQY6jlzTLGhn8OYBTV8kwCYFHLIVYAHES1pBQAi1oOsQLgIKolpQBY1HKIFQAHUS0pBcCilkOsADiIakkpABa1HGIFwEFUS0oBsKjlECsADqJaUgqARS2HWAFwENWSUgAsajnECoCDqJaUAmBRyyFWABxEtaT8BZvYv3DZ9JHwAAAAAElFTkSuQmCC'
  );
  pauseIcon = loadImage(
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAZhJREFUeF7tm00OgjAQRoeb6Ukk0QW3UG/BAhM8idwMg9EgP+1IpyVGn4mrqlOfrx8w1Ex4eAlk8PETAJBiCIAAZAsRDMIgDLIRwCAbPzIIgzDIRgCDbPzIoFQG5YdiIyLd0/po6qps5j5kjRra5IMNyg/FqW3lqBXQxrNMznVVnhyAktdQ56e9wDUOIIUcgAD0IJAig2YD98l7EuqBGRSthhYxsQE110u5dRXd7Yt2PBYC6HopnfPe7Yvb+OjqqwGgbpl4jpQAAtDQAZaYiJBBTylc51oAAlCfGxzm3zKU8yARThRfQjgCFEAA0s69/UcYDMIgDBoQoN2hCAEgANEPGjhAu4N2Ry8E7Q6lHQogAE36xdz24b4YF6ufXYzRDwrbvEC7g3bHZytMWGIssST7g8ggJYO64Wibmzzb/KLV0BIldsNMqzcZD7mzurTIN+0PWjp37+amNTaKahPGoJVbrtoP8ldLjL8iLNbhB98QnEE/yGL2KwEoVUhj0L8QwCDbL00GYRAG2QhgkI0fGYRBGGQjgEE2fnfmq4R2jqXwowAAAABJRU5ErkJggg=='
  );
}

function setup() {
  config.timeline.circles = [app.generateTimelineVisits(websites, 6)];
  const circleVerticalSpace =
    config.timeline.circleProps.verticalSpacing +
    config.timeline.circleProps.diameter;
  const canvas = createCanvas(config.canvas.width, circleVerticalSpace * 8);
  canvas.parent('ps-canvas');
  background(245);

  app.drawEpoch(app.epochIndex, app.weekCount);
}
