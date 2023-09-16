import { Position } from "./types"

export const getDistance = (intX: number, intY: number, position: Position) => {
	const x = intX - position.x
	const y = intY - position.y
	return Math.sqrt(x * x + y * y)
}
