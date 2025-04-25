import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combine et fusionne des classes CSS avec tailwind-merge
 * @param  {...any} inputs - Classes CSS à combiner
 * @returns {string} - Classes CSS combinées
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}