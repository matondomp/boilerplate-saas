import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * A function that takes multiple class values as input and merges them using twMerge and clsx, then returns the result.
 *
 * @param {ClassValue[]} inputs - an array of class values
 * @return {unknown} the merged class value
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
