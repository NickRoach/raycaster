export const backgroundColor = "black"
export const topViewBackgroundColor = "#131313"
export const topViewBlockColor = "#111111"
export const topViewGridColor = "#111111"
export const topViewGridLineWidth = 1

export const margin = 5
export const topViewBlockSize = 10
export const topViewTop = margin
export const topViewLeft = margin
const topViewWidthMax = window.innerWidth / 4
const topViewHeightMax = Math.min(
	window.innerHeight - topViewTop - margin - 1,
	window.innerWidth / 1.75
)
export const xSize = Math.floor(topViewWidthMax / topViewBlockSize)
export const ySize = Math.floor(topViewHeightMax / topViewBlockSize)
export const topViewHeight = topViewBlockSize * ySize
export const topViewWidth = topViewBlockSize * xSize
export const raycastLeft = topViewLeft + topViewWidth + margin
export const raycastTop = margin
export const raycastHeight = topViewHeight
export const raycastWidth = window.innerWidth - margin - raycastLeft

export const positionXMax = xSize * topViewBlockSize
export const positionYMax = ySize * topViewBlockSize
export const topViewBorderWidth = 50
export const fieldOfViewAngle = 75
export const viewBoundryLineColor = "yellow"
export const viewBoundryLineLength = 50
export const characterColor = "red"
export const torchColor = "#FFFFFF01"
export const torchLightBlockColor = "#444444"
export const distanceColor = "#3399FF"
export const rD = Number(`0x${distanceColor.slice(1, 3)}`)
export const gD = Number(`0x${distanceColor.slice(3, 5)}`)
export const bD = Number(`0x${distanceColor.slice(5, 7)}`)
export const raycastFloorNadirColor = "#999999"
export const raycastFloorHorizonColor = "#14547B"
export const raycastSkyHorizonColor = "#3399FF"
export const raycastSkyZenithColor = "#0066FF"
export const blockBoundaryColor = "#444444"
export const darkenPower = 1
export const edgeDarken = 1
export const initialX = topViewWidth / 2
export const initialY = topViewHeight / 2
export const initialAngle = 0
export const maxHeight = 30
export const minHeight = 0
export const initialHeight = maxHeight / 2 + 1

export const frameCadence = 30
export const rotationSpeed = (10 * frameCadence) / 100
export const movementSpeed = (10 * frameCadence) / 100
export const strafeSpeed = (10 * frameCadence) / 100
export const fastFactor = 2
