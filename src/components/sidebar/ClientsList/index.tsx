import { FC } from 'react'
import { ClassNameValue } from 'tailwind-merge'
import { cn } from '../../../utils/className'
import { ClientsListGroup } from './ClientsListGroup'
import { useConversationStore } from '../../../stores/conversations'
import { IClient } from '../../../models/contracts/Conversations'

interface IProps {
  searchQuery: string
  className?: ClassNameValue
}

enum EClientGroupSlugs {
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  LAST_WEEK = 'last-week',
  LAST_MONTH = 'last-month',
}

interface IClientGroup {
  slug: EClientGroupSlugs
  title: string
  clients: IClient[]
}

const getGroupedClientsByPeriod = (clients: IClient[]): IClientGroup[] => {
  const groupedClientsMapping: Record<EClientGroupSlugs, IClientGroup> = {
    [EClientGroupSlugs.TODAY]: {
      slug: EClientGroupSlugs.TODAY,
      title: 'Hoje',
      clients: clients.slice(0, 2),
    },
    [EClientGroupSlugs.YESTERDAY]: {
      slug: EClientGroupSlugs.YESTERDAY,
      title: 'Ontem',
      clients: clients.slice(2, 6),
    },
    [EClientGroupSlugs.LAST_WEEK]: {
      slug: EClientGroupSlugs.LAST_WEEK,
      title: 'Últimos 7 dias',
      clients: clients.slice(6, 12),
    },
    [EClientGroupSlugs.LAST_MONTH]: {
      slug: EClientGroupSlugs.LAST_MONTH,
      title: 'Últimos 30 dias',
      clients: clients.slice(12, 20),
    },
  }

  return Object.values(groupedClientsMapping)
}

export const ClientsList: FC<IProps> = ({ searchQuery, className }) => {
  const clients = useConversationStore((state) => state.clients)
  const filteredClients =
    searchQuery.length > 2
      ? clients.filter((client) => client.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : clients

  const clientGroups = getGroupedClientsByPeriod(filteredClients)
  return (
    <div className={cn('tw-overflow-y-auto', className)}>
      {clientGroups
        .filter((clientGroup) => clientGroup.clients.length)
        .map((clientGroup, index) => {
          return (
            <ClientsListGroup
              key={clientGroup.slug}
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
