import {
	topViewHeight,
	topViewWidth,
	darkenPower,
	rD,
	gD,
	bD,
	raycastHeight,
	raycastLeft,
	raycastTop
} from "./constants"
import { getDistance } from "./getDistance"
import { Block, Position } from "./types"

export const renderInRaycast = (
	foundIntX: number,
	foundIntY: number,
	foundIntBlock: Block,
	position: Position,
	column: number,
	ctx: CanvasRenderingContext2D
) => {
	// render in the raycast view
	let distance = getDistance(foundIntX, foundIntY, position)

	const fullDarkDistance = Math.sqrt(
		topViewHeight * topViewHeight + topViewWidth * topViewWidth
	)
	const f = Math.pow(
		(fullDarkDistance - distance) / fullDarkDistance,
		darkenPower
	)

	ctx.beginPath()
	const color = foundIntBlock ? foundIntBlock.color : "red"

	const r = Number(`0x${color.slice(1, 3)}`)
	const g = Number(`0x${color.slice(3, 5)}`)
	const b = Number(`0x${color.slice(5, 7)}`)

	const getDistanceColor = (c: number, d: number, f: number) => {
		return c * f + (d - d * f)
	}

	const rA = getDistanceColor(r, rD, f)
	const gA = getDistanceColor(g, gD, f)
	const bA = getDistanceColor(b, bD, f)

	const darkenedColor = `rgb(${rA},${gA},${bA})`

	ctx.strokeStyle = darkenedColor
	const lineHeight = Math.min(
		20000 / getDistance(foundIntX, foundIntY, position),
		raycastHeight
	)

	const yCenter = raycastTop + raycastHeight / 2
	const x = raycastLeft + column + 1
	ctx.lineWidth = 2
	ctx.moveTo(x, yCenter + lineHeight / 2)
	ctx.lineTo(x, yCenter - lineHeight / 2)
	ctx.stroke()
	ctx.closePath()
}
