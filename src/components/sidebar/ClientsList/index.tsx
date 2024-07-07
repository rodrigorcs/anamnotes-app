import { FC } from 'react'
import { ClassNameValue } from 'tailwind-merge'
import { cn } from '../../../utils/className'
import { ClientsListGroup } from './ClientsListGroup'
import { useConversationStore } from '../../../stores/conversations'
import { IClient } from '../../../models/contracts/Conversations'

interface IProps {
  className?: ClassNameValue
}

enum EClientGroupSlugs {
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  LAST_WEEK = 'last-week',
  LAST_MONTH = 'last-month',
}

interface IClientGroup {
  title: string
  clients: IClient[]
}

const getGroupedClientsByPeriod = (clients: IClient[]): IClientGroup[] => {
  const groupedClientsMapping: Record<EClientGroupSlugs, IClientGroup> = {
    [EClientGroupSlugs.TODAY]: { title: 'Hoje', clients: clients.slice(0, 2) },
    [EClientGroupSlugs.YESTERDAY]: { title: 'Ontem', clients: clients.slice(2, 6) },
    [EClientGroupSlugs.LAST_WEEK]: { title: 'Últimos 7 dias', clients: clients.slice(6, 12) },
    [EClientGroupSlugs.LAST_MONTH]: { title: 'Últimos 30 dias', clients: clients.slice(12, 20) },
  }

  return Object.values(groupedClientsMapping)
}

export const ClientsList: FC<IProps> = ({ className }) => {
  const clients = useConversationStore((state) => state.clients)

  const clientGroups = getGroupedClientsByPeriod(clients)
  return (
    <div className={cn('tw-overflow-y-auto', className)}>
      {clientGroups
        .filter((clientGroup) => clientGroup.clients.length)
        .map((clientGroup, index) => {
          return (
            <ClientsListGroup
              title={clientGroup.title}
              clients={clientGroup.clients}
              isFirstItem={index === 0}
              className="tw-mr-6"
            />
          )
        })}
    </div>
  )
}
