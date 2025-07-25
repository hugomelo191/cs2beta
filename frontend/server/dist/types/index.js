import { z } from 'zod';
// User types
export const UserSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    username: z.string().min(3).max(100),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    avatar: z.string().url().optional(),
    bio: z.string().optional(),
    country: z.string().length(2).default('pt'),
    role: z.enum(['user', 'admin', 'moderator']).default('user'),
    isVerified: z.boolean().default(false),
    isActive: z.boolean().default(true),
    lastLogin: z.date().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
export const CreateUserSchema = z.object({
    email: z.string().email(),
    username: z.string().min(3).max(100),
    password: z.string().min(6),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    country: z.string().length(2).default('pt'),
});
export const UpdateUserSchema = z.object({
    firstName: z.string().min(1, 'First name is required').optional(),
    lastName: z.string().min(1, 'Last name is required').optional(),
    email: z.string().email('Invalid email format').optional(),
    username: z.string().min(3, 'Username must be at least 3 characters').optional(),
    password: z.string().min(6, 'Password must be at least 6 characters').optional(),
    avatar: z.string().url('Invalid avatar URL').optional(),
    bio: z.string().max(500, 'Bio must not exceed 500 characters').optional(),
    country: z.string().length(2, 'Country must be a 2-letter code').optional(),
});
// Team types
export const TeamSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(2).max(100),
    tag: z.string().min(2).max(10),
    logo: z.string().url().optional(),
    banner: z.string().url().optional(),
    description: z.string().optional(),
    country: z.string().length(2),
    city: z.string().optional(),
    founded: z.number().int().positive().optional(),
    website: z.string().url().optional(),
    socials: z.record(z.string()).optional(),
    achievements: z.array(z.string()).optional(),
    isActive: z.boolean().default(true),
    createdAt: z.date(),
    updatedAt: z.date(),
});
export const CreateTeamSchema = z.object({
    name: z.string().min(2).max(100),
    tag: z.string().min(2).max(10),
    description: z.string().optional(),
    country: z.string().length(2),
    city: z.string().optional(),
    founded: z.number().int().positive().optional(),
    website: z.string().url().optional(),
    socials: z.record(z.string()).optional(),
});
export const UpdateTeamSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    tag: z.string().min(2).max(10).optional(),
    logo: z.string().url().optional(),
    banner: z.string().url().optional(),
    description: z.string().optional(),
    city: z.string().optional(),
    website: z.string().url().optional(),
    socials: z.record(z.string()).optional(),
    achievements: z.array(z.string()).optional(),
});
// Player types
export const PlayerSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid().optional(),
    teamId: z.string().uuid().optional(),
    nickname: z.string().min(2).max(50),
    realName: z.string().optional(),
    avatar: z.string().url().optional(),
    banner: z.string().url().optional(),
    country: z.string().length(2),
    city: z.string().optional(),
    age: z.number().int().positive().optional(),
    role: z.enum(['player', 'coach', 'manager']).default('player'),
    position: z.enum(['IGL', 'AWP', 'Rifler', 'Support']).optional(),
    bio: z.string().optional(),
    achievements: z.array(z.string()).optional(),
    stats: z.record(z.any()).optional(),
    socials: z.record(z.string()).optional(),
    isActive: z.boolean().default(true),
    createdAt: z.date(),
    updatedAt: z.date(),
});
export const CreatePlayerSchema = z.object({
    nickname: z.string().min(2).max(50),
    realName: z.string().optional(),
    country: z.string().length(2),
    city: z.string().optional(),
    age: z.number().int().positive().optional(),
    position: z.enum(['IGL', 'AWP', 'Rifler', 'Support']).optional(),
    bio: z.string().optional(),
    socials: z.record(z.string()).optional(),
});
export const UpdatePlayerSchema = z.object({
    nickname: z.string().min(2).max(50).optional(),
    realName: z.string().optional(),
    avatar: z.string().url().optional(),
    banner: z.string().url().optional(),
    city: z.string().optional(),
    age: z.number().int().positive().optional(),
    position: z.enum(['IGL', 'AWP', 'Rifler', 'Support']).optional(),
    bio: z.string().optional(),
    achievements: z.array(z.string()).optional(),
    stats: z.record(z.any()).optional(),
    socials: z.record(z.string()).optional(),
});
// Tournament types
export const TournamentSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(2).max(200),
    description: z.string().optional(),
    logo: z.string().url().optional(),
    banner: z.string().url().optional(),
    organizer: z.string().min(2).max(100),
    prizePool: z.number().positive().optional(),
    currency: z.string().length(3).default('EUR'),
    startDate: z.date(),
    endDate: z.date(),
    registrationDeadline: z.date().optional(),
    maxTeams: z.number().int().positive().optional(),
    currentTeams: z.number().int().default(0),
    format: z.string().optional(),
    maps: z.array(z.string()).optional(),
    rules: z.string().optional(),
    status: z.enum(['upcoming', 'ongoing', 'completed', 'cancelled']).default('upcoming'),
    country: z.string().length(2).optional(),
    isFeatured: z.boolean().default(false),
    createdAt: z.date(),
    updatedAt: z.date(),
});
export const CreateTournamentSchema = z.object({
    name: z.string().min(1, 'Tournament name is required'),
    description: z.string().optional(),
    organizer: z.string().min(1, 'Organizer is required'),
    startDate: z.date(),
    endDate: z.date(),
    registrationDeadline: z.date().optional(),
    maxTeams: z.number().positive().optional(),
    format: z.string().min(1, 'Format is required'),
    rules: z.string().optional(),
    prizePool: z.number().positive().optional(),
    currency: z.string().min(1, 'Currency is required'),
    status: z.enum(['upcoming', 'ongoing', 'completed', 'cancelled']).default('upcoming'),
    country: z.string().length(2, 'Country must be a 2-letter code').optional(),
    logo: z.string().url('Invalid logo URL').optional(),
    banner: z.string().url('Invalid banner URL').optional(),
    isFeatured: z.boolean().default(false),
});
export const UpdateTournamentSchema = z.object({
    name: z.string().min(1, 'Tournament name is required').optional(),
    description: z.string().optional(),
    organizer: z.string().min(1, 'Organizer is required').optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    registrationDeadline: z.date().optional(),
    maxTeams: z.number().positive().optional(),
    format: z.string().min(1, 'Format is required').optional(),
    rules: z.string().optional(),
    prizePool: z.number().positive().optional(),
    currency: z.string().min(1, 'Currency is required').optional(),
    status: z.enum(['upcoming', 'ongoing', 'completed', 'cancelled']).optional(),
    country: z.string().length(2, 'Country must be a 2-letter code').optional(),
    logo: z.string().url('Invalid logo URL').optional(),
    banner: z.string().url('Invalid banner URL').optional(),
    isFeatured: z.boolean().optional(),
});
// News types
export const NewsSchema = z.object({
    id: z.string().uuid(),
    title: z.string().min(2).max(200),
    excerpt: z.string().optional(),
    content: z.string().min(10),
    author: z.string().min(2).max(100),
    image: z.string().url().optional(),
    category: z.enum(['tournament', 'team', 'player', 'general']),
    tags: z.array(z.string()).optional(),
    views: z.number().int().default(0),
    readTime: z.number().int().positive().optional(),
    isPublished: z.boolean().default(false),
    isFeatured: z.boolean().default(false),
    publishedAt: z.date().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
export const CreateNewsSchema = z.object({
    title: z.string().min(2).max(200),
    excerpt: z.string().optional(),
    content: z.string().min(10),
    author: z.string().min(2).max(100),
    category: z.enum(['tournament', 'team', 'player', 'general']),
    tags: z.array(z.string()).optional(),
    readTime: z.number().int().positive().optional(),
    isPublished: z.boolean().default(false),
    isFeatured: z.boolean().default(false),
});
export const UpdateNewsSchema = z.object({
    title: z.string().min(2).max(200).optional(),
    excerpt: z.string().optional(),
    content: z.string().min(10).optional(),
    author: z.string().min(2).max(100).optional(),
    image: z.string().url().optional(),
    category: z.enum(['tournament', 'team', 'player', 'general']).optional(),
    tags: z.array(z.string()).optional(),
    readTime: z.number().int().positive().optional(),
    isPublished: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    publishedAt: z.date().optional(),
});
// Caster types
export const CasterSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid().optional(),
    name: z.string().min(2).max(100),
    type: z.enum(['caster', 'streamer']),
    specialty: z.string().optional(),
    avatar: z.string().url().optional(),
    banner: z.string().url().optional(),
    bio: z.string().optional(),
    country: z.string().length(2),
    languages: z.array(z.string()).optional(),
    followers: z.number().int().default(0),
    rating: z.number().min(0).max(5).default(0),
    experience: z.string().optional(),
    socials: z.record(z.string()).optional(),
    isLive: z.boolean().default(false),
    currentGame: z.string().optional(),
    isActive: z.boolean().default(true),
    createdAt: z.date(),
    updatedAt: z.date(),
});
export const CreateCasterSchema = z.object({
    name: z.string().min(2).max(100),
    type: z.enum(['caster', 'streamer']),
    specialty: z.string().optional(),
    bio: z.string().optional(),
    country: z.string().length(2),
    languages: z.array(z.string()).optional(),
    experience: z.string().optional(),
    socials: z.record(z.string()).optional(),
});
export const UpdateCasterSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    specialty: z.string().optional(),
    avatar: z.string().url().optional(),
    banner: z.string().url().optional(),
    bio: z.string().optional(),
    languages: z.array(z.string()).optional(),
    followers: z.number().int().optional(),
    rating: z.number().min(0).max(5).optional(),
    experience: z.string().optional(),
    socials: z.record(z.string()).optional(),
    isLive: z.boolean().optional(),
    currentGame: z.string().optional(),
});
// Draft types
export const DraftSchema = z.object({
    id: z.string().uuid(),
    title: z.string().min(2).max(200),
    description: z.string().optional(),
    tournamentId: z.string().uuid().optional(),
    organizerId: z.string().uuid(),
    maxTeams: z.number().int().positive(),
    currentTeams: z.number().int().default(0),
    startDate: z.date(),
    endDate: z.date(),
    status: z.enum(['open', 'in_progress', 'completed', 'cancelled']).default('open'),
    requirements: z.record(z.any()).optional(),
    isPublic: z.boolean().default(true),
    createdAt: z.date(),
    updatedAt: z.date(),
});
export const CreateDraftSchema = z.object({
    title: z.string().min(2).max(200),
    description: z.string().optional(),
    tournamentId: z.string().uuid().optional(),
    maxTeams: z.number().int().positive(),
    startDate: z.date(),
    endDate: z.date(),
    requirements: z.record(z.any()).optional(),
    isPublic: z.boolean().default(true),
});
export const UpdateDraftSchema = z.object({
    title: z.string().min(2).max(200).optional(),
    description: z.string().optional(),
    maxTeams: z.number().int().positive().optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    status: z.enum(['open', 'in_progress', 'completed', 'cancelled']).optional(),
    requirements: z.record(z.any()).optional(),
    isPublic: z.boolean().optional(),
});
// Auth types
export const LoginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'Password é obrigatória'),
});
export const RegisterSchema = z.object({
    // User data
    email: z.string().email('Email inválido'),
    username: z.string().min(3, 'Username deve ter pelo menos 3 caracteres').max(100),
    password: z.string().min(6, 'Password deve ter pelo menos 6 caracteres'),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    country: z.string().length(2).default('pt'),
    // Player data (obrigatório)
    nickname: z.string().min(2, 'Nickname deve ter pelo menos 2 caracteres').max(50),
    realName: z.string().optional(),
    age: z.number().int().positive().optional(),
    position: z.enum(['IGL', 'AWP', 'Rifler', 'Support']).optional(),
    bio: z.string().optional(),
    // Faceit integration
    faceitNickname: z.string().min(2, 'Nickname do Faceit é obrigatório'),
    // Socials
    socials: z.object({
        steam: z.string().url().optional(),
        discord: z.string().optional(),
        twitter: z.string().url().optional(),
        instagram: z.string().url().optional(),
        twitch: z.string().url().optional(),
    }).optional(),
});
// API Response types
export const ApiResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.any().optional(),
    error: z.string().optional(),
});
export const PaginatedResponseSchema = z.object({
    success: z.boolean(),
    data: z.array(z.any()),
    pagination: z.object({
        page: z.number(),
        limit: z.number(),
        total: z.number(),
        pages: z.number(),
    }),
});
//# sourceMappingURL=index.js.map