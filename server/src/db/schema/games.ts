import { pgTable, uuid, varchar, text, timestamp, boolean, integer, jsonb, index, decimal } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { users } from './users.js';

// Educational games catalog
export const games = pgTable('games', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Game Information
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 100 }).notNull(), // math, science, language, geography, history, etc.
  subcategory: varchar('subcategory', { length: 100 }),
  
  // Game Properties
  gameType: varchar('game_type', { length: 50 }).notNull(), // quiz, puzzle, match, word_scramble, math_challenge, etc.
  difficulty: varchar('difficulty', { length: 20 }).default('medium'), // easy, medium, hard, expert
  minAge: integer('min_age').default(8),
  maxAge: integer('max_age').default(100),
  
  // Game Mechanics
  timeLimit: integer('time_limit'), // seconds per game/question
  maxPlayers: integer('max_players').default(1), // 1 for single player, >1 for multiplayer
  minPlayers: integer('min_players').default(1),
  hasLevels: boolean('has_levels').default(false),
  levelCount: integer('level_count').default(1),
  
  // Scoring
  pointsPerCorrect: integer('points_per_correct').default(10),
  pointsPerIncorrect: integer('points_per_incorrect').default(0),
  bonusMultiplier: decimal('bonus_multiplier', { precision: 3, scale: 2 }).default('1.00'),
  
  // Game Content
  questionPool: jsonb('question_pool').default([]), // questions/challenges for the game
  gameConfig: jsonb('game_config').default({}), // game-specific configuration
  
  // Media
  icon: text('icon'),
  thumbnail: text('thumbnail'),
  screenshots: jsonb('screenshots').default([]),
  
  // Game Status
  isActive: boolean('is_active').default(true),
  isPublic: boolean('is_public').default(true),
  isPremium: boolean('is_premium').default(false),
  
  // Analytics
  totalPlays: integer('total_plays').default(0),
  averageScore: decimal('average_score', { precision: 8, scale: 2 }).default('0.00'),
  averageTime: integer('average_time').default(0), // average completion time in seconds
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0.00'),
  ratingCount: integer('rating_count').default(0),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  categoryIdx: index('games_category_idx').on(table.category),
  gameTypeIdx: index('games_type_idx').on(table.gameType),
  difficultyIdx: index('games_difficulty_idx').on(table.difficulty),
  isActiveIdx: index('games_is_active_idx').on(table.isActive),
  isPublicIdx: index('games_is_public_idx').on(table.isPublic),
  ratingIdx: index('games_rating_idx').on(table.rating),
}));

// Game sessions and attempts
export const gameAttempts = pgTable('game_attempts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  gameId: uuid('game_id').references(() => games.id, { onDelete: 'cascade' }).notNull(),
  
  // Attempt Details
  attemptNumber: integer('attempt_number').default(1),
  level: integer('level').default(1),
  
  // Performance
  score: integer('score').default(0),
  maxPossibleScore: integer('max_possible_score'),
  accuracy: decimal('accuracy', { precision: 5, scale: 2 }).default('0.00'), // percentage
  
  // Question/Challenge Statistics
  totalQuestions: integer('total_questions').default(0),
  correctAnswers: integer('correct_answers').default(0),
  incorrectAnswers: integer('incorrect_answers').default(0),
  skippedAnswers: integer('skipped_answers').default(0),
  
  // Time Tracking
  startTime: timestamp('start_time').defaultNow(),
  endTime: timestamp('end_time'),
  duration: integer('duration'), // total time in seconds
  averageTimePerQuestion: decimal('avg_time_per_question', { precision: 6, scale: 2 }),
  
  // Game Completion
  isCompleted: boolean('is_completed').default(false),
  completionPercentage: decimal('completion_percentage', { precision: 5, scale: 2 }).default('0.00'),
  
  // Detailed Results
  questionResults: jsonb('question_results').default([]), // detailed answer data
  powerUpsUsed: jsonb('power_ups_used').default([]),
  achievements: jsonb('achievements').default([]), // achievements earned in this session
  
  // Multiplayer Data (if applicable)
  isMultiplayer: boolean('is_multiplayer').default(false),
  roomCode: varchar('room_code', { length: 50 }),
  ranking: integer('ranking'), // final ranking in multiplayer games
  opponents: jsonb('opponents').default([]), // other players in the game
  
  // Device and Context
  deviceType: varchar('device_type', { length: 50 }),
  platform: varchar('platform', { length: 50 }),
  
  // User Experience
  difficultyRating: integer('difficulty_rating'), // how difficult the user found it (1-5)
  enjoymentRating: integer('enjoyment_rating'), // how much they enjoyed it (1-5)
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('game_attempts_user_id_idx').on(table.userId),
  gameIdIdx: index('game_attempts_game_id_idx').on(table.gameId),
  scoreIdx: index('game_attempts_score_idx').on(table.score),
  accuracyIdx: index('game_attempts_accuracy_idx').on(table.accuracy),
  startTimeIdx: index('game_attempts_start_time_idx').on(table.startTime),
  isCompletedIdx: index('game_attempts_is_completed_idx').on(table.isCompleted),
  isMultiplayerIdx: index('game_attempts_is_multiplayer_idx').on(table.isMultiplayer),
}));

