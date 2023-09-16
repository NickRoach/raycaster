import { fillOuterWallBlocks } from "./fillOuterWallBlocks"
import { move } from "./move"
import { makeBlockArray } from "./makeBlockArray"
import { resizeCanvas } from "./resizeCanvas"
import { Block, KeyPresses, Position } from "./types"
import { drawTopView } from "./drawTopView"
import { handleClick } from "./handleClick"
import { handleKeyDown, handleKeyUp } from "./handleKeyPress"
import { raycast } from "./raycast"

export const backgroundColor = "black"
export const topViewBackgroundColor = "#555555"
export const topViewBlockColor = "#777777"
export const topViewGridColor = "#111111"
export const topViewGridLineWidth = 1
export const xSize = 30
export const ySize = 30
export const topViewBlockSize = 15
export const topViewWidth = topViewBlockSize * xSize
export const topViewHeight = topViewBlockSize * ySize
export const topViewTop = 50
export const topViewLeft = 50
export const positionXMax = xSize * topViewBlockSize
export const positionYMax = ySize * topViewBlockSize
export const topViewBorderWidth = 50
export const fieldOfViewAngle = 60
export const viewBoundryLineColor = "yellow"
export const viewBoundryLineLength = 50
export const characterColor = "red"
export const raycastLeft = 550
export const raycastTop = 50
export const raycastHeight = 800
export const raycastWidth = 1300
export const raycastFloorColor = "#330707"
export const raycastSkyColor = "#151527"
export const darkenPower = 2.5
export const floorDarkenPower = 1.5
// const initialX = topViewWidth / 2 + 1
// const initialY = topViewHeight / 2 + 1
const initialX = 123
const initialY = 192
const initialAngle = 45
let lastFrame = 0
const frameCadence = 30
export const rotationSpeed = 60 / frameCadence
export const movementSpeed = 100 / frameCadence
export const strafeSpeed = 100 / frameCadence
export const fastFactor = 2

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
		raycast(position, blockArray, ctx)
		move(position, keyPresses, blockArray)
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
	window.requestAnimationFrame((timeStamp) =>
		renderLoop(timeStamp, blockArray, ctx, position, keyPresses)
	)
}

document.body.onload = initialize
