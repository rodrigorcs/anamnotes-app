import { FC } from 'react'
import { Input } from '../../common/Input'
import { Button } from '../../common/Button'
import { Microphone as MicIcon } from 'iconoir-react'
import { useRecordingStore } from '../../../stores/recording'
import { FormProvider, useForm } from 'react-hook-form'
import {
  StartConversationFormFields,
  TStartConversationFormData,
} from '../../../models/forms/StartConversationForm'

interface IProps {
  startRecording: (clientName: string) => void
}

export const StartConversationContent: FC<IProps> = ({ startRecording }) => {
  const setClientName = useRecordingStore((state) => state.setClientName)

  const formMethods = useForm<TStartConversationFormData>({})

  const onSubmit = (data: TStartConversationFormData) => {
    setClientName(data.fullName)
    startRecording(data.fullName)
  }

  return (
    <div className="tw-flex tw-flex-col tw-p-6">
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)} className="tw-flex tw-flex-col">
          <Input
            id={StartConversationFormFields.fullName}
            title="Nome do paciente"
            placeholder="João da Silva"
            type="text"
          />
          <Button
            text="Iniciar anamnese"
            IconLeft={<MicIcon width={'1.125rem'} height={'1.125rem'} />}
            rounded
            className="tw-mt-6"
            type="submit"
          />
        </form>
      </FormProvider>
    </div>
  )
}
