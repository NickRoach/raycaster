export const getRadians = (degrees: number) => {
	return (degrees * Math.PI) / 180
}

export const getDegrees = (radians: number) => {
	return radians * (180 / Math.PI)
}
