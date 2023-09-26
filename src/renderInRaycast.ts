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
	edgeDarken,
	topViewLeft,
	topViewTop
} from "./constants"
import { getDegrees, getRadians } from "./getRadians"
import { getVertices } from "./getVertices"
import { limitAngle } from "./limitAngle"
import { Position, RenderedBlock, Vertical } from "./types"

export const renderInRaycast = (
	verticals: Vertical[],
	position: Position,
	yFactor: number,
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

	const yCenter = raycastTop + raycastHeight / 2
	const distanceToFillFov =
		topViewBlockSize / 2 / Math.tan(getRadians(fieldOfViewAngle / 2))

	const sortedVerts = verticals.sort((a, b) => {
		return b.blockDistance - a.blockDistance
	})

	// keep a list of the blocks for which a top or bottom has already been rendered
	let topsAndBottoms: RenderedBlock = {}

	// render in the raycast view
	for (let vert of sortedVerts) {
		////// render vertical //////
		const { block, column, angle, intAngle, distance, isEdge, address } =
			vert

		// angle from the center of the field of view to the angle of the vertical. Maximum is FOV/2
		const theta = getRadians(angle - position.angle)
		const distanceCor = distance * Math.cos(theta)

		const fullDarkDistance = Math.sqrt(
			topViewHeight * topViewHeight + topViewWidth * topViewWidth
		)
		let f = Math.pow(
			(fullDarkDistance - distanceCor) / fullDarkDistance,
			darkenPower
		)

		const color = block.color
		if (isEdge) f = f / edgeDarken

		const r = Number(`0x${color.slice(1, 3)}`)
		const g = Number(`0x${color.slice(3, 5)}`)
		const b = Number(`0x${color.slice(5, 7)}`)

		const rDist = getDistanceColor(r, rD, f)
		const gDist = getDistanceColor(g, gD, f)
		const bDist = getDistanceColor(b, bD, f)

		const shadeF = Math.pow(Math.sin(getRadians(intAngle)), shadePower)

		const rA = getShadedColor(rDist, shadeF)
		const gA = getShadedColor(gDist, shadeF)
		const bA = getShadedColor(bDist, shadeF)

		const darkenedColor = `rgb(${rA},${gA},${bA},${
			block.transparency.toString() || "1"
		})`

		ctx.strokeStyle = darkenedColor

		const blockUnitHeight = (distanceToFillFov / distanceCor) * raycastWidth
		const xPos = raycastLeft + column + 1
		const lineHeight = blockUnitHeight * (block.height ?? 1)
		const lineBottom =
			yCenter + blockUnitHeight * (position.height - block.base ?? 0)
		const lineTop = lineBottom - lineHeight
		ctx.lineWidth = 2
		if (lineTop < raycastTop + raycastHeight && lineBottom > raycastTop) {
			ctx.beginPath()
			// bottom of vertical line
			ctx.moveTo(xPos, Math.min(lineBottom, raycastTop + raycastHeight))
			// top of vertical line
			ctx.lineTo(xPos, Math.max(lineTop, raycastTop))
			ctx.stroke()
			ctx.closePath()
		}
		////// render top or bottom //////
		// check if we need to render the top of the block
		const renderTop = position.height > block.base + block.height
		// check if we need to render the bottom of the block
		const renderBottom = position.height < block.base

		// check if we've already rendered the top or bottom of this block
		const key = `${address.x},${address.y}`
		if (!topsAndBottoms[key]) {
			topsAndBottoms[key] = true
			const vertices = getVertices(address)
			let faceCorners = []
			for (let i = 0; i < vertices.length; i++) {
				const v = vertices[i]

				const xOffset = v.x - position.x
				const yOffset = position.y - v.y
				// these work only while looking north

				// angle between zero and the vertex
				const alpha = getDegrees(Math.atan(xOffset / yOffset))

				// necessary while looking south
				const corrector = v.y > position.y ? 1 : 0

				// angle from the center of the field of view to the vertex. It corresponds to the column
				const vertTheta = getRadians(
					alpha - position.angle + 180 * corrector
				)

				const calcColumn =
					raycastLeft +
					Math.round(
						yFactor * Math.tan(vertTheta) + raycastWidth / 2
					) +
					1

				const vertDistance = Math.sqrt(
					xOffset * xOffset + yOffset * yOffset
				)

				const vertDistanceCor = vertDistance * Math.cos(vertTheta)

				const blockUnitHeight =
					(distanceToFillFov / vertDistanceCor) * raycastWidth
				const vertHeight = blockUnitHeight * block.height
				const vertBottom =
					yCenter + blockUnitHeight * (position.height - block.base)
				const vertTop = vertBottom - vertHeight

				if (renderTop) {
					faceCorners.push({ x: calcColumn, y: vertTop })
				} else {
					faceCorners.push({ x: calcColumn, y: vertBottom })
				}
			}
			const doRender = faceCorners.filter(
				(corner) =>
					corner.x > raycastLeft &&
					corner.x < raycastLeft + raycastWidth &&
					corner.y < raycastTop + raycastHeight - 1 &&
					corner.y > raycastTop
			)

			if (doRender.length === 4) {
				ctx.beginPath()
				ctx.fillStyle = block.color
				ctx.moveTo(faceCorners[0].x, faceCorners[0].y)
				ctx.lineTo(faceCorners[1].x, faceCorners[1].y)
				ctx.lineTo(faceCorners[2].x, faceCorners[2].y)
				ctx.lineTo(faceCorners[3].x, faceCorners[3].y)
				ctx.fill()
				ctx.closePath()
			}
		}
	} // end of for loop
	// debugger
}
