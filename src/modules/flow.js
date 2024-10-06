/**
 * Internal dependencies.
 */
import utils from './utils.js';
import app from '../app.js';

const flow = {
    config: {
        box: { width: 125, height: 100 },
        smallBox: { width: 80, height: 50 },
        mediumBox: { width: 125, height: 50 },
        lineWidth: 100,
        lineHeight: 50,
    },
    auctions: [],
    intervals: {},
};

flow.createBox = (title, x, y, width, height) => {
    app.p.textAlign(app.p.CENTER, app.p.CENTER);
    app.p.rect(x, y, width, height);
    app.p.text(title, x + width / 2, y + height / 2);
}

flow.progressLine = (x1, y1, x2, y2, direction = 'right') => {
    const arrowSize = 10;
    const width = flow.config.lineWidth - arrowSize;
    const height = flow.config.lineHeight - arrowSize;
    const incrementBy = 1;

    let _x2 = x1; // For horizontal direction
    let _y2 = y1; // For vertical direction

    return new Promise((resolve) => {
        flow.intervals['progressline'] = setInterval(() => {
            // Check the direction and adjust the respective coordinate
            if (direction === 'right') {
                _x2 = _x2 + incrementBy;

                // Check if the line has reached the target length for horizontal direction
                if ((_x2 - x1) > width) {
                    clearInterval(flow.intervals['progressline']);
                    resolve(); // Resolve the promise once the interval is cleared
                }

                // Draw the progressing line horizontally
                app.p.line(x1, y1, _x2, y2);

                // Draw the arrow in the correct direction
                utils.drawArrow(arrowSize, _x2, y1, direction); // Draw new arrow

            } else if (direction === 'down') {
                _y2 = _y2 + incrementBy;

                // Check if the line has reached the target length for vertical direction
                if ((_y2 - y1) > height) {
                    clearInterval(flow.intervals['progressline']);
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

export default flow;