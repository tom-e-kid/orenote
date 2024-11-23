<script lang="ts">
	let { key } = $props()

	const messages: Record<string, string> = {
		OAuthAccountNotLinked: 'Your account is not linked with any OAuth provider.',
		UnknownError: 'Unknown error occurred.'
	}

	let message = $derived(key ? messages[key] || messages.UnknownError : null)
</script>

{#if message}
	<div class="rounded border border-red-500 bg-red-500/60 p-3 text-sm text-white">
		{message}
	</div>
{/if}
