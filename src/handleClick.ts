import {
	topViewLeft,
	topViewTop,
	topViewWidth,
	topViewHeight,
	topViewBlockSize
} from "./constants"
import { drawTopView } from "./drawTopView"
import { Block, Position } from "./types"

export const handleClick = (
	e: MouseEvent,
	blockArray: [Block[]],
	ctx: CanvasRenderingContext2D,
	position: Position
) => {
	const { pageX, pageY } = e
	console.log(position)

	const isClickInTopView = () => {
		if (
			pageX > topViewLeft &&
			pageY > topViewTop &&
			pageX < topViewLeft + topViewWidth &&
			pageY < topViewTop + topViewHeight
		) {
			return true
		}
		return false
	}

	if (isClickInTopView()) {
		const blockX = Math.floor((pageX - topViewLeft) / topViewBlockSize)
		const blockY = Math.floor((pageY - topViewTop) / topViewBlockSize)
		blockArray[blockX][blockY].state = !blockArray[blockX][blockY].state
		drawTopView(blockArray, ctx, position)
	}
}
