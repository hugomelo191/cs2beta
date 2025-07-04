import { pgTable, text, timestamp, uuid, integer, boolean, json, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
// Users table
export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    username: varchar('username', { length: 50 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    firstName: varchar('first_name', { length: 100 }),
    lastName: varchar('last_name', { length: 100 }),
    avatar: text('avatar'),
    bio: text('bio'),
    country: varchar('country', { length: 2 }),
    role: varchar('role', { length: 20 }).default('user').notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    isVerified: boolean('is_verified').default(false).notNull(),
    verificationToken: varchar('verification_token', { length: 255 }),
    resetPasswordToken: varchar('reset_password_token', { length: 255 }),
    resetPasswordExpires: timestamp('reset_password_expires'),
    lastLogin: timestamp('last_login'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow(),
});
// Teams table
export const teams = pgTable('teams', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 100 }).notNull(),
    tag: varchar('tag', { length: 10 }).notNull().unique(),
    logo: text('logo'),
    banner: text('banner'),
    description: text('description'),
    country: varchar('country', { length: 2 }).notNull(),
    city: varchar('city', { length: 100 }),
    founded: integer('founded'),
    website: text('website'),
    socials: json('socials'), // { twitter, instagram, discord, etc }
    achievements: json('achievements'), // Array of achievements
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});
// Players table
export const players = pgTable('players', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    teamId: uuid('team_id').references(() => teams.id, { onDelete: 'set null' }),
    nickname: varchar('nickname', { length: 50 }).notNull(),
    realName: varchar('real_name', { length: 100 }),
    avatar: text('avatar'),
    banner: text('banner'),
    country: varchar('country', { length: 2 }).notNull(),
    city: varchar('city', { length: 100 }),
    age: integer('age'),
    role: varchar('role', { length: 20 }).default('player'), // player, coach, manager
    position: varchar('position', { length: 20 }), // IGL, AWP, Rifler, Support
    bio: text('bio'),
    achievements: json('achievements'),
    stats: json('stats'), // { kd, adr, maps_played, etc }
    socials: json('socials'),
    // Faceit integration fields
    faceitNickname: varchar('faceit_nickname', { length: 50 }),
    faceitId: varchar('faceit_id', { length: 100 }),
    faceitElo: integer('faceit_elo'),
    faceitLevel: integer('faceit_level'),
    steamId: varchar('steam_id', { length: 50 }),
    faceitUrl: text('faceit_url'),
    faceitStatsUpdatedAt: timestamp('faceit_stats_updated_at'),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});
// Tournaments table
export const tournaments = pgTable('tournaments', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 200 }).notNull(),
    description: text('description'),
    logo: text('logo'),
    banner: text('banner'),
    organizer: varchar('organizer', { length: 100 }).notNull(),
    prizePool: integer('prize_pool'),
    currency: varchar('currency', { length: 3 }).default('EUR'),
    startDate: timestamp('start_date').notNull(),
    endDate: timestamp('end_date').notNull(),
    registrationDeadline: timestamp('registration_deadline'),
    maxTeams: integer('max_teams'),
    currentTeams: integer('current_teams').default(0),
    format: varchar('format', { length: 50 }), // Single Elimination, Double Elimination, etc
    maps: json('maps'), // Array of maps
    rules: text('rules'),
    status: varchar('status', { length: 20 }).default('upcoming'), // upcoming, ongoing, completed, cancelled
    country: varchar('country', { length: 2 }),
    isFeatured: boolean('is_featured').default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});
// News table
export const news = pgTable('news', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 200 }).notNull(),
    excerpt: text('excerpt'),
    content: text('content').notNull(),
    author: varchar('author', { length: 100 }).notNull(),
    image: text('image'),
    category: varchar('category', { length: 20 }).notNull(), // tournament, team, player, general
    tags: json('tags'), // Array of tags
    views: integer('views').default(0),
    readTime: integer('read_time'),
    isPublished: boolean('is_published').default(false),
    isFeatured: boolean('is_featured').default(false),
    publishedAt: timestamp('published_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});
// Casters table
export const casters = pgTable('casters', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 100 }).notNull(),
    type: varchar('type', { length: 20 }).notNull(), // caster, streamer
    specialty: varchar('specialty', { length: 100 }),
    avatar: text('avatar'),
    banner: text('banner'),
    bio: text('bio'),
    country: varchar('country', { length: 2 }).notNull(),
    languages: json('languages'), // Array of language codes
    followers: integer('followers').default(0),
    rating: integer('rating').default(0),
    totalRatings: integer('total_ratings').default(0),
    experience: varchar('experience', { length: 50 }),
    socials: json('socials'),
    views: integer('views').default(0),
    isLive: boolean('is_live').default(false),
    currentGame: text('current_game'),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});
// Drafts table
export const drafts = pgTable('drafts', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 200 }).notNull(),
    description: text('description'),
    tournamentId: uuid('tournament_id').references(() => tournaments.id, { onDelete: 'cascade' }),
    organizerId: uuid('organizer_id').references(() => users.id, { onDelete: 'cascade' }),
    maxTeams: integer('max_teams').notNull(),
    currentTeams: integer('current_teams').default(0),
    maxApplications: integer('max_applications'),
    currentApplications: integer('current_applications').default(0),
    country: varchar('country', { length: 2 }),
    startDate: timestamp('start_date').notNull(),
    endDate: timestamp('end_date').notNull(),
    status: varchar('status', { length: 20 }).default('open'), // open, in_progress, completed, cancelled
    requirements: json('requirements'),
    isPublic: boolean('is_public').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});
