import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combina classes CSS de forma inteligente
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formata uma data para o formato português
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('pt-PT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Formata uma data para formato relativo (ex: "há 2 horas")
 */
export function formatRelativeDate(date: string | Date): string {
  const now = new Date()
  const target = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000)

  if (diffInSeconds < 60) return 'agora mesmo'
  if (diffInSeconds < 3600) return `há ${Math.floor(diffInSeconds / 60)} minutos`
  if (diffInSeconds < 86400) return `há ${Math.floor(diffInSeconds / 3600)} horas`
  if (diffInSeconds < 2592000) return `há ${Math.floor(diffInSeconds / 86400)} dias`
  if (diffInSeconds < 31536000) return `há ${Math.floor(diffInSeconds / 2592000)} meses`
  
  return `há ${Math.floor(diffInSeconds / 31536000)} anos`
}

/**
 * Formata um número para formato compacto (ex: 1.2K, 1.5M)
 */
export function formatCompactNumber(num: number): string {
  if (num < 1000) return num.toString()
  if (num < 1000000) return `${(num / 1000).toFixed(1)}K`
  return `${(num / 1000000).toFixed(1)}M`
}

/**
 * Gera um ID único
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

/**
 * Debounce function para otimizar performance
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function para limitar a frequência de execução
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Valida se um email é válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Capitaliza a primeira letra de uma string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Trunca texto com ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Remove acentos de uma string
 */
export function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

/**
 * Converte string para slug
 */
export function toSlug(str: string): string {
  return removeAccents(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/**
 * Verifica se está em ambiente de desenvolvimento
 */
export const isDev = process.env.NODE_ENV === 'development'

/**
 * Verifica se está em ambiente de produção
 */
export const isProd = process.env.NODE_ENV === 'production' 