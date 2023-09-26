export const backgroundColor = "black"
export const topViewBackgroundColor = "#131313"
// export const topViewBlockColor = "#156A03"
export const topViewBlockColor = "#111111"
export const topViewGridColor = "#111111"
export const topViewGridLineWidth = 1

export const margin = 5
export const topViewBlockSize = 40
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
export const distanceColor = "#111111"
export const rD = Number(`0x${distanceColor.slice(1, 3)}`)
export const gD = Number(`0x${distanceColor.slice(3, 5)}`)
export const bD = Number(`0x${distanceColor.slice(5, 7)}`)
export const raycastFloorNadirColor = "#999999"
export const raycastFloorHorizonColor = "#000000"
export const raycastSkyHorizonColor = "#14547B"
export const raycastSkyZenithColor = "#000E36"
export const blockBoundaryColor = "#444444"
export const darkenPower = 3
export const shadePower = 0.3
export const edgeDarken = 1.05
export const initialX = topViewWidth / 2
export const initialY = topViewHeight / 2
export const initialAngle = 0
export const initialHeight = 3

export const frameCadence = 30
export const rotationSpeed = (10 * frameCadence) / 100
export const movementSpeed = (10 * frameCadence) / 100
export const strafeSpeed = (10 * frameCadence) / 100
export const fastFactor = 2
