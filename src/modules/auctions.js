/**
 * Internal dependencies.
 */
import flow from './flow';
import app from '../app';
import config from '../config';
import utils from './utils';
import rippleEffect from './ripple-effect';

const auction = {};

auction.setupAuctions = () => {
    rippleEffect.setUp();

    config.timeline.circles.forEach((circle, index) => {
        auction.setUp(index);
    });
}

auction.setUp = (index) => {
    const { circleProps, circles } = config.timeline;
    const { box, smallBox, mediumBox, lineWidth, lineHeight } = config.flow;
    const { diameter } = circleProps;
    const currentCircle = circles[index];
    const _auction = {};

    // Calculate (x, y) coordinates
    const spaceFromTimeline = lineWidth + diameter / 2;

    const {x, y} = flow.calculateXYPostions( index );

    if (currentCircle.type !== 'publisher') {
        return;
    }

    // Setup DSP blocks
    _auction.ssp = {
        name: 'SSP',
        box: { x, y, width: box.width, height: box.height },
        line: {
            x1: x - spaceFromTimeline + diameter / 2,
            y1: y + box.height / 2,
            x2: x,
            y2: y + box.height / 2,
            speed: 0.6
        }
    };

    // Setup DSP blocks
    _auction.dsp = [];

    for (let i = 0; i <= 1; i++) {
        const marginTop = -10;
        const verticalSpacing = 20;
        const textYPosition = y + smallBox.height / 2 + smallBox.height * i + marginTop + verticalSpacing * i;
        const title = "DSP " + (i + 1);

        _auction.dsp.push({
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
                speed: 0.05,
                direction: 'right',
                text: ''
            }
        });

        _auction.dsp.push({
            name: title,
            line: {
                x1: x + box.width,
                y1: textYPosition,
                x2: x + box.width + lineWidth,
                y2: textYPosition,
                speed: 0.05,
                direction: 'left',
                text: `$${ Math.floor(Math.random() * 10) + 1 }`
            }
        });
    }

    const mediumBoxes = ['runAuction()', 'Show Winning Ad'];

    _auction.bottomFlow = [];

    // Setup bottom blocks
    for (let i = 0; i < mediumBoxes.length; i++) {
        const topHeight = y + box.height;
        const textXPosition = x + mediumBox.width / 2;
        const boxYPosition = topHeight + (lineHeight * i) + lineHeight * (i + 1);
        const title = mediumBoxes[i];

        _auction.bottomFlow.push({
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
    }

    app.auction.auctions.push(_auction);
}

auction.draw = async (index) => {
    app.p.textAlign(app.p.CENTER, app.p.CENTER);

    const _auction = app.auction.auctions[index];

    if (_auction === undefined) {
        return;
    }

    // Helper function to draw lines and boxes
    const drawLineAndBox = async (item) => {
        await drawLine(item);
        await drawBox(item);
    };

    const drawLine = async (item) => {
        await flow.progressLine(item.line.x1, item.line.y1, item.line.x2, item.line.y2, item.line?.direction, item.line?.text);
    }

    const drawBox = async (item) => {
        if ( item.box ) {
            flow.createBox(item.name, item.box.x, item.box.y, item.box.width, item.box.height);
        }
    }

    // Draw SSP box and line
    await drawLineAndBox(_auction.ssp);
    await utils.delay( 500 );

    await rippleEffect.start( 
        _auction.ssp.box.x + config.flow.box.width + 2, 
        _auction.ssp.box.y + config.flow.box.height / 2
    );

    // Sequentially draw DSP boxes and lines
    const dsp = _auction.dsp;
    for (const dspItem of dsp) {
        await drawBox(dspItem);  // Sequential execution for DSP items
    }

    await utils.delay( 1000 );

    for (const dspItem of dsp) {
        await drawLine(dspItem);  // Sequential execution for DSP items
        await utils.delay( 1000 );
    }

    // Sequentially draw bottom flow boxes and lines
    const bottomFlow = _auction.bottomFlow;
    for (const flowItem of bottomFlow) {
        await drawLineAndBox(flowItem);  // Sequential execution for bottom flow
        await utils.delay( 1000 );
    }
};

export default auction;