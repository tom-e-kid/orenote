<script lang="ts">
	import { beforeNavigate, goto, invalidateAll } from '$app/navigation'
	import { shortcut } from '$lib/actions/shortcut'
	import type { Doc } from '$lib/models/doc'
	import { docsStore } from '$lib/stores/docs'
	import { Editor, type Content } from '@tiptap/core'
	import Placeholder from '@tiptap/extension-placeholder'
	import StarterKit from '@tiptap/starter-kit'
	import { onDestroy, onMount } from 'svelte'
	import type { PageData } from './$types'

	export let data: PageData

	let editor: Editor
	let element: HTMLDivElement
	let submitting = false
	let original: Doc
	let editing: Doc

	$: if (data?.doc && !isEqual(data.doc as Doc, original)) {
		original = structuredClone(data.doc)
		editing = structuredClone(data.doc)
		if (editor) {
			editor.commands.setContent(editing.content.raw as Content)
		}
	}
	$: dirty = !isEqual(editing, original)

	const isEqual = <T,>(a: T, b: T) => JSON.stringify(a) === JSON.stringify(b)

	const updateStore = (doc: Doc) => {
		docsStore.update((docs) => {
			const index = docs.findIndex((d) => d.did === doc.did)
			if (index !== -1) {
				docs[index] = doc
			} else {
				docs.unshift(doc)
			}
			return docs
		})
	}

	const create = async () => {
		const res = await fetch(`/api/docs`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(editing.content)
		})
		if (res.ok) {
			const { doc } = await res.json()
			updateStore(doc)
			await goto(`/docs/${doc.did}`)
			// location.reload()
		}
	}

	const update = async () => {
		const res = await fetch(`/api/docs/${editing.did}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(editing.content)
		})
		if (res.ok) {
			const { doc } = await res.json()
			updateStore(doc)
			await invalidateAll()
		}
	}

	const onSave = async () => {
		submitting = true
		editor.setEditable(false)
		try {
			// ひとまず・・保存時にタイトルを取得して保存する
			let title = ''
			if (editor) {
				const text = editor.state.doc.firstChild?.textContent
				title = text ?? ''
			}
			editing.content.title = title

			if (editing.did) {
				await update()
			} else {
				await create()
			}
		} catch (e) {
			console.error(e)
		} finally {
			editor.setEditable(true)
			submitting = false
		}
	}

	const handleShortcut = async () => {
		if (dirty && !submitting) {
			await onSave()
		}
	}

	beforeNavigate(async ({ cancel }) => {
		if (
			!submitting &&
			dirty &&
			!confirm('Unsaved changes detected. Are you sure you want to leave this page?')
		) {
			cancel()
		}
	})

	onMount(() => {
		editor = new Editor({
			element,
			extensions: [
				StarterKit,
				Placeholder.configure({
					placeholder: placeholderRandom()
				})
			],
			content: editing.content.raw as Content,
			editorProps: {
				attributes: {
					class: 'focus-within:outline-none h-full overflow-auto p-3'
				}
			},
			onTransaction: () => {
				editor = editor
			},
			onUpdate: ({ editor }) => {
				if (editor.isEmpty) {
					editing.content.raw = null
				} else {
					editing.content.raw = editor.getJSON()
				}
			}
		})
	})

	onDestroy(() => {
		if (editor) {
			editor.destroy()
		}
	})

	const placeholderRandom = () => {
		const placeholders = [
			'Start typing your thoughts here...',
			'Write something memorable...',
			"What's on your mind today?",
			'Capture your ideas...',
			'Jot down a quick note...',
			'Your thoughts, organized here.',
			'Write your next big idea...',
			'Make a note of anything important...',
			'Type to start a new note...',
			'Your ideas, big or small, go here.'
		]
		const index = Math.floor(Math.random() * placeholders.length)
		return placeholders[index]
	}
</script>

<main class="h-full w-full" use:shortcut={{ key: 's', callback: handleShortcut }}>
	<header class="flex h-[44px] w-full items-center justify-end px-3">
		<span>
			<button
				class="button-style rounded-full px-5 py-1"
				type="button"
				disabled={!dirty || submitting}
				on:click={onSave}
			>
				Save
			</button>
		</span>
	</header>
	<section class="h-[calc(100%-88px)] w-full">
		<div class="h-full w-full" bind:this={element}></div>
	</section>
	<footer class="border-color flex h-[44px] w-full items-center border-t px-3">
		<p class="secondary-text-color text-xs">Under Construction...</p>
	</footer>
</main>
