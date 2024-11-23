import { prisma } from '$lib/prisma'
import { createId } from '@paralleldrive/cuid2'
import { error, json } from '@sveltejs/kit'

export async function PUT({ request, locals }) {
	try {
		const session = await locals.auth()
		const uid = session?.user?.id
		if (!uid) {
			error(401, 'Unauthorized')
		}

		// 下書きがあればそれを返す
		// 基本的に下書きは1つを想定しているが、複数ある場合は最新のものを返す
		let doc = await prisma.doc.findFirst({
			where: {
				uid,
				draft: true
			},
			orderBy: { createdAt: 'desc' }
		})
		if (doc) {
			return json({ doc })
		}

		const content = await request.json()
		doc = await prisma.doc.create({
			data: {
				did: createId(),
				uid,
				draft: true,
				content: {
					title: content.title ?? '',
					raw: content.raw ?? null
				}
			}
		})
		return json({ doc })
	} catch (e) {
		console.error(e)
		error(500, 'Internal Server Error')
	}
}
