import { FC, useEffect, useRef, useState } from 'react'
import { Button } from '../common/Button'
import { SummarizationSection, getTitleFromSlug } from './SummarizationSection'
import { useConversationStore } from '../../stores/conversations'
import { ESectionSlugs, TContentSection } from '../../models/contracts/Summarization'
import { Check as CheckIcon, Copy as CopyIcon } from 'iconoir-react'
import { copyToClipboard } from '../../utils/clipboard'
import { IConversationWithSummarizations } from '../../models/contracts/Conversations'
import { SummarizationSkeleton } from '../skeletons/SummarizationSkeleton'
import { Alert } from '../common/Alert'
import { EFeedbackTopics, useFeedback } from '../../hooks/useFeedback'

const getSummarizationClipboardText = (
  contentSections: TContentSection[],
  filterSlugs: string[] | null,
) => {
  return (
    contentSections
      .filter((contentSection) => (filterSlugs ? filterSlugs.includes(contentSection.slug) : true))
      .map((section) => {
        const title = getTitleFromSlug(section.slug)
        return `# ${title.toUpperCase()}\n${section.content}`
      })
      .join('\n\n') ?? ''
  )
}

export type TCopiedSection = ESectionSlugs | 'all' | 'expanded' | null

export const Summarization: FC = () => {
  const { feedback } = useFeedback({ subscribeToTopic: EFeedbackTopics.CONVERSATION })

  const selectedConversation = useConversationStore((state) => state.selectedConversation)

  const [summarization] =
    (selectedConversation as IConversationWithSummarizations)?.summarizations ?? []

  const [expandedSlugs, setExpandedSlugs] = useState<string[]>(
    summarization?.content.map((contentSection) => contentSection.slug) || [],
  )
  const [copiedSection, setCopiedSection] = useState<TCopiedSection>(null)
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

  useEffect(() => {
    if (!summarization) return
    setExpandedSlugs(summarization.content.map((contentSection) => contentSection.slug))
  }, [summarization])

  return (
    <div className="tw-flex tw-flex-col tw-w-[42rem] tw-py-10 tw-px-4">
      <Alert feedback={feedback} className="tw-mb-4" />
      <>
        {!summarization && !feedback ? (
          <SummarizationSkeleton />
        ) : (
          <>
            {feedback?.type !== 'error' && (
              <>
                <h1 className="tw-text-neutrals-800 tw-font-bold tw-text-3xl">
                  Resumo da anamnese
                </h1>
                <div className="tw-mt-8">
                  {summarization?.content.map((contentSection, index) => {
                    const isExpanded = expandedSlugs.includes(contentSection.slug)
                    return (
                      <SummarizationSection
                        key={`${summarization.id}#${contentSection.slug}`}
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
                      <>
                        {copiedSection === 'all' ? (
                          <CheckIcon className="tw-text-feedback-positive-300 group-hover:tw-text-feedback-positive-500" />
                        ) : (
                          <CopyIcon />
                        )}
                      </>
                    }
                    iconClassName={copiedSection === 'all' && 'tw-text-feedback-positive-300'}
                    variant="secondary"
                    rounded
                    className="tw-font-medium"
                    onClick={() => {
                      const content = getSummarizationClipboardText(
                        summarization?.content ?? [],
                        null,
                      )
                      copyToClipboard(content)
                      setCopiedSection('all')
                    }}
                  />
                  <Button
                    text="Copiar seções expandidas"
                    variant="tertiary"
                    className="tw-ml-2 tw-font-medium"
                    IconRight={
                      copiedSection === 'expanded' && (
                        <CheckIcon className="tw-text-feedback-positive-300 group-hover:tw-text-feedback-positive-500" />
                      )
                    }
                    onClick={() => {
                      const content = getSummarizationClipboardText(
                        summarization?.content ?? [],
                        expandedSlugs,
                      )
                      copyToClipboard(content)
                      setCopiedSection('expanded')
                    }}
                  />
                </div>
              </>
            )}
          </>
        )}
      </>
    </div>
  )
}
