import { IconoirProvider } from 'iconoir-react'
import { FC } from 'react'
import { theme } from '../../theme'
import { cn } from '../../utils/className'
import { Plus as PlusIcon, Minus as MinusIcon, Copy as CopyIcon } from 'iconoir-react'

interface IProps {
  isExpanded?: boolean
  isFirstItem?: boolean
}

export const SummarizationSection: FC<IProps> = ({ isExpanded, isFirstItem }) => {
  return (
    <div className={cn('flex-1 tw-flex', !isFirstItem && 'tw-mt-8')}>
      <div className="tw-mt-1">
        <IconoirProvider
          iconProps={{
            color: theme.colors['neutrals-500'],
            strokeWidth: 2,
            width: '1.5em',
            height: '1.5em',
          }}
        >
          {isExpanded ? <MinusIcon /> : <PlusIcon />}
        </IconoirProvider>
      </div>
      <div className="tw-ml-3 tw-flex-1 tw-flex tw-flex-col">
        <div className="tw-flex tw-flex-row tw-items-center">
          <h2 className="tw-text-neutrals-700 tw-font-semibold tw-text-xl tw-leading-8">
            Queixa Principal
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
          <p className="tw-text-neutrals-500 tw-mt-2">
            João, 34 anos, sexo masculino, caucasiano, jornalista, apresentou-se à clínica com a
            queixa principal de insônia. O paciente relata que tem dificuldade em iniciar e manter o
            sono. Relata ainda sonolência durante o dia no turno em que trabalha.
          </p>
        )}
      </div>
    </div>
  )
}
