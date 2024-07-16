import { FC, useState } from 'react'
import { Input } from '../../common/Input'
import { Button } from '../../common/Button'
import { Microphone as MicIcon } from 'iconoir-react'
import { useRecordingStore } from '../../../stores/recording'

interface IProps {
  startRecording: (clientName: string) => void
}

export const StartConversationContent: FC<IProps> = ({ startRecording }) => {
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
