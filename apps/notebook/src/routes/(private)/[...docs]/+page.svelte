<script lang="ts">
	import { format } from 'date-fns'

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

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()

	let editor: Editor
	let element: HTMLDivElement | undefined = $state(undefined)
	let submitting = $state(false)
	let original: Doc
	let editing = $state({} as Doc)
	let updatedAt = $state('')
	let dirty = $state(false)

	const isEqual = <T,>(a: T, b: T) => JSON.stringify(a) === JSON.stringify(b)

	$effect(() => {
		if (data?.props.doc && !isEqual(data.props.doc, original)) {
			original = structuredClone(data.props.doc)
			editing = structuredClone(original)
			updatedAt = original.updatedAt
				? format(new Date(original.updatedAt), 'yyyy.MM.dd HH:mm:ss')
				: ''
			if (editor) {
				editor.commands.setContent(editing.content.raw as Content)
			}
		}
	})

	$effect(() => {
		dirty = !isEqual(original, editing)
	})

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
		const selection = editor.state.selection
		editor.setEditable(false)
		try {
			await handleSave(true)
		} catch (e) {
			console.error(e)
		} finally {
			editor.setEditable(true)
			editor.chain().setTextSelection(selection).focus().run()
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
					class: 'focus-within:outline-none h-full overflow-auto px-5'
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

{#if editing}
	<main class="h-full w-full" use:shortcuts={{ keys: ['s'], callback: handleShortcuts }}>
		<header class="flex h-[44px] w-full items-center justify-end px-3">
			<span>
				<button
					class="button-style rounded-full px-5 py-1 text-xs"
					type="button"
					disabled={!dirty || submitting}
					onclick={onSave}
				>
					{$t('common.save')}
				</button>
			</span>
		</header>
		{#if !editing.draft}
			<section class="secondary-text-color flex h-[20px] items-center justify-end px-5 text-xs">
				{#if updatedAt}
					<p>{$t('common.last_updated')}: {updatedAt}</p>
				{/if}
			</section>
		{/if}
		<section class="w-full {editing.draft ? 'h-[calc(100%-88px)]' : 'h-[calc(100%-108px)]'}">
			<div class="h-full w-full" bind:this={element}></div>
		</section>
		<footer class="border-color flex h-[44px] w-full items-center border-t px-3">
			<p class="secondary-text-color text-xs">Under Construction...</p>
		</footer>
	</main>
{/if}
