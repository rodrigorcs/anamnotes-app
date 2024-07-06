import { useEffect, useState } from 'react'
import { TSection } from './models/contracts/sections'
import {
  Search as SearchIcon,
  Plus as PlusIcon,
  Minus as MinusIcon,
  Copy as CopyIcon,
  IconoirProvider,
} from 'iconoir-react'
import '../styles.css'
import { theme } from './theme'
import { cn } from './utils/className'
import { Avatar } from './components/common/Avatar'
import { Button } from './components/common/Button'

export enum ERecordingState {
  IDLE = 'idle',
  RECORDING = 'recording',
  WAITING_RESPONSE = 'waiting-response',
  SUCCESS = 'success',
}

export enum EModals {
  RESULTS = 'results',
}

function App(props: unknown) {
  const [recordingState, setRecordingState] = useState<ERecordingState>(ERecordingState.IDLE)
  const [activeModal, setActiveModal] = useState<EModals | null>(null)
  const [isModalExpanded, setIsModalExpanded] = useState<boolean>(false)
  const [sections, setSections] = useState<TSection[]>([])

  useEffect(() => {
    if (recordingState === ERecordingState.SUCCESS) {
      setActiveModal(EModals.RESULTS)

      setTimeout(() => {
        setRecordingState(ERecordingState.IDLE)
      }, 2000)
    }
  }, [recordingState])

  useEffect(() => {
    setIsModalExpanded(!!activeModal)
  }, [activeModal])

  return (
    <div id="anamnotes-app-container" className="tw-flex">
      <div className="tw-flex tw-flex-col tw-w-72 tw-bg-background-100 tw-px-4 tw-py-6">
        <div className="tw-flex tw-flex-col tw-px-2">
          <div className="tw-flex tw-bg-neutrals-white tw-border tw-border-neutrals-200 tw-rounded-lg tw-h-10 tw-items-center tw-px-2 focus-within:tw-border-2 focus-within:tw-border-brand-500">
            <SearchIcon
              color={theme.colors['neutrals-400']}
              strokeWidth={2}
              width="1.125em"
              height="1.125em"
            />
            <input className="tw-flex-1 tw-ml-2 tw-outline-none" placeholder="Pesquisar..." />
          </div>
          <Button text="Nova anamnese" IconLeft={<PlusIcon />} rounded className="tw-mt-6" />
          <div className="tw-mt-6">
            <h3 className="tw-text-neutrals-800 tw-font-medium tw-text-sm">Hoje</h3>
            <div className="tw-mt-4 tw-items-center">
              {new Array(10).fill('Rodrigo Costa').map((fullName, index) => {
                const isFirstItem = index === 0
                const isSelected = index === 3
                return (
                  <div
                    className={cn(
                      'tw-flex tw-items-center tw-p-1 tw-rounded-full',
                      !isFirstItem && 'tw-mt-1',
                      isSelected && 'tw-bg-background-200 tw-font-medium',
                    )}
                  >
                    <Avatar fullName={fullName} />
                    <p className="tw-ml-2 tw-text-neutrals-700 tw-text-sm">{fullName}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="tw-flex tw-flex-col tw-flex-1 tw-bg-background-white">
        <div className="flex-1 tw-flex tw-h-28 tw-px-10 tw-py-6 tw-bg-background-white tw-border-b tw-border-neutrals-200">
          <Avatar fullName="Rodrigo Costa" className="tw-size-8" />
          <div className="tw-ml-3 tw-flex-1 tw-flex tw-flex-col tw-justify-between">
            <h2 className="tw-text-neutrals-800 tw-font-medium tw-text-xl tw-leading-8">
              Rodrigo Costa
            </h2>
            <div className="tw-flex tw-flex-row tw-items-center">
              <p className="tw-text-neutrals-600">Ontem às 16:30</p>
              <span className="tw-mx-2 tw-size-1 tw-rounded-full tw-bg-neutrals-400 tw-block" />
              <p className="tw-text-neutrals-400">+3 anamneses</p>
            </div>
          </div>
        </div>
        <div className="tw-flex tw-flex-1 tw-justify-center tw-bg-background-white">
          <div className="tw-flex tw-flex-col tw-w-[42rem] tw-py-10 tw-px-4">
            <h1 className="tw-text-neutrals-800 tw-font-bold tw-text-3xl">Resumo da anamnese</h1>
            <div className="tw-mt-8">
              {new Array(4).fill(null).map((_item, index) => {
                const isFirstItem = index === 0
                const isExpanded = index !== 2
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
                            color={theme.colors['neutrals-300']}
                            strokeWidth={1.5}
                            width="1.25em"
                            height="1.25em"
                            className="tw-ml-2 tw-cursor-pointer tw-transition-colors hover:tw-text-neutrals-600"
                          />
                        )}
                      </div>
                      {isExpanded && (
                        <p className="tw-text-neutrals-500 tw-mt-2">
                          João, 34 anos, sexo masculino, caucasiano, jornalista, apresentou-se à
                          clínica com a queixa principal de insônia. O paciente relata que tem
                          dificuldade em iniciar e manter o sono. Relata ainda sonolência durante o
                          dia no turno em que trabalha.
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="tw-flex tw-mt-8">
              <Button text="Copiar tudo" IconRight={<CopyIcon />} variant="secondary" rounded />
              <Button text="Copiar seções expandidas" variant="tertiary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
