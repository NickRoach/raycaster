import {
	fieldOfViewAngle,
	raycastWidth,
	topViewBlockSize,
	topViewLeft,
	topViewTop,
	topViewWidth,
	torchColor,
	ySize
} from "./constants"
import { drawDot } from "./drawDot"
import { drawFloorAndSky } from "./drawFloorAndSky"
import { getBlockAddressXY } from "./getBlockAddress"
import { getDistance } from "./getDistance"
import { getDegrees, getRadians } from "./getRadians"
import { isOOR } from "./isOOR"
import { limitAngle } from "./limitAngle"
import { renderInRaycast } from "./renderInRaycast"
import { Block, Position } from "./types"

export const raycast = (
	position: Position,
	blockArray: [Block[]],
	ctx: CanvasRenderingContext2D
) => {
	drawFloorAndSky(ctx)
	// for every angle/column, we need the distance to the closest intersect with a solid block
	for (let column = 0; column < raycastWidth; column++) {
		// column offset from the center of the field of view
		const columnOffset = column - raycastWidth / 2
		// number of columns in a half
		const n = raycastWidth / 2
		// angle of half the field of view
		const theta = fieldOfViewAngle / 2
		// we know that for column n
		const yFactor = n / Math.tan(getRadians(theta))
		// now we can use that y factor for other columns
		const angleOffset = getDegrees(Math.atan(columnOffset / yFactor))

		const angle = limitAngle(position.angle + angleOffset)

		let intBlockH: Block
		let intBlockV: Block

		// find closest horizontalIntersect
		let foundIntXH: number
		let foundIntYH: number

		let searchEnd: boolean = false

		// works facing both up and down
		// sd is 1 if facing down. switch down
		const sd = angle > 90 && angle < 270 ? 1 : 0
		const su = sd === 0 ? 1 : 0
		// ssd is -1 when facing down. switch sign down
		const ssd = sd === 1 ? -1 : 1
		// y value of the first horizontal intercept
		const y1h =
			sd * topViewBlockSize + ssd * (position.y % topViewBlockSize)

		let i = 0
		while (!searchEnd) {
			const y = y1h + topViewBlockSize * i
			const x = y * Math.tan(getRadians(sd * 360 + ssd * angle))
			const intX = position.x + x
			const intY = position.y - ssd * y
			if (isOOR(intX, intY)) {
				searchEnd = true
				foundIntXH = intX
				foundIntYH = intY
			}
			if (!searchEnd) {
				const addr = getBlockAddressXY(
					intX,
					intY + topViewBlockSize / 2
				)
				const block = blockArray[addr.x][addr.y - su]
				const state = block.state
				if (state) {
					searchEnd = true
					foundIntXH = intX
					foundIntYH = intY
					intBlockH = block
				}
				i++
			}
		}

		// find closest verticalIntersect
		// works looking either left or right

		// sv is for "switch left". It is 1 when looking left
		const sl = angle < 360 && angle > 180 ? 1 : 0
		const sr = sl === 0 ? 1 : 0
		// ssl is for "sign flip left". It is -1 when looking left
		const ssl = sl === 1 ? -1 : 1

		let foundIntXV: number
		let foundIntYV: number
		// x value of the first vertical intercept
		const x1v =
			sr * topViewBlockSize - ssl * (position.x % topViewBlockSize)

		searchEnd = false
		let j = 0
		while (!searchEnd) {
			// horizontal distance to next x intercept
			const x = x1v + topViewBlockSize * j
			// vertical distance to that intercept
			const y = x / Math.tan(getRadians(angle))

			const intX = position.x + x * ssl
			const intY = position.y - y * ssl

			if (isOOR(intX, intY)) {
				searchEnd = true
				foundIntXV = intX
				foundIntYV = intY
			}
			if (!searchEnd) {
				const addr = getBlockAddressXY(
					intX + topViewBlockSize / 2,
					intY
				)
				const block = blockArray[addr.x + ssl * sl][addr.y]
				const state = block.state
				if (state) {
					searchEnd = true
					foundIntXV = intX
					foundIntYV = intY
					intBlockV = block
				}
				j++
			}
		}

		const vDistance = getDistance(foundIntXV, foundIntYV, position)
		const hDistance = getDistance(foundIntXH, foundIntYH, position)
		let foundIntX: number
		let foundIntY: number
		let foundIntBlock: Block

		if (vDistance < hDistance) {
			foundIntX = foundIntXV
			foundIntY = foundIntYV
			foundIntBlock = intBlockV
		} else {
			foundIntX = foundIntXH
			foundIntY = foundIntYH
			foundIntBlock = intBlockH
		}

		const isEdge =
			(foundIntX % topViewBlockSize < 0.1 ||
				foundIntX % topViewBlockSize > topViewBlockSize - 0.1) &&
			(foundIntY % topViewBlockSize < 0.1 ||
				foundIntY % topViewBlockSize > topViewBlockSize - 0.1)

		/////////////////////////////////////////////////////////////

		// draw torch light in topView
		ctx.strokeStyle = torchColor
		ctx.beginPath()
		ctx.moveTo(topViewLeft + position.x, topViewTop + position.y)
		ctx.lineTo(topViewLeft + foundIntX, topViewTop + foundIntY)
		ctx.stroke()
		ctx.closePath()
		if (!foundIntBlock)
			foundIntBlock = {
				state: false,
				color: "#000000",
				transparency: 0
			}
		renderInRaycast(
			foundIntX,
			foundIntY,
			foundIntBlock,
			position,
			angle,
			column,
			isEdge,
			ctx
		)
	}
}
