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
						subject: `Sign in to ${host}`,
						html: html({ url, host }),
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

function html({ url, host }: { url: string; host: string }) {
	const escapedHost = host.replace(/\./g, '&#8203;.')
	return `
<body>
  <header>
    <h1>Use this link to join orenote</h1>
  </header>
  <section>
    <p>Sign in to <strong>${escapedHost}</strong></p>
    <a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #0f0; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid #0f0; display: inline-block; font-weight: bold;">Sign in</a>
  </section>
  <footer>
    <p>If you did not request this email you can safely ignore it.</p>
  </footer>
</body>
`
}

function text({ url, host }: { url: string; host: string }) {
	return `Sign in to ${host}\n${url}\n\n`
}
