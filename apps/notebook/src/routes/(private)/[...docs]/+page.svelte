<script lang="ts">
	import { beforeNavigate, goto, invalidateAll } from '$app/navigation'
	import { shortcuts } from '$lib/actions/shortcuts'
	import { t } from '$lib/i18n/translations'
	import type { Doc } from '$lib/models/doc'
	import { upsertDocs } from '$lib/stores/docs'
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

	const handleSave = async (needsRedirect: boolean = false) => {
		// ひとまず・・保存時にタイトルを取得して保存する
		let title = ''
		if (editor) {
			const text = editor.state.doc.firstChild?.textContent
			title = text ?? ''
		}

		const res = await fetch(`/api/docs/${editing.did}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				content: {
					...editing.content,
					title
				},
				draft: editing.draft
			})
		})
		if (!res.ok) throw new Error('Failed to save data')
		const { doc, redirectTo } = await res.json()
		if (doc) {
			upsertDocs([doc])
		}
		if (needsRedirect && redirectTo) {
			await goto(redirectTo)
		}
		await invalidateAll()
	}

	const onSave = async () => {
		submitting = true
		editor.setEditable(false)
		try {
			await handleSave(true)
		} catch (e) {
			console.error(e)
		} finally {
			editor.setEditable(true)
			submitting = false
		}
	}

	const handleShortcuts = (key: string) => {
		if (key === 's') {
			if (dirty && !submitting) {
				onSave()
			}
		}
	}

	beforeNavigate(async ({ cancel }) => {
		if (dirty && !submitting) {
			if (!editing.draft) {
				if (!confirm('Unsaved changes detected. Are you sure you want to leave this page?')) {
					cancel()
				}
			} else {
				handleSave()
			}
		}
	})

	$: if (data?.props.doc && !isEqual(data.props.doc, original)) {
		original = structuredClone(data.props.doc)
		editing = structuredClone(original)
		if (editor) {
			editor.commands.setContent(editing.content.raw as Content)
		}
	}
	$: dirty = !isEqual(editing, original)

	const isEqual = <T,>(a: T, b: T) => JSON.stringify(a) === JSON.stringify(b)

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

<main class="h-full w-full" use:shortcuts={{ keys: ['s'], callback: handleShortcuts }}>
	<header class="flex h-[44px] w-full items-center justify-end px-3">
		<span>
			<button
				class="button-style rounded-full px-5 py-1 text-xs"
				type="button"
				disabled={!dirty || submitting}
				on:click={onSave}
			>
				{$t('common.save')}
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
