import { FC, ReactNode, useEffect, useRef, useState } from 'react'
import { Input } from '../common/Input'
import { Button } from '../common/Button'
import {
  Check as CheckIcon,
  MicrophoneMuteSolid as MuteIcon,
  IconoirProvider,
  Microphone as MicIcon,
} from 'iconoir-react'
import { cn } from '../../utils/className'
import { theme } from '../../theme'
import { TSummarizationWebsocketMessage, EWebsocketMessageTypes } from '../../models/apis/websocket'
import { Spinner } from '../common/Spinner'
import { useConversationStore } from '../../stores/conversations'
import { ERecordingState, useRecordingStore } from '../../stores/recording'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { AnamnotesRestAPI } from '../../apis/anamnotesRest'
import { AnamnotesWebsocketAPI } from '../../apis/anamnotesWebsocket'
dayjs.extend(duration)

interface IStartConversationContentProps {
  startRecording: (clientName: string) => void
}

const StartConversationContent: FC<IStartConversationContentProps> = ({ startRecording }) => {
  const [clientNameInput, setClientNameInput] = useState('')
  const setClientName = useRecordingStore((state) => state.setClientName)
  return (
    <div className="tw-flex tw-flex-col tw-p-6">
      <p className="tw-text-neutrals-600">Nome do paciente</p>
      <Input
        value={clientNameInput}
        onChange={(event) => {
          setClientNameInput(event.target.value)
        }}
        placeholder="João da Silva"
        className="tw-mt-2"
      />
      <Button
        text="Iniciar anamnese"
        IconLeft={<MicIcon width={'1.125rem'} height={'1.125rem'} />}
        rounded
        className="tw-mt-6"
        onClick={() => {
          setClientName(clientNameInput)
          startRecording(clientNameInput)
        }}
        isDisabled={clientNameInput.length < 3}
      />
    </div>
  )
}

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
  }

  return fabContentMapping[recordingState as ERecordingState]
}

