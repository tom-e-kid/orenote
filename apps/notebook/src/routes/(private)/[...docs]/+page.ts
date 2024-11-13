import type { Doc } from '$lib/models/doc'
import { error } from '@sveltejs/kit'

export async function load({ params, fetch }) {
	const components = params.docs.split('/')
	const isRoot = components.length === 1 && components[0] === ''
	if (!isRoot) {
		if (components.length !== 2 || components[0] !== 'docs' || components[1] === '') {
			error(404, 'Not found')
		}
		const did = components[1]
		const res = await fetch(`/api/docs/${did}`)
		if (!res.ok) {
			error(res.status, res.statusText)
		}
		const { doc } = await res.json()
		return {
			doc
		} satisfies {
			doc: Doc
		}
	}
	return {
		doc: {
			content: {
				title: '',
				raw: null
			}
		}
	} satisfies {
		doc: Doc
	}
}
