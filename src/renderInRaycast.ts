import {
	topViewHeight,
	topViewWidth,
	darkenPower,
	rD,
	gD,
	bD,
	raycastHeight,
	raycastLeft,
	raycastTop,
	fieldOfViewAngle,
	raycastWidth,
	topViewBlockSize,
	edgeDarken
} from "./constants"
import { getDegrees, getRadians } from "./getRadians"
import { getXYVertices } from "./getXYVertices"
import {
	BlocksToRender,
	FaceWithDistance,
	Faces,
	Position,
	Vertex
} from "./types"

export const renderInRaycast = (
	blocksToRender: BlocksToRender,
	position: Position,
	yFactor: number,
	ctx: CanvasRenderingContext2D
) => {
	// this mixes two colors in the ratio given by f. c is color 1, d is color 2
	const getDistanceColor = (c: number, d: number, f: number) => {
		return c * f + (d - d * f)
	}

	// this darkens the color by the factor given by f
	const getShadedColor = (c: number, shadeF: number) => {
		return c * shadeF
	}

	const yCenter = raycastTop + raycastHeight / 2
	const distanceToFillFov =
		topViewBlockSize / 2 / Math.tan(getRadians(fieldOfViewAngle / 2))

	const sortedBlockArray = Object.values(blocksToRender).sort((a, b) => {
		return b.distance - a.distance
	})

	const fullDarkDistance = Math.sqrt(
		topViewHeight * topViewHeight + topViewWidth * topViewWidth
	)

	// render each block in the raycast view
	for (let blockToRender of sortedBlockArray) {
		const { distance, address, block } = blockToRender
		let f = Math.pow(
			(fullDarkDistance - distance) / fullDarkDistance,
			darkenPower
		)

		const color = block.color

		const r = Number(`0x${color.slice(1, 3)}`)
		const g = Number(`0x${color.slice(3, 5)}`)
		const b = Number(`0x${color.slice(5, 7)}`)

		const corners = getXYVertices(address)

		// convert corners to raycast render space
		let vertices: Vertex[] = []
		for (let i = 0; i < corners.length; i++) {
			const v = corners[i]

			const xOffset = v.x - position.x
			const yOffset = position.y - v.y

			// angle between zero and the vertex
			const alpha = getDegrees(Math.atan(xOffset / yOffset))

			// necessary while looking south
			const corrector = v.y > position.y ? 1 : 0

			// angle from the center of the field of view to the vertex. It corresponds to the column
			const vertTheta = getRadians(
				alpha - position.angle + 180 * corrector
			)

			const calcColumn =
				raycastLeft +
				Math.round(yFactor * Math.tan(vertTheta) + raycastWidth / 2) +
				1

			const vertDistance = Math.sqrt(
				xOffset * xOffset + yOffset * yOffset
			)

			const distanceCor = vertDistance * Math.cos(vertTheta)

			const blockUnitHeight =
				(distanceToFillFov / distanceCor) * raycastWidth
			const vertHeight = blockUnitHeight * block.height
			const vertBottom =
				yCenter + blockUnitHeight * (position.height - block.base)

			const vertTop = vertBottom - vertHeight

			vertices.push({ x: calcColumn, y: vertTop, distanceCor })
			vertices.push({ x: calcColumn, y: vertBottom, distanceCor })
		}

		let faces: Faces = {
			north: [vertices[0], vertices[1], vertices[3], vertices[2]],
			south: [vertices[4], vertices[5], vertices[7], vertices[6]],
			west: [vertices[0], vertices[1], vertices[7], vertices[6]],
			east: [vertices[2], vertices[3], vertices[5], vertices[4]]
		}

		const top = [vertices[0], vertices[2], vertices[4], vertices[6]]
		const bott = [vertices[1], vertices[3], vertices[5], vertices[7]]

		const rDist = getDistanceColor(r, rD, f)
		const gDist = getDistanceColor(g, gD, f)
		const bDist = getDistanceColor(b, bD, f)
		const renderFace = (face: Vertex[] | number, darkness: number) => {
			const rA = getShadedColor(rDist, darkness)
			const gA = getShadedColor(gDist, darkness)
			const bA = getShadedColor(bDist, darkness)

			const darkenedColor = `rgb(${rA},${gA},${bA},${block.transparency})`

			ctx.fillStyle = darkenedColor

			ctx.beginPath()
			ctx.moveTo(face[0].x, face[0].y)
			ctx.lineTo(face[1].x, face[1].y)
			ctx.lineTo(face[2].x, face[2].y)
			ctx.lineTo(face[3].x, face[3].y)
			ctx.fill()
			ctx.closePath()
		}

		const faceArray: FaceWithDistance[] = []
		for (const key in faces) {
			const face = faces[key]

			const averageDistance =
				(face[0].distanceCor +
					face[1].distanceCor +
					face[2].distanceCor +
					face[3].distanceCor) /
				4
			faceArray.push({ [key]: face, averageDistance })
		}

		faceArray.sort((a, b) => {
			return b.averageDistance - a.averageDistance
		})

		const topDarkness = 1
		const bottomDarkness = 0.5

		// if the top or bottom is further than the sides, render it now
		if (position.height > block.base) {
			renderFace(bott, bottomDarkness)
		}
		if (position.height < block.base + block.height) {
			renderFace(top, topDarkness)
		}

		faceArray.forEach((face) => {
			let darkness: number
			let key = Object.keys(face)[0]
			switch (key) {
				case "north":
					darkness = 0.9
					break
				case "south":
					darkness = 0.7
					break
				case "west":
					darkness = 0.8
					break
				case "east":
					darkness = 0.6
					break
			}
			renderFace(Object.values(face)[0], darkness)
		})

		// if the top or bottom is closer than the sides, render it now
		if (position.height < block.base) {
			renderFace(bott, bottomDarkness)
		}

		if (position.height > block.base + block.height) {
			renderFace(top, topDarkness)
		}
	} // end of for loop
}
