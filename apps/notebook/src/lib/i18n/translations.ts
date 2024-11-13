import i18n from 'sveltekit-i18n'

export const { t, locale, locales, loading, loadTranslations } = new i18n({
	loaders: [
		{
			locale: 'en',
			key: 'common',
			loader: async () => (await import('./en/common.json')).default
		},
		{
			locale: 'ja',
			key: 'common',
			loader: async () => (await import('./ja/common.json')).default
		}
	]
})
