/**
 * Internal dependencies.
 */
import flow from './flow';
import app from '../app';
import config from '../config';
import utils from './utils';
import rippleEffect from './ripple-effect';

const joinInterestGroup = {};

joinInterestGroup.setupJoinings = () => {
    config.timeline.circles.forEach((circle, index) => {
        joinInterestGroup.setUp(index);
    });
}

joinInterestGroup.setUp = (index) => {
    const { position, circleProps } = config.timeline;
    const { diameter, verticalSpacing } = circleProps;
    const currentCircle = config.timeline.circles[index];
    const { box, smallBox, lineWidth } = config.flow;
    const _joining = {};

    // Calculate (x, y) coordinates
    const circleNumber = index + 1;
    const spaceFromTimeline = lineWidth + diameter / 2;
    const x = position.x + spaceFromTimeline;
    const circleRadius = diameter / 2;
    const circleHeights = diameter * circleNumber - circleRadius;
    const circleVerticalHeights = verticalSpacing * (circleNumber - 1) - verticalSpacing / 2;
    const y = position.y / 2 + circleHeights + circleVerticalHeights;

    if (currentCircle.type !== 'advertiser') {
        return;
    }

    // Setup DSP blocks
    _joining.ssp = {
        name: 'DSP Tag',
        box: { x, y, width: box.width, height: box.height },
        line: {
            x1: x - spaceFromTimeline + diameter / 2,
            y1: y + box.height / 2,
            x2: x,
            y2: y + box.height / 2,
            speed: 0.6,
            text: 'joinInterestGroup()'
        }
    };

    // Setup DSP blocks
    _joining.dsp = [];

    for (let i = 0; i <= 1; i++) {
        const marginTop = -10;
        const verticalSpacing = 20;
        const textYPosition = y + smallBox.height / 2 + smallBox.height * i + marginTop + verticalSpacing * i;
        const title = "DSP " + (i + 1);

        _joining.dsp.push({
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

        _joining.dsp.push({
            name: title,
            line: {
                x1: x + box.width,
                y1: textYPosition,
                x2: x + box.width + lineWidth,
                y2: textYPosition,
                speed: 0.05,
                direction: 'left',
            }
        });
    }

    app.joinInterestGroup.joinings.push(_joining);
}

joinInterestGroup.draw = async (index) => {
    app.p.textAlign(app.p.CENTER, app.p.CENTER);

    const _joining = app.joinInterestGroup.joinings[index];

    if (_joining === undefined) {
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
    await drawLineAndBox(_joining.ssp);
    await utils.delay( 500 );

    // Sequentially draw DSP boxes and lines
    const dsp = _joining.dsp;
    for (const dspItem of dsp) {
        await drawBox(dspItem);  // Sequential execution for DSP items
    }

    await utils.delay( 1000 );

    for (const dspItem of dsp) {
        await drawLine(dspItem);  // Sequential execution for DSP items
        await utils.delay( 1000 );
    }
};

export default joinInterestGroup;