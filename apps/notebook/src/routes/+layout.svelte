<script lang="ts">
	import Theme from '$lib/components/theme.svelte'
	import '../app.css'
</script>

<Theme>
	<div class="text-color background-color h-full w-full">
		<slot />
	</div>
</Theme>
