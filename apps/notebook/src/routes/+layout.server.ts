export async function load(event) {
	return {
		session: await event.locals.auth(),
		headers: {
			'Content-Security-Policy': "default-src 'self'; script-src 'self';"
		}
	}
}
