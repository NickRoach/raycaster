import { fillOuterWallBlocks } from "./fillOuterWallBlocks"
import { move } from "./move"
import { makeBlockArray } from "./makeBlockArray"
import { resizeCanvas } from "./resizeCanvas"
import { Block, Position } from "./types"
import { drawTopView } from "./drawTopView"
import { limitAngle } from "./limitAngle"
import { handleClick } from "./handleClick"

export const backgroundColor = "black"
export const topViewBackgroundColor = "#555555"
export const topViewBlockColor = "turquoise"
export const topViewGridColor = "#111111"
export const topViewGridLineWidth = 1
export const xSize = 20
export const ySize = 20
export const topViewTop = 100
export const topViewLeft = 100
export const topViewBlockSize = 30
export const topViewWidth = topViewBlockSize * xSize
export const topViewHeight = topViewBlockSize * ySize
export const topViewBorderWidth = 50
let lastFrame: number = 0
const frameCadence: number = 69
export const fieldOfViewAngle = 60
export const viewBoundryLineColor = "yellow"
export const viewBoundryLineLength = 30
export const characterColor = "red"

export const positionXMax = xSize * topViewBlockSize
export const positionYMax = ySize * topViewBlockSize

export const rotationSpeed = 6
export const movementSpeed = 6

const renderLoop = (
	timeStamp: number,
	blockArray: [Block[]],
	ctx: CanvasRenderingContext2D,
	position: Position
) => {
	if (timeStamp - lastFrame > frameCadence) {
		lastFrame = timeStamp
		drawTopView(blockArray, ctx, position)
	}
	window.requestAnimationFrame((timeStamp) =>
		renderLoop(timeStamp, blockArray, ctx, position)
	)
}

const handleKeyDown = (
	e: KeyboardEvent,
	position: Position,
	blockArray: [Block[]]
) => {
	switch (e.key) {
		case "ArrowUp":
			move(position, true, blockArray)
			break
		case "ArrowDown":
			move(position, false, blockArray)
			break
		case "ArrowLeft":
			position.angle = limitAngle(position.angle + rotationSpeed)
			break
		case "ArrowRight":
			position.angle = limitAngle(position.angle - rotationSpeed)
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
	canvas.addEventListener("click", (e) =>
		handleClick(e, blockArray, ctx, position)
	)
	window.addEventListener("keydown", (e) =>
		handleKeyDown(e, position, blockArray)
	)
	canvas.focus()
	fillOuterWallBlocks(blockArray)
	window.requestAnimationFrame((timeStamp) =>
		renderLoop(timeStamp, blockArray, ctx, position)
	)
}

document.body.onload = initialize
