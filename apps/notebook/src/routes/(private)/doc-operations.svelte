<script lang="ts">
	import { t } from '$lib/i18n/translations'
	import { Ellipsis } from 'lucide-svelte'
	import { onMount } from 'svelte'

	interface Props {
		onclick: (event: { operation: string }) => void
	}

	let { onclick }: Props = $props()
	let open = $state(false)
	let menu: HTMLDivElement

	const toggle = () => {
		open = !open
	}

	const handleClick = (operation: string) => {
		onclick?.({ operation })
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
	<button type="button" class="flex items-center" onclick={toggle} aria-label="Operation Menu">
		<Ellipsis class="size-5" strokeWidth={1.5} />
	</button>
	<div
		class="secondary-background-color border-color absolute right-1 top-1 w-[200px] rounded-lg border shadow {open
			? 'block'
			: 'hidden'}"
	>
		<ul class="divide-color flex flex-col divide-y">
			<button type="button" class="p-3 text-left" onclick={() => handleClick('duplicate')}>
				{$t('common.duplicate')}
			</button>
			<button
				type="button"
				class="p-3 text-left text-red-500"
				onclick={() => handleClick('delete')}
			>
				{$t('common.delete')}
			</button>
		</ul>
	</div>
</div>
