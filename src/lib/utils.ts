import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLastMatching<T>(
  arr: T[],
  filterFunc: (item: T) => boolean
): T | undefined {
  const filtered = arr.filter(filterFunc);
  return filtered[filtered.length - 1];
}
