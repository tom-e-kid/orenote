import { redirect, type Handle } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import { handle as authenticationHandle } from './auth'

const authorizationHandle: Handle = async ({ event, resolve }) => {
	const session = await event.locals.auth()
	if (event.url.pathname.startsWith('/auth')) {
		if (session) {
			throw redirect(303, '/')
		}
	} else {
		if (!session) {
			throw redirect(303, '/auth/sign_in')
		}
	}
	return resolve(event)
}

export const handle: Handle = sequence(authenticationHandle, authorizationHandle)
