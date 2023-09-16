import { topViewLeft, topViewTop } from "./constants"

export const drawDot = (
	x: number,
	y: number,
	ctx: CanvasRenderingContext2D
) => {
	ctx.fillStyle = "red"
	ctx.beginPath()
	ctx.arc(topViewLeft + x, topViewTop + y, 1, 0, 2 * Math.PI)
	ctx.fill()
	ctx.closePath()
}
