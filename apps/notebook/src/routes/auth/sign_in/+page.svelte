<script lang="ts">
	import { page } from '$app/stores'
	import Notification from '$lib/components/notification.svelte'
	import { t } from '$lib/i18n/translations'
	import { signIn } from '@auth/sveltekit/client'

	let email = ''
	$: isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

	const handleMagicLink = async () => {
		await signIn('resend', { email })
	}

	$: errorKey = $page.url.searchParams.get('error')
</script>

<main class="flex h-[100svh] w-full flex-col items-center justify-center">
	<Notification note={errorKey ? { key: errorKey, type: 'error' } : null} />
	<div class="w-full max-w-[320px] space-y-3 p-3">
		<header>
			<h5 class="text-2xl font-black">ORENOTE</h5>
		</header>
		<section class="space-y-5">
			<div class="flex flex-col space-y-2">
				<input type="email" placeholder="user@example.com" class="input-box" bind:value={email} />
				<button
					type="button"
					class="hover-scale-sm rounded-md bg-black py-2 text-white disabled:bg-black/50"
					disabled={!isValid}
					on:click={handleMagicLink}
				>
					{$t('common.continue')}
				</button>
			</div>
			<div class="flex items-center space-x-3">
				<div class="border-color grow border-b"></div>
				<p class="secondary-text-color text-sm">or</p>
				<div class="border-color grow border-b"></div>
			</div>
			<div>
				<button
					type="button"
					class="hover-scale-sm flex w-full items-center justify-center space-x-2 rounded-full border border-gray-300 px-3 py-2 dark:border-black dark:bg-black"
					on:click={() => signIn('google')}
				>
					<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="h-5 w-5">
						<path
							fill="#EA4335"
							d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
						></path>
						<path
							fill="#4285F4"
							d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
						></path>
						<path
							fill="#FBBC05"
							d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
						></path>
						<path
							fill="#34A853"
							d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
						></path>
						<path fill="none" d="M0 0h48v48H0z"></path>
					</svg>
					<p class="text-sm">{$t('common.continue_google')}</p>
				</button>
			</div>
		</section>
	</div>
</main>
