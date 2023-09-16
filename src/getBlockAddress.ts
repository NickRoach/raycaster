import { topViewWidth, xSize, topViewHeight, ySize } from "./constants"
import { Position } from "./types"

export const getBlockAddress = (position: Position) => {
	return {
		x: Math.floor((position.x / topViewWidth) * xSize),
		y: Math.floor((position.y / topViewHeight) * ySize)
	}
}

export const getBlockAddressXY = (x: number, y: number) => {
	return getBlockAddress({
		x,
		y,
		angle: 0
	})
}
