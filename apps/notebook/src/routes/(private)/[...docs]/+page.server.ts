import { env } from '$env/dynamic/private'
import type { Doc } from '$lib/models/doc'
import { prisma } from '$lib/prisma'
import { error } from '@sveltejs/kit'

export async function load({ params, locals }) {
	const session = await locals.auth()
	const uid = session?.user?.id
	if (!uid) {
		throw error(401, 'Unauthorized')
	}
	const components = params.docs.split('/')
	const isNew = components.length === 1 && components[0] === ''
	if (!isNew) {
		if (components.length !== 2 || components[0] !== 'docs' || components[1] === '') {
			throw error(404, 'Not found')
		}
		const doc = await prisma.doc.findUnique({
			where: {
				did: components[1],
				uid
			}
		})
		if (!doc) {
			throw error(404, 'Not found')
		}
		const publicUrl = doc.publicKey ? `${env.NOTEBOOK_URL}/notebook/${doc.publicKey}` : undefined
		return {
			doc: {
				...doc,
				publicUrl
			}
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
