import { FC } from 'react'
import { Input } from '../common/Input'
import { Button } from '../common/Button'
import { ClientsList } from './ClientsList'
import { Search as SearchIcon, Plus as PlusIcon } from 'iconoir-react'
import { useConversationStore } from '../../stores/conversations'

export const Sidebar: FC = () => {
  const clearConversationSelection = useConversationStore(
    (state) => state.clearConversationSelection,
  )
  return (
    <div className="tw-flex tw-flex-col tw-w-72 tw-bg-background-100 tw-py-6">
      <div className="tw-flex tw-flex-col tw-max-h-full">
        <div className="tw-flex tw-flex-col tw-px-6">
          <Input placeholder="Pesquisar..." IconLeft={<SearchIcon />} />
          <Button
            text="Nova anamnese"
            IconLeft={<PlusIcon />}
            rounded
            size="small"
            className="tw-mt-6"
            onClick={() => {
              clearConversationSelection()
            }}
          />
        </div>
        <ClientsList className="tw-mt-6 tw-ml-6" />
      </div>
    </div>
  )
}
