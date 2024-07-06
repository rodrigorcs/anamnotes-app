import { useEffect, useState } from 'react'
import { TSection } from './models/contracts/sections'
import { Search as SearchIcon, Plus as AddIcon } from 'iconoir-react'
import '../styles.css'
import { theme } from './theme'
import { cn } from './utils/className'

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
        <div className="tw-flex tw-flex-col tw-p-2">
          <div className="tw-flex tw-bg-neutrals-white tw-border tw-border-neutrals-200 tw-rounded-lg tw-h-10 tw-items-center tw-px-2 focus-within:tw-border-2 focus-within:tw-border-brand-500">
            <SearchIcon
              color={theme.colors['neutrals-400']}
              strokeWidth={2}
              width="1.125em"
              height="1.125em"
            />
            <input className="tw-flex-1 tw-ml-2 tw-outline-none" placeholder="Pesquisar..." />
          </div>
          <button className="tw-flex tw-items-center tw-mt-6 tw-bg-brand-500 tw-h-10 tw-rounded-full tw-justify-center">
            <AddIcon
              color={theme.colors['neutrals-white']}
              strokeWidth={2}
              width="1.5em"
              height="1.5em"
            />
            <p className="tw-text-neutrals-white tw-font-medium tw-text-sm tw-mx-2">
              Nova anamnese
            </p>
          </button>
          <div className="tw-mt-6">
            <h3 className="tw-text-neutrals-800 tw-font-medium tw-text-sm">Hoje</h3>
            <div className="tw-mt-4 tw-items-center">
              {new Array(10).fill('Rodrigo Costa').map((fullName, index) => {
                const initials = fullName
                  .split(' ')
                  .map((name: string) => name[0])
                  .join('')
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
                    <div className="tw-size-7 tw-rounded-full tw-bg-[#E6F3FF] tw-items-center tw-justify-center tw-text-center">
                      <span className="tw-text-xs tw-font-medium tw-text-brand-500">
                        {initials}
                      </span>
                    </div>
                    <p className="tw-ml-2 tw-text-neutrals-700 tw-text-sm">{fullName}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="tw-flex-col tw-flex-1 tw-bg-background-white">
        <div className="tw-h-28 tw-bg-background-white tw-border-b tw-border-neutrals-200"></div>
        <div className="flex-1 tw-bg-background-white"></div>
      </div>
    </div>
  )
}

export default App
