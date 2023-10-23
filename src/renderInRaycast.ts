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
import { getDegrees, getRadians } from "./getRadians"
import { getVertices } from "./getVertices"
import { Block, BlocksToRender, Position } from "./types"

export const renderInRaycast = (
	blockArray: [Block[]],
	blocksToRender: BlocksToRender,
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

	const sortedBlockArray = Object.values(blocksToRender).sort((a, b) => {
		return b.distance - a.distance
	})

	// render in the raycast view
	for (let blockToRender of sortedBlockArray) {
		////// render block //////
		const { distance, address } = blockToRender
		const block = blockArray[address.x][address.y]

		const fullDarkDistance = Math.sqrt(
			topViewHeight * topViewHeight + topViewWidth * topViewWidth
		)
		// let f = Math.pow(
		// 	(fullDarkDistance - distanceCor) / fullDarkDistance,
		// 	darkenPower
		// )
		let f = Math.pow(
			(fullDarkDistance - distance) / fullDarkDistance,
			darkenPower
		)

		const color = block.color

		const r = Number(`0x${color.slice(1, 3)}`)
		const g = Number(`0x${color.slice(3, 5)}`)
		const b = Number(`0x${color.slice(5, 7)}`)

		const rDist = getDistanceColor(r, rD, f)
		const gDist = getDistanceColor(g, gD, f)
		const bDist = getDistanceColor(b, bD, f)

		// 	const shadeF = Math.pow(Math.sin(getRadians(intAngle)), shadePower)

		// 	const rA = getShadedColor(rDist, shadeF)
		// 	const gA = getShadedColor(gDist, shadeF)
		// 	const bA = getShadedColor(bDist, shadeF)

		// 	const darkenedColor = `rgb(${rA},${gA},${bA},${
		// 		block.transparency.toString() || "1"
		// 	})`

		// 	ctx.strokeStyle = darkenedColor

		// 	const blockUnitHeight = (distanceToFillFov / distanceCor) * raycastWidth
		// 	const xPos = raycastLeft + column + 1
		// 	const lineHeight = blockUnitHeight * (block.height ?? 1)
		// 	const lineBottom =
		// 		yCenter + blockUnitHeight * (position.height - block.base ?? 0)
		// 	const lineTop = lineBottom - lineHeight
		// 	ctx.lineWidth = 2
		// 	if (lineTop < raycastTop + raycastHeight && lineBottom > raycastTop) {
		// 		ctx.beginPath()
		// 		// bottom of vertical line
		// 		ctx.moveTo(xPos, Math.min(lineBottom, raycastTop + raycastHeight))
		// 		// top of vertical line
		// 		ctx.lineTo(xPos, Math.max(lineTop, raycastTop))
		// 		ctx.stroke()
		// 		ctx.closePath()
		// 	}

		// 	////// render top or bottom //////

		const vertices = getVertices(address)
		let bottomCorners = []
		let topCorners = []
		for (let i = 0; i < vertices.length; i++) {
			const v = vertices[i]

			const xOffset = v.x - position.x
			const yOffset = position.y - v.y

			// 		// angle between zero and the vertex
			const alpha = getDegrees(Math.atan(xOffset / yOffset))

			// 		// necessary while looking south
			const corrector = v.y > position.y ? 1 : 0

			// 		// angle from the center of the field of view to the vertex. It corresponds to the column
			const vertTheta = getRadians(
				alpha - position.angle + 180 * corrector
			)

			const calcColumn =
				raycastLeft +
				Math.round(yFactor * Math.tan(vertTheta) + raycastWidth / 2) +
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

			topCorners.push({ x: calcColumn, y: vertTop })

			bottomCorners.push({ x: calcColumn, y: vertBottom })
		}

		if (bottomCorners.length === 4) {
			// this part fixes a bug where the top of a block is rendered badly when the player passes over the top of it
			let cornersAbove = 0
			let cornersBelow = 0
			let cornersLeft = 0
			let cornersRight = 0
			for (const corner of bottomCorners) {
				if (corner.y > raycastTop + raycastHeight - 1) {
					cornersAbove++
				}
				if (corner.y < raycastTop + 1) {
					cornersBelow++
				}
				if (corner.x < raycastLeft + 1) {
					cornersLeft++
				}
				if (corner.x > raycastLeft + raycastWidth - 1) {
					cornersRight++
				}
			}

			if (
				!(cornersBelow > 0 && cornersAbove > 0) &&
				!(cornersLeft > 0 && cornersRight > 0)
			) {
				// render the top or bottom of the block
				ctx.fillStyle = `rgb(${rDist},${gDist},${bDist},${
					block.transparency.toString() || "1"
				})`
				ctx.beginPath()
				ctx.moveTo(bottomCorners[0].x, bottomCorners[0].y)
				for (let i = 1; i < bottomCorners.length; i++) {
					ctx.lineTo(bottomCorners[i].x, bottomCorners[i].y)
				}
				ctx.fill()
				ctx.closePath()
			}
		}

		if (topCorners.length === 4) {
			// this part fixes a bug where the top of a block is rendered badly when the player passes over the top of it
			let cornersAbove = 0
			let cornersBelow = 0
			let cornersLeft = 0
			let cornersRight = 0
			for (const corner of topCorners) {
				if (corner.y > raycastTop + raycastHeight - 1) {
					cornersAbove++
				}
				if (corner.y < raycastTop + 1) {
					cornersBelow++
				}
				if (corner.x < raycastLeft + 1) {
					cornersLeft++
				}
				if (corner.x > raycastLeft + raycastWidth - 1) {
					cornersRight++
				}
			}

			if (
				!(cornersBelow > 0 && cornersAbove > 0) &&
				!(cornersLeft > 0 && cornersRight > 0)
			) {
				// render the top or bottom of the block
				ctx.fillStyle = `rgb(${rDist},${gDist},${bDist},${
					block.transparency.toString() || "1"
				})`
				ctx.beginPath()
				ctx.moveTo(topCorners[0].x, topCorners[0].y)
				for (let i = 1; i < topCorners.length; i++) {
					ctx.lineTo(topCorners[i].x, topCorners[i].y)
				}
				ctx.fill()
				ctx.closePath()
			}
		}
	} // end of for loop
}
