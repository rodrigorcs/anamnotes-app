import { FC, ReactNode } from 'react'

interface IProps {
  children: ReactNode
}

export const MainContainer: FC<IProps> = ({ children }) => {
  return <div className="tw-flex tw-flex-col tw-flex-1 tw-bg-background-white">{children}</div>
}
