import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to combine class names with clsx and merge Tailwind classes
 * This ensures that conflicting Tailwind classes are properly merged
 * 
 * @param inputs - Class names, objects, or arrays to combine
 * @returns Merged class name string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}