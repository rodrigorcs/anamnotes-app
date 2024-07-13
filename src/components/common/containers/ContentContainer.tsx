import { FC, ReactNode } from 'react'

interface IProps {
  children: ReactNode
}

export const ContentContainer: FC<IProps> = ({ children }) => {
  return (
    <div className="tw-flex tw-flex-col tw-flex-1 tw-items-center tw-bg-background-white tw-overflow-y-auto">
      {children}
    </div>
  )
}
