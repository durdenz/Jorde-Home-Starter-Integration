export function handleScroll(event, positionAlongPathState) {
	positionAlongPathState.lastScrollTime = performance.now();

	// When a new scroll starts, set the starting distance
	positionAlongPathState.startingDistance = positionAlongPathState.currentDistanceOnPath;

	const changeInScroll = Math.sign(event.deltaY);
	positionAlongPathState.targetDistance += changeInScroll / positionAlongPathState.lengthToScroll;
}

export function updatePosition(curvePath, object, positionAlongPathState) {
	if (!curvePath || !curvePath.curve || typeof curvePath.curve.getPointAt !== 'function') {
		console.warn("Invalid curvePath or curve.");
		return;
	}

	const timeElapsed = performance.now() - positionAlongPathState.lastScrollTime;

	if (timeElapsed < positionAlongPathState.movementDuration) {
		// Clamp and interpolate position along the path
		const timeLeftPercentage = timeElapsed / positionAlongPathState.movementDuration;
		const interpolationFactor = Math.min(Math.max(timeLeftPercentage, 0.005), 0.9);

		const interpolatedPositionOnPath =
			(1 - interpolationFactor) * positionAlongPathState.startingDistance +
			interpolationFactor * positionAlongPathState.targetDistance;

		positionAlongPathState.currentDistanceOnPath = interpolatedPositionOnPath;

		let percentage = interpolatedPositionOnPath % 1;
		if (percentage < 0) percentage = 1 + percentage; // Handle negative looping

		positionAlongPathState.currentPercentageOnPath = percentage;

		// Small offset for lookAt target
		let lookAtPosition = (percentage - 0.0001 + 1) % 1;

		const newPosition = curvePath.curve.getPointAt(percentage);
		const newLookAt = curvePath.curve.getPointAt(lookAtPosition);

		if (!newPosition || !newLookAt) {
			console.warn("getPointAt returned undefined:", { percentage, lookAtPosition });
			return;
		}

		object.position.copy(newPosition);
		object.lookAt(newLookAt);
	}
}
