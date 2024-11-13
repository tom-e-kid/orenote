export function shortcut(
	node: HTMLElement,
	{ key, callback }: { key: string; callback: () => void }
) {
	function handleKeydown(event: KeyboardEvent) {
		if ((event.metaKey || event.ctrlKey) && event.key === key) {
			event.preventDefault()
			callback()
		}
	}

	window.addEventListener('keydown', handleKeydown)

	return {
		destroy() {
			window.removeEventListener('keydown', handleKeydown)
		}
	}
}
