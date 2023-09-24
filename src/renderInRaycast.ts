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
import { getDistance } from "./getDistance"
import { getRadians } from "./getRadians"
import { Block, Position } from "./types"

export const renderInRaycast = (
	foundIntX: number,
	foundIntY: number,
	foundIntBlock: Block,
	position: Position,
	angle: number,
	column: number,
	isEdge: boolean,
	ctx: CanvasRenderingContext2D
) => {
	// render in the raycast view
	let distance = getDistance(foundIntX, foundIntY, position)
	const theta = getRadians(angle - position.angle - 360)
	// distortion correction
	distance = distance * Math.cos(theta)

	const fullDarkDistance = Math.sqrt(
		topViewHeight * topViewHeight + topViewWidth * topViewWidth
	)
	let f = Math.pow(
		(fullDarkDistance - distance) / fullDarkDistance,
		darkenPower
	)

	ctx.beginPath()
	const color = foundIntBlock.color
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
		foundIntBlock.transparency.toString() || "1"
	})`

	ctx.strokeStyle = darkenedColor
	const distanceToFillFov =
		topViewBlockSize / 2 / Math.tan(getRadians(fieldOfViewAngle / 2))
	const blockUnitHeight = (distanceToFillFov / distance) * raycastWidth
	const lineHeight = blockUnitHeight * (foundIntBlock.height ?? 1)

	const yCenter = raycastTop + raycastHeight / 2
	const x = raycastLeft + column + 1
	const lineBottom = yCenter + blockUnitHeight * position.height
	const lineTop = lineBottom - lineHeight
	ctx.lineWidth = 2
	// bottom
	ctx.moveTo(x, Math.min(lineBottom, raycastTop + raycastHeight))
	// top
	ctx.lineTo(x, Math.max(lineTop, raycastTop))
	ctx.stroke()
	ctx.closePath()
}
