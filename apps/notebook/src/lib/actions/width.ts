export function width(
	node: HTMLElement,
	{ threshold, onChange }: { threshold: number; onChange: (over: boolean) => void }
) {
	const resizeObserver = new ResizeObserver((entries) => {
		for (const entry of entries) {
			const width = entry.contentRect.width
			onChange(width >= threshold)
		}
	})

	resizeObserver.observe(node)

	return {
		destroy() {
			resizeObserver.unobserve(node)
		}
	}
}
