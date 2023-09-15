export const limitAngle = (angle: number) => {
	if (angle >= 360) {
		angle -= 360
		return angle
	}
	if (angle < 0) {
		angle += 360
		return angle
	}
	return angle
}
