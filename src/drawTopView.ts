import {
	topViewBackgroundColor,
	topViewGridColor,
	topViewGridLineWidth,
	topViewBlockColor,
	topViewBlockSize,
	topViewBorderWidth,
	topViewLeft,
	topViewTop,
	xSize,
	ySize,
	backgroundColor,
	viewBoundryLineColor,
	fieldOfViewAngle,
	characterColor,
	viewBoundryLineLength
} from "./constants"
import { drawGridlines } from "./drawGridlines"
import { drawTopViewBlocks } from "./drawTopViewBlocks"
import { getRadians } from "./getRadians"
import { Block, Position } from "./types"

export const drawTopView = (
	blockArray: [Block[]],
	ctx: CanvasRenderingContext2D,
	position: Position
) => {
	ctx.fillStyle = backgroundColor
	ctx.beginPath()
	// clear the topView display
	ctx.fillRect(
		topViewLeft - topViewBorderWidth,
		topViewTop - topViewBorderWidth,
		topViewBlockSize * xSize + topViewBorderWidth * 2,
		topViewBlockSize * ySize + topViewBorderWidth * 2
	)
	ctx.closePath()

	ctx.fillStyle = topViewBackgroundColor
	ctx.beginPath()
	// draw topViewBackground
	ctx.fillRect(
		topViewLeft,
		topViewTop,
		topViewBlockSize * xSize,
		topViewBlockSize * ySize
	)
	ctx.closePath()

	drawTopViewBlocks(ctx, blockArray)

	drawGridlines(ctx, blockArray)

	// draw field of view indicator
	ctx.strokeStyle = viewBoundryLineColor
	ctx.beginPath()
	ctx.moveTo(topViewLeft + position.x, topViewTop + position.y)
	ctx.lineTo(
		topViewLeft +
			position.x +
			viewBoundryLineLength *
				-Math.sin(getRadians(-position.angle - fieldOfViewAngle / 2)),
		topViewTop +
			position.y +
			viewBoundryLineLength *
				-Math.cos(getRadians(-position.angle - fieldOfViewAngle / 2))
	)
	ctx.stroke()
	ctx.closePath()

	ctx.beginPath()
	ctx.moveTo(topViewLeft + position.x, topViewTop + position.y)
	ctx.lineTo(
		topViewLeft +
			position.x -
			viewBoundryLineLength *
				Math.sin(getRadians(-position.angle + fieldOfViewAngle / 2)),
		topViewTop +
			position.y -
			viewBoundryLineLength *
				Math.cos(getRadians(-position.angle + fieldOfViewAngle / 2))
	)
	ctx.stroke()
	ctx.closePath()

	// draw character
	ctx.fillStyle = characterColor
	ctx.beginPath()
	ctx.arc(
		topViewLeft + position.x,
		topViewTop + position.y,
		3,
		0,
		2 * Math.PI
	)
	ctx.fill()
	ctx.closePath()
}
