import { fillOuterWallBlocks } from "./fillOuterWallBlocks"
import { move } from "./move"
import { makeBlockArray } from "./makeBlockArray"
import { resizeCanvas } from "./resizeCanvas"
import { Block, KeyPresses, Position } from "./types"
import { drawTopView } from "./drawTopView"
import { handleClick } from "./handleClick"

export const backgroundColor = "black"
export const topViewBackgroundColor = "#555555"
export const topViewBlockColor = "turquoise"
export const topViewGridColor = "#111111"
export const topViewGridLineWidth = 1
export const xSize = 20
export const ySize = 20
export const topViewTop = 50
export const topViewLeft = 50
export const topViewBlockSize = 20
export const topViewWidth = topViewBlockSize * xSize
export const topViewHeight = topViewBlockSize * ySize
export const topViewBorderWidth = 50
let lastFrame = 0
const frameCadence = 20
export const fieldOfViewAngle = 60
export const viewBoundryLineColor = "yellow"
export const viewBoundryLineLength = 30
export const characterColor = "red"

export const positionXMax = xSize * topViewBlockSize
export const positionYMax = ySize * topViewBlockSize

export const rotationSpeed = 20 / frameCadence
export const movementSpeed = 30 / frameCadence
export const strafeSpeed = 20 / frameCadence

const renderLoop = (
	timeStamp: number,
	blockArray: [Block[]],
	ctx: CanvasRenderingContext2D,
	position: Position,
	keyPresses: KeyPresses
) => {
	if (timeStamp - lastFrame > frameCadence) {
		lastFrame = timeStamp
		drawTopView(blockArray, ctx, position)
	}
	move(position, keyPresses, blockArray)
	window.requestAnimationFrame((timeStamp) =>
		renderLoop(timeStamp, blockArray, ctx, position, keyPresses)
	)
}

const handleKeyDown = (e: KeyboardEvent, keyPresses: KeyPresses) => {
	switch (e.key) {
		case "ArrowUp":
			keyPresses.up = true
			keyPresses.down = false
			break
		case "ArrowDown":
			keyPresses.down = true
			keyPresses.up = false
			break
		case "ArrowLeft":
			keyPresses.left = true
			keyPresses.right = false
			break
		case "ArrowRight":
			keyPresses.right = true
			break
		case "Shift":
			keyPresses.shift = true
			break
	}
}

const handleKeyUp = (e: KeyboardEvent, keyPresses: KeyPresses) => {
	switch (e.key) {
		case "ArrowUp":
			keyPresses.up = false
			break
		case "ArrowDown":
			keyPresses.down = false
			break
		case "ArrowLeft":
			keyPresses.left = false
			break
		case "ArrowRight":
			keyPresses.right = false
			break
		case "Shift":
			keyPresses.shift = false
			break
	}
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
	const position = {
		x: 170,
		y: 170,
		angle: 0
	}
	const keyPresses: KeyPresses = {
		up: false,
		down: false,
		left: false,
		right: false,
		shift: false
	}

	canvas.addEventListener("click", (e) =>
		handleClick(e, blockArray, ctx, position)
	)
	window.addEventListener("keydown", (e) => handleKeyDown(e, keyPresses))
	window.addEventListener("keyup", (e) => handleKeyUp(e, keyPresses))
	fillOuterWallBlocks(blockArray)
	window.requestAnimationFrame((timeStamp) =>
		renderLoop(timeStamp, blockArray, ctx, position, keyPresses)
	)
}

document.body.onload = initialize
