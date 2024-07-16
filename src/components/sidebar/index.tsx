import { FC, useState } from 'react'
import { Input } from '../common/Input'
import { Button } from '../common/Button'
import { ClientsList } from './ClientsList'
import { Search as SearchIcon, Plus as PlusIcon, LogOut as SignOutIcon } from 'iconoir-react'
import { useConversationStore } from '../../stores/conversations'
import { useRecordingStore } from '../../stores/recording'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'aws-amplify/auth'
import { useAuthStore } from '../../stores/auth'
import { useFeedbackStore } from '../../stores/feedback'

export const Sidebar: FC = () => {
  const navigate = useNavigate()
  const clearConversationSelection = useConversationStore(
    (state) => state.clearConversationSelection,
  )
  const clearConversationsState = useConversationStore((state) => state.clearConversationsState)
  const clearRecordingState = useRecordingStore((state) => state.clearRecordingState)
  const clearUser = useAuthStore((state) => state.clearUser)
  const clearFeedback = useFeedbackStore((state) => state.clearFeedback)

  const [searchQuery, setSearchQuery] = useState<string>('')

  const handleSignOut = async () => {
    await signOut()
    clearRecordingState()
    clearConversationsState()
    clearUser()
    clearFeedback()
  }

  return (
    <div className="tw-flex tw-flex-col tw-w-72 tw-bg-background-100 tw-py-6">
      <div className="tw-flex-1 tw-flex tw-flex-col tw-max-h-full">
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
        <ClientsList searchQuery={searchQuery} className="tw-my-6 tw-ml-6" />
        <Button
          text="Sair"
          variant="tertiary"
          size="fit"
          textClassName="tw-text-neutrals-500"
          iconClassName="tw-text-neutrals-500"
          IconRight={<SignOutIcon />}
          iconSize={1.25}
          iconStrokeWidth={1.75}
          onClick={handleSignOut}
        />
      </div>
    </div>
  )
}
