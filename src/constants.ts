export const backgroundColor = "black"
export const topViewBackgroundColor = "#555555"
export const topViewBlockColor = "#156A03"
export const topViewGridColor = "#111111"
export const topViewGridLineWidth = 1
export const xSize = 50
export const ySize = 50
export const topViewBlockSize = 9
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
export const distanceColor = "#8485EE"
export const rD = Number(`0x${distanceColor.slice(1, 3)}`)
export const gD = Number(`0x${distanceColor.slice(3, 5)}`)
export const bD = Number(`0x${distanceColor.slice(5, 7)}`)
export const raycastFloorNadirColor = "#C68C3B"
export const raycastFloorHorizonColor = "#9EA498"
export const raycastSkyHorizonColor = "#8485EE"
export const raycastSkyZenithColor = "#1A3CD0"
export const blockBoundaryColor = "#444444"
export const darkenPower = 0.5
export const initialX = topViewWidth / 2 + 1
export const initialY = topViewHeight / 2 + 1
// const initialX = 123
// const initialY = 192
export const initialAngle = 45

export const frameCadence = 30
export const rotationSpeed = 60 / frameCadence
export const movementSpeed = 100 / frameCadence
export const strafeSpeed = 100 / frameCadence
export const fastFactor = 2
