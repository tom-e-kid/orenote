<script lang="ts">
	import { page } from '$app/stores'
	import { createEventDispatcher, onMount } from 'svelte'

	let dispatch = createEventDispatcher()
	let open = false
	let menu: HTMLDivElement

	const toggle = () => {
		open = !open
	}

	const handleClick = (operation: string) => {
		dispatch('click', { detail: operation })
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

	$: session = $page.data.session!
</script>

<div class="relative {open ? 'z-10' : 'z-0'}" bind:this={menu}>
	<button
		type="button"
		class="z-0 flex h-[44px] w-full items-center space-x-2 rounded px-2 font-medium hover:bg-gray-200 hover:dark:bg-gray-800"
		on:click={toggle}
		aria-label="Accout Menu"
	>
		<span>
			{#if session.user?.image}
				<img src={session.user.image} class="size-5 rounded-full" alt="User Avatar" />
			{:else}
				<div>
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
							d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
						/>
					</svg>
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
				Sign out
			</a>
		</ul>
	</div>
</div>
