import {
	fieldOfViewAngle,
	raycastWidth,
	topViewBlockSize,
	topViewLeft,
	topViewTop
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

		// FOR DEVELOPMENT THESE LINES REPLACE THE TWO ABOVE
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

		// works when facing up
		// const y1h = position.y % topViewBlockSize
		// let i = 0
		// while (!searchEnd) {
		// 	const y = y1h + topViewBlockSize * i
		// 	const x = y * Math.tan(getRadians(angle))

		// 	const intX = position.x + x
		// 	const intY = position.y - y
		// 	if (isOOR(intX, intY)) searchEnd = true
		// 	if (!searchEnd) {
		// 		const addr = getBlockAddressXY(intX, intY)
		// 		const block = blockArray[addr.x][addr.y - 1]
		// 		const state = block.state
		// 		if (state) {
		// 			searchEnd = true
		// 			foundIntXH = intX
		// 			foundIntYH = intY
		// 			intBlockH = block
		// 		}
		// 		i++
		// 	}

		// let s
		// if(angle > 90 && angle < 270)

		// try to make work facing down
		searchEnd = false
		const y1h = topViewBlockSize - (position.y % topViewBlockSize)
		let i = 0
		while (!searchEnd) {
			const y = y1h + topViewBlockSize * i
			const x = y * Math.tan(getRadians(360 - angle))
			const intX = position.x + x
			const intY = position.y + y
			if (isOOR(intX, intY)) searchEnd = true
			if (!searchEnd) {
				const addr = getBlockAddressXY(intX, intY)
				const block = blockArray[addr.x][addr.y]
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

		// vertical intersects
		// find closest verticalIntersect
		// WORKS WHEN FACING RIGHT ONLY

		// sv is for "switch left". It is 1 when looking left
		// const sl = angle < 359 && angle > 180 ? 1 : 0
		// // sfv is for "sign flip left". It is -1 when looking left
		// const sfv = sl === 1 ? -1 : 1

		// let foundIntXV: number = 10000
		// let foundIntYV: number = 10000
		// searchEnd = false
		// // horizontal distance to the first vertical intercept
		// const x1v = (topViewWidth - position.x) % topViewBlockSize

		// let j = 0
		// while (!searchEnd) {
		// 	// horizontal distance to next x intercept
		// 	const x = x1v + topViewBlockSize * j
		// 	// vertical distance to that intercept
		// 	const y = x / Math.tan(getRadians(360 + angle))

		// 	const intX = position.x + x * sfv
		// 	const intY = position.y - y
		// 	if (isOOR(intX, intY)) searchEnd = true
		// 	if (!searchEnd) {
		// 		const addr = getBlockAddressXY(intX, intY)
		// 		const block = blockArray[addr.x][addr.y]
		// 		const state = block.state
		// 		if (state) {
		// 			searchEnd = true
		// 			foundIntXV = intX
		// 			foundIntYV = intY
		// 			intBlockV = block
		// 		}
		// 		j++
		// 	}
		// }

		// const vDistance = getDistance(foundIntXV, foundIntYV, position)
		const hDistance = getDistance(foundIntXH, foundIntYH, position)
		let foundIntX: number
		let foundIntY: number
		let foundIntBlock: Block

		// if (vDistance < hDistance) {
		// 	foundIntX = foundIntXV
		// 	foundIntY = foundIntYV
		// 	foundIntBlock = intBlockV
		// } else {
		// 	foundIntX = foundIntXH
		// 	foundIntY = foundIntYH
		// 	foundIntBlock = intBlockH
		// }

		foundIntX = foundIntXH
		foundIntY = foundIntYH
		foundIntBlock = intBlockH
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
