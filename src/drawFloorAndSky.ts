import {
	raycastHeight,
	raycastSkyHorizonColor,
	raycastLeft,
	raycastTop,
	raycastWidth,
	raycastFloorNadirColor,
	raycastSkyZenithColor,
	raycastFloorHorizonColor
} from "."

export const drawFloorAndSky = (ctx: CanvasRenderingContext2D) => {
	// draw linear gradient sky
	const grdS = ctx.createLinearGradient(0, 0, 0, raycastHeight / 2)

	grdS.addColorStop(1, raycastSkyHorizonColor)
	grdS.addColorStop(0, raycastSkyZenithColor)
	ctx.fillStyle = grdS
	ctx.fillRect(raycastLeft, raycastTop, raycastWidth, raycastHeight / 2)

	// draw linear gradient floor
	// const grdF = ctx.createLinearGradient(
	// 	0,
	// 	raycastHeight / 2,
	// 	0,
	// 	raycastHeight
	// )
	const grdF = ctx.createRadialGradient(
		raycastLeft + raycastWidth / 2,
		raycastTop + raycastHeight + 1400,
		raycastWidth / 2,
		raycastLeft + raycastWidth / 2,
		raycastTop + raycastHeight + 1500,
		raycastWidth / 2 + 1500
	)
	grdF.addColorStop(0, raycastFloorNadirColor)
	grdF.addColorStop(1, raycastFloorHorizonColor)
	// grdF.addColorStop(0, "black")
	// grdF.addColorStop(1, "white")
	ctx.fillStyle = grdF
	ctx.fillRect(
		raycastLeft,
		raycastTop + raycastHeight / 2,
		raycastWidth,
		raycastHeight / 2
	)
}
