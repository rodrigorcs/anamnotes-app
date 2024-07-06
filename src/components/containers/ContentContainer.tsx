import { FC, ReactNode } from 'react'

interface IProps {
  children: ReactNode
}

export const ContentContainer: FC<IProps> = ({ children }) => {
  return (
    <div className="tw-flex tw-flex-1 tw-justify-center tw-bg-background-white">{children}</div>
  )
}
