import {
	topViewHeight,
	topViewWidth,
	darkenPower,
	rD,
	gD,
	bD,
	raycastHeight,
	raycastLeft,
	raycastTop,
	fieldOfViewAngle,
	raycastWidth,
	topViewBlockSize
} from "./constants"
import { getRadians } from "./getRadians"
import { Position, Vertical } from "./types"

export const renderInRaycast = (
	verticals: Vertical[],
	position: Position,
	ctx: CanvasRenderingContext2D
) => {
	const sortedVerts = verticals.sort((a, b) => {
		return b.distance - a.distance
	})
	// render in the raycast view
	for (let vert of sortedVerts) {
		const { x, y, block, column, angle, distance, isEdge } = vert
		const theta = getRadians(vert.angle - position.angle - 360)
		// distortion correction
		const distanceCor = distance * Math.cos(theta)

		const fullDarkDistance = Math.sqrt(
			topViewHeight * topViewHeight + topViewWidth * topViewWidth
		)
		let f = Math.pow(
			(fullDarkDistance - distanceCor) / fullDarkDistance,
			darkenPower
		)

		ctx.beginPath()
		const color = block.color
		if (isEdge) f = f / 1.1

		const r = Number(`0x${color.slice(1, 3)}`)
		const g = Number(`0x${color.slice(3, 5)}`)
		const b = Number(`0x${color.slice(5, 7)}`)

		const getDistanceColor = (c: number, d: number, f: number) => {
			return c * f + (d - d * f)
		}

		const rA = getDistanceColor(r, rD, f)
		const gA = getDistanceColor(g, gD, f)
		const bA = getDistanceColor(b, bD, f)

		const darkenedColor = `rgb(${rA},${gA},${bA},${
			block.transparency.toString() || "1"
		})`

		ctx.strokeStyle = darkenedColor
		const distanceToFillFov =
			topViewBlockSize / 2 / Math.tan(getRadians(fieldOfViewAngle / 2))
		const blockUnitHeight = (distanceToFillFov / distanceCor) * raycastWidth
		const lineHeight = blockUnitHeight * (block.height ?? 1)

		const yCenter = raycastTop + raycastHeight / 2
		const xPos = raycastLeft + column + 1
		const lineBottom = yCenter + blockUnitHeight * position.height
		const lineTop = lineBottom - lineHeight
		ctx.lineWidth = 2
		// bottom
		ctx.moveTo(xPos, Math.min(lineBottom, raycastTop + raycastHeight))
		// top
		ctx.lineTo(xPos, Math.max(lineTop, raycastTop))
		ctx.stroke()
		ctx.closePath()
	}
}
