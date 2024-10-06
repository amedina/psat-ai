/**
 * Internal dependencies.
 */
import flow from "./flow";

const auctions = {};

auctions.setupAuctions = () => {
    config.timeline.circles.forEach((circle, index) => {
        flow.setupAuction(index);
    });
}

auctions.setupAuction = (index) => {
    const { position, circleProps } = config.timeline;
    const { diameter, verticalSpacing } = circleProps;
    const currentCircle = config.timeline.circles[index];
    const circleNumber = index + 1;
    const { box, smallBox, mediumBox, lineWidth, lineHeight } = flow.config;
    const auction = {};

    if (currentCircle.type !== 'publisher' || !app.canDrawAuctionFlow) {
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
    // flow.createBox( 'SSP', x, y, box.width, box.height );
    // app.utils.animateLineOnce( 'ssp', x - spaceFromTimeline + diameter / 2, y + box.height / 2, x, y + box.height / 2, 0.06);

    // Draw DSP blocks

    auction.dsp = [];

    for (let i = 0; i <= 1; i++) {
        const marginTop = -10;
        const verticalSpacing = 20;
        const textYPosition = y + smallBox.height / 2 + smallBox.height * i + marginTop + verticalSpacing * i;
        const title = "DSP " + (i + 1);

        auction.dsp.push({
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
        });
        // flow.createBox( title, x + box.width + lineWidth, y + (smallBox.height + verticalSpacing) * i + marginTop, smallBox.width, smallBox.height );
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

        auction.bottomFlow.push({
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
        });
        // flow.createBox(title, x, boxYPosition, mediumBox.width, mediumBox.height);
        // app.utils.animateLineOnce( title, textXPosition, boxYPosition - lineHeight, textXPosition, boxYPosition + lineHeight * i - mediumBox.height * i, 0.06, 'down');
    }

    flow.auctions.push(auction);
}

auctions.drawAuction = async (index) => {
    app.p.textAlign(app.p.CENTER, app.p.CENTER);

    const auction = flow.auctions[index];

    if (auction === undefined) {
        return;
    }

    // Helper function to draw lines and boxes
    const drawLineAndBox = async (item, direction = 'right') => {
        await flow.progressLine(item.line.x1, item.line.y1, item.line.x2, item.line.y2, direction);
        flow.createBox(item.name, item.box.x, item.box.y, item.box.width, item.box.height);
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

export default auctions;