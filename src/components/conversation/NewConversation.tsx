import { FC } from 'react'
import { cn } from '../../utils/className'
import { useAuthStore } from '../../stores/auth'
import { getFirstNameFromFullName } from '../../utils/names'

export const NewConversation: FC = () => {
  const user = useAuthStore((state) => state.user)
  const firstName = getFirstNameFromFullName(user?.fullName)

  return (
    <div className="tw-flex tw-flex-col tw-flex-1">
      <h1 className="tw-text-4xl lg:tw-text-5xl tw-font-medium">
        <span className="tw-bg-gradient-to-tr tw-from-[#3C65C7] tw-to-[#1F97B1] tw-text-neutrals-white tw-text-opacity-0 tw-bg-clip-text">
          {`Olá${firstName ? `, ${firstName}` : ''}!`}
        </span>{' '}
        👋🏻
      </h1>
      <h1 className="tw-text-xl lg:tw-text-3xl tw-font-light tw-text-neutrals-400 tw-mt-4">
        Pronto para iniciar uma nova <span className="tw-font-normal">anamnese</span>?
      </h1>
      <div className="tw-my-8 lg:tw-my-12 tw-border-t tw-border-neutrals-100"></div>
      <div className="tw-flex tw-flex-col lg:tw-flex-row">
        {[
          'Inicie a anamnese pelo botão abaixo',
          'Comece a conversa com o paciente',
          'Receba o resumo da sua anamnese 🎉',
        ].map((instruction, index) => {
          const isFirstItem = index === 0
          return (
            <div
              key={index} // Using index as key because list is not mutable
              className={cn(
                'tw-flex tw-flex-row tw-py-4 tw-w-[24rem] tw-items-center tw-bg-background-100 tw-border tw-border-neutrals-100 tw-rounded-2xl tw-px-4',
                'lg:tw-justify-between lg:tw-flex-col lg:tw-w-52 lg:tw-items-start',
                !isFirstItem && 'tw-ml-0 lg:tw-ml-6 tw-mt-4 lg:tw-mt-0',
              )}
            >
              <div className="tw-flex tw-size-6 lg:tw-size-8 tw-rounded-full tw-bg-brand-100 tw-items-center tw-justify-center tw-text-center">
                <span className="tw-font-bold tw-text-brand-500 tw-text-sm">{index + 1}</span>
              </div>
              <p className="tw-text-neutrals-600 tw-ml-4 lg:tw-ml-0 lg:tw-mt-8">{instruction}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
