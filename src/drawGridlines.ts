import {
	topViewGridColor,
	topViewGridLineWidth,
	topViewLeft,
	topViewBlockSize,
	topViewTop
} from "./constants"
import { Block } from "./types"

export const drawGridlines = (
	ctx: CanvasRenderingContext2D,
	blockArray: [Block[]]
) => {
	// draw gridlines
	ctx.strokeStyle = topViewGridColor
	ctx.lineWidth = topViewGridLineWidth
	// vertical
	for (let x = 0; x <= blockArray.length; x++) {
		ctx.beginPath()
		ctx.moveTo(topViewLeft + x * topViewBlockSize, topViewTop)
		ctx.lineTo(
			topViewLeft + x * topViewBlockSize,
			topViewTop + blockArray[0].length * topViewBlockSize
		)
		ctx.stroke()
		ctx.closePath()
	}
	// horizontal
	for (let y = 0; y <= blockArray[0].length; y++) {
		ctx.beginPath()
		ctx.moveTo(topViewLeft, topViewTop + y * topViewBlockSize)
		ctx.lineTo(
			topViewLeft + blockArray.length * topViewBlockSize,
			topViewTop + y * topViewBlockSize
		)
		ctx.stroke()
		ctx.closePath()
	}
}
