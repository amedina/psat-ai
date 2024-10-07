/**
 * Internal dependencies.
 */
import config from './../config.js';
import app from './../app.js';

const utils = {};

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
    let _x, _y;

    if (direction === 'right') {
        _x = x - 1;
        _y = y;
    } else if (direction === 'left') {
        _x = x + 1;
        _y = y;
    } else if (direction === 'down') {
        _x = x;
        _y = y - 1;
    }

    // Clear previous one.
    utils.triangle(
        size + 1,
        _x,
        _y,
        direction,
        config.canvas.background
    );

    utils.triangle(size, x, y, direction, 'black');
}

utils.triangle = (size, x, y, direction = 'right', color = 'black') => {
    const p = app.p;
    const height = (p.sqrt(3) / 2) * size; // Height of an equilateral triangle
    let angle;

    // Determine the angle of rotation based on the direction
    if (direction === 'right') {
        angle = p.radians(90); // Pointing right (default)
    } else if (direction === 'down') {
        angle = p.radians(180); // Pointing down
    } else if (direction === 'left') {
        angle = p.radians(270); // Pointing down
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
    } else if (direction === 'left') {
        p.translate(x - spacing, y + spacing);
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

utils.delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default utils;