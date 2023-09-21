export const hexToRgba = (hexColor: string) => {
	const r = Number(`0x${hexColor.slice(1, 3)}`)
	const g = Number(`0x${hexColor.slice(3, 5)}`)
	const b = Number(`0x${hexColor.slice(5, 7)}`)
	const a = Number(`0x${hexColor.slice(5, 8)}`) ?? 1
	return { r, g, b, a }
}
