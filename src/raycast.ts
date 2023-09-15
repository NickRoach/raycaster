import {
	raycastLeft,
	raycastTop,
	raycastWidth,
	raycastHeight,
	raycastBackgroundColor,
	fieldOfViewAngle,
	topViewHeight,
	topViewBlockSize,
	topViewLeft,
	topViewTop,
	topViewWidth
} from "."
import { getBlockAddressXY } from "./getBlockAddress"
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

	const getDistance = (intX: number, intY: number, position: Position) => {
		const x = intX - position.x
		const y = intY - position.y
		return Math.sqrt(x * x + y * y)
	}

	// for every angle/column, we need the distance to the closest intersect with a solid block
	for (let column = 0; column < raycastWidth - 1; column++) {
		const angle = limitAngle(startAngle + angleInc * column)

		// find closest horizontalIntersect
		let foundIntXH: number = 10000
		let foundIntYH: number = 10000

		// works when facing up
		let searchEnd: boolean = false
		const y1h = position.y % topViewBlockSize
		let i = 0
		while (!searchEnd) {
			const y = y1h + topViewBlockSize * i
			const x = y * Math.tan(getRadians(angle))

			const intX = position.x + x
			const intY = position.y - y
			if (isOOR(intX, intY)) searchEnd = true
			if (!searchEnd) {
				const addr = getBlockAddressXY(intX, intY)
				const state = blockArray[addr.x][addr.y - 1].state
				if (state) {
					searchEnd = true
					foundIntXH = intX
					foundIntYH = intY
				}
				i++
			}
		}

		////////////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////

		// sd is for "switch down". It is 1 when looking down
		// const sd = angle > 90 && angle < 270 ? 1 : 0

		// // when facing down -- doesn't work now
		// let searchEnd: boolean = false
		// const y1h = (position.y % topViewBlockSize) - sd * topViewBlockSize

		// let i = 0
		// while (!searchEnd) {
		// 	const y = y1h - topViewBlockSize * i
		// 	const x = y * Math.tan(getRadians(angle))

		// 	const intX = position.x + x
		// 	const intY = position.y - y
		// 	if (isOOR(intX, intY)) searchEnd = true
		// 	if (!searchEnd) {
		// 		const addr = getBlockAddressXY(intX, intY)
		// 		const state = blockArray[addr.x][addr.y - 1].state
		// 		if (state) {
		// 			searchEnd = true
		// 			foundIntXH = intX
		// 			foundIntYH = intY
		// 		}
		// 		i++
		// 	}
		// }

		///////////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////

		// vertical intersects
		// find closest verticalIntersect
		// WORKS WHEN FACING RIGHT ONLY

		// sv is for "switch left". It is 1 when looking left
		const sl = angle < 359 && angle > 180 ? 1 : 0
		// sfv is for "sign flip left". It is -1 when looking left
		const sfv = sl === 1 ? -1 : 1

		let foundIntXV: number = 10000
		let foundIntYV: number = 10000
		searchEnd = false
		// horizontal distance to the first vertical intercept
		const x1v = (topViewWidth - position.x) % topViewBlockSize

		let j = 0
		while (!searchEnd) {
			// horizontal distance to next x intercept
			const x = x1v + topViewBlockSize * j
			// vertical distance to that intercept
			const y = x / Math.tan(getRadians(360 + angle))

			const intX = position.x + x * sfv
			const intY = position.y - y
			if (isOOR(intX, intY)) searchEnd = true
			if (!searchEnd) {
				const addr = getBlockAddressXY(intX, intY)
				const state = blockArray[addr.x][addr.y].state
				if (state) {
					searchEnd = true
					foundIntXV = intX
					foundIntYV = intY
				}
				j++
			}
		}

		const vDistance = getDistance(foundIntXV, foundIntYV, position)
		const hDistance = getDistance(foundIntXH, foundIntYH, position)
		let foundIntX: number
		let foundIntY: number

		if (vDistance < hDistance) {
			foundIntX = foundIntXV
			foundIntY = foundIntYV
		} else {
			foundIntX = foundIntXH
			foundIntY = foundIntYH
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
		let distance = getDistance(foundIntX, foundIntY, position)
		const fullDarkDistance = Math.sqrt(
			topViewHeight * topViewHeight + topViewWidth * topViewWidth
		)
		const f = Math.pow(
			(fullDarkDistance - distance) / fullDarkDistance,
			3.5
		)

		// draw color
		ctx.beginPath()
		const color = blockArray[0][0].color

		const r = Number(`0x${color.slice(1, 3)}`)
		const g = Number(`0x${color.slice(3, 5)}`)
		const b = Number(`0x${color.slice(5, 7)}`)
		const ar = (r * f).toFixed(0)
		const ag = (g * f).toFixed(0)
		const ab = (b * f).toFixed(0)

		const darkenedColor = `rgb(${ar},${ag},${ab})`

		ctx.strokeStyle = darkenedColor
		const lineHeight = Math.min(
			20000 / getDistance(foundIntX, foundIntY, position),
			raycastHeight
		)
		const x = raycastLeft + column + 1
		ctx.lineWidth = 2
		ctx.moveTo(x, yCenter + lineHeight / 2)
		ctx.lineTo(x, yCenter - lineHeight / 2)
		ctx.stroke()
		ctx.closePath()
	}
}
