<script lang="ts">
	import { PanelLeft } from 'lucide-svelte'
	import { onMount, type Snippet } from 'svelte'

	interface Props {
		title?: string
		styles?: string
		drawerStyles?: string
		open?: boolean
		header?: Snippet<[{ md: boolean }]>
		drawer: Snippet<[{ md: boolean }]>
		children: Snippet<[{ md: boolean }]>
	}

	let {
		title = '',
		styles = 'background-color',
		drawerStyles = 'secondary-background-color',
		open = $bindable(true),
		header,
		drawer,
		children
	}: Props = $props()

	let md = $state(true)
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

<div class="relative h-full w-full overflow-hidden">
	<div class={`absolute left-0 top-0 z-50 h-[44px]`}>
		{#if header}
			{@render header?.({ md })}
		{:else}
			<div class="flex h-full items-center space-x-3 p-3">
				<button
					type="button"
					onclick={() => (open = !open)}
					class="hover-scale-sm"
					aria-label="Toggle Drawer"
				>
					<PanelLeft class="size-5" />
				</button>
				<span class="text-xl drop-shadow">{title}</span>
			</div>
		{/if}
	</div>
	{#if md}
		<div
			class="absolute left-0 top-0 h-full w-[256px] {drawerStyles} {open
				? 'pointer-events-auto'
				: 'pointer-events-none'}"
		>
			<div class="h-[100svh] w-full">
				{@render drawer({ md })}
			</div>
		</div>
		<div
			class="absolute right-0 top-0 h-full shadow-md transition-[left] duration-200 {styles} {open
				? 'left-[256px]'
				: 'left-0'}"
		>
			<div class="h-[100svh] w-full">
				{@render children({ md })}
			</div>
		</div>
	{:else}
		<div class="h-[100svh] w-full {styles}">
			<div class="h-full w-full">
				{@render children({ md })}
			</div>
		</div>
		<button
			type="button"
			class="absolute left-0 top-0 z-30 h-full w-full bg-gray-700/50 transition-opacity duration-200 {open
				? 'pointer-events-auto opacity-100'
				: 'pointer-events-none opacity-0'}"
			onclick={() => (open = false)}
			aria-label="Background Dim"
		>
		</button>
		<div
			class="absolute top-0 z-40 flex h-full w-[256px] shadow-md transition-[left] duration-200 {drawerStyles} {open
				? 'pointer-events-auto left-0'
				: 'pointer-events-none -left-[256px]'}"
		>
			<div class="h-[100svh] w-full">
				{@render drawer({ md })}
			</div>
		</div>
	{/if}
</div>
