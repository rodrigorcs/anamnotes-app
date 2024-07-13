import { FC, ReactNode } from 'react'

interface IProps {
  children: ReactNode
}

export const RootContainer: FC<IProps> = ({ children }) => {
  return (
    <div id="anamnotes-app-container" className="tw-flex">
      {children}
    </div>
  )
}
