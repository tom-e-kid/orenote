<script lang="ts">
	import Drawer from '$lib/components/drawer.svelte'
	import Navigation from './navigation.svelte'
	import Title from './title.svelte'

	let open = true
</script>

<Drawer bind:open>
	<svelte:fragment slot="header">
		<Title bind:open />
	</svelte:fragment>
	<svelte:fragment slot="drawer">
		<Navigation />
	</svelte:fragment>
	<svelte:fragment>
		<slot />
	</svelte:fragment>
</Drawer>