const formatElapsedTime = (seconds: number): string => {
  const duration = dayjs.duration(seconds, 'seconds')
  const minutes = Math.floor(duration.asMinutes())
  const remainingSeconds = duration.seconds()
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

interface IOngoingConversationContentProps {
  pauseRecording: () => void
  resumeRecording: () => void
  stopRecording: () => void
}

const OngoingConversationContent: FC<IOngoingConversationContentProps> = ({
  pauseRecording,
  resumeRecording,
  stopRecording,
}) => {
  const clientName = useRecordingStore((state) => state.clientName)
  const recordingState = useRecordingStore((state) => state.recordingState)
  const elapsedTime = useRecordingStore((state) => state.elapsedTime)
  const clearRecordingState = useRecordingStore((state) => state.clearRecordingState)

  const formattedElapsedTime = formatElapsedTime(elapsedTime)
  const isPaused = recordingState === ERecordingState.PAUSED
  const content = getContentByRecordingState(recordingState)

  return (
    <>
      <div className="tw-flex tw-flex-col">
        <div className="tw-flex tw-flex-1 tw-p-6">
          <div className="tw-flex tw-flex-col tw-flex-1 tw-justify-between">
            <h3 className="tw-font-semibold tw-text-xl">{clientName}</h3>
            <h3 className="tw-text-neutrals-600">{`${content.title} - ${formattedElapsedTime}`}</h3>
          </div>
          <div className="tw-flex">
            <button
              className={cn(
                'tw-bg-neutrals-100 hover:tw-bg-neutrals-200 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-size-14 tw-transition-colors',
                isPaused && 'hover:tw-bg-feedback-negative-100',
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
              )}
              onClick={stopRecording}
              disabled={recordingState === ERecordingState.WAITING_RESPONSE}
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
        <div className="tw-flex tw-justify-end tw-bg-background-100 tw-border-t tw-border-neutrals-100 tw-items-center tw-px-6">
          <Button
            variant="tertiary"
            text="Cancelar"
            className="tw-px-0 tw-mr-1"
            textClassName="tw-text-feedback-negative-300 group-hover:tw-text-feedback-negative-500"
            onClick={clearRecordingState}
          />
        </div>
      </div>
    </>
  )
}

export const ConversationModal: FC = () => {
  const audioStreamRef = useRef<MediaStream | null>(null)
  const lastAudioChunkIdRef = useRef<number | null>(null)
  const conversationIdRef = useRef<string | null>(null)
  const chunkIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordingStateRef = useRef<ERecordingState>(ERecordingState.IDLE)

  const addConversation = useConversationStore((state) => state.addConversation)
  const selectConversation = useConversationStore((state) => state.selectConversation)
  const recordingState = useRecordingStore((state) => state.recordingState)
  const setRecordingState = useRecordingStore((state) => state.setRecordingState)

  const anamnotesRestAPI = new AnamnotesRestAPI()
  const anamnotesWebsocketAPI = new AnamnotesWebsocketAPI()

  useEffect(() => {
    recordingStateRef.current = recordingState
  }, [recordingState])

  const initializeMediaRecorder = (
    stream: MediaStream,
    chunkCallback: (audioChunk: Blob) => void,
    stopCallback: (audioChunk: Blob) => void,
  ) => {
    const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })

    recorder.ondataavailable = (event: BlobEvent) => {
      const blob = new Blob([event.data], { type: 'audio/webm' })

      ;[ERecordingState.RECORDING, ERecordingState.PAUSED].includes(recordingStateRef.current)
        ? chunkCallback(blob)
        : stopCallback(blob)
    }

    recorder.onpause = () => {
      setRecordingState(ERecordingState.PAUSED)
    }

    recorder.onresume = () => {
      setRecordingState(ERecordingState.RECORDING)
    }

    return recorder
  }

  const startNewRecorder = async () => {
    if (!audioStreamRef.current) return

    const recorder = initializeMediaRecorder(
      audioStreamRef.current,
      sendAudioChunk,
      sendLastAudioChunk,
    )

    mediaRecorderRef.current = recorder
    recorder.start()
    chunkIntervalRef.current = setTimeout(() => {
      recorder.stop()
      startNewRecorder()
    }, 60000)
  }

  const uploadAudioChunk = async (audioChunk: Blob, isLastChunk: boolean) => {
    const lastAudioChunkId = lastAudioChunkIdRef.current
    const conversationId = conversationIdRef.current

    if (!conversationId) throw new Error('Invalid conversationId')

    const currentChunkId = lastAudioChunkId ? lastAudioChunkId + 1 : 1
    const signedUploadURL = await anamnotesRestAPI.getAudioChunkUploadURL({
      conversationId,
      audioChunkId: currentChunkId.toString(),
      isLastChunk,
    })

    await anamnotesRestAPI.uploadAudioChunk({
      signedURL: signedUploadURL,
      audioChunkBlob: audioChunk,
    })

    lastAudioChunkIdRef.current = currentChunkId
  }

  const sendAudioChunk = async (audioChunk: Blob) => {
    await uploadAudioChunk(audioChunk, false)
  }

  const sendLastAudioChunk = async (audioChunk: Blob) => {
    await uploadAudioChunk(audioChunk, true)

    try {
      if (!conversationIdRef.current) throw new Error('Invalid conversationId')
      const conversationWithSummarization = await anamnotesWebsocketAPI.getSummarizationMessage(
        conversationIdRef.current,
      )
      addConversation(conversationWithSummarization)
      selectConversation(conversationWithSummarization.id)
      setRecordingState(ERecordingState.SUCCESS)
    } catch (error) {
      console.error(error)
      setRecordingState(ERecordingState.IDLE)
    }
  }

  const getConversationId = async (clientName: string) => {
    const conversationId = await anamnotesRestAPI.createConversation({ clientName })
    conversationIdRef.current = conversationId
  }

  const startRecording = async (clientName: string) => {
    lastAudioChunkIdRef.current = null

    const stream = await navigator.mediaDevices?.getUserMedia({ audio: true })
    audioStreamRef.current = stream

    await startNewRecorder()
    setRecordingState(ERecordingState.RECORDING)
    getConversationId(clientName)
  }

  const stopRecording = async () => {
    if (chunkIntervalRef.current) {
      clearTimeout(chunkIntervalRef.current)
    }
    setRecordingState(ERecordingState.WAITING_RESPONSE)

    mediaRecorderRef.current?.stop()

    if (audioStreamRef.current) {
      const tracks = audioStreamRef.current.getTracks()
      tracks.forEach((track) => {
        track.stop()
      })
    }
  }

  const pauseRecording = () => mediaRecorderRef.current?.pause()

  const resumeRecording = () => mediaRecorderRef.current?.resume()

  return (
    <div className="tw-flex-1 tw-justify-center tw-items-center tw-flex tw-overflow-visible tw-absolute tw-bottom-6 tw-inset-0 tw-z-50">
      <div className="tw-absolute tw-w-auto tw-mx-auto tw-max-w-3xl tw-bottom-0 tw-overflow-visible">
        <div className="tw-w-[38rem] tw-rounded-2xl tw-relative tw-flex tw-flex-col tw-bg-neutrals-white tw-shadow-[0_4px_32px_0px_rgba(0,0,0,0.10)]">
          {recordingState === ERecordingState.IDLE ? (
            <StartConversationContent startRecording={startRecording} />
          ) : (
            <OngoingConversationContent
              pauseRecording={pauseRecording}
              resumeRecording={resumeRecording}
              stopRecording={stopRecording}
            />
          )}
        </div>
      </div>
    </div>
  )
}
