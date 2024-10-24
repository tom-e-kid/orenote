<script lang="ts">
	import { onMount } from 'svelte'

	onMount(() => {
		const mq = window.matchMedia('(prefers-color-scheme: dark)')
		function update() {
			if (mq.matches) {
				document.documentElement.classList.add('dark')
			} else {
				document.documentElement.classList.remove('dark')
			}
		}
		mq.addEventListener('change', update)
		update()
		return () => {
			mq.removeEventListener('change', update)
		}
	})
</script>

<slot />
