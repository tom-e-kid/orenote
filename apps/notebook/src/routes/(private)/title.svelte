<script lang="ts">
	import { FilePenLine, PanelLeft } from 'lucide-svelte'

	let { open = $bindable(true) } = $props()
</script>

<div class="relative h-full w-[256px]">
	<span class="absolute left-3 top-1/2 flex -translate-y-1/2 space-x-3">
		<button
			type="button"
			onclick={() => (open = !open)}
			class="hover-scale-sm"
			aria-label="Toggle Drawer"
		>
			<PanelLeft class="size-5" />
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
		<a href="/"><FilePenLine class="size-5" /></a>
	</span>
</div>
