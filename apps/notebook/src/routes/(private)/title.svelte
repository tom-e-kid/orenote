<script lang="ts">
	import { PanelLeftClose, PanelLeftOpen, SquarePlus } from 'lucide-svelte'

	let { open = $bindable(), md } = $props()
</script>

<div class="heading-text-color relative h-full w-[256px]">
	<span class="absolute left-3 top-1/2 flex -translate-y-1/2 items-center space-x-3">
		<button
			type="button"
			onclick={() => (open = !open)}
			class="hover-scale-sm"
			aria-label="Toggle Drawer"
		>
			{#if open}
				<PanelLeftClose class="size-6" strokeWidth={1.5} />
			{:else}
				<PanelLeftOpen class="size-6" strokeWidth={1.5} />
			{/if}
		</button>
		<h1 class="font-black transition-opacity duration-200 {open ? ' opacity-100' : 'opacity-0'}">
			ORENOTE
		</h1>
	</span>
	<span
		class="absolute top-1/2 -translate-y-1/2 transition-[right] duration-200 {open
			? 'right-3'
			: 'right-[190px]'}"
	>
		<a
			href="/"
			onclick={() => {
				if (!md) {
					open = false
				}
			}}
		>
			<SquarePlus class="size-6" strokeWidth={1.5} />
		</a>
	</span>
</div>
