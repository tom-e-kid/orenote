<script lang="ts">
	import Drawer from '$lib/components/drawer.svelte'
	import Navigation from './navigation.svelte'
	import Title from './title.svelte'

	let { children } = $props()
	let open = $state(true)
</script>

<Drawer bind:open>
	{#snippet header()}
		<Title bind:open />
	{/snippet}
	{#snippet drawer({ md })}
		<Navigation {md} bind:open />
	{/snippet}
	{@render children?.()}
</Drawer>
