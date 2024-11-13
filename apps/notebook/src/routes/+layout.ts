import { loadTranslations } from '$lib/i18n/translations'

export const load = async ({ url, data }) => {
	const { pathname } = url

	const browserLanguage = typeof navigator !== 'undefined' ? navigator.language : 'en'
	const supportedLanguages = ['en', 'ja']
	const defaultLanguage = 'en'

	const initLocale = supportedLanguages.includes(browserLanguage)
		? browserLanguage
		: defaultLanguage

	console.log('initLocale', initLocale)

	await loadTranslations(initLocale, pathname) // keep this just before the `return`

	return {
		...data
	}
}
