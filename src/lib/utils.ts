import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, isToday, isYesterday } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMessageDate(date: string) {
  const messageDate = new Date(date)
  
  if (isToday(messageDate)) {
    return format(messageDate, 'HH:mm')
  }
  
  if (isYesterday(messageDate)) {
    return 'Yesterday'
  }
  
  return format(messageDate, 'dd/MM/yyyy')
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
} 