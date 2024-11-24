<script lang="ts">
	import Calendar from '$lib/components/calendar.svelte'
</script>

<main class="h-full w-full">
	<header class="h-[44px]"></header>
	<section class="h-[calc(100%-44px)] px-5 py-3">
		<Calendar date={new Date()}>
			{#snippet cell(date)}
				<div>{date}</div>
			{/snippet}
		</Calendar>
	</section>
</main>
