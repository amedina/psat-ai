/**
 * External dependencies.
 */
import p5 from 'p5';

/**
 * Internal dependencies.
 */
import config from './config.js';
import app from './app.js';
import auctions from './modules/auctions.js';
import flow from './modules/flow.js';
import utils from './modules/utils.js'; 

app.init = async (p) => {
  app.p = p;
  app.auctions = auctions;
  app.flow = flow;
  app.utils = utils;

  app.handlePlayPauseButttons();

  config.timeline.circles.forEach((circle, index) => {
    if (circle.type === 'publisher') {
      app.circlePublisherIndices.push(index);
    }
  });

  app.auctions.setupAuctions();
  await app.auctions.draw( 0 );
}

app.play = () => {
  app.playButton.classList.add('hidden');
  app.pauseButton.classList.remove('hidden');
  app.isPaused = false;
  app.setupInterval();
}

app.pause = () => {
  app.pauseButton.classList.add('hidden');
  app.playButton.classList.remove('hidden');
  app.isPaused = true;
  app.utils.clearRequestInterval(app.internval);
}

app.setupInterval = () => {
  app.internval = app.utils.requestInterval( () => {
    if ( ! app.isPaused ) {
      app.renderUserIcon();
      // if ( app.circlePublisherIndices.includes(app.currentIndex) ) {
      //   app.canDrawAuctionFlow = true;
      //   app.utils.clearRequestInterval( app.internval );
      //   return;
      // }

      app.currentIndex++;
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
  const p = app.p;
  
  p.textAlign(p.LEFT, p.CENTER);
  
  // Draw circles and text at the timeline position
  circles.forEach((circleItem, index) => {
    const yPosition = verticalSpacing + circleVerticalSpace * index;

    app.circlePositions.push({ x: position.x, y: yPosition });
    app.drawCircle( index );
    // app.drawSmallCircles( index );
    
    p.text(circleItem.datetime, leftPadding, yPosition);
    p.text(circleItem.website, leftPadding, yPosition + 20);
    
    // Draw line leading out of the circle
    p.line(position.x - 25, yPosition, position.x - 40, yPosition);
  });
}

app.drawCircle = ( index ) => {
  const position = app.circlePositions[index];
  const { diameter } = config.timeline.circleProps;

  app.p.circle(position.x, position.y, diameter);
}

app.drawSmallCircles = (index) => {
  const position = app.circlePositions[index];
  const { diameter } = config.timeline.circleProps;
  const smallCircleDiameter = diameter / 5;

  const distanceFromEdge = 6;

  const numSmallCircles = Math.floor(Math.random() * 3) + 1;
  const p = app.p;

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

    const randomColor = p.color(random(255), random(255), random(255));

		p.push();
    p.stroke(randomColor);

    p.circle(randomX, randomY, smallCircleDiameter);
		p.pop();
  }
};

app.drawTimelineKiLine = () => {
  const position = config.timeline.position;
  const { diameter, verticalSpacing } = config.timeline.circleProps;
  const circleVerticalSpace = verticalSpacing + diameter;

  app.p.line( position.x, position.y, position.x, circleVerticalSpace * config.timeline.circles.length );
}

app.renderUserIcon = () => {
  const circlePosition = app.circlePositions[app.currentIndex];

  if ( circlePosition === undefined ) {
    return;
  }

  const user = config.timeline.user;

  if ( app.currentIndex > 0 ) {
    app.drawCircle( app.currentIndex - 1 );
  }

  app.p.image(app.p.userIcon, circlePosition.x - user.width/2, circlePosition.y - user.height/2, user.width, user.height);
}

// Define the sketch
const sketch = (p) => {
  p.setup = () => {
    const circleVerticalSpace = config.timeline.circleProps.verticalSpacing + config.timeline.circleProps.diameter;
    const canvas = p.createCanvas(config.canvas.width, circleVerticalSpace * config.timeline.circles.length);
    canvas.parent('ps-canvas');
    p.background(245);
    p.textSize(12);

    ( async () => {
      await app.init(p);
    } )();

    app.drawTimelineKiLine();
    app.drawTimeline(config.timeline);

    // On first render.
    app.renderUserIcon();
    // app.play();
  };
  
  p.preload = () => {
      // Load the icon image in the preload() function to ensure it is loaded before use
    p.arrowRightIcon = p.loadImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAR1JREFUeF7t2cENg0AQA8ClsiSd8OBBF6EMHomUdEJnoJMoYF+2tWveJyHPeQMXpmh+Tc3zhwHcgOYCHoHmBfCPoEfAI9BcwCPQvAB+CngEPALNBTwCzQuAeQrMy/r8ffZDERsyAvOybucZj/93f6khIAHeEXGoIaABRgGkEBgAUggsABkEJoAEAhuAjqAAQEVQAaAhKAFQENQA4AiKAFAEAyAOJ/dhaJwFMhf0VVmtAdDwYzeUAODhlQAo4VUAaOEVAKjh2QD08EwAifAsAJnwDACp8GiA1n+L9/4wkjkAsNZAXoVZ4TL3NUBGqfIaN6Dy7mayuQEZpcpr3IDKu5vJ5gZklCqvcQMq724mmxuQUaq8xg2ovLuZbO0bcAF7yK5BD9q4CwAAAABJRU5ErkJggg=='); 
    p.arrowDownIcon = p.loadImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAARpJREFUeF7tlkEOAVEQRL+bcRISFnMkCxJOYo4ms7MQMXT3W/SbxE6m1Ksq/29G82fT3P8QgA1oTsAJNC+Af4JOwAk0J+AEmhfAU8AJOIHmBJxA8wJ4CjgBJ9CcgBNoXoDYU+BwmrZjjOWT+cy3y3mOEgifwP44PRIhzPfreRdlfnlPOIDlpUkQws2nAUiAkGI+FUAghDTz6QACIKSaLwHwB4R082UAfoBQYr4UwAoIZebLAXwBodQ8AuADhHLzGIA3EBDzKIAXCCP6ervmqpxyFV7zA+jvCoBOgNa3AXQCtL4NoBOg9W0AnQCtbwPoBGh9G0AnQOvbADoBWt8G0AnQ+jaAToDWtwF0ArS+DaAToPVtAJ0Ard++AU9nS0BBPkjaVQAAAABJRU5ErkJggg==');
    p.userIcon = p.loadImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAn9JREFUeF7tmktywjAMhp2TFU4CM7DILUpvkQXMwEmanixFnZgmxi85knAbsQQntj79kmWZxqz806zcfqMAVAErJ6AhsHIBaBLUENAQWDkBDYFXCmB/bDfXc9e/cg3iCtgf29MwmDdjzMYxvG8a83U9dydJIGIAwNvDYN49hj/Z2zTmQwqECIDR62B89kcKAjuAEuMtJQkI7AB2h3YIuH2a/Nx88Hjknhe2nImSFUDI+z7PRpTS3y7dNjt2kANZAfi8H5P1mCg/XRtul45tnWwv9hmTE9O7QwsAZiHBGQacAGC/n2X+HAABcGx5QBpA0pBS5SBD/zfJlj6Yeq7Uk75kmKOc1HpCv3MqACo/N6ElM3oAQFI51QGABRXsAk95A97zJ3cBWDhFHcApf1gjWwhYSfq2NfcUGDsgcXpfBECouMmJWW7viwCIhUIMgoTxYgCsoZknQ2iMQD9ApFPEngNcLwME+M7pCv10g+65oJcy/HHkzonF/zxGXAG1wVQAUh6B7dDu92P8z6Yec4D9TiwXsClg0gUGo4Itr4QDbHI0XF1iUgBERgeZcNQGJAAwPX+KkKMEsRhARq1PYbP3HRQgFgFAGP+o6mzBAxbZomeaICdFUm7uSPYYoiV3qXsyjCcpaSeVY+xmqRhCkQISNT2J4T7HpOYtuT8oAhDwPpvhvvOE23GGc4QkgNl1F0UywoYi1f0BWgHSbesQGKrmKQkAkJ9TymIdih7v+5NFyQ0SFQC0ARwPKICCq3RVAFaKS7q82Lmw40VCABY1lq7Y9bGPL+knokOA3QrhCRSAMPDqplMFVOcS4QWpAoSBVzedKqA6lwgvSBUgDLy66VavgG9uL15QKQoHkQAAAABJRU5ErkJggg==');
    p.playIcon = p.loadImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAAAXNSR0IArs4c6QAAAqhJREFUeF7tm1FuwkAMRDcnKz0JSPCRW5Tego8ilZNAT0a7KEh8FBQnseyZnf7W2GSeZ9e4tCv6CVWgC62u4kUAgptAAAQgWIHg8nKAAAQrEFxeDhCAYAWCy8sBAhCsQHB5OUAAghUILi8HCECwAsHl5QABCFYguLwcIADBCgSXlwNaB7DZ9fvvr8M+WIew8uEOWG/7a336riufLYJIA6BVCKkA3M+BltyQEsAA4tJ15Yf9WMoM4MaB3Q3pAbAfSzAAWN0ABYDRDZAAmNwAC4DFDfAA0EdWFgCwIysVAMRjiRIA0iWdHsDpeOjqyvp6LR9TdsbZP0lDAKjCb3b9aoCwsoLIDAEGwF10NjfAAVgARKotKyyA4ViCvxugASzghvB1NwUAZDfQAEB1Ax2ABze8lVLSj6yUAJDcQA1gARDuI2sTADJf0s0AWMANLiNrcwDW2/485XL+e009jurXJy/WXdSr+GYAZN0h0QOYs0X16vpHR1ADyNr19ACydz01AISupwQwt+tPx8P7ktPN2FwUd0C20XKs+LcvD1iCPWLv/6L0LHf9o/yz36EdN/89BySAuceNxweqqc0JB4Ch6yEvYaauhwPA1vVQAOo6YOryLGq0tNwH6e8Ay8MMsS5bywnvY9RLqABk/griMxosAKC6Hu0OeGllxK5nAQDb9fAA0LseGcAFYbQcNf4MQSiXMMVxA7mMYzpu0ADQdn36O4C96zMDaKLrUwJoqeuzATizjZZQY6jlzTLGhn8OYBTV8kwCYFHLIVYAHES1pBQAi1oOsQLgIKolpQBY1HKIFQAHUS0pBcCilkOsADiIakkpABa1HGIFwEFUS0oBsKjlECsADqJaUgqARS2HWAFwENWSUgAsajnECoCDqJaUAmBRyyFWABxEtaT8BZvYv3DZ9JHwAAAAAElFTkSuQmCC');
    p.pauseIcon = p.loadImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAZhJREFUeF7tm00OgjAQRoeb6Ukk0QW3UG/BAhM8idwMg9EgP+1IpyVGn4mrqlOfrx8w1Ex4eAlk8PETAJBiCIAAZAsRDMIgDLIRwCAbPzIIgzDIRgCDbPzIoFQG5YdiIyLd0/po6qps5j5kjRra5IMNyg/FqW3lqBXQxrNMznVVnhyAktdQ56e9wDUOIIUcgAD0IJAig2YD98l7EuqBGRSthhYxsQE110u5dRXd7Yt2PBYC6HopnfPe7Yvb+OjqqwGgbpl4jpQAAtDQAZaYiJBBTylc51oAAlCfGxzm3zKU8yARThRfQjgCFEAA0s69/UcYDMIgDBoQoN2hCAEgANEPGjhAu4N2Ry8E7Q6lHQogAE36xdz24b4YF6ufXYzRDwrbvEC7g3bHZytMWGIssST7g8ggJYO64Wibmzzb/KLV0BIldsNMqzcZD7mzurTIN+0PWjp37+amNTaKahPGoJVbrtoP8ldLjL8iLNbhB98QnEE/yGL2KwEoVUhj0L8QwCDbL00GYRAG2QhgkI0fGYRBGGQjgEE2fnfmq4R2jqXwowAAAABJRU5ErkJggg==');
  }
};

// Initialize the sketch
new p5(sketch);