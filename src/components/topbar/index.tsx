import { FC } from 'react'
import { Avatar } from '../common/Avatar'

export const Topbar: FC = () => {
  return (
    <div className="flex-1 tw-flex tw-h-28 tw-px-10 tw-py-6 tw-bg-background-white tw-border-b tw-border-neutrals-200">
      <Avatar fullName="Rodrigo Costa" className="tw-size-8" />
      <div className="tw-ml-3 tw-flex-1 tw-flex tw-flex-col tw-justify-between">
        <h2 className="tw-text-neutrals-800 tw-font-medium tw-text-xl tw-leading-8">
          Rodrigo Costa
        </h2>
        <div className="tw-flex tw-flex-row tw-items-center">
          <p className="tw-text-neutrals-600">Ontem às 16:30</p>
          <span className="tw-mx-2 tw-size-1 tw-rounded-full tw-bg-neutrals-400 tw-block" />
          <p className="tw-text-neutrals-400">+3 anamneses</p>
        </div>
      </div>
    </div>
  )
}
