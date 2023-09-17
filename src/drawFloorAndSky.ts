import {
	raycastHeight,
	raycastSkyHorizonColor,
	raycastSkyZenithColor,
	raycastLeft,
	raycastTop,
	raycastWidth,
	raycastFloorNadirColor,
	raycastFloorHorizonColor
} from "./constants"

export const drawFloorAndSky = (ctx: CanvasRenderingContext2D) => {
	// draw linear gradient sky
	const grdS = ctx.createLinearGradient(0, 0, 0, raycastHeight / 2)

	grdS.addColorStop(1, raycastSkyHorizonColor)
	grdS.addColorStop(0, raycastSkyZenithColor)
	ctx.fillStyle = grdS
	ctx.fillRect(raycastLeft, raycastTop, raycastWidth + 1, raycastHeight / 2)

	// draw radial gradient floor
	const grdF = ctx.createRadialGradient(
		raycastLeft + raycastWidth / 2,
		raycastTop + raycastHeight + 1400,
		raycastWidth / 2,
		raycastLeft + raycastWidth / 2,
		raycastTop + raycastHeight + 1500,
		raycastWidth / 2 + 1500
	)

	// draw linear gradient sky
	grdF.addColorStop(0, raycastFloorNadirColor)
	grdF.addColorStop(1, raycastFloorHorizonColor)
	ctx.fillStyle = grdF
	ctx.fillRect(
		raycastLeft,
		raycastTop + raycastHeight / 2,
		raycastWidth + 1,
		raycastHeight / 2
	)
}
