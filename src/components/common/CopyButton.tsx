import { IconoirProvider } from 'iconoir-react'
import { copyToClipboard } from '../../utils/clipboard'
import { Check as CheckIcon, Copy as CopyIcon } from 'iconoir-react'
import { ESectionSlugs, TContentSection } from '../../models/contracts/Summarization'
import { FC } from 'react'

interface IProps {
  isCopied?: boolean
  contentSection: TContentSection
  setCopiedSection: (slug: ESectionSlugs | 'all' | null) => void
}

export const CopyButton: FC<IProps> = ({ contentSection, setCopiedSection, isCopied }) => {
  return (
    <button
      className="tw-ml-2"
      onClick={() => {
        copyToClipboard(contentSection.content)
        setCopiedSection(contentSection.slug)
      }}
    >
      <IconoirProvider
        iconProps={{
          strokeWidth: 1.75,
          width: '1.25em',
          height: '1.25em',
        }}
      >
        {isCopied ? (
          <CheckIcon className="tw-text-feedback-positive-300" />
        ) : (
          <CopyIcon className="tw-text-neutrals-300 hover:tw-text-neutrals-600 tw-transition-colors" />
        )}
      </IconoirProvider>
    </button>
  )
}
