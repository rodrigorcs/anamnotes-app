import { FC } from 'react'
import { ClassNameValue } from 'tailwind-merge'
import { cn } from '../../../utils/className'
import { ClientsListGroup } from './ClientsListGroup'

interface IProps {
  clients: string[]
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
  clients: string[]
}

const getGroupedClientsByPeriod = (clients: string[]): IClientGroup[] => {
  const groupedClientsMapping: Record<EClientGroupSlugs, IClientGroup> = {
    [EClientGroupSlugs.TODAY]: { title: 'Hoje', clients: clients.slice(0, 2) },
    [EClientGroupSlugs.YESTERDAY]: { title: 'Ontem', clients: clients.slice(2, 6) },
    [EClientGroupSlugs.LAST_WEEK]: { title: 'Últimos 7 dias', clients: clients.slice(6, 12) },
    [EClientGroupSlugs.LAST_MONTH]: { title: 'Últimos 30 dias', clients: clients.slice(12, 20) },
  }

  return Object.values(groupedClientsMapping)
}

export const ClientsList: FC<IProps> = ({ clients, className }) => {
  const clientGroups = getGroupedClientsByPeriod(clients)
  return (
    <div className={cn('tw-overflow-y-auto', className)}>
      {clientGroups.map((clientGroup, index) => {
        const isSelected = index === 3
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
