import type { Doc as _Doc } from '@prisma/client'

export type Doc = Omit<_Doc, 'id' | 'did' | 'uid' | 'publicKey' | 'createdAt' | 'updatedAt'> &
	Partial<Pick<_Doc, 'id' | 'did' | 'uid' | 'publicKey'>> & {
		publicUrl?: string
	}
