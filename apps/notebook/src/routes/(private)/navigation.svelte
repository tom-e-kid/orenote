<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import type { Doc } from '$lib/models/doc'
	import { docsStore } from '$lib/stores/docs'
	import { onMount } from 'svelte'
	import Account from './account.svelte'
	import DocOperations from './doc-operations.svelte'

	let docs: Doc[] = []
	let total = 0
	let offset = 0
	const limit = 20
	let loading = false

	const loadMore = async () => {
		if (loading) return
		loading = true
		try {
			const res = await fetch(`/api/docs?limit=${limit}&offset=${offset}`)
			if (!res.ok) throw new Error('Failed to fetch data')

			const data = await res.json()
			docs = [...docs, ...data.docs]
			total = data.total
			offset += limit
			docsStore.set(docs)
		} catch (e) {
			console.error(e)
		} finally {
			loading = false
		}
	}

	const handleDuplicate = async (did: string) => {
		const doc = docs.find((d) => d.did === did)
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
		docs = [data.doc, ...docs]
		docsStore.set(docs)
	}

	const handleDelete = async (did: string) => {
		const res = await fetch(`/api/docs/${did}`, { method: 'DELETE' })
		if (!res.ok) return
		docs = docs.filter((d) => d.did !== did)
		docsStore.set(docs)
		await goto('/')
	}

	const handleOperations = async (iid: string, operation: string) => {
		if (!iid) return
		if (operation === 'duplicate') {
			await handleDuplicate(iid)
		} else if (operation === 'delete') {
			await handleDelete(iid)
		}
	}

	$: linkStyle = (href: string) => {
		if ($page.url.pathname.startsWith(href)) return 'bg-gray-200 dark:bg-gray-800 selected'
		return ''
	}

	docsStore.subscribe((value) => {
		docs = value
	})

	onMount(async () => {
		if (docs.length === 0) {
			await loadMore()
		}
	})
</script>

<nav class="flex h-full flex-col px-2">
	<header class="h-[44px]"></header>
	<section class="grow space-y-3 overflow-auto">
		<h3 class="text-xs font-semibold">Docs</h3>
		<ul class="space-y-1">
			{#each docs as doc}
				<li
					class="flex h-[44px] items-center rounded px-2 hover:bg-gray-200 hover:dark:bg-gray-800 {linkStyle(
						`/docs/${doc.did}`
					)}"
				>
					<a href={`/docs/${doc.did}`} class="flex h-full grow items-center truncate">
						<span class="truncate">{doc.content.title || 'Untitled'}</span>
					</a>
					<span class="selected:block hidden">
						<DocOperations on:click={(e) => handleOperations(doc.did ?? '', e.detail.operation)} />
					</span>
				</li>
			{/each}
		</ul>
		<div class="flex items-center justify-center">
			{#if docs.length < total}
				<button type="button" on:click={loadMore} disabled={loading} class="button-style text-xs">
					{#if loading}Loading...{/if}
					{#if !loading}Read More{/if}
				</button>
			{:else}
				<p class="secondary-text-color text-xs">All items loaded.</p>
			{/if}
		</div>
	</section>
	<footer class="h-[44px]">
		<Account />
	</footer>
</nav>

<style>
	.selected .hidden {
		display: block;
	}
</style>
