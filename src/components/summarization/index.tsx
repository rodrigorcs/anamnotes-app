import { FC, useEffect, useRef, useState } from 'react'
import { Button } from '../common/Button'
import { SummarizationSection, getTitleFromSlug } from './SummarizationSection'
import { useConversationStore } from '../../stores/conversations'
import { ESectionSlugs } from '../../models/contracts/Summarization'
import { CopyButton } from '../common/CopyButton'

export const Summarization: FC = () => {
  const selectedConversation = useConversationStore((state) => state.selectedConversation)
  const summarization = selectedConversation?.summarizations[0]
  const [expandedSlugs, setExpandedSlugs] = useState<string[]>(
    summarization?.content.map((contentSection) => contentSection.slug) || [],
  )
  const [copiedSection, setCopiedSection] = useState<ESectionSlugs | 'all' | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleToggleExpanded = (slug: string) => {
    if (expandedSlugs.includes(slug)) {
      setExpandedSlugs(expandedSlugs.filter((expandedSlug) => expandedSlug !== slug))
    } else {
      setExpandedSlugs([...expandedSlugs, slug])
    }
  }

  useEffect(() => {
    if (copiedSection) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        setCopiedSection(null)
        timeoutRef.current = null
      }, 1500)
    }
  }, [copiedSection])

  const contentToCopy =
    summarization?.content
      .map((section) => {
        const title = getTitleFromSlug(section.slug)
        return `# ${title.toUpperCase()}\n${section.content}`
      })
      .join('\n\n') ?? ''

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
              copiedSection={copiedSection}
              setCopiedSection={setCopiedSection}
              isFirstItem={index === 0}
            />
          )
        })}
      </div>
      <div className="tw-flex tw-mt-8">
        <Button
          text="Copiar tudo"
          IconRight={
            <CopyButton
              isCopied={copiedSection === 'all'}
              setCopiedSection={setCopiedSection}
              contentSection={{
                slug: 'all' as ESectionSlugs,
                content: contentToCopy,
              }}
            />
          }
          variant="secondary"
          rounded
          className="tw-font-medium"
          onClick={() => {}} // TODO: Change copy logic to button
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
