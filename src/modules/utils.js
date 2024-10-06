/**
 * Internal dependencies.
 */
import config from './../config.js';

const utils = {};

utils.setup = (p) => {
    utils.p = p;
}

utils.animateLine = (startX, startY, endX, endY, speed = 0.01, direction = 'right') => {
    let currentX = startX;
    let currentY = startY;
    let done = false;
    const p = utils.p;

    return function () {
        if (done) return; // Stop animation when the line is fully drawn

        // Calculate progress for x and y
        let progressX = (endX - currentX) * speed;
        let progressY = (endY - currentY) * speed;

        // Draw the incremental line
        p.line(startX, startY, currentX, currentY);

        // Update currentX and currentY
        currentX += progressX;
        currentY += progressY;

        // Check if the line has reached the destination
        if (dist(currentX, currentY, endX, endY) < 1) {
            // Draw the final line and mark it as done
            p.line(startX, startY, endX, endY);

            if (direction === 'down') {
                p.image(p.arrowDownIcon, startX - 12.5, startY + 35, 25, 25);
            } else {
                p.image(p.arrowRightIcon, startX + 85, startY - 13, 25, 25);
            }
            done = true;
        }
    };
}

utils.animateLineOnce = (func, startX, startY, endX, endY, speed = 0.01, direction = 'right') => {
    // Draw the vertical timeline line
    if (!app.animated[func]) {
        app.animated[func] = utils.animateLine(startX, startY, endX, endY, speed, direction);
    }

    app.animated[func]();
}

utils.requestInterval = (fn, delay) => {
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

utils.clearRequestInterval = (handle) => {
    cancelAnimationFrame(handle.id);
}

utils.drawArrow = (size, x, y, direction = 'right') => {
    // Clear previous one.
    utils.triangle(
        size + 1,
        direction === 'right' ? x - 1 : x,
        direction === 'right' ? y : y - 1,
        direction,
        config.canvas.background
    );

    utils.triangle(size, x, y, direction, 'black');
}

utils.triangle = (size, x, y, direction = 'right', color = 'black') => {
    const p = utils.p;
    const height = (p.sqrt(3) / 2) * size; // Height of an equilateral triangle
    let angle;

    // Determine the angle of rotation based on the direction
    if (direction === 'right') {
        angle = p.radians(90); // Pointing right (default)
    } else if (direction === 'down') {
        angle = p.radians(180); // Pointing down
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
    p.push();

    // Move the origin to the triangle's center
    if (direction === 'right') {
        p.translate(x + spacing, y);
    } else {
        p.translate(x, y + spacing);
    }

    // Rotate the triangle based on the angle
    p.rotate(angle);
    p.noStroke();

    p.fill(color);

    // Draw the triangle using the calculated vertices
    p.triangle(x1, y1, x2, y2, x3, y3);

    // Restore the previous state of the canvas
    p.pop();
}

export default utils;