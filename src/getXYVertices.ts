import { topViewBlockSize } from "./constants"

export const getXYVertices = (address: { x: number; y: number }) => {
	const x = address.x * topViewBlockSize
	const y = address.y * topViewBlockSize
	return [
		{ x, y },
		{ x: x + topViewBlockSize, y },
		{ x: x + topViewBlockSize, y: y + topViewBlockSize },
		{ x, y: y + topViewBlockSize }
	]
}
