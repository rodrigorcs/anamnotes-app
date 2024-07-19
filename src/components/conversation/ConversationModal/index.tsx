import { FC, useEffect, useRef } from 'react'
import { useConversationStore } from '../../../stores/conversations'
import { ERecordingState, useRecordingStore } from '../../../stores/recording'
import { AnamnotesRestAPI } from '../../../apis/anamnotesRest'
import { AnamnotesWebsocketAPI } from '../../../apis/anamnotesWebsocket'
import { useNavigate } from 'react-router-dom'
import { EFeedbackTopics, useFeedback } from '../../../hooks/useFeedback'
import { OngoingConversationContent } from './OngoingConversationContent'
import { StartConversationContent } from './StartConversationContent'

export const ConversationModal: FC = () => {
  const audioStreamRef = useRef<MediaStream | null>(null)
  const lastAudioChunkIdRef = useRef<number | null>(null)
  const conversationIdRef = useRef<string | null>(null)
  const chunkIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordingStateRef = useRef<ERecordingState>(ERecordingState.IDLE)

  const navigate = useNavigate()

  const addConversation = useConversationStore((state) => state.addConversation)
  const recordingState = useRecordingStore((state) => state.recordingState)
  const setRecordingState = useRecordingStore((state) => state.setRecordingState)

  const { setFeedback } = useFeedback()

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

    try {
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
    } catch (error) {
      setFeedback({
        type: 'error',
        message:
          'Ocorreu um erro ao iniciar a gravação, verifique a configuração do seu microfone.',
      })
    }
  }

  const uploadAudioChunk = async (audioChunk: Blob, isLastChunk: boolean) => {
    const lastAudioChunkId = lastAudioChunkIdRef.current
    const conversationId = conversationIdRef.current

    if (!conversationId) throw new Error('Invalid conversationId')

    const currentChunkId = lastAudioChunkId ? lastAudioChunkId + 1 : 1

    try {
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
    } catch (error) {
      setFeedback(
        {
          type: 'error',
          message: 'Ocorreu um erro ao enviar a anamnese, verifique a conexão com a internet.',
        },
        { postToTopic: EFeedbackTopics.RECORDING },
      )
    }
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
      setRecordingState(ERecordingState.SUCCESS)
      addConversation(conversationWithSummarization)

      setTimeout(() => {
        navigate(`../${conversationIdRef.current}`)
      }, 1500)
    } catch (error) {
      setFeedback(
        {
          type: 'error',
          message: 'Não foi possível gerar um resumo, há pouca informação na anamnese.',
        },
        { postToTopic: EFeedbackTopics.RECORDING },
      )
      // TODO: Add fallback scenario (e.g. confirm whether the "no info" is the error cause)
      setRecordingState(ERecordingState.ERROR)
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
        <div className="tw-w-[38rem] tw-rounded-2xl tw-relative tw-flex tw-flex-col tw-bg-neutrals-white tw-shadow-[0_4px_32px_0px_rgba(0,0,0,0.10)] max-lg:tw-w-[28rem]">
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
