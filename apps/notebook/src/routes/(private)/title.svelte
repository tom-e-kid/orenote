<script lang="ts">
	import { t } from '$lib/i18n/translations'

	export let open = true
</script>

<div class="relative h-full w-[256px]">
	<span class="absolute left-3 top-1/2 mt-[2px] flex -translate-y-1/2 space-x-3">
		<button
			type="button"
			on:click={() => (open = !open)}
			class="hover-scale-sm"
			aria-label="Toggle Drawer"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="secondary-text-color mt-[1px] size-5"
			>
				<rect x="2" y="2" width="20" height="18" rx="4" ry="4" />
				<line x1="10" y1="2" x2="10" y2="20" />
			</svg>
		</button>
		<h1
			class="font-extralight transition-opacity duration-200 {open ? ' opacity-100' : 'opacity-0'}"
		>
			ORENOTE
		</h1>
	</span>
	<span
		class="absolute top-1/2 -translate-y-1/2 transition-[right] duration-200 {open
			? 'right-3'
			: 'right-[160px]'}"
	>
		<a href="/" class="button-style rounded-full px-3 py-1 text-xs">{$t('common.new')}</a>
	</span>
</div>
