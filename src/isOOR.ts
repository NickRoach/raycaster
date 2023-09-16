import { topViewHeight, topViewWidth } from "./constants"

// is a given point outside the arena area?
export const isOOR = (intX: number, intY: number) => {
	if (
		intY > topViewHeight - 1 ||
		intY < 1 ||
		intX > topViewWidth ||
		intX < 0
	) {
		return true
	} else return false
}
