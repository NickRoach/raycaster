const backgroundColor = "black"
const topViewBackgroundColor = "#555555"
const topViewBlockColor = "turquoise"
const topViewGridColor = "#111111"
const topViewGridLineWidth = 1
const xSize = 20
const ySize = 20
const topViewTop = 100
const topViewLeft = 100
const topViewBlockSize = 15
const topViewBorderWidth = 30
const topViewWidth = topViewBlockSize * xSize
const topViewHeight = topViewBlockSize * ySize
let lastFrame: number = 0
const frameCadence: number = 69

const positionXMax = xSize * topViewBlockSize
const positionYMax = ySize * topViewBlockSize

const getRadians = (degrees: number) => {
	return (degrees * Math.PI) / 180
}

type Block = {
	state: boolean
}

const makeBlockArray = (xSize: number, ySize: number) => {
	let array: [Block[]] = [[]]
	for (let x = 0; x < xSize; x++) {
		array[x] = []
		for (let y = 0; y < ySize; y++) {
			array[x][y] = {
				state: false
			}
		}
	}
	return array
}

const drawTopView = (
	blockArray: [Block[]],
	ctx: CanvasRenderingContext2D,
	position: Position
) => {
	ctx.fillStyle = topViewBackgroundColor
	ctx.beginPath()
	// clear the topView display
	ctx.fillRect(
		topViewLeft - topViewBorderWidth,
		topViewTop - topViewBorderWidth,
		topViewBlockSize * xSize + topViewBorderWidth * 2,
		topViewBlockSize * ySize + topViewBorderWidth * 2
	)
	ctx.closePath()

	// draw gridlines
	ctx.strokeStyle = topViewGridColor
	ctx.lineWidth = topViewGridLineWidth
	// vertical
	for (let x = 0; x <= blockArray.length; x++) {
		ctx.beginPath()
		ctx.moveTo(topViewLeft + x * topViewBlockSize, topViewTop)
		ctx.lineTo(
			topViewLeft + x * topViewBlockSize,
			topViewTop + blockArray[0].length * topViewBlockSize
		)
		ctx.stroke()
		ctx.closePath()
	}
	// horizontal
	for (let y = 0; y <= blockArray[0].length; y++) {
		ctx.beginPath()
		ctx.moveTo(topViewLeft, topViewTop + y * topViewBlockSize)
		ctx.lineTo(
			topViewLeft + blockArray[0].length * topViewBlockSize,
			topViewTop + y * topViewBlockSize
		)
		ctx.stroke()
		ctx.closePath()
	}

	// draw blocks
	for (let x = 0; x < blockArray.length; x++) {
		for (let y = 0; y < blockArray.length; y++) {
			if (blockArray[x][y].state) {
				ctx.fillStyle = topViewBlockColor
				ctx.fillRect(
					topViewLeft + x * topViewBlockSize,
					topViewTop + y * topViewBlockSize,
					topViewBlockSize,
					topViewBlockSize
				)
				ctx.closePath()
			}
		}
	}

	ctx.strokeStyle = "yellow"
	ctx.beginPath()
	ctx.moveTo(topViewLeft + position.x, topViewTop + position.y)
	ctx.lineTo(
		topViewLeft + position.x + 30 * -Math.sin(getRadians(position.angle)),
		topViewTop + position.y + 30 * -Math.cos(getRadians(position.angle))
	)
	ctx.stroke()
	ctx.closePath()
	ctx.fillStyle = "red"
	ctx.beginPath()
	ctx.arc(
		topViewLeft + position.x,
		topViewTop + position.y,
		3,
		0,
		2 * Math.PI
	)
	ctx.fill()
	ctx.closePath()
}

export const resizeCanvas = (canvas: HTMLCanvasElement) => {
	canvas.height = window.innerHeight - 4
	canvas.width = window.innerWidth
}

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

const handleClick = (
	e: MouseEvent,
	blockArray: [Block[]],
	ctx: CanvasRenderingContext2D,
	position: Position
) => {
	const { pageX, pageY } = e

	const isClickInTopView = () => {
		if (
			pageX > topViewLeft &&
			pageY > topViewTop &&
			pageX < topViewLeft + topViewWidth &&
			pageY < topViewTop + topViewHeight
		) {
			return true
		}
		return false
	}
	if (isClickInTopView()) {
		const blockX = Math.floor((pageX - topViewLeft) / topViewBlockSize)
		const blockY = Math.floor((pageY - topViewTop) / topViewBlockSize)
		blockArray[blockX][blockY].state = !blockArray[blockX][blockY].state
		drawTopView(blockArray, ctx, position)
	}
}

const fillOuterWallBlocks = (blockArray: [Block[]]) => {
	for (let x = 0; x < blockArray.length; x += blockArray.length - 1) {
		for (let y = 0; y < blockArray[0].length; y++) {
			blockArray[x][y].state = true
		}
	}
	for (let y = 0; y < blockArray[0].length; y += blockArray[0].length - 1) {
		for (let x = 1; x < blockArray.length - 1; x++) {
			blockArray[x][y].state = true
		}
	}
}

type Position = {
	x: number
	y: number
	angle: number
}

const handleKeyDown = (e: KeyboardEvent, position: Position) => {
	const incAngle = (angle: number) => {
		angle++
		if (angle > 359) {
			angle = 0
		}
		return angle
	}

	const decAngle = (angle: number) => {
		angle--
		if (angle < 0) {
			angle = 359
		}
		return angle
	}

	const limitPosition = (position: Position) => {
		if (position.x > positionXMax) position.x = positionXMax
		if (position.x < 0) position.x = 0
		if (position.y > positionYMax) position.y = positionYMax
		if (position.y < 0) position.y = 0
	}

	const goForward = (angle: number) => {
		position.x += Math.sin(getRadians(angle))
		position.y += Math.cos(getRadians(angle))
		limitPosition(position)
	}

	const goBackward = (angle: number) => {
		position.x -= Math.sin(getRadians(angle))
		position.y -= Math.cos(getRadians(angle))
		limitPosition(position)
	}

	switch (e.key) {
		case "ArrowUp":
			goBackward(position.angle)
			break
		case "ArrowDown":
			goForward(position.angle)
			break
		case "ArrowLeft":
			position.angle = incAngle(position.angle)
			break
		case "ArrowRight":
			position.angle = decAngle(position.angle)
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
	window.addEventListener("keydown", (e) => handleKeyDown(e, position))
	canvas.focus()
	fillOuterWallBlocks(blockArray)
	window.requestAnimationFrame((timeStamp) =>
		renderLoop(timeStamp, blockArray, ctx, position)
	)
}

document.body.onload = initialize
