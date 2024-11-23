import { env } from '$env/dynamic/private'
import { prisma } from '$lib/prisma'
import { error, json } from '@sveltejs/kit'

export async function GET({ params: { did }, locals }) {
	try {
		const session = await locals.auth()
		const uid = session?.user?.id
		if (!uid) {
			error(401, 'Unauthorized')
		}
		const doc = await prisma.doc.findUnique({
			where: {
				did,
				uid
			}
		})
		if (!doc) {
			error(404, 'Not found')
		}
		const publicUrl = doc.publicKey ? `${env.NOTEBOOK_URL}/notebook/${doc.publicKey}` : undefined
		return json({
			doc: {
				...doc,
				publicUrl
			}
		})
	} catch (e) {
		console.error(e)
		error(500, 'Internal Server Error')
	}
}

export async function PUT({ params: { did }, request, locals }) {
	try {
		const session = await locals.auth()
		const uid = session?.user?.id
		if (!uid) {
			error(401, 'Unauthorized')
		}
		const data = await request.json()
		const doc = await prisma.doc.update({
			where: {
				did,
				uid
			},
			data: {
				draft: false,
				content: data.content
			}
		})
		const publicUrl = doc.publicKey ? `${env.NOTEBOOK_URL}/notebook/${doc.publicKey}` : undefined
		return json({
			doc: {
				...doc,
				publicUrl
			},
			redirectTo: data.draft ? `/docs/${doc.did}` : undefined
		})
	} catch (e) {
		console.error(e)
		error(500, 'Internal Server Error')
	}
}

export async function DELETE({ params: { did }, locals }) {
	try {
		const session = await locals.auth()
		const uid = session?.user?.id
		if (!uid) {
			error(401, 'Unauthorized')
		}

		const doc = await prisma.doc.delete({
			where: { did }
		})

		return json({ doc })
	} catch (e) {
		console.error(e)
		error(500, 'Internal Server Error')
	}
}
