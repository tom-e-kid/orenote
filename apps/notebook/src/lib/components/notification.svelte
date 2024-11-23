<script lang="ts">
	export let note: { key: string; type: 'error' } | null = null
	const messages: Record<string, string> = {
		OAuthAccountNotLinked: 'Your account is not linked with any OAuth provider.',
		UnknownError: 'Unknown error occurred.'
	}
	$: message = note ? messages[note.key] || messages.UnknownError : messages.UnknownError
</script>

{#if message}
	<div class="rounded border border-red-500 bg-red-500/60 p-3 text-sm text-white">
		{message}
	</div>
{/if}
