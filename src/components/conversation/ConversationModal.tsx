import { FC } from 'react'
import { Input } from '../common/Input'
import { Button } from '../common/Button'
import {
  Check as CheckIcon,
  MicrophoneMute as MuteIcon,
  IconoirProvider,
  Microphone as MicIcon,
} from 'iconoir-react'
import { cn } from '../../utils/className'
import { theme } from '../../theme'

const StartConversationContent: FC = () => {
  return (
    <>
      <p className="tw-text-neutrals-600">Nome do paciente</p>
      <Input placeholder="João da Silva" className="tw-mt-2" />
      <Button
        text="Iniciar anamnese"
        IconLeft={<MicIcon width={'1.125rem'} height={'1.125rem'} />}
        rounded
        className="tw-mt-6"
      />
    </>
  )
}

const OngoingConversationContent: FC = () => {
  return (
    <>
      <div className="tw-flex tw-flex-col">
        <div className="tw-flex tw-flex-1 tw-p-6">
          <div className="tw-flex tw-flex-col tw-flex-1 tw-justify-between">
            <h3 className="tw-font-semibold tw-text-xl">Rodrigo Costa</h3>
            <h3 className="tw-text-neutrals-600">Ouvindo o paciente - 1:23</h3>
          </div>
          <div className="tw-flex">
            <button
              className={cn(
                'tw-bg-neutrals-100 hover:tw-bg-neutrals-200 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-size-14 tw-transition-colors',
              )}
            >
              <IconoirProvider
                iconProps={{
                  color: theme.colors['neutrals-600'],
                  strokeWidth: 2,
                  width: '1.5em',
                  height: '1.5em',
                }}
              >
                <MuteIcon />
              </IconoirProvider>
            </button>
            <button
              className={cn(
                'tw-bg-brand-500 tw-rounded-full tw-flex tw-items-center tw-justify-center hover:tw-bg-brand-700 disabled:tw-bg-brand-300 tw-size-14 tw-transition-colors tw-ml-4',
              )}
            >
              <IconoirProvider
                iconProps={{
                  color: theme.colors['neutrals-white'],
                  strokeWidth: 2,
                  width: '1.5em',
                  height: '1.5em',
                }}
              >
                <CheckIcon />
              </IconoirProvider>
            </button>
          </div>
        </div>
        <div className="tw-flex tw-justify-end tw-bg-background-100 tw-border-t tw-border-neutrals-100 tw-items-center tw-px-6">
          <Button
            variant="tertiary"
            text="Cancelar"
            className="tw-px-0 tw-mr-1"
            textClassName="tw-text-feedback-negative-300 group-hover:tw-text-feedback-negative-500"
          />
        </div>
      </div>
    </>
  )
}

export const ConversationModal: FC = () => {
  return (
    <div className="tw-flex-1 tw-justify-center tw-items-center tw-flex tw-overflow-visible tw-absolute tw-bottom-6 tw-inset-0 tw-z-50">
      <div className="tw-absolute tw-w-auto tw-mx-auto tw-max-w-3xl tw-bottom-0 tw-overflow-visible">
        <div className="tw-w-[38rem] tw-rounded-2xl tw-relative tw-flex tw-flex-col tw-bg-neutrals-white tw-shadow-[0_4px_32px_0px_rgba(0,0,0,0.10)]">
          <OngoingConversationContent />
        </div>
      </div>
    </div>
  )
}
