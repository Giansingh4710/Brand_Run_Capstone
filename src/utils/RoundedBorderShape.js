import * as THREE from 'three';

export const RoundedBorderShape = (width, height, radius, borderThickness) => {
    // Ensure that the radius is not too large for the given dimensions
    radius = Math.min(radius, (width - borderThickness * 2) / 2, (height - borderThickness * 2) / 2);

    // Create the outer shape (larger, for the border)
    const outerWidth = width + borderThickness * 2;
    const outerHeight = height + borderThickness * 2;
    const outerShape = new THREE.Shape()
        .moveTo(-outerWidth / 2, radius - outerHeight / 2)
        .quadraticCurveTo(-outerWidth / 2, -outerHeight / 2, radius - outerWidth / 2, -outerHeight / 2)
        .lineTo(outerWidth / 2 - radius, -outerHeight / 2)
        .quadraticCurveTo(outerWidth / 2, -outerHeight / 2, outerWidth / 2, radius - outerHeight / 2)
        .lineTo(outerWidth / 2, outerHeight / 2 - radius)
        .quadraticCurveTo(outerWidth / 2, outerHeight / 2, outerWidth / 2 - radius, outerHeight / 2)
        .lineTo(radius - outerWidth / 2, outerHeight / 2)
        .quadraticCurveTo(-outerWidth / 2, outerHeight / 2, -outerWidth / 2, outerHeight / 2 - radius)
        .lineTo(-outerWidth / 2, radius - outerHeight / 2);

    // Create the inner shape (hole) similar to the original shape but inset by the border thickness
    const innerShape = new THREE.Shape()
        .moveTo(-width / 2, radius - height / 2)
        .quadraticCurveTo(-width / 2, -height / 2, radius - width / 2, -height / 2)
        .lineTo(width / 2 - radius, -height / 2)
        .quadraticCurveTo(width / 2, -height / 2, width / 2, radius - height / 2)
        .lineTo(width / 2, height / 2 - radius)
        .quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2)
        .lineTo(radius - width / 2, height / 2)
        .quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - radius)
        .lineTo(-width / 2, radius - height / 2);

    // Add the inner shape as a hole to the outer shape to create the border
    outerShape.holes.push(innerShape);

    return outerShape;
};
