import {
	fieldOfViewAngle,
	raycastWidth,
	topViewBlockSize,
	topViewHeight,
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
import { Block, Position, Vertical } from "./types"

export const raycast = (
	position: Position,
	blockArray: [Block[]],
	ctx: CanvasRenderingContext2D
) => {
	const isEdge = (x: number, y: number) => {
		return (
			(x % topViewBlockSize < 0.1 ||
				x % topViewBlockSize > topViewBlockSize - 0.1) &&
			(y % topViewBlockSize < 0.1 ||
				y % topViewBlockSize > topViewBlockSize - 0.1)
		)
	}

	// the angle the intercept makes to the surface: for shading
	const getIntAngleX = (angle: number, sl: number, sd: number) => {
		//up, left
		if (sd === 0 && sl === 1) return 360 - angle
		// up, right
		if (sd === 0 && sl === 0) return angle
		// down, left
		if (sd === 1 && sl === 1) return angle - 180
		// down, right
		if (sd === 1 && sl === 0) return 180 - angle
	}

	// the angle the intercept makes to the surface: for shading
	const getIntAngleY = (angle: number, sl: number, sd: number) => {
		// up, left
		if (sd === 0 && sl === 1) return angle - 270
		// up, right
		if (sd === 0 && sl === 0) return 90 - angle
		// down, left
		if (sd === 1 && sl === 1) return 270 - angle
		// down, right
		if (sd === 1 && sl === 0) return angle - 90
	}

	drawFloorAndSky(ctx)
	let verticals: Vertical[] = []

	// number of columns in a half
	const n = raycastWidth / 2
	// angle of half the field of view
	const theta = fieldOfViewAngle / 2
	// we know that for the first and last column, the y distance is:
	const yFactor = n / Math.tan(getRadians(theta))

	// for every angle/column, we need the distance to the closest intersect with a solid block
	for (let column = 0; column < raycastWidth; column++) {
		// column offset from the center of the field of view
		const columnOffset = column - raycastWidth / 2
		// now we can use that y factor for other columns
		const angleOffset = getDegrees(Math.atan(columnOffset / yFactor))

		const angle = limitAngle(position.angle + angleOffset)

		// sd is 1 if facing down. switch down
		const sd = angle > 90 && angle < 270 ? 1 : 0
		const su = sd === 0 ? 1 : 0
		// ssd is -1 when facing down. switch sign down
		const ssd = sd === 1 ? -1 : 1

		// sv is for "switch left". It is 1 when looking left
		const sl = angle < 360 && angle > 180 ? 1 : 0
		const sr = sl === 0 ? 1 : 0
		// ssl is for "sign flip left". It is -1 when looking left
		const ssl = sl === 1 ? -1 : 1

		// find closest horizontalIntersect
		let searchEnd: boolean = false
		let firstIntFound: boolean = false

		let foundIntXH: number
		let foundIntYH: number

		// works facing both up and down

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
				if (!firstIntFound) {
					foundIntXH = intX
					foundIntYH = intY
				}
			}
			if (!searchEnd) {
				const addr = getBlockAddressXY(
					intX,
					intY + topViewBlockSize / 2
				)
				const block = blockArray[addr.x][addr.y - su]
				const state = block.state
				if (state) {
					verticals.push({
						address: {
							x: addr.x,
							y: addr.y - su
						},
						blockDistance: getDistance(
							addr.x * topViewBlockSize,
							(addr.y - su) * topViewBlockSize,
							position
						),
						block,
						column,
						angle,
						intAngle: getIntAngleY(angle, sl, sd),
						isEdge: isEdge(intX, intY),
						distance: getDistance(intX, intY, position)
					})
					if (!firstIntFound) {
						firstIntFound = true
						foundIntXH = intX
						foundIntYH = intY
					}
				}
				i++
			}
		}

		// find closest verticalIntersect
		// works looking either left or right

		let foundIntXV: number
		let foundIntYV: number

		// x value of the first vertical intercept
		const x1v =
			sr * topViewBlockSize - ssl * (position.x % topViewBlockSize)

		searchEnd = false
		firstIntFound = false
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
				if (!firstIntFound) {
					foundIntXV = intX
					foundIntYV = intY
				}
			}
			if (!searchEnd) {
				const addr = getBlockAddressXY(
					intX + topViewBlockSize / 2,
					intY
				)
				const block = blockArray[addr.x + ssl * sl][addr.y]
				const state = block.state
				if (state) {
					verticals.push({
						address: {
							x: addr.x + ssl * sl,
							y: addr.y
						},
						block,
						blockDistance: getDistance(
							(addr.x + ssl * sl) * topViewBlockSize,
							addr.y * topViewBlockSize,
							position
						),
						column,
						angle,
						intAngle: getIntAngleX(angle, sl, sd),
						isEdge: isEdge(intX, intY),
						distance: getDistance(intX, intY, position)
					})
					if (!firstIntFound) {
						firstIntFound = true
						foundIntXV = intX
						foundIntYV = intY
					}
				}
				j++
			}
		}

		/////////////////////////////////////////////////////////////

		// draw torch light ray in topView
		let foundIntX: number
		let foundIntY: number

		const hDistance = getDistance(foundIntXH, foundIntYH, position)
		const vDistance = getDistance(foundIntXV, foundIntYV, position)

		if (hDistance < vDistance) {
			foundIntX = foundIntXH
			foundIntY = foundIntYH
		} else {
			foundIntX = foundIntXV
			foundIntY = foundIntYV
		}

		ctx.strokeStyle = torchColor
		ctx.beginPath()
		ctx.moveTo(topViewLeft + position.x, topViewTop + position.y)
		ctx.lineTo(topViewLeft + foundIntX, topViewTop + foundIntY)
		ctx.stroke()
		ctx.closePath()
	}
	renderInRaycast(verticals, position, yFactor, ctx)
}
