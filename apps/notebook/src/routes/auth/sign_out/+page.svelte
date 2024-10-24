<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { signOut } from '@auth/sveltekit/client'
	import { onMount } from 'svelte'

	onMount(async () => {
		if ($page.data.session) {
			await signOut()
		} else {
			goto('/', { invalidateAll: true })
		}
	})
</script>

<main class="h-full w-full p-3">
	<p class="text-lg font-black">See you...</p>
</main>
