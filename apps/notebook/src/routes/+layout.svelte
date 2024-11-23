<script lang="ts">
	import Theme from '$lib/components/theme.svelte'
	import '../app.css'

	let { children } = $props()
</script>

<Theme>
	<div class="text-color background-color h-full w-full">
		{@render children?.()}
	</div>
</Theme>
