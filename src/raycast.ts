import {
	raycastLeft,
	raycastTop,
	raycastWidth,
	raycastHeight,
	raycastBackgroundColor,
	fieldOfViewAngle,
	topViewHeight,
	topViewBlockSize,
	xSize,
	characterColor,
	topViewLeft,
	topViewTop,
	topViewWidth
} from "."
import { drawDot } from "./drawDot"
import { getBlockAddress, getBlockAddressXY } from "./getBlockAddress"
import { getRadians } from "./getRadians"
import { isOOR } from "./isOOR"
import { limitAngle } from "./limitAngle"
import { Block, Position } from "./types"

export const raycast = (
	position: Position,
	blockArray: [Block[]],
	ctx: CanvasRenderingContext2D
) => {
	// clear
	ctx.beginPath()
	ctx.fillStyle = raycastBackgroundColor
	ctx.fillRect(raycastLeft, raycastTop, raycastWidth, raycastHeight)
	ctx.closePath()

	const getCorrectedAngle = (angle: number) => {
		let corr = angle
		if (angle < 0) corr = angle + 360
		return corr
	}

	const yCenter = raycastTop + raycastHeight / 2
	const angleInc = fieldOfViewAngle / raycastWidth
	const startAngle = getCorrectedAngle(position.angle - fieldOfViewAngle / 2)

	const getUpDown = (position: Position) => {
		if (position.angle < 90 || position.angle > 270) {
			return -1
		}
		return +1
	}

	const getDistance = (intX: number, intY: number, position: Position) => {
		const x = intX - position.x
		const y = intY - position.y
		return Math.sqrt(x * x + y * y)
	}

	// for every angle/column, we need the distance to the closest intersect with a solid block

	for (let column = 0; column < raycastWidth - 1; column++) {
		const angle = limitAngle(startAngle + angleInc * column)
		// const angle = limitAngle(position.angle)

		let searchEnd: boolean = false
		let foundIntX: number
		let foundIntY: number

		// in the top half

		// find closest horizontalIntersect
		// const y1 = position.y % topViewBlockSize
		// const x1 = y1 * Math.tan(getRadians(angle))
		// const int1Y = position.y - y1
		// const int1X = x1 + position.x
		// if (isOOR(int1X, int1Y)) searchEnd = true
		// if (!searchEnd) {
		// 	const addr = getBlockAddressXY(int1X, int1Y)
		// 	const state = blockArray[addr.x][addr.y - 1].state
		// 	if (state) {
		// 		searchEnd = true
		// 		foundIntX = int1X
		// 		foundIntY = int1Y
		// 	}
		// }
		// let i = 1
		// while (!searchEnd) {
		// 	const y = y1 + topViewBlockSize * i
		// 	const x = y * Math.tan(getRadians(angle))

		// 	const intX = position.x + x
		// 	const intY = position.y - y
		// 	if (isOOR(intX, intY)) searchEnd = true
		// 	if (!searchEnd) {
		// 		const addr = getBlockAddressXY(intX, intY)
		// 		const state = blockArray[addr.x][addr.y - 1].state
		// 		if (state) {
		// 			searchEnd = true
		// 			foundIntX = intX
		// 			foundIntY = intY
		// 		}
		// 		i++
		// 	}
		// }

		/////////////////////////////////////////////////////////////
		// when looking right
		// if (angle > 0 && angle < 180) {
		// find closest verticalIntersect
		const x1 = (topViewWidth - position.x) % topViewBlockSize
		const y1 = x1 / Math.tan(getRadians(angle))
		const int1X = position.x + x1
		const int1Y = position.y - y1

		if (isOOR(int1X, int1Y)) searchEnd = true
		if (!searchEnd) {
			const addr = getBlockAddressXY(int1X, int1Y)
			const state = blockArray[addr.x][addr.y].state
			if (state) {
				searchEnd = true
				foundIntX = int1X
				foundIntY = int1Y
			}
		}
		// }

		let i = 1
		while (!searchEnd) {
			const x = x1 + topViewBlockSize * i
			const y = x / Math.tan(getRadians(angle))

			const intX = position.x + x
			const intY = position.y - y
			if (isOOR(intX, intY)) searchEnd = true
			if (!searchEnd) {
				const addr = getBlockAddressXY(intX, intY)
				const state = blockArray[addr.x][addr.y].state
				if (state) {
					searchEnd = true
					foundIntX = intX
					foundIntY = intY
				}
				i++
			}
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

		// render in the raycast view
		const distance = getDistance(foundIntX, foundIntY, position)
		const fractionDistance =
			distance /
			Math.sqrt(
				topViewHeight * topViewHeight + topViewWidth * topViewWidth
			)
		const darkness = Math.floor(fractionDistance * 255).toString(16)

		// draw color
		ctx.beginPath()
		ctx.strokeStyle = blockArray[0][0].color
		const lineHeight = Math.min(
			5000 / getDistance(foundIntX, foundIntY, position),
			raycastHeight
		)
		const x = raycastLeft + column + 1
		ctx.moveTo(x, yCenter + lineHeight / 2)
		ctx.lineTo(x, yCenter - lineHeight / 2)
		ctx.stroke()
		ctx.closePath()

		// draw darkness
		ctx.beginPath()
		ctx.strokeStyle = `#000000${darkness}`
		ctx.moveTo(x, yCenter + lineHeight / 2)
		ctx.lineTo(x, yCenter - lineHeight / 2)
		ctx.stroke()
		ctx.closePath()
	}
}
