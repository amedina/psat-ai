/**
 * Internal dependencies.
 */
import utils from './utils.js';
import app from '../app.js';
import config from '../config.js';

const flow = {};

flow.createBox = (title, x, y, width, height) => {
    app.p.textAlign(app.p.CENTER, app.p.CENTER);
    app.p.rect(x, y, width, height);
    app.p.text(title, x + width / 2, y + height / 2);
}

flow.progressLine = (x1, y1, x2, y2, direction = 'right', text = '') => {
    const arrowSize = 10;
    const width = config.flow.lineWidth - arrowSize;
    const height = config.flow.lineHeight - arrowSize;
    const incrementBy = 1;

    let _x2 = x1; // For horizontal directions
    let _y2 = y1; // For vertical direction
    let __x2 = x2;

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
                app.p.line(x1, y1, _x2, y2);

                // Draw the arrow in the correct direction
                utils.drawArrow(arrowSize, _x2, y1, direction); // Draw new arrow

            } else if (direction === 'left') {
                __x2 = __x2 - incrementBy;
                const margin = 10;

                if ((x2 - __x2) > width) {
                    clearInterval(app.flow.intervals['progressline']);

                    if (text) {
                        app.p.textSize(10);
                        app.p.text(text, __x2 + width / 2, y1 + height / 2);
                        app.p.textSize(12);
                    }

                    resolve(); // Resolve the promise once the interval is cleared
                }

                // Draw the progressing line horizontally (left direction)
                app.p.line(x2, y2 + margin, __x2, y1 + margin);

                // Draw the arrow in the correct direction
                utils.drawArrow(arrowSize, __x2, y1 + 4, direction); // Draw new arrow

            } else if (direction === 'down') {
                _y2 = _y2 + incrementBy;

                // Check if the line has reached the target length for vertical direction
                if ((_y2 - y1) > height) {
                    clearInterval(app.flow.intervals['progressline']);
                    resolve(); // Resolve the promise once the interval is cleared
                }

                // Draw the progressing line vertically
                app.p.line(x1, y1, x2, _y2);

                // Draw the arrow in the correct direction
                utils.drawArrow(arrowSize, x1, _y2, direction); // Draw new arrow
            }
        }, 10);
    });
}

flow.calculateXYPostions = (index) => {
    const { position, circleProps } = config.timeline;
    const { diameter, verticalSpacing } = circleProps;
    const { lineWidth } = config.flow;

    // Calculate (x, y) coordinates
    const circleNumber = index + 1;
    const spaceFromTimeline = lineWidth + diameter / 2;
    const x = position.x + spaceFromTimeline;
    const circleRadius = diameter / 2;
    const circleHeights = diameter * circleNumber - circleRadius;
    const circleVerticalHeights = verticalSpacing * (circleNumber - 1) - verticalSpacing / 2;
    const y = position.y / 2 + circleHeights + circleVerticalHeights;

    return { x, y };
}

flow.createOverrideBox = (x1, y1, x2, height) => {
    const p = app.p;
    const paddingLeft = 1;

    // Calculate the width of the box
    let width = x2 - x1;
    
    // Calculate the top y-position for the rectangle
    let topY = y1 - height / 2;

    // Draw the rectangle
    p.noStroke(); // Remove the border
    p.fill(config.canvas.background); // Set the fill color from the config
    p.rect(x1 + paddingLeft, topY, width, height); // Draw the rectangle
}

export default flow;