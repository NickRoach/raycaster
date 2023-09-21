import {
	topViewHeight,
	topViewWidth,
	darkenPower,
	raycastHeight,
	raycastLeft,
	raycastTop,
	distanceColor
} from "./constants"
import { drawVerticalLine } from "./drawVerticalLine"
import { hexToRgba } from "./hexToRgba"
import { toImageData } from "./imageConverterFuncs"
import { RgbaData } from "./types"

export const renderInRaycast = (
	verticals,
	ctx: CanvasRenderingContext2D,
	rgb2dArrayOriginal: RgbaData
) => {
	const rgb2dArray = {
		data: rgb2dArrayOriginal.data.map((x) => x.map((y) => y.map((z) => z))),
		colorSpace: "rgba"
	}

	for (let vert of verticals) {
		// render in the raycast view
		const { distance, foundIntBlock, isEdge, column } = vert
		// distortion correction
		const adjustedDistance = distance * Math.cos(vert.angleFromCenter)

		const fullDarkDistance = Math.min(
			Math.sqrt(
				topViewHeight * topViewHeight + topViewWidth * topViewWidth
			),
			2000
		)
		let f = Math.pow(
			(fullDarkDistance - adjustedDistance) / fullDarkDistance,
			darkenPower
		)

		const color = foundIntBlock.color
		if (isEdge) f = f / 1.1

		const rgb = hexToRgba(color)
		const distanceColorRgb = hexToRgba(distanceColor)

		const getDistanceColor = (c: number, d: number, f: number) => {
			return c * f + (d - d * f)
		}

		const rA = getDistanceColor(rgb.r, distanceColorRgb.r, f)
		const gA = getDistanceColor(rgb.g, distanceColorRgb.g, f)
		const bA = getDistanceColor(rgb.b, distanceColorRgb.b, f)

		const darkCol = [rA, gA, bA, foundIntBlock.transparency || 1]
		const lineHeight = 10000 / adjustedDistance
		const yCenter = Math.round(raycastTop + raycastHeight / 2)

		const height = foundIntBlock.height * 200 || lineHeight * 5
		drawVerticalLine(
			rgb2dArray,
			column,
			Math.max(Math.round(yCenter - height), 0),
			Math.min(Math.round(yCenter + lineHeight / 2), raycastHeight),
			[darkCol[0], darkCol[1], darkCol[2], 1 * 255]
		)
	}

	const imageData = toImageData(rgb2dArray, ctx)
	ctx.beginPath()
	ctx.putImageData(imageData, raycastLeft, raycastTop)
	ctx.closePath()
}
