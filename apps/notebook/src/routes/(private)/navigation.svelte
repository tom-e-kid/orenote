<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { t } from '$lib/i18n/translations'
	import type { Doc } from '$lib/models/doc'
	import { clearDocs, docs, removeDoc, upsertDocs } from '$lib/stores/docs'
	import { CalendarDays } from 'lucide-svelte'
	import { onMount } from 'svelte'
	import Account from './account.svelte'
	import DocOperations from './doc-operations.svelte'

	let { open = $bindable(), md } = $props()

	const limit = 20
	let total = $state(0)
	let offset = $state(0)
	let loading = $state(false)

	const reset = () => {
		offset = 0
		total = 0
		clearDocs()
	}

	const loadMore = async () => {
		if (loading) return
		loading = true
		try {
			const res = await fetch(`/api/docs?limit=${limit}&offset=${offset}`)
			if (!res.ok) throw new Error('Failed to fetch data')
			const data = await res.json()
			total = data.total
			offset += limit
			upsertDocs(data.docs)
		} catch (e) {
			console.error(e)
		} finally {
			loading = false
		}
	}

	const handleDuplicate = async (doc: Doc) => {
		if (!doc) return
		const res = await fetch(`/api/docs`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(doc.content)
		})
		if (!res.ok) return
		const data = await res.json()
		upsertDocs([data.idea])
	}

	const handleDelete = async (did: string) => {
		const res = await fetch(`/api/docs/${did}`, { method: 'DELETE' })
		if (!res.ok) return
		removeDoc(did)
		total -= 1
		await goto('/')
	}

	const handleOperations = async (doc: Doc, operation: string) => {
		if (!doc || !doc.did) return
		if (operation === 'duplicate') {
			await handleDuplicate(doc)
		} else if (operation === 'delete') {
			await handleDelete(doc.did)
		}
	}

	const handleTransition = () => {
		if (!md) {
			open = false
		}
	}

	const linkStyle = $derived((href: string) => {
		if ($page.url.pathname.startsWith(href)) return 'bg-gray-200 dark:bg-gray-800 selected'
		return ''
	})

	onMount(async () => {
		reset()
		loadMore()
	})
</script>

<nav class="flex h-full flex-col space-y-3 px-2">
	<header class="h-[44px]"></header>
	<section>
		<ul class="space-y-1">
			<li class="flex h-[32px] items-center rounded px-2 hover:bg-gray-200 hover:dark:bg-gray-800">
				<a
					href="/calendar"
					class="flex h-full grow items-center truncate"
					onclick={handleTransition}
				>
					<CalendarDays class="mr-2 size-4" />
					<span class="truncate">{$t('common.calendar')}</span>
				</a>
			</li>
		</ul>
	</section>
	<section class="grow space-y-1 overflow-auto">
		<h3 class="text-xs font-semibold">{$t('common.docs')}</h3>
		<ul class="space-y-1">
			{#each $docs as doc}
				<li
					class="flex h-[32px] items-center rounded px-2 hover:bg-gray-200 hover:dark:bg-gray-800 {linkStyle(
						`/docs/${doc.did}`
					)}"
				>
					<a
						href={`/docs/${doc.did}`}
						class="flex h-full grow items-center truncate"
						onclick={handleTransition}
					>
						<span class="truncate text-sm">{doc.content.title || $t('common.untitled')}</span>
					</a>
					<span class="selected:block hidden">
						<DocOperations onclick={(e) => handleOperations(doc, e.operation)} />
					</span>
				</li>
			{/each}
		</ul>
		<div class="flex items-center justify-center">
			{#if $docs.length < total}
				<button type="button" onclick={loadMore} disabled={loading} class="button-style text-xs">
					{#if loading}{$t('common.loading')}{/if}
					{#if !loading}{$t('common.read_more')}{/if}
				</button>
			{:else}
				<p class="secondary-text-color text-xs">{$t('common.all_items_loaded')}</p>
			{/if}
		</div>
	</section>
	<footer class="py-3">
		<Account />
	</footer>
</nav>

<style>
	.selected .hidden {
		display: block;
	}
</style>
