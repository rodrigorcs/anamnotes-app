import { IconoirProvider } from 'iconoir-react'
import { FC } from 'react'
import { theme } from '../../theme'
import { cn } from '../../utils/className'
import { Plus as PlusIcon, Minus as MinusIcon, Copy as CopyIcon } from 'iconoir-react'
import { ESectionSlugs, TContentSection } from '../../models/contracts/Summarization'

interface IProps {
  contentSection: TContentSection
  isExpanded: boolean
  toggleExpanded: (slug: string) => void
  isFirstItem?: boolean
}

const getTitleFromSlug = (slug: string) => {
  const titleMapping: Record<ESectionSlugs, string> = {
    identificacaoPaciente: 'Identificação do paciente',
    queixaPrincipal: 'Queixa principal',
    historiaDoencaAtual: 'Histórico da doença atual',
    historiaFamiliar: 'Histórico familiar',
    historiaPessoal: 'Historico pessoal',
    exameFisico: 'Exame físico',
    exameEstadoMental: 'Exame de estado mental',
    hipotesesDiagnosticas: 'Hipóteses diagnósticas',
    examesComplementares: 'Exames complementares',
    conduta: 'Conduta',
    prognostico: 'Progóstico',
    sequelas: 'Sequelas',
  } as const

  return titleMapping[slug as keyof typeof titleMapping] ?? null
}

export const SummarizationSection: FC<IProps> = ({
  contentSection,
  isExpanded,
  toggleExpanded,
  isFirstItem,
}) => {
  const title = getTitleFromSlug(contentSection.slug)

  return (
    <div className={cn('flex-1 tw-flex', !isFirstItem && 'tw-mt-8')}>
      <div className="tw-flex-1 tw-flex tw-flex-col">
        <div className="tw-flex tw-flex-row tw-items-center">
          <button
            onClick={() => {
              toggleExpanded(contentSection.slug)
            }}
          >
            <IconoirProvider
              iconProps={{
                color: theme.colors['neutrals-500'],
                strokeWidth: 2,
                width: '1.25em',
                height: '1.25em',
              }}
            >
              {isExpanded ? <MinusIcon /> : <PlusIcon />}
            </IconoirProvider>
          </button>
          <h2 className="tw-text-neutrals-700 tw-font-semibold tw-text-xl tw-leading-8 tw-ml-1">
            {title}
          </h2>
          {isExpanded && (
            <CopyIcon
              color={theme.colors['neutrals-400']}
              strokeWidth={1.5}
              width="1.25em"
              height="1.25em"
              className="tw-ml-2 tw-cursor-pointer tw-transition-colors hover:tw-text-neutrals-600"
            />
          )}
        </div>
        {isExpanded && (
          <p className="tw-text-neutrals-500 tw-mt-2 tw-ml-6">{contentSection.content}</p>
        )}
      </div>
    </div>
  )
}
