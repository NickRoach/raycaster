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
import { getBlockAddress, getBlockAddressXY } from "./getBlockAddress"
import { getRadians } from "./getRadians"
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
			return true
		}
		return false
	}
	const getRightLeft = (position: Position) => {
		if (position.angle < 0 && position.angle < 180) {
			return true
		}
		return false
	}

	const isOOR = (intX: number, intY: number) => {
		if (
			intY > topViewHeight - 1 ||
			intY < 0 ||
			intX > topViewWidth ||
			intX < 0
		)
			return true
		else return false
	}

	const getDistance = (intX: number, intY: number, position: Position) => {
		const x = intX - position.x
		const y = intY - position.y
		return Math.sqrt(x * x + y * y)
	}

	// for every angle/column, we need the distance to the closest intersect with a solid block

	for (let column = 0; column < raycastWidth; column++) {
		const angle = startAngle + angleInc * column

		// int the top half
		let searchEnd: boolean = false
		let foundIntX: number
		let foundIntY: number
		const y1 = position.y % topViewBlockSize
		const x1 = y1 * Math.tan(getRadians(angle))
		const int1Y = position.y - y1
		const int1X = x1 + position.x
		if (isOOR(int1X, int1Y)) searchEnd = true
		if (!searchEnd) {
			const addr = getBlockAddressXY(int1X, int1Y)
			const state = blockArray[addr.x][addr.y - 1].state
			if (state) {
				searchEnd = true
				foundIntX = int1X
				foundIntY = int1Y
			}
		}
		let i = 1
		while (!searchEnd) {
			const y = y1 + topViewBlockSize * i
			const x = y * Math.tan(getRadians(angle))

			const intX = position.x + x
			const intY = position.y - y
			if (isOOR(intX, intY)) searchEnd = true
			if (!searchEnd) {
				const addr = getBlockAddressXY(intX, intY)
				const state = blockArray[addr.x][addr.y - 1].state
				if (state) {
					searchEnd = true
					foundIntX = intX
					foundIntY = intY
				}
				i++
			}
		}

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

		const distance = getDistance(foundIntX, foundIntY, position)
		const fractionDistance = distance / topViewHeight
		const transparency = Math.floor(255 - fractionDistance * 255).toString(
			16
		)
		ctx.beginPath()
		ctx.strokeStyle = `${blockArray[0][0].color}${transparency}`
		const lineHeight = 5000 / getDistance(foundIntX, foundIntY, position)
		const x = raycastLeft + column
		ctx.moveTo(x, yCenter + lineHeight / 2)
		ctx.lineTo(x, yCenter - lineHeight / 2)
		ctx.stroke()
		ctx.closePath()
	}
}
