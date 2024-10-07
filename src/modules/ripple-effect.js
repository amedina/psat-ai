/**
 * Internal dependencies.
 */
import app from '../app';

const rippleEffect = {
    config: {
        ripples: [],
        numRipples: 3,
        maxRadius: 200,
        animationComplete: false,
        speed: 1,
    }
};

rippleEffect.setUp = () => {
  for (let i = 0; i < rippleEffect.config.numRipples; i++) {
    rippleEffect.config.ripples.push({
      radius: 0,
      baseSpeed: 1 + i * 0.5,
    });
  }
}

rippleEffect.start = ( x = 0, y = 0 ) => {
  setInterval( () => {
    rippleEffect.create( x, y );
  }, 20 );
}

rippleEffect.create = ( rippleX, rippleY ) => {
  // Calculate the area to clear
  let { ripples, numRipples, animationComplete, speed, maxRadius } = rippleEffect.config;
  let clearWidth = maxRadius * 2 + (numRipples - 1) * 40;
  let clearHeight = maxRadius * 2;
  const p = app.p;

  p.push();
  // Clear only the area used by the ripples
  p.fill(240);
  p.noStroke();
  p.rect(rippleX - 1, rippleY - clearHeight / 2, clearWidth, clearHeight);

  let allComplete = true;
  p.translate(rippleX, rippleY);

  for (let i = 0; i < ripples.length; i++) {
    let ripple = ripples[i];
    if (ripple.radius < maxRadius) {
      ripple.radius += ripple.baseSpeed * speed;
      allComplete = false;
    } else {
      ripple.radius = maxRadius; // Ensure the radius doesn't exceed maxRadius
    }

    // Black color with fading opacity
    let opacity = p.map(ripple.radius, 0, maxRadius, 255, 0);
    p.stroke(0, opacity);
    p.noFill();
    
    // Increased spacing between ripples
    let spacing = 40;
    p.arc(0, 0, (ripple.radius + i * spacing) * 2, (ripple.radius + i * spacing) * 2, -p.HALF_PI, p.HALF_PI);
  }

  if (allComplete && !animationComplete) {
    animationComplete = true;
    p.noLoop(); // Stop the animation when complete
  }

  p.pop(); // Restore the original transformation state
}

export default rippleEffect;