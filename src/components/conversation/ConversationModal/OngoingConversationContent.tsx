import { FC, ReactNode, useEffect } from 'react'
import { Button } from '../../common/Button'
import {
  Check as CheckIcon,
  MicrophoneMuteSolid as MuteIcon,
  IconoirProvider,
  Microphone as MicIcon,
  Xmark as CloseIcon,
} from 'iconoir-react'
import { cn } from '../../../utils/className'
import { theme } from '../../../theme'
import { ERecordingState, useRecordingStore } from '../../../stores/recording'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { EFeedbackTopics, useFeedback } from '../../../hooks/useFeedback'
import { Alert } from '../../common/Alert'
import { Spinner } from '../../common/Spinner'
dayjs.extend(duration)

const getContentByRecordingState = (recordingState: ERecordingState) => {
  const fabContentMapping: Record<string, { Icon: ReactNode; title: string | null }> = {
    [ERecordingState.RECORDING]: {
      Icon: <CheckIcon />,
      title: 'Ouvindo o paciente',
    },
    [ERecordingState.PAUSED]: {
      Icon: <CheckIcon />,
      title: 'Mudo',
    },
    [ERecordingState.WAITING_RESPONSE]: {
      Icon: (
        <Spinner
          className="tw-animate-spin"
          color={theme.colors['neutrals-white']}
          strokeWidth={2}
          width="1.5em"
          height="1.5em"
        />
      ),
      title: 'Analisando',
    },
    [ERecordingState.SUCCESS]: {
      Icon: <CheckIcon />,
      title: 'Tudo pronto!',
    },
    [ERecordingState.ERROR]: {
      Icon: <CloseIcon />,
      title: 'Ocorreu um erro',
    },
  }

  return fabContentMapping[recordingState as ERecordingState]
}

const formatElapsedTime = (seconds: number): string => {
  const duration = dayjs.duration(seconds, 'seconds')
  const minutes = Math.floor(duration.asMinutes())
  const remainingSeconds = duration.seconds()
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

interface IProps {
  pauseRecording: () => void
  resumeRecording: () => void
  stopRecording: () => void
}

export const OngoingConversationContent: FC<IProps> = ({
  pauseRecording,
  resumeRecording,
  stopRecording,
}) => {
  const clientName = useRecordingStore((state) => state.clientName)
  const recordingState = useRecordingStore((state) => state.recordingState)
  const elapsedTime = useRecordingStore((state) => state.elapsedTime)
  const clearRecordingState = useRecordingStore((state) => state.clearRecordingState)

  const { feedback, clearFeedback } = useFeedback({ subscribeToTopic: EFeedbackTopics.RECORDING })

  const formattedElapsedTime = formatElapsedTime(elapsedTime)
  const isPaused = recordingState === ERecordingState.PAUSED
  const content = getContentByRecordingState(recordingState)

  useEffect(() => {
    if (recordingState === ERecordingState.IDLE && feedback?.topic === EFeedbackTopics.RECORDING) {
      clearFeedback({ global: true })
    }
  }, [])

  const handleClearRecordingState = () => {
    clearRecordingState()
    clearFeedback({ global: true })
  }

  return (
    <>
      <div className="tw-flex tw-flex-col">
        <div className="tw-flex tw-flex-col tw-flex-1 tw-p-6">
          <div className="tw-flex tw-flex-1">
            <div className="tw-flex tw-flex-col tw-flex-1 tw-justify-between">
              <h3 className="tw-font-semibold tw-text-xl">{clientName}</h3>
              <h3 className="tw-text-neutrals-600">{`${content.title} - ${formattedElapsedTime}`}</h3>
            </div>
            <div className="tw-flex">
              <button
                className={cn(
                  'tw-bg-neutrals-100 hover:tw-bg-neutrals-200 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-size-14 tw-transition-colors',
                  isPaused && 'hover:tw-bg-feedback-negative-200',
                )}
                onClick={isPaused ? resumeRecording : pauseRecording}
              >
                <IconoirProvider
                  iconProps={{
                    color: isPaused
                      ? theme.colors['feedback-negative-300']
                      : theme.colors['neutrals-600'],
                    strokeWidth: 2,
                    width: '1.5em',
                    height: '1.5em',
                  }}
                >
                  {isPaused ? <MuteIcon /> : <MicIcon />}
                </IconoirProvider>
              </button>
              <button
                className={cn(
                  'tw-bg-brand-500 tw-rounded-full tw-flex tw-items-center tw-justify-center hover:tw-bg-brand-700 disabled:tw-bg-brand-300 tw-size-14 tw-transition-colors tw-ml-4',
                  recordingState === ERecordingState.ERROR &&
                    'tw-bg-feedback-negative-300 hover:tw-bg-feedback-negative-500',
                  recordingState === ERecordingState.SUCCESS &&
                    'tw-bg-feedback-positive-300 disabled:tw-bg-feedback-positive-300 hover:tw-bg-feedback-positive-500',
                )}
                onClick={
                  recordingState === ERecordingState.ERROR
                    ? handleClearRecordingState
                    : stopRecording
                }
                disabled={
                  recordingState === ERecordingState.WAITING_RESPONSE ||
                  recordingState === ERecordingState.SUCCESS
                }
              >
                <IconoirProvider
                  iconProps={{
                    color: theme.colors['neutrals-white'],
                    strokeWidth: 2,
                    width: '1.5em',
                    height: '1.5em',
                  }}
                >
                  {content.Icon}
                </IconoirProvider>
              </button>
            </div>
          </div>
          <Alert feedback={feedback} className="tw-mt-4" />
        </div>
        <div className="tw-flex tw-justify-end tw-bg-background-100 tw-border-t tw-border-neutrals-100 tw-items-center tw-px-6">
          <Button
            variant="tertiary"
            text="Cancelar"
            className="tw-px-0 tw-mr-1"
            textClassName="tw-text-feedback-negative-300 group-hover:tw-text-feedback-negative-500"
            onClick={handleClearRecordingState}
          />
        </div>
      </div>
    </>
  )
}
