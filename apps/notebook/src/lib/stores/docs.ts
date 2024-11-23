import type { Doc } from '$lib/models/doc'
import { writable } from 'svelte/store'

export const docs = writable<Doc[]>([])

export function upsertDocs(newDocs: Doc[]) {
	docs.update((prev) => {
		const next = [...prev]
		newDocs.forEach((doc) => {
			const index = next.findIndex((d) => d.did === doc.did)
			if (index === -1) {
				next.unshift(doc)
			} else {
				next[index] = doc
			}
		})
		return next.sort((a, b) => {
			const at = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
			const bt = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
			return bt - at
		})
	})
}

export function removeDoc(did: string) {
	docs.update((prev) => prev.filter((d) => d.did !== did))
}

export function clearDocs() {
	docs.set([])
}
