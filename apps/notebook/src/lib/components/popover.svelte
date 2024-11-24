<script lang="ts">
	import {
		arrow,
		autoPlacement,
		autoUpdate,
		computePosition,
		offset,
		shift,
		type Placement
	} from '@floating-ui/dom'
	import { onMount, type Snippet } from 'svelte'

	interface Props {
		class?: string
		buttonClass?: string
		placement?: Placement
		dismissOnOutsideClick?: boolean
		pop?: boolean
		popover: Snippet
		children?: Snippet
	}

	let {
		class: className = 'secondary-background-color w-[max-content] px-3 py-1 shadow-xl rounded-xl',
		buttonClass = '',
		placement,
		dismissOnOutsideClick = true,
		pop = false,
		popover,
		children
	}: Props = $props()

	let reference: HTMLButtonElement
	let floating: HTMLDivElement
	let arrowEl: HTMLDivElement
	let cleanup: () => void

	function update() {
		if (cleanup) {
			cleanup()
		}
		cleanup = autoUpdate(reference, floating, () => {
			const middleware = [offset(4), shift(), arrow({ element: arrowEl })]
			if (!placement) {
				middleware.unshift(autoPlacement())
			}
			computePosition(reference, floating, {
				placement,
				middleware
			}).then(({ x, y, middlewareData, placement }) => {
				Object.assign(floating.style, {
					left: `${x}px`,
					top: `${y}px`
				})
				const { x: ax, y: ay } = middlewareData.arrow as { x: number; y: number }
				const staticSide = {
					top: 'bottom',
					right: 'left',
					bottom: 'top',
					left: 'right'
				}[placement.split('-')[0]]
				Object.assign(arrowEl.style, {
					left: ax != null ? `${ax}px` : '',
					top: ay != null ? `${ay}px` : '',
					right: '',
					bottom: '',
					[staticSide as string]: '-6px'
				})
			})
		})
	}

	function toggle() {
		pop = !pop
	}

	$effect(() => {
		if (pop) {
			update()
		} else {
			if (cleanup) {
				cleanup()
			}
		}
	})

	onMount(() => {
		function handleOutsideClick(event: MouseEvent) {
			if (
				pop &&
				floating &&
				!floating.contains(event.target as Node) &&
				!reference.contains(event.target as Node)
			) {
				if (dismissOnOutsideClick) {
					pop = false
				}
			}
		}
		document.addEventListener('click', handleOutsideClick)
		return () => {
			document.removeEventListener('click', handleOutsideClick)
			if (cleanup) {
				cleanup()
			}
		}
	})
</script>

<button bind:this={reference} type="button" class={buttonClass} onclick={toggle}>
	{@render children?.()}
</button>

<div bind:this={floating} class="absolute z-50 {className} {pop ? 'block' : 'hidden'}">
	<div bind:this={arrowEl} class="absolute h-[12px] w-[12px] rotate-45 bg-inherit"></div>
	{@render popover()}
</div>
