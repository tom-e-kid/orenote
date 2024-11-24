<script lang="ts">
	import { toasts } from '$lib/stores/toasts'
	import { cubicInOut } from 'svelte/easing'

	const stypesForType = (type: 'error' | 'success' | 'info') => {
		switch (type) {
			case 'error':
				return 'border-red-500 bg-red-500/60 text-red-500'
			case 'success':
				return 'border-green-500 bg-green-500/60 text-green-500'
			case 'info':
				return 'border-blue-500 bg-blue-500/60 text-blue-500'
		}
	}

	const slide = (node: HTMLElement, { duration = 300, easing = cubicInOut }) => {
		const style = getComputedStyle(node)
		const transform = style.transform === 'none' ? '' : style.transform
		const width = parseFloat(style.width)
		return {
			duration,
			easing,
			css: (t: number) => `
        transform: ${transform} translateX(${(1 - t) * width}px);
      `
		}
	}
</script>

<div class="fixed bottom-0 right-0 top-0 overflow-auto" style="z-index: 1000;">
	<ul class="space-y-1 p-3">
		{#each $toasts as toast (toast.id)}
			<li
				transition:slide={{ duration: 200 }}
				class="rounded border p-3 text-sm font-bold shadow {stypesForType(toast.type)}"
			>
				{toast.message}
			</li>
		{/each}
	</ul>
</div>
