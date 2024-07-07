import { FC } from 'react'
import { cn } from '../../utils/className'

export const NewConversation: FC = () => {
  return (
    <div className="tw-flex tw-flex-col tw-flex-1">
      <h1 className="tw-text-6xl tw-font-medium ">
        <span className="tw-bg-gradient-to-tr tw-from-[#3C65C7] tw-to-[#1F97B1] tw-text-neutrals-white tw-text-opacity-0 tw-bg-clip-text">
          Olá, Roque!
        </span>{' '}
        👋🏻
      </h1>
      <h1 className="tw-text-4xl tw-font-light tw-text-neutrals-400 tw-mt-4">
        Pronto para iniciar uma nova <span className="tw-font-normal">anamnese</span>?
      </h1>
      <div className="tw-my-8 tw-border-t tw-border-neutrals-100"></div>
      <div className="tw-flex">
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
                'tw-flex tw-flex-col tw-h-36 tw-w-52 tw-bg-background-100 tw-border tw-border-neutrals-100 tw-rounded-2xl tw-p-4 tw-justify-between',
                !isFirstItem && 'tw-ml-6',
              )}
            >
              <div className="tw-flex tw-size-8 tw-rounded-full tw-bg-brand-100 tw-items-center tw-justify-center tw-text-center">
                <span className="tw-font-bold tw-text-brand-500">{index + 1}</span>
              </div>
              <p className="tw-text-neutrals-700">{instruction}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
