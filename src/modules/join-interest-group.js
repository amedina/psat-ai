/**
 * Internal dependencies.
 */
import flow from './flow';
import app from '../app';
import config from '../config';
import utils from './utils';
import rippleEffect from './ripple-effect';
import timeline from './timeline';

const joinInterestGroup = {};

joinInterestGroup.setupJoinings = () => {
    config.timeline.circles.forEach((circle, index) => {
        joinInterestGroup.setUp(index);
    });
}

joinInterestGroup.setUp = (index) => {
    const { circleProps, circles } = config.timeline;
    const { box, smallBox, lineWidth } = config.flow;
    const { diameter } = circleProps;
    const currentCircle = circles[index];
    const _joining = {};

    // Calculate (x, y) coordinates
    const spaceFromTimeline = lineWidth + diameter / 2;

    const {x, y} = flow.calculateXYPostions( index );

    if (currentCircle.type !== 'advertiser') {
        app.joinInterestGroup.joinings.push(null);
        return;
    }

    // Setup DSP blocks
    _joining.dspTags = [];

    _joining.dspTags.push( {
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
    });

    _joining.dspTags.push( {
        name: 'DSP Tag',
        line: {
            x1: x - spaceFromTimeline + diameter / 2,
            y1: y + box.height / 2,
            x2: x,
            y2: y + box.height / 2,
            speed: 0.6,
            direction: 'left',
            text: 'joinInterestGroup()'
        }
    });

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

    if (!_joining) {
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

    // Draw DSP Tags box and line
    await drawLineAndBox(_joining.dspTags[0]);

    await utils.delay( 500 );

    // Sequentially draw DSP boxes and lines
    const dsp = _joining.dsp;
    for (const dspItem of dsp) {
        await drawLineAndBox(dspItem);  // Sequential execution for DSP items
    }

    await drawLine(_joining.dspTags[1]);

    timeline.drawSmallCircles(index);

    await utils.delay( 1500 );

    joinInterestGroup.remove(index);
};

joinInterestGroup.remove = (index) => {
    const { dspTags, dsp } = app.joinInterestGroup.joinings[index];
    const x1 = dspTags[0]?.line?.x1;
    const y1 = dspTags[0]?.line?.y1;
    const x2 = dsp[0]?.line?.x1 + config.flow.box.width + config.flow.smallBox.width;

    const height = config.flow.box.height + 22;

    flow.createOverrideBox( x1, y1, x2, height );
}

export default joinInterestGroup;