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
	topViewBlockSize,
	shadePower,
	edgeDarken
} from "./constants"
import { getRadians } from "./getRadians"
import { Position, Vertical } from "./types"

export const renderInRaycast = (
	verticals: Vertical[],
	position: Position,
	ctx: CanvasRenderingContext2D
) => {
	// this mixes two colors in the ratio given by f. c is color 1, d is color 2
	const getDistanceColor = (c: number, d: number, f: number) => {
		return c * f + (d - d * f)
	}

	// this darkens the color by the factor given by f
	const getShadedColor = (c: number, shadeF: number) => {
		return c * shadeF
	}

	const sortedVerts = verticals.sort((a, b) => {
		return b.distance - a.distance
	})
	// render in the raycast view
	for (let vert of sortedVerts) {
		const { block, column, angle, intAngle, distance, isEdge } = vert
		const theta = getRadians(angle - position.angle - 360)
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
		if (isEdge) f = f / edgeDarken

		const r = Number(`0x${color.slice(1, 3)}`)
		const g = Number(`0x${color.slice(3, 5)}`)
		const b = Number(`0x${color.slice(5, 7)}`)

		const rDist = getDistanceColor(r, rD, f)
		const gDist = getDistanceColor(g, gD, f)
		const bDist = getDistanceColor(b, bD, f)

		const shadeF = Math.pow(Math.sin(getRadians(vert.intAngle)), shadePower)

		const rA = getShadedColor(rDist, shadeF)
		const gA = getShadedColor(gDist, shadeF)
		const bA = getShadedColor(bDist, shadeF)

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
		if (lineTop < raycastTop + raycastHeight) {
			// bottom
			ctx.moveTo(xPos, Math.min(lineBottom, raycastTop + raycastHeight))
			// top
			ctx.lineTo(xPos, Math.max(lineTop, raycastTop))
			ctx.stroke()
			ctx.closePath()
		}
	}
}
