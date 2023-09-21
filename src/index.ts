import { fillOuterWallBlocks } from "./fillOuterWallBlocks"
import { move } from "./move"
import { makeBlockArray } from "./makeBlockArray"
import { resizeCanvas } from "./resizeCanvas"
import { Block, KeyPresses, Position, RgbaData } from "./types"
import { drawTopView } from "./drawTopView"
import { handleClick } from "./handleClick"
import { handleKeyDown, handleKeyUp } from "./handleKeyPress"
import { raycast } from "./raycast"
import {
	frameCadence,
	backgroundColor,
	xSize,
	ySize,
	initialX,
	initialY,
	initialAngle,
	raycastWidth,
	raycastHeight
} from "./constants"
import { to2dRgbaArray } from "./imageConverterFuncs"
import { drawFloorAndSky } from "./drawFloorAndSky"

let lastFrame = 0

const renderLoop = (
	timeStamp: number,
	blockArray: [Block[]],
	ctx: CanvasRenderingContext2D,
	position: Position,
	keyPresses: KeyPresses,
	iCtx: CanvasRenderingContext2D,
	rgb2dArray: RgbaData
) => {
	try {
		if (timeStamp - lastFrame > frameCadence) {
			console.log("fps:", Math.round(1000 / (timeStamp - lastFrame)))
			lastFrame = timeStamp
			drawTopView(blockArray, ctx, position)
			raycast(position, blockArray, ctx, iCtx, rgb2dArray)

			move(position, keyPresses, blockArray)
		}
	} catch (e) {
		console.log(e)
	}

	window.requestAnimationFrame((timeStamp) =>
		renderLoop(
			timeStamp,
			blockArray,
			ctx,
			position,
			keyPresses,
			iCtx,
			rgb2dArray
		)
	)
}

const initialize = () => {
	const canvas = document.createElement("canvas")
	const iCanvas = document.createElement("canvas")
	const body = document.getElementById("body")
	const ctx = canvas.getContext("2d")
	const iCtx = iCanvas.getContext("2d")
	body.style.margin = "0px"
	body.style.backgroundColor = backgroundColor
	resizeCanvas(canvas)
	resizeCanvas(iCanvas)
	canvas.id = "canvas"
	body.appendChild(canvas)
	window.onresize = () => {
		resizeCanvas(canvas)
		resizeCanvas(iCanvas)
	}
	const blockArray = makeBlockArray(xSize, ySize)
	const position = {
		x: initialX,
		y: initialY,
		angle: initialAngle
	}
	const keyPresses: KeyPresses = {
		up: false,
		down: false,
		left: false,
		right: false,
		shift: false,
		ctrl: false
	}

	canvas.addEventListener("click", (e) =>
		handleClick(e, blockArray, ctx, position)
	)
	window.addEventListener("keydown", (e) => handleKeyDown(e, keyPresses))
	window.addEventListener("keyup", (e) => handleKeyUp(e, keyPresses))
	fillOuterWallBlocks(blockArray)

	drawFloorAndSky(iCtx)
	const floorAndSky = iCtx.getImageData(0, 0, raycastWidth, raycastHeight)
	const rgb2dArray = to2dRgbaArray(floorAndSky)

	window.requestAnimationFrame((timeStamp) =>
		renderLoop(
			timeStamp,
			blockArray,
			ctx,
			position,
			keyPresses,
			iCtx,
			rgb2dArray
		)
	)
}

document.body.onload = initialize
