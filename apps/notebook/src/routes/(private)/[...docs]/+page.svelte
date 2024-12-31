<script lang="ts">
	import { beforeNavigate, goto, invalidateAll } from '$app/navigation'
	import { shortcuts } from '$lib/actions/shortcuts'
	import { t } from '$lib/i18n/translations'
	import { upsertDocs } from '$lib/stores/docs'
	import { Editor, type Content as TipTapContent } from '@tiptap/core'
	import Placeholder from '@tiptap/extension-placeholder'
	import StarterKit from '@tiptap/starter-kit'
	import { format } from 'date-fns'
	import { onDestroy, onMount } from 'svelte'
	import { Markdown } from 'tiptap-markdown'
	import type { PageData } from './$types'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()

	let editor: Editor
	let element: HTMLDivElement | undefined = $state()
	let submitting = $state(false)

	const doc = $derived(data.props.doc)
	const did = $derived(doc.did)
	const draft = $derived(doc.draft)
	const updatedAt = $derived(
		doc.updatedAt ? format(new Date(doc.updatedAt), 'yyyy-MM-dd HH:mm:ss') : ''
	)
	const original = $derived(data.props.doc.content.raw as TipTapContent)

	let content: TipTapContent = $state(null)

	const isEqual = <T,>(a: T, b: T) => JSON.stringify(a) === JSON.stringify(b)
	const dirty = $derived(!isEqual(content, original))

	$effect(() => {
		// contentをeditorに直接渡すと$effectが繰り返し実行されるため、一度変数に格納してから渡す
		const clone = structuredClone(original)
		content = clone
		if (editor) {
			editor.commands.setContent(clone)
		}
	})

	const handleSave = async (needsRedirect: boolean = false) => {
		// ひとまず・・保存時にタイトルを取得して保存する
		let title = ''
		if (editor) {
			const text = editor.state.doc.firstChild?.textContent
			title = text ?? ''
		}

		const res = await fetch(`/api/docs/${did}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				content: {
					raw: content,
					title
				},
				draft
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

	beforeNavigate(async ({ cancel }) => {
		if (dirty && !submitting) {
			if (!draft) {
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
				}),
				Markdown.configure({
					transformPastedText: true,
					transformCopiedText: true
				})
			],
			content,
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
					content = null
				} else {
					content = editor.getJSON()
				}
			}
		})
	})

	onDestroy(() => {
		if (editor) {
			editor.destroy()
		}
	})
</script>

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
	{#if !draft}
		<section class="secondary-text-color flex h-[20px] items-center justify-end px-5 text-xs">
			{#if updatedAt}
				<p>{$t('common.last_updated')}: {updatedAt}</p>
			{/if}
		</section>
	{/if}
	<section class="w-full {draft ? 'h-[calc(100%-88px)]' : 'h-[calc(100%-108px)]'}">
		<div class="h-full w-full" bind:this={element}></div>
	</section>
	<footer class="border-color flex h-[44px] w-full items-center border-t px-3">
		<p class="secondary-text-color text-xs">Under Construction...</p>
	</footer>
</main>
