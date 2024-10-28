import { prisma } from '$lib/prisma'
import { error, json } from '@sveltejs/kit'

export async function PUT({ request, params: { did }, locals }) {
	try {
		const session = await locals.auth()
		const uid = session?.user?.id
		if (!uid) {
			error(401, 'Unauthorized')
		}
		const content = await request.json()
		const doc = await prisma.doc.update({
			where: { did },
			data: {
				content
			}
		})
		return json({ doc })
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
