import { FC } from 'react'
import { ClassNameValue } from 'tailwind-merge'
import { cn } from '../../../utils/className'
import { Avatar } from '../../common/Avatar'

interface IProps {
  fullName: string
  isSelected?: boolean
  isFirstItem?: boolean
  className?: ClassNameValue
}

export const ClientsListItem: FC<IProps> = ({ fullName, isSelected, isFirstItem, className }) => {
  return (
    <div
      className={cn(
        'tw-flex tw-items-center tw-p-1 tw-rounded-full',
        isSelected && 'tw-bg-background-200 tw-font-medium',
        !isFirstItem && 'tw-mt-1',
        className,
      )}
    >
      <Avatar fullName={fullName} />
      <p className="tw-ml-2 tw-text-neutrals-700 tw-text-sm">{fullName}</p>
    </div>
  )
}
