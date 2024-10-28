import { prisma } from '$lib/prisma'
import { createId } from '@paralleldrive/cuid2'
import { error, json } from '@sveltejs/kit'

export async function GET({ url, locals }) {
	try {
		const session = await locals.auth()
		const uid = session?.user?.id
		if (!uid) {
			error(401, 'Unauthorized')
		}
		const limit = parseInt(url.searchParams.get('limit') || '10')
		const offset = parseInt(url.searchParams.get('offset') || '0')

		const [docs, total] = await Promise.all([
			prisma.doc.findMany({
				where: {
					uid
				},
				skip: offset,
				take: limit,
				orderBy: { updatedAt: 'desc' }
			}),
			prisma.doc.count({ where: { uid } })
		])
		return json({ docs, total })
	} catch (e) {
		console.error(e)
		error(500, 'Internal Server Error')
	}
}

export async function POST({ request, locals }) {
	try {
		const session = await locals.auth()
		const uid = session?.user?.id
		if (!uid) {
			error(401, 'Unauthorized')
		}
		const content = await request.json()
		const doc = await prisma.doc.create({
			data: {
				did: createId(),
				uid,
				content
			}
		})
		return json({ doc })
	} catch (e) {
		console.error(e)
		error(500, 'Internal Server Error')
	}
}
