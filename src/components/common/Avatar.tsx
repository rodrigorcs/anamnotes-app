import { FC } from 'react'
import { ClassNameValue } from 'tailwind-merge'
import { cn } from '../../utils/className'

const stringToHslColor = ({
  name,
  saturation,
  lightness,
}: {
  name: string
  saturation: number
  lightness: number
}) => {
  let nameHash = 0
  for (var i = 0; i < name.length; i++) {
    nameHash = name.charCodeAt(i) + ((nameHash << 5) - nameHash)
  }

  return `hsl(${nameHash % 360}, ${saturation}%, ${lightness}%)`
}

interface IProps {
  fullName: string
  className?: ClassNameValue
}

export const Avatar: FC<IProps> = ({ fullName, className }) => {
  const names = fullName.split(' ')
  const lastName = names.length > 1 ? names.pop() : null

  const firstChar: string = fullName[0]
  const lastChar: string = lastName?.[0] ?? ''
  const initials = `${firstChar}${lastChar}`.toUpperCase()

  return (
    <div
      className={cn(
        'tw-flex tw-size-7 tw-rounded-full tw-items-center tw-justify-center tw-text-center',
        className,
      )}
      style={{
        backgroundColor: stringToHslColor({ name: fullName, saturation: 55, lightness: 85 }),
      }}
    >
      <span
        className="tw-text-[0.6875rem] tw-font-semibold"
        style={{
          color: stringToHslColor({ name: fullName, saturation: 30, lightness: 45 }),
        }}
      >
        {initials}
      </span>
    </div>
  )
}
