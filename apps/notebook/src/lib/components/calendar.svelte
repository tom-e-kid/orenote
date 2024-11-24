<script lang="ts">
	import { format } from '$lib/calendar'
	import { onMount } from 'svelte'

	interface Props {
		date: Date
		onmonth?: (event: { year: number; month: number; date: string }) => void
		ontoday?: (event: { year: number; month: number; date: string }) => void
		cell?: (date: string) => any
	}

	let { date, onmonth, ontoday, cell }: Props = $props()
	let year = $state(date.getFullYear())
	let month = $state(date.getMonth()) // 0-indexed

	function build(year: number, month: number) {
		const days = []

		const firstDay = new Date(year, month, 1).getDay()
		for (let i = 0; i < firstDay; i++) {
			days.push(NaN)
		}

		const lastDate = new Date(year, month + 1, 0)
		const daysInMonth = lastDate.getDate()
		for (let i = 1; i <= daysInMonth; i++) {
			days.push(i)
		}

		const lastDay = lastDate.getDay()
		if (lastDay < 6) {
			for (let i = 0; i < 6 - lastDay; i++) {
				days.push(NaN)
			}
		}
		return days
	}

	function prevMonth() {
		month--
		if (month < 0) {
			month = 11
			year--
		}
		onmonth?.({ year, month, date: format(year, month, 1) })
	}

	function nextMonth() {
		month++
		if (month > 11) {
			month = 0
			year++
		}
		onmonth?.({ year, month, date: format(year, month, 1) })
	}

	function handleToday() {
		const now = new Date()
		month = now.getMonth()
		year = now.getFullYear()
		ontoday?.({ year, month, date: format(year, month, now.getDate()) })
	}

	onMount(() => {
		onmonth?.({ year, month, date: format(year, month, 1) })
	})

	const title = $derived(`${year}年${month + 1}月`)
	const days = $derived(build(year, month))
</script>

<div>
	<div class="flex items-center justify-end space-x-3">
		<span class="text-xl font-black">{title}</span>
		<div class="flex items-center space-x-1 text-xs">
			<button type="button" class="button-style" onclick={prevMonth} aria-label="Prev Month">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="h-3 w-3"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
				</svg>
			</button>
			<button type="button" class="button-style font-semibold" onclick={handleToday}>
				Today
			</button>
			<button type="button" class="button-style" onclick={nextMonth} aria-label="Next Month">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="h-3 w-3"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
				</svg>
			</button>
		</div>
	</div>
	<div class="grid grid-cols-7">
		{#each ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as day}
			<div class="px-2 text-right text-xs">{day}</div>
		{/each}
	</div>
	<div class="border-color grid grid-cols-7 gap-0 border-l border-t">
		{#each days as day}
			{#if day}
				<div class="border-color border-b border-r">
					{#if cell}
						{@render cell(format(year, month, day))}
					{:else}
						<div class="p-2 text-center">{day}</div>
					{/if}
				</div>
			{:else}
				<div class="border-color secondary-background-color border-b border-r"></div>
			{/if}
		{/each}
	</div>
</div>
