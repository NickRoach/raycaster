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
	initialAngle
} from "./constants"
import { handleTouchEnd, handleTouchMove } from "./handleTouch"

let lastFrame = 0

const renderLoop = (
	timeStamp: number,
	blockArray: [Block[]],
	ctx: CanvasRenderingContext2D,
	position: Position,
	keyPresses: KeyPresses
) => {
	try {
		if (timeStamp - lastFrame > frameCadence) {
			lastFrame = timeStamp
			drawTopView(blockArray, ctx, position)
			raycast(position, blockArray, ctx)
			move(position, keyPresses, blockArray)
		}
	} catch (e) {
		console.log(e)
	}

	window.requestAnimationFrame((timeStamp) =>
		renderLoop(timeStamp, blockArray, ctx, position, keyPresses)
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
	const position: Position = {
		x: initialX,
		y: initialY,
		angle: initialAngle,
		height: 1
	}
	const keyPresses: KeyPresses = {
		up: false,
		down: false,
		left: false,
		right: false,
		shift: false,
		ctrl: false
	}

	const touches = {
		lastTouch: null
	}

	canvas.addEventListener("click", (e) =>
		handleClick(e, blockArray, ctx, position)
	)
	window.addEventListener("keydown", (e) => handleKeyDown(e, keyPresses))
	window.addEventListener("keyup", (e) => handleKeyUp(e, keyPresses))
	canvas.addEventListener("touchmove", (e) =>
		handleTouchMove(e, keyPresses, touches)
	)
	canvas.addEventListener("touchend", (e) =>
		handleTouchEnd(e, keyPresses, touches)
	)
	fillOuterWallBlocks(blockArray)
	window.requestAnimationFrame((timeStamp) =>
		renderLoop(timeStamp, blockArray, ctx, position, keyPresses)
	)
}

document.body.onload = initialize
