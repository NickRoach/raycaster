import { fillOuterWallBlocks } from "./fillOuterWallBlocks"
import { move } from "./move"
import { makeBlockArray } from "./makeBlockArray"
import { resizeCanvas } from "./resizeCanvas"
import { Block, KeyPresses, Position } from "./types"
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
	initialHeight,
	raycastLeft,
	raycastTop,
	raycastWidth,
	raycastHeight,
	topViewLeft,
	topViewTop,
	torchColor
} from "./constants"
import { handleTouchEnd, handleTouchMove } from "./handleTouch"
import { renderInRaycast } from "./renderInRaycast"

let lastFrame = 0

const renderLoop = (
	timeStamp: number,
	blockArray: [Block[]],
	ctx: CanvasRenderingContext2D,
	position: Position,
	keyPresses: KeyPresses,
	canvas
) => {
	const clipRaycast = () => {
		ctx.beginPath()
		ctx.fillStyle = backgroundColor
		ctx.fillRect(0, 0, raycastLeft, canvas.height)
		ctx.fillRect(0, 0, canvas.width, raycastTop)
		ctx.fillRect(
			0,
			raycastTop + raycastHeight,
			canvas.width,
			canvas.height - raycastTop - raycastHeight
		)
		ctx.fillRect(
			raycastLeft + raycastWidth,
			0,
			canvas.width - raycastLeft - raycastWidth,
			canvas.height
		)
		ctx.closePath()
	}

	try {
		if (timeStamp - lastFrame > frameCadence) {
			lastFrame = timeStamp

			const { blocksToRender, yFactor } = raycast(
				position,
				blockArray,
				ctx
			)
			renderInRaycast(blocksToRender, position, yFactor, ctx)
			clipRaycast()
			move(position, keyPresses, blockArray)
		}
	} catch (e) {
		console.log(e)
	}

	window.requestAnimationFrame((timeStamp) =>
		renderLoop(timeStamp, blockArray, ctx, position, keyPresses, canvas)
	)
}

const initialize = () => {
	const canvas = document.createElement("canvas")
	const body = document.getElementById("body")
	const ctx = canvas.getContext("2d")
	body.style.margin = "0px"
	body.style.backgroundColor = backgroundColor
	resizeCanvas(canvas)
	canvas.id = "canvas"
	body.appendChild(canvas)
	window.onresize = () => resizeCanvas(canvas)
	const blockArray = makeBlockArray(xSize, ySize)
	fillOuterWallBlocks(blockArray)
	const position: Position = {
		x: initialX,
		y: initialY,
		angle: initialAngle,
		height: initialHeight
	}
	const keyPresses: KeyPresses = {
		up: false,
		down: false,
		left: false,
		right: false,
		shift: false,
		ctrl: false,
		w: false,
		s: false
	}

	const touches = {
		lastTouch: null
	}

	// canvas.addEventListener("click", (e) =>
	// 	handleClick(e, blockArray, ctx, position)
	// )
	window.addEventListener("keydown", (e) => handleKeyDown(e, keyPresses))
	window.addEventListener("keyup", (e) => handleKeyUp(e, keyPresses))
	canvas.addEventListener("touchmove", (e) =>
		handleTouchMove(e, keyPresses, touches)
	)
	canvas.addEventListener("touchend", (e) =>
		handleTouchEnd(e, keyPresses, touches)
	)
	window.requestAnimationFrame((timeStamp) =>
		renderLoop(timeStamp, blockArray, ctx, position, keyPresses, canvas)
	)
}

document.body.onload = initialize
