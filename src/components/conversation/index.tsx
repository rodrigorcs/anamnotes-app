import { FC } from 'react'
import { cn } from '../../utils/className'
import { Input } from '../common/Input'
import { Button } from '../common/Button'
import { Microphone as MicIcon } from 'iconoir-react'

export const Conversation: FC = () => {
  return (
    <div className="tw-flex tw-relative tw-flex-col tw-flex-1 tw-p-12 tw-overflow-visible">
      <h1 className="tw-text-6xl tw-font-medium ">
        <span className="tw-bg-gradient-to-tr tw-from-[#3C65C7] tw-to-[#1F97B1] tw-text-neutrals-white tw-text-opacity-0 tw-bg-clip-text">
          Olá, Fernando!
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
              className={cn(
                'tw-flex tw-flex-col tw-h-36 tw-w-52 tw-bg-background-100 tw-border tw-border-neutrals-100 tw-rounded-2xl tw-p-4 tw-justify-between',
                !isFirstItem && 'tw-ml-6',
              )}
            >
              <div
                className={cn(
                  'tw-flex tw-size-8 tw-rounded-full tw-bg-brand-100 tw-items-center tw-justify-center tw-text-center',
                )}
              >
                <span className="tw-font-bold tw-text-brand-500">{index + 1}</span>
              </div>
              <p className="tw-text-neutrals-700">{instruction}</p>
            </div>
          )
        })}
      </div>

      <div className="tw-flex-1 tw-justify-center tw-items-center tw-flex tw-overflow-visible tw-absolute tw-bottom-6 tw-inset-0 tw-z-50">
        <div className="tw-absolute tw-w-auto tw-mx-auto tw-max-w-3xl tw-bottom-0 tw-overflow-visible">
          <div className="tw-w-[38rem] tw-rounded-2xl tw-relative tw-flex tw-flex-col tw-bg-neutrals-white tw-p-6 tw-shadow-[0_4px_32px_0px_rgba(0,0,0,0.10)]">
            <p className="tw-text-neutrals-600">Nome do paciente</p>
            <Input placeholder="João da Silva" className="tw-mt-2" />
            <Button
              text="Iniciar anamnese"
              IconLeft={<MicIcon width={'1.125rem'} height={'1.125rem'} />}
              rounded
              className="tw-mt-6"
            />
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </div>
  )
}
