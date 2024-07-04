import {
  Copy as CopyIcon,
  NavArrowDown as CollapseIcon,
  Check as CheckIcon,
  IconoirProvider,
} from 'iconoir-react'
import { cn } from '../utils/className'
import { theme } from '../theme'
import { copyToClipboard } from '../utils/clipboard'
import { FC, useEffect, useRef, useState } from 'react'
import { ESectionSlugs, TSection } from '../models/contracts/sections'
import { useSpring, animated, easings } from '@react-spring/web'

const titleMapping = {
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

const getTitleFromSlug = (slug: string) => titleMapping[slug as keyof typeof titleMapping] ?? null

interface IProps {
  isExpanded: boolean
  collapseModal: () => void
  sections: TSection[]
}

export const ResultsModal: FC<IProps> = ({ isExpanded, collapseModal, sections }) => {
  const [copiedSection, setCopiedSection] = useState<ESectionSlugs | 'all' | null>(null)
  const [isRendered, setIsRendered] = useState(isExpanded)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const animatedSize = useSpring({
    from: {
      width: 0,
      maxHeight: 0,
    },
    to: {
      width: 448, // Hardcoded
      maxHeight: 645, // Hardcoded
    },
    config: {
      duration: 300,
      easing: isExpanded ? easings.easeOutCubic : easings.easeInCubic,
    },
    reverse: !isExpanded,
    onResolve: () => {
      if (!isExpanded) setIsRendered(false)
    },
  })

  const animatedStyles = useSpring({
    from: {
      opacity: 0,
      marginBottom: 0,
    },
    to: {
      opacity: 1,
      marginBottom: 24,
    },
    config: {
      duration: 300,
      easing: easings.linear,
    },
    reverse: !isExpanded,
  })

  useEffect(() => {
    if (isExpanded) setIsRendered(true)
  }, [, isExpanded])

  useEffect(() => {
    if (copiedSection) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        setCopiedSection(null)
        timeoutRef.current = null
      }, 1500)
    }
  }, [copiedSection])

  return isRendered ? (
    <animated.div
      key={`results-modal-${isExpanded ? 'expanded' : 'collapsed'}`}
      className="tw-w-[28rem] tw-rounded-2xl tw-overflow-hidden tw-bg-neutrals-white tw-shadow-xl tw-shadow-neutrals-200"
      style={{ ...animatedSize, ...animatedStyles }}
    >
      <div className="tw-p-6 tw-bg-gradient-to-r tw-from-[#0D4EB8] tw-to-[#156EA1]">
        <h2 className="tw-text-2xl tw-font-[Inter] tw-font-medium tw-text-neutrals-white tw-z-10">
          Resultados
        </h2>
        <p className="tw-mt-2 tw-text-sm tw-font-[Inter] tw-text-neutrals-white tw-z-10">
          Resumo da anamnese com Rodrigo
        </p>
        <button className="tw-absolute tw-top-6 tw-right-6 tw-z-10" onClick={collapseModal}>
          <CollapseIcon
            className="hover:tw-text-neutrals-white tw-transition-colors"
            color={theme.colors['neutrals-200']}
            strokeWidth={2}
            width="1.5em"
            height="1.5em"
          />
        </button>
        <div className="tw-absolute tw-right-0 tw-top-0 tw-w-24 tw-h-16 tw-bg-neutrals-white tw-opacity-[.04] tw-z-0"></div>
        <div className="tw-absolute -tw-right-2 tw-top-10 tw-h-36 tw-aspect-square tw-rounded-full tw-bg-neutrals-white tw-opacity-[.04] tw-z-0"></div>
      </div>
      <div className="tw-px-6">
        <div className="tw-flex-col tw-pt-6 tw-pb-4">
          <div className="tw-h-96 tw-overflow-y-auto tw-pb-1">
            <div className="tw-pr-2">
              {sections.map((section, index) => (
                <div key={section.slug} className={cn(index > 0 && 'tw-mt-4')}>
                  <div className="tw-flex tw-items-center">
                    <h3 className="tw-text-lg tw-font-medium tw-font-[Inter] tw-text-neutrals-800">
                      {`${index + 1}. ${getTitleFromSlug(section.slug)}`}
                    </h3>
                    <button
                      className="tw-ml-2"
                      onClick={() => {
                        copyToClipboard(section.content)
                        setCopiedSection(section.slug)
                      }}
                    >
                      <IconoirProvider
                        iconProps={{
                          strokeWidth: 2,
                          width: '1.25em',
                          height: '1.25em',
                        }}
                      >
                        {copiedSection === section.slug ? (
                          <CheckIcon className="tw-text-feedback-positive-300" />
                        ) : (
                          <CopyIcon className="tw-text-neutrals-300 hover:tw-text-neutrals-600 tw-transition-colors" />
                        )}
                      </IconoirProvider>
                    </button>
                  </div>
                  <p className="tw-text-sm tw-font-[Inter] tw-text-neutrals-700 tw-mt-2">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <button
            className="tw-flex tw-justify-center tw-items-center tw-w-full tw-mt-6 tw-rounded-lg tw-h-12 tw-bg-brand-500 hover:tw-bg-brand-700 tw-text-neutrals-white tw-transition-colors"
            onClick={() => {
              const allContent = sections
                .map((section) => {
                  const title = getTitleFromSlug(section.slug)
                  return `# ${title.toUpperCase()}\n${section.content}`
                })
                .join('\n\n')
              copyToClipboard(allContent)
              setCopiedSection('all')
            }}
          >
            Copiar tudo
            {copiedSection === 'all' ? (
              <CheckIcon className="tw-ml-2" />
            ) : (
              <CopyIcon className="tw-ml-2 " />
            )}
          </button>
        </div>
        <div className="tw-flex-col tw-justify-center">
          <div className="tw-flex-1 tw-items-center tw-justify-center tw-py-3 tw-border-t tw-border-neutrals-200">
            <p className="tw-text-xs tw-font-[Inter] tw-text-neutrals-300 tw-text-center">
              Powered by <span className="tw-font-bold">ANAMNOTES</span>
            </p>
          </div>
        </div>
      </div>
    </animated.div>
  ) : null
}
