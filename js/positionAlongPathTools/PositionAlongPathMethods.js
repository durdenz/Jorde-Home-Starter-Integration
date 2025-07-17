export function handleScroll(event, positionAlongPathState) {
	const changeInScroll = Math.sign(event.deltaY);
  
	const newTarget = positionAlongPathState.targetDistance + (changeInScroll / positionAlongPathState.lengthToScroll);
  
	// Clamp between 0 and 1
	if (newTarget < 0 || newTarget > .5) {
	  return; // 🔒 Do not allow further scroll updates
	}
  
	positionAlongPathState.lastScrollTime = performance.now();
	positionAlongPathState.startingDistance = positionAlongPathState.currentDistanceOnPath;
	positionAlongPathState.targetDistance = newTarget;
  }
  
  

  export function updatePosition(curvePath, object, positionAlongPathState) {
	const timeElapsed = performance.now() - positionAlongPathState.lastScrollTime;
  
	if (timeElapsed < positionAlongPathState.movementDuration) {
	  const timeLeftPercentage = timeElapsed / positionAlongPathState.movementDuration;
	  const interpolationFactor = Math.min(Math.max(timeLeftPercentage, 0.005), 0.9);
  
	  const interpolated = (1 - interpolationFactor) * positionAlongPathState.startingDistance +
						   interpolationFactor * positionAlongPathState.targetDistance;
  
	  const previous = positionAlongPathState.currentDistanceOnPath;
	  positionAlongPathState.currentDistanceOnPath = interpolated;
  
	  // Only update if movement actually occurred
	  if (Math.abs(previous - interpolated) > 0.0001) {
		let percentage = interpolated;
		if (percentage < 0) {
		  percentage = 1 - (Math.abs(percentage) % 1);
		} else {
		  percentage = percentage % 1;
		}
  
		positionAlongPathState.currentPercentageOnPath = percentage;
  
		const newPosition = curvePath.curve.getPointAt(percentage);
		const lookAt = curvePath.curve.getPointAt(Math.max(percentage - 0.00001, 0));
  
		object.position.copy(newPosition);
		object.lookAt(lookAt);
	  }
	}
  }
  
