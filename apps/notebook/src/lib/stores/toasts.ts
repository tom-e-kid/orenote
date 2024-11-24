import { createId } from '@paralleldrive/cuid2'
import { writable } from 'svelte/store'

export type Toast = {
	id: string
	message: string
	type: 'info' | 'success' | 'error'
	duration: number
}

export const toasts = writable<Toast[]>([])

export function pushError(message: string, duration = 5000) {
	push({ id: createId(), message, type: 'error', duration })
}

export function pushSuccess(message: string, duration = 5000) {
	push({ id: createId(), message, type: 'success', duration })
}

export function pushInfo(message: string, duration = 5000) {
	push({ id: createId(), message, type: 'info', duration })
}

export function push(toast: Toast) {
	toasts.update((prev) => [...prev, toast])
	setTimeout(() => {
		toasts.update((prev) => prev.filter((t) => t.id !== toast.id))
	}, toast.duration)
}
