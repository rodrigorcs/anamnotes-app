import { FC, useState } from 'react'
import { Input } from '../common/Input'
import { Button } from '../common/Button'
import { ClientsList } from './ClientsList'
import { Search as SearchIcon, Plus as PlusIcon } from 'iconoir-react'
import { useConversationStore } from '../../stores/conversations'
import { useRecordingStore } from '../../stores/recording'
import { useNavigate } from 'react-router-dom'

export const Sidebar: FC = () => {
  const navigate = useNavigate()
  const clearConversationSelection = useConversationStore(
    (state) => state.clearConversationSelection,
  )
  const clearRecordingState = useRecordingStore((state) => state.clearRecordingState)

  const [searchQuery, setSearchQuery] = useState<string>('')

  return (
    <div className="tw-flex tw-flex-col tw-w-72 tw-bg-background-100 tw-py-6">
      <div className="tw-flex tw-flex-col tw-max-h-full">
        <div className="tw-flex tw-flex-col tw-px-6">
          <Input
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value)
            }}
            placeholder="Pesquisar..."
            IconLeft={<SearchIcon />}
          />
          <Button
            text="Nova anamnese"
            IconLeft={<PlusIcon />}
            rounded
            size="small"
            className="tw-mt-6"
            onClick={() => {
              clearConversationSelection()
              clearRecordingState()
              navigate('conversations/new', { relative: 'route' })
            }}
          />
        </div>
        <ClientsList searchQuery={searchQuery} className="tw-mt-6 tw-ml-6" />
      </div>
    </div>
  )
}
