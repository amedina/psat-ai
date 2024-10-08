/**
 * Internal dependencies.
 */
import config from "../config";
import app from "../app";

const timeline = {};

timeline.init = () => {
    config.timeline.circles.forEach((circle, index) => {
        if (circle.type === 'publisher') {
            app.timeline.circlePublisherIndices.push(index);
        }
    });

    app.timeline.drawTimelineLine();
    app.timeline.drawTimeline(config.timeline);
    app.timeline.renderUserIcon(); // On first render.
}

timeline.drawTimeline = ({ position, circleProps, circles }) => {
    const { diameter, verticalSpacing } = circleProps;
    const circleVerticalSpace = verticalSpacing + diameter;
    const leftPadding = 10;
    const p = app.p;

    p.textAlign(p.LEFT, p.CENTER);

    // Draw circles and text at the timeline position
    circles.forEach((circleItem, index) => {
        const yPosition = config.timeline.position.y + diameter / 2 + circleVerticalSpace * index;

        app.timeline.circlePositions.push({ x: position.x, y: yPosition });
        timeline.drawCircle(index);

        p.text(circleItem.datetime, leftPadding, yPosition);
        p.text(circleItem.website, leftPadding, yPosition + 20);

        // Draw line leading out of the circle
        p.line(position.x - 25, yPosition, position.x - 40, yPosition);
    });
}

timeline.drawTimelineLine = () => {
    const position = config.timeline.position;
    const { diameter, verticalSpacing } = config.timeline.circleProps;
    const circleVerticalSpace = verticalSpacing + diameter;

    app.p.line(position.x, 0, position.x, circleVerticalSpace * config.timeline.circles.length);
}

timeline.drawCircle = (index) => {
    const position = app.timeline.circlePositions[index];
    const { diameter } = config.timeline.circleProps;

    app.p.circle(position.x, position.y, diameter);
}

timeline.drawSmallCircles = (index) => {
    const position = app.timeline.circlePositions[index];
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

        const randomColor = p.color(p.random(255), p.random(255), p.random(255));

        p.push();
        p.fill(randomColor);

        p.circle(randomX, randomY, smallCircleDiameter);
        p.pop();
    }
};

timeline.renderUserIcon = () => {
    const circlePosition = app.timeline.circlePositions[app.timeline.currentIndex];

    if (circlePosition === undefined) {
        return;
    }

    const user = config.timeline.user;

    if (app.timeline.currentIndex > 0) {
        timeline.drawCircle(app.timeline.currentIndex - 1);
    }

    app.p.image(app.p.userIcon, circlePosition.x - user.width / 2, circlePosition.y - user.height / 2, user.width, user.height);
}

export default timeline;