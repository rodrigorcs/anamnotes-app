import { useState, useRef, FC, ReactNode, useEffect } from 'react'
import axios from 'axios'
import {
  IconoirProvider,
  Microphone as MicIcon,
  Pause as PauseIcon,
  Check as CheckIcon,
  Xmark as CloseIcon,
  NavArrowUp as ExpandIcon,
} from 'iconoir-react'
import { theme } from '../theme'
import { cn } from '../utils/className'
import { Spinner } from './common/Spinner'
import { ERecordingState } from '../App'
import { TSection, parseSections } from '../models/contracts/sections'
import { EWebsocketMessageTypes, TSummarizationWebsocketMessage } from '../models/apis/websocket'

interface IProps {
  recordingState: ERecordingState
  setRecordingState: (state: ERecordingState) => void
  isModalActive: boolean
  isModalExpanded: boolean
  closeModal: () => void
  expandModal: () => void
  setSections(sections: TSection[]): void
}

export const RecordButton: FC<IProps> = ({
  recordingState,
  setRecordingState,
  isModalActive,
  isModalExpanded,
  closeModal,
  expandModal,
  setSections,
}) => {
  const [fabContentWidth, setFABContentWidth] = useState(0)
  const audioStreamRef = useRef<MediaStream | null>(null)
  const lastAudioChunkIdRef = useRef<number | null>(null)
  const conversationIdRef = useRef<string | null>(null)
  const fabContentRef = useRef<HTMLDivElement | null>(null)
  const chunkIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordingStateRef = useRef<ERecordingState>(ERecordingState.IDLE)

  useEffect(() => {
    recordingStateRef.current = recordingState
  }, [recordingState])

  const getContentByRecordingState = (recordingState: ERecordingState) => {
    const fabContentMapping: Record<
      ERecordingState,
      { icon: ReactNode; title: string | null; subtitle: string | null }
    > = {
      [ERecordingState.IDLE]: {
        icon: <MicIcon />,
        title: null,
        subtitle: null,
      },
      [ERecordingState.RECORDING]: {
        icon: <PauseIcon />,
        title: 'Ouvindo o paciente...',
        subtitle: 'Ao finalizar, clique no botão ao lado!',
      },
      [ERecordingState.WAITING_RESPONSE]: {
        icon: (
          <Spinner
            className="tw-animate-spin"
            color={theme.colors['neutrals-white']}
            strokeWidth={2}
            width="1.5em"
            height="1.5em"
          />
        ),
        title: 'Analisando...',
        subtitle: 'Analisando a anamnese, pode levar alguns instantes.',
      },
      [ERecordingState.SUCCESS]: {
        icon: <CheckIcon />,
        title: 'Tudo pronto!',
        subtitle: 'Já analisamos e resumimos tudo para você!',
      },
    }

    return fabContentMapping[recordingState]
  }

  const initializeMediaRecorder = (
    stream: MediaStream,
    chunkCallback: (audioChunk: Blob) => void,
    stopCallback: (audioChunk: Blob) => void,
  ) => {
    const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })

    recorder.ondataavailable = (event: BlobEvent) => {
      const blob = new Blob([event.data], { type: 'audio/webm' })
      recordingStateRef.current === ERecordingState.RECORDING
        ? chunkCallback(blob)
        : stopCallback(blob)
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

    const currentChunkId = lastAudioChunkId ? lastAudioChunkId + 1 : 1
    const presignedUploadUrlResponse = await axios.get(
      `https://api.anamnotes.com/v1/conversations/${conversationId}/audioChunks/${currentChunkId}/uploadUrl`,
      {
        params: { isLastChunk },
      },
    )

    await axios.put(presignedUploadUrlResponse.data.signedUrl, audioChunk)

    lastAudioChunkIdRef.current = currentChunkId
  }

  const sendAudioChunk = async (audioChunk: Blob) => {
    await uploadAudioChunk(audioChunk, false)
  }

  const getSummarizationMessage = async () =>
    new Promise<TSummarizationWebsocketMessage['data']>((resolve, reject) => {
      const wsURL = new URL('wss://ws.anamnotes.com')
      wsURL.searchParams.append('conversationId', conversationIdRef.current ?? '')

      const ws = new WebSocket(wsURL)
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data) as TSummarizationWebsocketMessage
        if (message.type !== EWebsocketMessageTypes.SUMMARIZATION) return
        if (ws.readyState === ws.OPEN) ws.close()

        if (message.success && message.data) {
          resolve(message.data)
        } else {
          reject(message.error)
        }
      }
      ws.onerror = (error) => {
        reject(error)
      }
    })

  const sendLastAudioChunk = async (audioChunk: Blob) => {
    await uploadAudioChunk(audioChunk, true)

    try {
      const summarizationMessage = await getSummarizationMessage()
      const validatedSections = parseSections(summarizationMessage?.content)
      setSections(validatedSections)
      setRecordingState(ERecordingState.SUCCESS)
    } catch (error) {
      console.error(error)
      setRecordingState(ERecordingState.IDLE)
    }
  }

  const getConversationId = async () => {
    const startConversationResponse = await axios.post('https://api.anamnotes.com/v1/conversations')
    conversationIdRef.current = startConversationResponse.data.conversationId
  }

  const startRecording = async () => {
    lastAudioChunkIdRef.current = null

    const stream = await navigator.mediaDevices?.getUserMedia({ audio: true })
    audioStreamRef.current = stream

    await startNewRecorder()
    setRecordingState(ERecordingState.RECORDING)
    getConversationId()
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

  const fabContent = getContentByRecordingState(recordingState)
  const hasContent = fabContent.title !== null
  const shouldCloseModal = recordingState === ERecordingState.IDLE && isModalExpanded
  const shouldExpandModal =
    recordingState === ERecordingState.IDLE && isModalActive && !isModalExpanded

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries.find((entry) => entry.target === fabContentRef.current)
      if (entry) setFABContentWidth(entry.contentRect.width)
    })

    if (fabContentRef.current) {
      resizeObserver.observe(fabContentRef.current)
    }

    return () => {
      if (fabContentRef.current) {
        resizeObserver.unobserve(fabContentRef?.current)
      }
    }
  }, [fabContent.title, fabContent.subtitle])

  return (
    <div
      className={cn(
        'tw-flex tw-flex-grow-0 tw-bg-neutrals-white tw-rounded-full tw-items-center tw-shadow-lg tw-shadow-neutrals-100 tw-transition-all',
        hasContent && 'tw-p-2',
      )}
    >
      <div
        className={cn(
          'tw-flex-1 tw-bg-neutrals-white tw-flex tw-text-nowrap tw-overflow-hidden tw-transition-all tw-ease-out',
          hasContent && 'tw-mx-6',
        )}
        style={{
          width: fabContentWidth,
        }}
      >
        <div ref={fabContentRef} className="tw-flex tw-flex-col">
          {fabContent.title && (
            <p
              className={cn("tw-text-base tw-text-neutrals-900 tw-font-['Inter'] tw-font-semibold")}
            >
              {fabContent.title}
            </p>
          )}
          {fabContent.subtitle && (
            <p className={cn("tw-text-sm tw-text-neutrals-500 tw-font-['Inter'] tw-mt-0.5")}>
              {fabContent.subtitle}
            </p>
          )}
        </div>
      </div>
      <div>
        <button
          className={cn(
            'tw-bg-brand-500 tw-rounded-full tw-flex tw-items-center tw-justify-center hover:tw-bg-brand-700 disabled:tw-bg-brand-300 tw-h-16 tw-aspect-square tw-transition-colors tw-shadow-md tw-shadow-neutrals-200',
            recordingState === ERecordingState.SUCCESS &&
              'tw-bg-feedback-positive-300 hover:tw-bg-feedback-positive-500',
          )}
          disabled={recordingState === ERecordingState.WAITING_RESPONSE}
          onClick={() => {
            const actionMapping: Record<ERecordingState, (() => void) | null> = {
              [ERecordingState.IDLE]: shouldCloseModal
                ? closeModal
                : shouldExpandModal
                ? expandModal
                : startRecording,
              [ERecordingState.RECORDING]: stopRecording,
              [ERecordingState.WAITING_RESPONSE]: null,
              [ERecordingState.SUCCESS]: () => setRecordingState(ERecordingState.IDLE),
            }
            return actionMapping[recordingState]?.()
          }}
        >
          <IconoirProvider
            iconProps={{
              color: theme.colors['neutrals-white'],
              strokeWidth: 2,
              width: '1.5em',
              height: '1.5em',
            }}
          >
            {shouldCloseModal ? (
              <CloseIcon />
            ) : shouldExpandModal ? (
              <ExpandIcon />
            ) : (
              fabContent.icon
            )}
          </IconoirProvider>
        </button>
      </div>
    </div>
  )
}
