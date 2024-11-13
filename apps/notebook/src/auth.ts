import { env } from '$env/dynamic/private'
import { prisma } from '$lib/prisma'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { SvelteKitAuth } from '@auth/sveltekit'
import Google from '@auth/sveltekit/providers/google'
import Resend from '@auth/sveltekit/providers/resend'

export const { handle, signIn, signOut } = SvelteKitAuth({
	adapter: PrismaAdapter(prisma),
	trustHost: true,
	providers: [
		Google,
		Resend({
			maxAge: 60 * 60, // 1 hour
			from: env.RESEND_RECIPIENT,
			sendVerificationRequest: async (params) => {
				const { identifier: to, provider, url } = params
				const { host } = new URL(url)
				const res = await fetch('https://api.resend.com/emails', {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${provider.apiKey}`,
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						from: provider.from,
						to,
						subject: `Your Magic Link to Access ${host}`,
						text: text({ url, host })
					})
				})

				if (!res.ok) throw new Error('Resend error: ' + JSON.stringify(await res.json()))
			}
		})
	],
	pages: {
		signIn: '/auth/sign_in'
	},
	callbacks: {
		async jwt({ token }) {
			// console.log('jwt', { token, user, account, profile })
			return token
		},
		async session({ session }) {
			// console.log('session', { token, session })
			return session
		}
	}
})

function text({ url, host }: { url: string; host: string }) {
	return `
Hello,

To access ${host}, please click the link below. This link is unique to you and will expire in 60 minutes.

${url}

For your security, please do not share this email or link with anyone else. If you did not request this login link, please ignore this message.

Thank you,  
The orenote.millne team
`
}
