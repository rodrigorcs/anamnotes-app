import { FC } from 'react'
import { ClassNameValue } from 'tailwind-merge'
import { cn } from '../../../utils/className'
import { Avatar } from '../../common/Avatar'
import { ClientsListItem } from './ClientsListItem'
import { IClient } from '../../../models/contracts/Conversations'

interface IProps {
  title: string
  clients: IClient[]
  isFirstItem?: boolean
  className?: ClassNameValue
}

export const ClientsListGroup: FC<IProps> = ({ title, clients, isFirstItem, className }) => {
  return (
    <div className={cn(!isFirstItem && 'tw-mt-6', className)}>
      <h3 className="tw-text-neutrals-800 tw-font-medium tw-text-sm">{title}</h3>
      <div className="tw-mt-4 tw-items-center">
        {clients.map((client, index) => {
          return <ClientsListItem client={client} isFirstItem={index === 0} />
        })}
      </div>
    </div>
  )
}