// Draft Applications table
export const draftApplications = pgTable('draft_applications', {
    id: uuid('id').primaryKey().defaultRandom(),
    draftId: uuid('draft_id').references(() => drafts.id, { onDelete: 'cascade' }),
    teamId: uuid('team_id').references(() => teams.id, { onDelete: 'cascade' }),
    applicantId: uuid('applicant_id').references(() => users.id, { onDelete: 'cascade' }),
    status: varchar('status', { length: 20 }).default('pending'), // pending, accepted, rejected
    message: text('message'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});
// Team Members table (many-to-many relationship)
export const teamMembers = pgTable('team_members', {
    id: uuid('id').primaryKey().defaultRandom(),
    teamId: uuid('team_id').references(() => teams.id, { onDelete: 'cascade' }),
    playerId: uuid('player_id').references(() => players.id, { onDelete: 'cascade' }),
    role: varchar('role', { length: 20 }).default('player'), // player, captain, coach, manager
    joinedAt: timestamp('joined_at').defaultNow(),
    leftAt: timestamp('left_at'),
    isActive: boolean('is_active').default(true),
});
// Tournament Participants table
export const tournamentParticipants = pgTable('tournament_participants', {
    id: uuid('id').primaryKey().defaultRandom(),
    tournamentId: uuid('tournament_id').references(() => tournaments.id, { onDelete: 'cascade' }),
    teamId: uuid('team_id').references(() => teams.id, { onDelete: 'cascade' }),
    status: varchar('status', { length: 20 }).default('registered'), // registered, confirmed, eliminated, winner
    seed: integer('seed'),
    finalPosition: integer('final_position'),
    createdAt: timestamp('created_at').defaultNow(),
});
// Caster Applications table
export const casterApplications = pgTable('caster_applications', {
    id: uuid('id').primaryKey().defaultRandom(),
    type: varchar('type', { length: 20 }).notNull(), // caster, streamer
    name: varchar('name', { length: 100 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    country: varchar('country', { length: 2 }).notNull(),
    experience: varchar('experience', { length: 50 }).notNull(),
    specialty: varchar('specialty', { length: 100 }),
    description: text('description'),
    twitchUsername: varchar('twitch_username', { length: 100 }),
    youtubeChannel: varchar('youtube_channel', { length: 100 }),
    portfolio: text('portfolio'),
    motivation: text('motivation'),
    status: varchar('status', { length: 20 }).default('pending'), // pending, approved, rejected
    reviewedBy: uuid('reviewed_by').references(() => users.id, { onDelete: 'set null' }),
    reviewedAt: timestamp('reviewed_at'),
    reviewNotes: text('review_notes'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});
// Draft Posts table
export const draftPosts = pgTable('draft_posts', {
    id: uuid('id').primaryKey().defaultRandom(),
    authorId: uuid('author_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    type: varchar('type', { length: 20 }).notNull(), // player_looking, team_looking
    title: varchar('title', { length: 200 }).notNull(),
    description: text('description').notNull(),
    // Player-specific fields
    nickname: varchar('nickname', { length: 100 }),
    role: varchar('role', { length: 50 }),
    experience: varchar('experience', { length: 50 }),
    availability: varchar('availability', { length: 50 }),
    lookingFor: varchar('looking_for', { length: 200 }),
    // Team-specific fields
    teamName: varchar('team_name', { length: 100 }),
    lookingForRole: varchar('looking_for_role', { length: 50 }),
    commitment: varchar('commitment', { length: 50 }),
    requirements: text('requirements'),
    // Common fields
    urgency: varchar('urgency', { length: 20 }).default('normal'), // normal, urgent
    country: varchar('country', { length: 2 }),
    isActive: boolean('is_active').default(true),
    views: integer('views').default(0),
    expiresAt: timestamp('expires_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});
// Relations
export const usersRelations = relations(users, ({ many }) => ({
    players: many(players),
    drafts: many(drafts),
    casters: many(casters),
    draftPosts: many(draftPosts),
}));
export const teamsRelations = relations(teams, ({ many }) => ({
    players: many(players),
    members: many(teamMembers),
    draftApplications: many(draftApplications),
    tournamentParticipants: many(tournamentParticipants),
}));
export const playersRelations = relations(players, ({ one, many }) => ({
    user: one(users, {
        fields: [players.userId],
        references: [users.id],
    }),
    team: one(teams, {
        fields: [players.teamId],
        references: [teams.id],
    }),
    teamMemberships: many(teamMembers),
}));
export const tournamentsRelations = relations(tournaments, ({ many }) => ({
    drafts: many(drafts),
    participants: many(tournamentParticipants),
}));
export const draftsRelations = relations(drafts, ({ one, many }) => ({
    tournament: one(tournaments, {
        fields: [drafts.tournamentId],
        references: [tournaments.id],
    }),
    organizer: one(users, {
        fields: [drafts.organizerId],
        references: [users.id],
    }),
    applications: many(draftApplications),
}));
export const castersRelations = relations(casters, ({ one }) => ({
    user: one(users, {
        fields: [casters.userId],
        references: [users.id],
    }),
}));
export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
    team: one(teams, {
        fields: [teamMembers.teamId],
        references: [teams.id],
    }),
    player: one(players, {
        fields: [teamMembers.playerId],
        references: [players.id],
    }),
}));
export const draftPostsRelations = relations(draftPosts, ({ one }) => ({
    author: one(users, {
        fields: [draftPosts.authorId],
        references: [users.id],
    }),
}));
//# sourceMappingURL=schema.js.map