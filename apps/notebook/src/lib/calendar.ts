import { formatDate } from 'date-fns'

export type DateType = 'ymd' | 'ym'

// month is 0-based
export function format(year: number, month: number, day?: number) {
	const yyyy = year.toString()
	const mm = (month + 1).toString().padStart(2, '0')
	if (day) {
		const dd = day.toString().padStart(2, '0')
		return `${yyyy}-${mm}-${dd}`
	} else {
		return `${yyyy}-${mm}`
	}
}

export function dateKey(date: Date, type: DateType = 'ymd') {
	switch (type) {
		case 'ymd':
			return format(date.getFullYear(), date.getMonth(), date.getDate())
		case 'ym':
			return format(date.getFullYear(), date.getMonth())
	}
}

export function currentDateKey() {
	return dateKey(new Date())
}

export function dateKeyForStartOfMonth(from?: Date) {
	const date = from ? new Date(from) : new Date()
	date.setDate(1)
	return dateKey(date)
}

export function dateKeyForEndOfMonth(from?: Date) {
	const date = from ? new Date(from) : new Date()
	date.setMonth(date.getMonth() + 1)
	date.setDate(0)
	return dateKey(date)
}

export function formatDateKey(dateKey: string, format: string = 'yyyy年MM月dd日') {
	return formatDate(new Date(dateKey), format)
}
