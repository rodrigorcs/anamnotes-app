import { Dayjs } from 'dayjs'

export interface IContentSection {
  slug: string
  content: string
}

export interface ISummarization {
  id: string
  content: IContentSection[]
  createdAt: Dayjs
  updatedAt?: Dayjs
}

export interface ISummarizationResponsePayload
  extends Omit<ISummarization, 'createdAt' | 'updatedAt'> {
  createdAt: string
  updatedAt?: string
}
