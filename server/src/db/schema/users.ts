import { pgTable, uuid, varchar, text, timestamp, boolean, integer, jsonb, index, unique } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 50 }).unique(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  displayName: varchar('display_name', { length: 150 }),
  avatar: text('avatar'),
  bio: text('bio'),
  
  // Authentication
  passwordHash: varchar('password_hash', { length: 255 }),
  emailVerified: boolean('email_verified').default(false),
  emailVerificationToken: varchar('email_verification_token', { length: 255 }),
  passwordResetToken: varchar('password_reset_token', { length: 255 }),
  passwordResetExpiry: timestamp('password_reset_expiry'),
  
  // OAuth Providers
  googleId: varchar('google_id', { length: 255 }),
  githubId: varchar('github_id', { length: 255 }),
  microsoftId: varchar('microsoft_id', { length: 255 }),
  appleId: varchar('apple_id', { length: 255 }),
  
  // User Type & Subscription
  userType: varchar('user_type', { length: 50 }).default('student'), // student, teacher, admin, institution
  subscriptionTier: varchar('subscription_tier', { length: 50 }).default('free'), // free, premium, pro, enterprise
  subscriptionStatus: varchar('subscription_status', { length: 50 }).default('active'),
  subscriptionExpiry: timestamp('subscription_expiry'),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  
  // Educational Information
  educationLevel: varchar('education_level', { length: 50 }), // elementary, middle, high_school, college, graduate, professional
  institution: varchar('institution', { length: 255 }),
  major: varchar('major', { length: 255 }),
  graduationYear: integer('graduation_year'),
  
  // Preferences & Settings
  language: varchar('language', { length: 10 }).default('en'),
  timezone: varchar('timezone', { length: 50 }).default('UTC'),
  theme: varchar('theme', { length: 20 }).default('light'), // light, dark, auto
  preferences: jsonb('preferences').default({}),
  
  // Engagement & Analytics
  lastLoginAt: timestamp('last_login_at'),
  loginCount: integer('login_count').default(0),
  studyStreak: integer('study_streak').default(0),
  totalStudyTime: integer('total_study_time').default(0), // in minutes
  totalPoints: integer('total_points').default(0),
  level: integer('level').default(1),
  
  // Privacy & Security
  isPrivate: boolean('is_private').default(false),
  twoFactorEnabled: boolean('two_factor_enabled').default(false),
  twoFactorSecret: varchar('two_factor_secret', { length: 255 }),
  
  // Status & Metadata
  isActive: boolean('is_active').default(true),
  isBanned: boolean('is_banned').default(false),
  banReason: text('ban_reason'),
  banExpiry: timestamp('ban_expiry'),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
  usernameIdx: index('users_username_idx').on(table.username),
  userTypeIdx: index('users_user_type_idx').on(table.userType),
  subscriptionIdx: index('users_subscription_idx').on(table.subscriptionTier),
  lastLoginIdx: index('users_last_login_idx').on(table.lastLoginAt),
  googleIdIdx: index('users_google_id_idx').on(table.googleId),
  githubIdIdx: index('users_github_id_idx').on(table.githubId),
  emailUniqueIdx: unique('users_email_unique').on(table.email),
  usernameUniqueIdx: unique('users_username_unique').on(table.username),
}));

// User profiles for additional information
export const userProfiles = pgTable('user_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  
  // Personal Information
  dateOfBirth: timestamp('date_of_birth'),
  gender: varchar('gender', { length: 20 }),
  phoneNumber: varchar('phone_number', { length: 20 }),
  address: jsonb('address'),
  
  // Academic Information
  academicGoals: text('academic_goals'),
  subjectsOfInterest: jsonb('subjects_of_interest').default([]),
  skillLevel: jsonb('skill_level').default({}), // { math: 'intermediate', science: 'beginner' }
  learningStyle: varchar('learning_style', { length: 50 }), // visual, auditory, kinesthetic, reading
  
  // Social Features
  isPublic: boolean('is_public').default(true),
  allowMessages: boolean('allow_messages').default(true),
  allowFriendRequests: boolean('allow_friend_requests').default(true),
  showOnlineStatus: boolean('show_online_status').default(true),
  
  // Achievements & Badges
  badges: jsonb('badges').default([]),
  achievements: jsonb('achievements').default([]),
  certificates: jsonb('certificates').default([]),
  
  // Study Preferences
  studyReminders: boolean('study_reminders').default(true),
  dailyGoal: integer('daily_goal').default(30), // minutes
  preferredStudyTimes: jsonb('preferred_study_times').default([]),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('user_profiles_user_id_idx').on(table.userId),
  userIdUniqueIdx: unique('user_profiles_user_id_unique').on(table.userId),
}));

// User sessions for tracking active sessions
export const userSessions = pgTable('user_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  sessionToken: varchar('session_token', { length: 255 }).notNull().unique(),
  refreshToken: varchar('refresh_token', { length: 255 }),
  deviceInfo: jsonb('device_info'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  isActive: boolean('is_active').default(true),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('user_sessions_user_id_idx').on(table.userId),
  sessionTokenIdx: index('user_sessions_token_idx').on(table.sessionToken),
  expiresAtIdx: index('user_sessions_expires_at_idx').on(table.expiresAt),
}));

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email(),
  username: z.string().min(3).max(50).optional(),
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  userType: z.enum(['student', 'teacher', 'admin', 'institution']).optional(),
  subscriptionTier: z.enum(['free', 'premium', 'pro', 'enterprise']).optional(),
});

export const selectUserSchema = createSelectSchema(users);
export const insertUserProfileSchema = createInsertSchema(userProfiles);
export const selectUserProfileSchema = createSelectSchema(userProfiles);
export const insertUserSessionSchema = createInsertSchema(userSessions);
export const selectUserSessionSchema = createSelectSchema(userSessions);

// Types
export type User = z.infer<typeof selectUserSchema>;
export type NewUser = z.infer<typeof insertUserSchema>;
export type UserProfile = z.infer<typeof selectUserProfileSchema>;
export type NewUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserSession = z.infer<typeof selectUserSessionSchema>;
export type NewUserSession = z.infer<typeof insertUserSessionSchema>;