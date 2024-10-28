import type { Doc } from '$lib/models/doc'
import { writable } from 'svelte/store'

export const docsStore = writable<Doc[]>([])
