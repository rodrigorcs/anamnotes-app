import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Tailwind helper to manage classes with twMerge and clsx libraries
export const cn = (...classes: ClassValue[]) => twMerge(clsx(...classes))
