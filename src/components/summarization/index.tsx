import { FC } from 'react'
import { Copy as CopyIcon } from 'iconoir-react'
import { Button } from '../common/Button'
import { SummarizationSection } from './SummarizationSection'

interface IProps {}

export const Summarization: FC<IProps> = ({}) => {
  return (
    <div className="tw-flex tw-flex-col tw-w-[42rem] tw-py-10 tw-px-4">
      <h1 className="tw-text-neutrals-800 tw-font-bold tw-text-3xl">Resumo da anamnese</h1>
      <div className="tw-mt-8">
        {new Array(4).fill(null).map((_item, index) => {
          const isExpanded = index !== 2
          return <SummarizationSection isExpanded={isExpanded} isFirstItem={index === 0} />
        })}
      </div>
      <div className="tw-flex tw-mt-8">
        <Button text="Copiar tudo" IconRight={<CopyIcon />} variant="secondary" rounded />
        <Button text="Copiar seções expandidas" variant="tertiary" className="tw-ml-2" />
      </div>
    </div>
  )
}
