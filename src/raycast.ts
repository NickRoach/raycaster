import {
	fieldOfViewAngle,
	raycastWidth,
	topViewBlockSize,
	topViewLeft,
	topViewTop,
	topViewWidth
} from "./constants"
import { drawDot } from "./drawDot"
import { drawFloorAndSky } from "./drawFloorAndSky"
import { getBlockAddressXY } from "./getBlockAddress"
import { getDistance } from "./getDistance"
import { getRadians } from "./getRadians"
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
	const angleInc = fieldOfViewAngle / raycastWidth
	const startAngle = limitAngle(position.angle - fieldOfViewAngle / 2)

	// for every angle/column, we need the distance to the closest intersect with a solid block
	for (let column = 0; column < raycastWidth - 1; column++) {
		const angle = limitAngle(startAngle + angleInc * column)

		// for (
		// 	let column = raycastWidth / 2;
		// 	column < raycastWidth - 1;
		// 	column += raycastWidth
		// ) {
		// 	const angle = limitAngle(position.angle)

		let intBlockH: Block
		let intBlockV: Block

		// find closest horizontalIntersect
		let foundIntXH: number = 10000
		let foundIntYH: number = 10000

		let searchEnd: boolean = false

		// works facing both up and down
		// sd is 1 if facing down. switch down
		const sd = angle > 90 && angle < 270 ? 1 : 0
		const su = sd === 1 ? 0 : 1
		// ssd is -1 when facing down. switch sign down
		const ssd = sd === 1 ? -1 : 1

		searchEnd = false
		const y1h =
			sd * topViewBlockSize + ssd * (position.y % topViewBlockSize)
		let i = 0
		while (!searchEnd) {
			const y = y1h + topViewBlockSize * i
			const x = y * Math.tan(getRadians(sd * 360 + ssd * angle))
			const intX = position.x + x
			const intY = position.y - ssd * y
			if (isOOR(intX, intY)) searchEnd = true
			if (!searchEnd) {
				const addr = getBlockAddressXY(intX, intY)
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
		const sl = angle < 359 && angle > 180 ? 1 : 0
		const sr = sl === 0 ? 1 : 0
		// ssl is for "sign flip left". It is -1 when looking left
		const ssl = sl === 1 ? -1 : 1

		let foundIntXV: number = 10000
		let foundIntYV: number = 10000
		searchEnd = false
		const x1v =
			sr * topViewBlockSize - ssl * (position.x % topViewBlockSize)

		let j = 0
		while (!searchEnd) {
			// horizontal distance to next x intercept
			const x = x1v + topViewBlockSize * j
			// vertical distance to that intercept
			const y = x / Math.tan(getRadians(angle))

			const intX = position.x + x * ssl
			const intY = position.y - y * ssl

			if (isOOR(intX, intY)) searchEnd = true
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

		/////////////////////////////////////////////////////////////

		// draw rendered intersects in topView
		ctx.fillStyle = "red"
		ctx.beginPath()
		ctx.arc(
			topViewLeft + foundIntX,
			topViewTop + foundIntY,
			1,
			0,
			2 * Math.PI
		)
		ctx.fill()
		ctx.closePath()

		if (foundIntBlock)
			renderInRaycast(
				foundIntX,
				foundIntY,
				foundIntBlock,
				position,
				column,
				ctx
			)
	}
}
