import { FC, useState } from 'react'
import { Copy as CopyIcon } from 'iconoir-react'
import { Button } from '../common/Button'
import { SummarizationSection } from './SummarizationSection'
import { useConversationStore } from '../../stores/conversations'

export const Summarization: FC = () => {
  const selectedConversation = useConversationStore((state) => state.selectedConversation)
  const summarization = selectedConversation?.summarizations[0]
  const [expandedSlugs, setExpandedSlugs] = useState<string[]>(
    summarization?.content.map((contentSection) => contentSection.slug) || [],
  )

  const handleToggleExpanded = (slug: string) => {
    if (expandedSlugs.includes(slug)) {
      setExpandedSlugs(expandedSlugs.filter((expandedSlug) => expandedSlug !== slug))
    } else {
      setExpandedSlugs([...expandedSlugs, slug])
    }
  }

  return (
    <div className="tw-flex tw-flex-col tw-w-[42rem] tw-py-10 tw-px-4">
      <h1 className="tw-text-neutrals-800 tw-font-bold tw-text-3xl">Resumo da anamnese</h1>
      <div className="tw-mt-8">
        {summarization?.content.map((contentSection, index) => {
          const isExpanded = expandedSlugs.includes(contentSection.slug)
          return (
            <SummarizationSection
              isExpanded={isExpanded}
              toggleExpanded={handleToggleExpanded}
              contentSection={contentSection}
              isFirstItem={index === 0}
            />
          )
        })}
      </div>
      <div className="tw-flex tw-mt-8">
        <Button
          text="Copiar tudo"
          IconRight={<CopyIcon />}
          variant="secondary"
          rounded
          className="tw-font-medium"
        />
        <Button
          text="Copiar seções expandidas"
          variant="tertiary"
          className="tw-ml-2 tw-font-medium"
        />
      </div>
    </div>
  )
}
