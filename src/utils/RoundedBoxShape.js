import * as THREE from 'three';

export const RoundedBoxShape = (width, height, radius) => {
	radius = Math.min(radius, width / 2, height / 2);

	const roundedBoxShape = new THREE.Shape()
		.moveTo(-width / 2, radius - height / 2)
		.quadraticCurveTo(-width / 2, -height / 2, radius - width / 2, -height / 2)
		.lineTo(width / 2 - radius, -height / 2)
		.quadraticCurveTo(width / 2, -height / 2, width / 2, radius - height / 2)
		.lineTo(width / 2, height / 2 - radius)
		.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2)
		.lineTo(radius - width / 2, height / 2)
		.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - radius)
		.lineTo(-width / 2, radius - height / 2);

	return roundedBoxShape;
};
