export const limitAngle = (angle: number) => {
	if (angle > 359) {
		angle = 0
		return angle
	}
	if (angle < 0) {
		angle = 359
		return angle
	}
	return angle
}
