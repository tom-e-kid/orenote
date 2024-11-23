export function shortcuts(
	node: HTMLElement,
	{ keys, callback }: { keys: string[]; callback: (key: string) => void }
) {
	function handleKeydown(event: KeyboardEvent) {
		if ((event.metaKey || event.ctrlKey) && keys.includes(event.key)) {
			event.preventDefault()
			callback(event.key)
		}
	}

	window.addEventListener('keydown', handleKeydown)

	return {
		destroy() {
			window.removeEventListener('keydown', handleKeydown)
		}
	}
}
