<script lang="ts">
	import { onMount } from 'svelte'

	export let styles = 'background-color'
	export let title = ''
	export let drawerStyles = 'secondary-background-color'
	export let open = true

	let md = true
	onMount(() => {
		const mq = window.matchMedia('(min-width: 768px)')
		function update() {
			md = mq.matches
			if (!md && open) {
				open = false
			}
		}
		mq.addEventListener('change', update)
		update()
		return () => {
			mq.removeEventListener('change', update)
		}
	})
</script>

<div class="relative h-[100vh] w-[100vw]">
	<div class={`absolute left-0 top-0 z-20 h-[44px]`}>
		<div class="flex h-full items-center space-x-3 p-3">
			<button type="button" on:click={() => (open = !open)} class="hover-scale-sm">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="secondary-text-color size-5"
				>
					<rect x="2" y="2" width="20" height="18" rx="4" ry="4" />
					<line x1="10" y1="2" x2="10" y2="20" />
				</svg>
			</button>
			<span class="secondary-text-color pb-1 text-xl font-extralight drop-shadow">{title}</span>
		</div>
	</div>
	{#if md}
		<div
			class="absolute left-0 top-0 h-full w-[256px] {drawerStyles} {open
				? 'pointer-events-auto'
				: 'pointer-events-none'}"
		>
			<div class="h-[100svh] w-full">
				<slot name="drawer">
					<p class="p-3">Drawer</p>
				</slot>
			</div>
		</div>
		<div
			class="absolute right-0 top-0 z-10 h-full shadow-md transition-[left] duration-200 {styles} {open
				? 'left-[256px]'
				: 'left-0'}"
		>
			<div class="h-[100svh] w-full">
				<slot>
					<p class="p-3">Content</p>
				</slot>
			</div>
		</div>
	{:else}
		<div class="h-[100svh] w-full {styles}">
			<div class="h-full w-full">
				<slot>
					<p class="p-3">Content</p>
				</slot>
			</div>
		</div>
		<button
			class="absolute left-0 top-0 h-full w-full bg-gray-700/50 transition-opacity duration-300 {open
				? 'pointer-events-auto opacity-100'
				: 'pointer-events-none opacity-0'}"
			on:click={() => (open = false)}
		></button>
		<div
			class="absolute top-0 flex h-full w-[256px] shadow-md transition-[left] duration-300 {drawerStyles} {open
				? 'pointer-events-auto left-0'
				: 'pointer-events-none -left-[256px]'}"
		>
			<div class="h-[100svh] w-full">
				<slot name="drawer">
					<p class="p-3">Drawer</p>
				</slot>
			</div>
		</div>
	{/if}
</div>
