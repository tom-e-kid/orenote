<script lang="ts">
	import { t } from '$lib/i18n/translations'
	import { createEventDispatcher, onMount } from 'svelte'

	let dispatch = createEventDispatcher()
	let open = false
	let menu: HTMLDivElement

	const toggle = () => {
		open = !open
	}

	const handleClick = (operation: string) => {
		dispatch('click', { operation })
		open = false
	}

	onMount(() => {
		function handleOutsideClick(event: MouseEvent) {
			if (menu && !menu.contains(event.target as Node)) {
				open = false
			}
		}
		document.addEventListener('click', handleOutsideClick)
		return () => {
			document.removeEventListener('click', handleOutsideClick)
		}
	})
</script>

<div class="relative w-[max-content] {open ? 'z-10' : 'z-0'}" bind:this={menu}>
	<button type="button" class="flex items-center" on:click={toggle} aria-label="Operation Menu">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="size-5"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
			/>
		</svg>
	</button>

	<div
		class="secondary-background-color border-color absolute right-1 top-1 w-[200px] rounded-lg border shadow {open
			? 'block'
			: 'hidden'}"
	>
		<ul class="divide-color flex flex-col divide-y">
			<button type="button" class="p-3 text-left" on:click={() => handleClick('duplicate')}>
				{$t('common.duplicate')}
			</button>
			<button
				type="button"
				class="p-3 text-left text-red-500"
				on:click={() => handleClick('delete')}
			>
				{$t('common.delete')}
			</button>
		</ul>
	</div>
</div>
