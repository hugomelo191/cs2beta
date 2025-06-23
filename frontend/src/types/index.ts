// Base Types
export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

// User Types
export interface User extends BaseEntity {
  username: string
  email: string
  role: UserRole
  avatar?: string
  isActive: boolean
}

export type UserRole = 'user' | 'moderator' | 'admin'

// Caster Types
export interface Caster extends BaseEntity {
  name: string
  username: string
  avatar: string
  bio: string
  specialty: CasterSpecialty
  language: CasterLanguage
  rating: number
  followers: number
  isLive: boolean
  socialMedia: SocialMedia
  experience: number
  achievements: string[]
}

export type CasterSpecialty = 'analyst' | 'host' | 'play-by-play' | 'color-commentator' | 'streamer'
export type CasterLanguage = 'pt' | 'es' | 'en'

export interface SocialMedia {
  twitch?: string
  youtube?: string
  twitter?: string
  instagram?: string
  discord?: string
}

// News Types
export interface News extends BaseEntity {
  title: string
  slug: string
  excerpt: string
  content: string
  image: string
  category: NewsCategory
  author: User
  tags: string[]
  readTime: number
  views: number
  isPublished: boolean
  publishedAt?: string
}

export type NewsCategory = 'tournaments' | 'teams' | 'players' | 'general' | 'analysis'

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: string[]
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form Types
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  username: string
  email: string
  password: string
  confirmPassword: string
}

// Filter Types
export interface CasterFilters {
  language?: CasterLanguage
  specialty?: CasterSpecialty
  isLive?: boolean
  search?: string
}

export interface NewsFilters {
  category?: NewsCategory
  author?: string
  search?: string
  dateRange?: {
    start: string
    end: string
  }
}

// UI Types
export interface TabItem {
  id: string
  label: string
  icon?: string
  count?: number
}

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

// Component Props Types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface CardProps extends BaseComponentProps {
  title?: string
  subtitle?: string
  image?: string
  onClick?: () => void
  hover?: boolean
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

// Theme Types
export interface Theme {
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textSecondary: string
  }
}

// Local Storage Types
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: 'pt' | 'es' | 'en'
  notifications: {
    email: boolean
    push: boolean
    news: boolean
    casters: boolean
  }
}

// Error Types
export interface ApiError {
  message: string
  code?: string
  field?: string
  details?: Record<string, any>
}

// Loading States
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

// Navigation Types
export interface NavigationItem {
  name: string
  href: string
  icon?: string
  badge?: number
  children?: NavigationItem[]
}

// Modal Types
export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeOnOverlayClick?: boolean
  showCloseButton?: boolean
} 