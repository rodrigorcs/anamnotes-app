import { Dayjs } from 'dayjs'

import { z } from 'zod'

export enum ESectionSlugs {
  IDENTIFICACAO_PACIENTE = 'identificacaoPaciente',
  QUEIXA_PRINCIPAL = 'queixaPrincipal',
  HISTORIA_DOENCA_ATUAL = 'historiaDoencaAtual',
  HISTORIA_FAMILIAR = 'historiaFamiliar',
  HISTORIA_PESSOAL = 'historiaPessoal',
  EXAME_FISICO = 'exameFisico',
  EXAME_ESTADO_MENTAL = 'exameEstadoMental',
  HIPOTESES_DIAGNOSTICAS = 'hipotesesDiagnosticas',
  EXAMES_COMPLEMENTARES = 'examesComplementares',
  CONDUTA = 'conduta',
  PROGNOSTICO = 'prognostico',
  SEQUELAS = 'sequelas',
}

const SectionSchema = z.object({
  slug: z.nativeEnum(ESectionSlugs),
  content: z.string(),
})

const SectionsSchema = z.array(SectionSchema)

export const parseSections = (sections: unknown) => {
  return SectionsSchema.parse(sections)
}

export type TContentSection = z.infer<typeof SectionSchema>

export interface ISummarization {
  id: string
  content: TContentSection[]
  createdAt: Dayjs
  updatedAt?: Dayjs
}

export interface ISummarizationResponsePayload
  extends Omit<ISummarization, 'createdAt' | 'updatedAt'> {
  createdAt: string
  updatedAt?: string
}
