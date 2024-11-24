import type { Doc } from '$lib/models/doc'
import { error } from '@sveltejs/kit'

export async function load({ params, fetch, data }) {
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
		const { doc }: { doc: Doc } = await res.json()
		return {
			...data,
			props: {
				doc
			}
		}
	}
	// ルートの場合は下書きを取得する
	const res = await fetch('/api/docs/draft', {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({})
	})
	if (!res.ok) {
		error(res.status, res.statusText)
	}
	const { doc }: { doc: Doc } = await res.json()
	return {
		...data,
		props: {
			doc
		}
	}
}