// Leaderboards for games
export const leaderboards = pgTable('leaderboards', {
  id: uuid('id').primaryKey().defaultRandom(),
  gameId: uuid('game_id').references(() => games.id, { onDelete: 'cascade' }).notNull(),
  
  // Leaderboard Configuration
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  leaderboardType: varchar('leaderboard_type', { length: 50 }).notNull(), // high_score, fastest_time, accuracy, etc.
  
  // Time Period
  period: varchar('period', { length: 20 }).default('all_time'), // daily, weekly, monthly, all_time
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  
  // Leaderboard Settings
  maxEntries: integer('max_entries').default(100),
  isGlobal: boolean('is_global').default(true), // global vs. friends-only
  requireVerification: boolean('require_verification').default(false),
  
  // Status
  isActive: boolean('is_active').default(true),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  gameIdIdx: index('leaderboards_game_id_idx').on(table.gameId),
  leaderboardTypeIdx: index('leaderboards_type_idx').on(table.leaderboardType),
  periodIdx: index('leaderboards_period_idx').on(table.period),
  isActiveIdx: index('leaderboards_is_active_idx').on(table.isActive),
}));

// Leaderboard entries
export const leaderboardEntries = pgTable('leaderboard_entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  leaderboardId: uuid('leaderboard_id').references(() => leaderboards.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  gameAttemptId: uuid('game_attempt_id').references(() => gameAttempts.id, { onDelete: 'cascade' }).notNull(),
  
  // Score Data
  score: integer('score').notNull(),
  secondaryScore: integer('secondary_score'), // for games with multiple scoring criteria
  time: integer('time'), // completion time in seconds
  accuracy: decimal('accuracy', { precision: 5, scale: 2 }),
  
  // Ranking
  rank: integer('rank').notNull(),
  previousRank: integer('previous_rank'),
  rankChange: integer('rank_change').default(0),
  
  // Entry Metadata
  isVerified: boolean('is_verified').default(false),
  entryDate: timestamp('entry_date').defaultNow(),
  
  // Additional Data
  metadata: jsonb('metadata').default({}), // additional game-specific data
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  leaderboardIdIdx: index('leaderboard_entries_leaderboard_id_idx').on(table.leaderboardId),
  userIdIdx: index('leaderboard_entries_user_id_idx').on(table.userId),
  scoreIdx: index('leaderboard_entries_score_idx').on(table.score),
  rankIdx: index('leaderboard_entries_rank_idx').on(table.rank),
  entryDateIdx: index('leaderboard_entries_entry_date_idx').on(table.entryDate),
}));

// Multiplayer game rooms
export const gameRooms = pgTable('game_rooms', {
  id: uuid('id').primaryKey().defaultRandom(),
  gameId: uuid('game_id').references(() => games.id, { onDelete: 'cascade' }).notNull(),
  hostId: uuid('host_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  
  // Room Information
  name: varchar('name', { length: 255 }),
  roomCode: varchar('room_code', { length: 20 }).notNull(),
  password: varchar('password', { length: 255 }),
  
  // Room Settings
  maxPlayers: integer('max_players').default(8),
  currentPlayers: integer('current_players').default(1),
  isPrivate: boolean('is_private').default(false),
  allowSpectators: boolean('allow_spectators').default(true),
  
  // Game Configuration
  difficulty: varchar('difficulty', { length: 20 }),
  timeLimit: integer('time_limit'), // time per question/round
  numberOfRounds: integer('number_of_rounds').default(10),
  customRules: jsonb('custom_rules').default({}),
  
  // Room Status
  status: varchar('status', { length: 20 }).default('waiting'), // waiting, in_progress, completed, cancelled
  currentRound: integer('current_round').default(0),
  
  // Scheduling
  scheduledStart: timestamp('scheduled_start'),
  actualStart: timestamp('actual_start'),
  endTime: timestamp('end_time'),
  
  // Results
  winner: uuid('winner').references(() => users.id, { onDelete: 'set null' }),
  finalScores: jsonb('final_scores').default({}), // userId -> score mapping
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  gameIdIdx: index('game_rooms_game_id_idx').on(table.gameId),
  hostIdIdx: index('game_rooms_host_id_idx').on(table.hostId),
  roomCodeIdx: index('game_rooms_room_code_idx').on(table.roomCode),
  statusIdx: index('game_rooms_status_idx').on(table.status),
  scheduledStartIdx: index('game_rooms_scheduled_start_idx').on(table.scheduledStart),
}));

