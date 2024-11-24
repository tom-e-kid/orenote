<script lang="ts">
	import { page } from '$app/stores'
	import { t } from '$lib/i18n/translations'
	import { CircleUserRound } from 'lucide-svelte'
	import { onMount } from 'svelte'

	let session = $page.data.session!
	let open = $state(false)
	let menu: HTMLDivElement

	const toggle = () => {
		open = !open
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

<div class="relative {open ? 'z-10' : 'z-0'}" bind:this={menu}>
	<button
		type="button"
		class="z-0 flex h-[44px] w-full items-center space-x-2 rounded px-2 font-medium hover:bg-gray-200 hover:dark:bg-gray-800"
		onclick={toggle}
		aria-label="Accout Menu"
	>
		<span>
			{#if session.user?.image}
				<img src={session.user.image} class="size-5 rounded-full" alt="User Avatar" />
			{:else}
				<div>
					<CircleUserRound class="size-5" strokeWidth={1.5} />
				</div>
			{/if}
		</span>
		<p class="">{session.user?.name ?? session.user?.email ?? 'Unknown'}</p>
	</button>

	<div
		class="secondary-background-color border-color absolute bottom-[52px] left-1 right-1 rounded-lg border shadow {open
			? 'block'
			: 'hidden'}"
	>
		<ul class="divide-color flex flex-col divide-y">
			<a
				href="/auth/sign_out"
				class="flex h-[44px] items-center space-x-2 rounded px-2 font-medium hover:bg-gray-200 hover:dark:bg-gray-800"
			>
				{$t('common.sign_out')}
			</a>
		</ul>
	</div>
</div>