// Game room participants
export const gameRoomParticipants = pgTable('game_room_participants', {
  id: uuid('id').primaryKey().defaultRandom(),
  roomId: uuid('room_id').references(() => gameRooms.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  
  // Participation Details
  role: varchar('role', { length: 20 }).default('player'), // player, spectator
  status: varchar('status', { length: 20 }).default('joined'), // joined, left, kicked, disconnected
  
  // Performance in Room
  currentScore: integer('current_score').default(0),
  currentRank: integer('current_rank'),
  roundsWon: integer('rounds_won').default(0),
  
  // Participation Tracking
  joinedAt: timestamp('joined_at').defaultNow(),
  leftAt: timestamp('left_at'),
  isReady: boolean('is_ready').default(false),
  
  // Connection Status
  isConnected: boolean('is_connected').default(true),
  lastPing: timestamp('last_ping').defaultNow(),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  roomIdIdx: index('game_room_participants_room_id_idx').on(table.roomId),
  userIdIdx: index('game_room_participants_user_id_idx').on(table.userId),
  statusIdx: index('game_room_participants_status_idx').on(table.status),
  currentScoreIdx: index('game_room_participants_score_idx').on(table.currentScore),
}));

// Power-ups and game items
export const gamePowerUps = pgTable('game_power_ups', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Power-up Information
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  type: varchar('type', { length: 50 }).notNull(), // time_bonus, double_points, hint, skip, etc.
  
  // Power-up Properties
  effect: jsonb('effect').notNull(), // what the power-up does
  duration: integer('duration'), // how long it lasts (if applicable)
  cost: integer('cost').default(0), // cost in points/coins to use
  rarity: varchar('rarity', { length: 20 }).default('common'),
  
  // Availability
  gameTypes: jsonb('game_types').default([]), // which games this can be used in
  maxUsesPerGame: integer('max_uses_per_game').default(1),
  
  // Visual
  icon: text('icon'),
  color: varchar('color', { length: 7 }).default('#3b82f6'),
  
  // Status
  isActive: boolean('is_active').default(true),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  typeIdx: index('game_power_ups_type_idx').on(table.type),
  rarityIdx: index('game_power_ups_rarity_idx').on(table.rarity),
  isActiveIdx: index('game_power_ups_is_active_idx').on(table.isActive),
}));

// User power-up inventory
export const userPowerUps = pgTable('user_power_ups', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  powerUpId: uuid('power_up_id').references(() => gamePowerUps.id, { onDelete: 'cascade' }).notNull(),
  
  // Inventory Details
  quantity: integer('quantity').default(1),
  
  // Acquisition
  acquiredAt: timestamp('acquired_at').defaultNow(),
  acquiredFrom: varchar('acquired_from', { length: 50 }), // purchase, reward, achievement, etc.
  
  // Usage
  timesUsed: integer('times_used').default(0),
  lastUsedAt: timestamp('last_used_at'),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('user_power_ups_user_id_idx').on(table.userId),
  powerUpIdIdx: index('user_power_ups_power_up_id_idx').on(table.powerUpId),
  quantityIdx: index('user_power_ups_quantity_idx').on(table.quantity),
}));

// Zod schemas
export const insertGameSchema = createInsertSchema(games);
export const selectGameSchema = createSelectSchema(games);
export const insertGameAttemptSchema = createInsertSchema(gameAttempts);
export const selectGameAttemptSchema = createSelectSchema(gameAttempts);
export const insertLeaderboardSchema = createInsertSchema(leaderboards);
export const selectLeaderboardSchema = createSelectSchema(leaderboards);
export const insertLeaderboardEntrySchema = createInsertSchema(leaderboardEntries);
export const selectLeaderboardEntrySchema = createSelectSchema(leaderboardEntries);
export const insertGameRoomSchema = createInsertSchema(gameRooms);
export const selectGameRoomSchema = createSelectSchema(gameRooms);
export const insertGameRoomParticipantSchema = createInsertSchema(gameRoomParticipants);
export const selectGameRoomParticipantSchema = createSelectSchema(gameRoomParticipants);
export const insertGamePowerUpSchema = createInsertSchema(gamePowerUps);
export const selectGamePowerUpSchema = createSelectSchema(gamePowerUps);
export const insertUserPowerUpSchema = createInsertSchema(userPowerUps);
export const selectUserPowerUpSchema = createSelectSchema(userPowerUps);

// Types
export type Game = z.infer<typeof selectGameSchema>;
export type NewGame = z.infer<typeof insertGameSchema>;
export type GameAttempt = z.infer<typeof selectGameAttemptSchema>;
export type NewGameAttempt = z.infer<typeof insertGameAttemptSchema>;
export type Leaderboard = z.infer<typeof selectLeaderboardSchema>;
export type NewLeaderboard = z.infer<typeof insertLeaderboardSchema>;
export type LeaderboardEntry = z.infer<typeof selectLeaderboardEntrySchema>;
export type NewLeaderboardEntry = z.infer<typeof insertLeaderboardEntrySchema>;
export type GameRoom = z.infer<typeof selectGameRoomSchema>;
export type NewGameRoom = z.infer<typeof insertGameRoomSchema>;
export type GameRoomParticipant = z.infer<typeof selectGameRoomParticipantSchema>;
export type NewGameRoomParticipant = z.infer<typeof insertGameRoomParticipantSchema>;
export type GamePowerUp = z.infer<typeof selectGamePowerUpSchema>;
export type NewGamePowerUp = z.infer<typeof insertGamePowerUpSchema>;
export type UserPowerUp = z.infer<typeof selectUserPowerUpSchema>;
export type NewUserPowerUp = z.infer<typeof insertUserPowerUpSchema>;