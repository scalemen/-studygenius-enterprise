import { pgTable, uuid, varchar, text, timestamp, boolean, integer, jsonb, index, decimal } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { users } from './users.js';
import { flashcardSets, quizzes } from './content.js';
import { studyGroups, studyRooms } from './social.js';

// Study sessions for detailed learning analytics
export const studySessions = pgTable('study_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  
  // Session Type and Content
  sessionType: varchar('session_type', { length: 50 }).notNull(), // flashcards, quiz, note_review, group_study, ai_tutoring
  contentId: uuid('content_id'), // ID of the content being studied (note, flashcard set, quiz, etc.)
  contentType: varchar('content_type', { length: 50 }), // note, flashcard_set, quiz, ai_chat
  
  // Session Details
  subject: varchar('subject', { length: 100 }),
  topic: varchar('topic', { length: 255 }),
  difficulty: varchar('difficulty', { length: 20 }), // easy, medium, hard
  
  // Time Tracking
  startTime: timestamp('start_time').defaultNow(),
  endTime: timestamp('end_time'),
  duration: integer('duration'), // in seconds
  pausedDuration: integer('paused_duration').default(0), // time paused in seconds
  
  // Study Metrics
  itemsStudied: integer('items_studied').default(0), // cards reviewed, questions answered, etc.
  itemsCorrect: integer('items_correct').default(0),
  itemsIncorrect: integer('items_incorrect').default(0),
  accuracyRate: decimal('accuracy_rate', { precision: 5, scale: 2 }).default('0.00'),
  
  // Session Quality
  focusScore: decimal('focus_score', { precision: 3, scale: 2 }).default('0.00'), // 0-10 focus rating
  difficultyRating: integer('difficulty_rating'), // 1-5 how difficult the session was
  satisfactionRating: integer('satisfaction_rating'), // 1-5 how satisfied with the session
  
  // Device and Environment
  deviceType: varchar('device_type', { length: 50 }), // desktop, mobile, tablet
  platform: varchar('platform', { length: 50 }), // web, ios, android
  studyEnvironment: varchar('study_environment', { length: 50 }), // home, library, school, commute
  
  // Collaboration (if applicable)
  groupId: uuid('group_id').references(() => studyGroups.id, { onDelete: 'set null' }),
  studyRoomId: uuid('study_room_id').references(() => studyRooms.id, { onDelete: 'set null' }),
  isCollaborative: boolean('is_collaborative').default(false),
  
  // Goals and Progress
  goalSet: boolean('goal_set').default(false),
  goalMet: boolean('goal_met').default(false),
  goalData: jsonb('goal_data'), // specific goal details
  
  // Notes and Feedback
  notes: text('notes'), // user's notes about the session
  aiInsights: jsonb('ai_insights'), // AI-generated insights about the session
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('study_sessions_user_id_idx').on(table.userId),
  sessionTypeIdx: index('study_sessions_type_idx').on(table.sessionType),
  contentIdIdx: index('study_sessions_content_id_idx').on(table.contentId),
  subjectIdx: index('study_sessions_subject_idx').on(table.subject),
  startTimeIdx: index('study_sessions_start_time_idx').on(table.startTime),
  groupIdIdx: index('study_sessions_group_id_idx').on(table.groupId),
}));

// Quiz attempts and results
export const quizAttempts = pgTable('quiz_attempts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  quizId: uuid('quiz_id').references(() => quizzes.id, { onDelete: 'cascade' }).notNull(),
  studySessionId: uuid('study_session_id').references(() => studySessions.id, { onDelete: 'set null' }),
  
  // Attempt Details
  attemptNumber: integer('attempt_number').default(1),
  totalQuestions: integer('total_questions').notNull(),
  questionsAnswered: integer('questions_answered').default(0),
  correctAnswers: integer('correct_answers').default(0),
  incorrectAnswers: integer('incorrect_answers').default(0),
  skippedAnswers: integer('skipped_answers').default(0),
  
  // Scoring
  rawScore: integer('raw_score').default(0), // total points earned
  maxScore: integer('max_score').notNull(), // maximum possible points
  percentageScore: decimal('percentage_score', { precision: 5, scale: 2 }).default('0.00'),
  passed: boolean('passed').default(false),
  grade: varchar('grade', { length: 5 }), // A, B, C, D, F or similar
  
  // Time Management
  timeLimit: integer('time_limit'), // in minutes
  timeSpent: integer('time_spent'), // in seconds
  timeRemaining: integer('time_remaining'), // in seconds
  
  // Question-by-Question Results
  questionResults: jsonb('question_results').default([]), // detailed results for each question
  
  // Completion Status
  status: varchar('status', { length: 20 }).default('in_progress'), // in_progress, completed, abandoned, timed_out
  startedAt: timestamp('started_at').defaultNow(),
  completedAt: timestamp('completed_at'),
  submittedAt: timestamp('submitted_at'),
  
  // Analytics
  averageTimePerQuestion: decimal('avg_time_per_question', { precision: 5, scale: 2 }),
  difficultyBreakdown: jsonb('difficulty_breakdown'), // performance by difficulty level
  topicBreakdown: jsonb('topic_breakdown'), // performance by topic/subject
  
  // Feedback
  feedback: text('feedback'), // instructor or auto-generated feedback
  studentNotes: text('student_notes'), // student's own notes about the attempt
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('quiz_attempts_user_id_idx').on(table.userId),
  quizIdIdx: index('quiz_attempts_quiz_id_idx').on(table.quizId),
  statusIdx: index('quiz_attempts_status_idx').on(table.status),
  startedAtIdx: index('quiz_attempts_started_at_idx').on(table.startedAt),
  percentageScoreIdx: index('quiz_attempts_percentage_score_idx').on(table.percentageScore),
}));

// Flashcard study statistics
export const flashcardStats = pgTable('flashcard_stats', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  flashcardSetId: uuid('flashcard_set_id').references(() => flashcardSets.id, { onDelete: 'cascade' }).notNull(),
  studySessionId: uuid('study_session_id').references(() => studySessions.id, { onDelete: 'set null' }),
  
  // Study Statistics
  totalCards: integer('total_cards').notNull(),
  cardsStudied: integer('cards_studied').default(0),
  cardsCorrect: integer('cards_correct').default(0),
  cardsIncorrect: integer('cards_incorrect').default(0),
  cardsSkipped: integer('cards_skipped').default(0),
  
  // Performance Metrics
  accuracyRate: decimal('accuracy_rate', { precision: 5, scale: 2 }).default('0.00'),
  averageResponseTime: decimal('avg_response_time', { precision: 6, scale: 2 }), // in seconds
  studyTime: integer('study_time'), // total time in seconds
  
  // Spaced Repetition Progress
  newCards: integer('new_cards').default(0),
  reviewCards: integer('review_cards').default(0),
  masteredCards: integer('mastered_cards').default(0),
  
  // Study Mode Performance
  studyMode: varchar('study_mode', { length: 50 }), // flashcards, write, spell, test
  difficultyLevel: varchar('difficulty_level', { length: 20 }),
  
  // Session Details
  sessionDate: timestamp('session_date').defaultNow(),
  sessionDuration: integer('session_duration'), // in seconds
  cardsPerMinute: decimal('cards_per_minute', { precision: 5, scale: 2 }),
  
  // Learning Progress
  knowledgeGain: decimal('knowledge_gain', { precision: 5, scale: 2 }), // estimated learning progress
  retentionScore: decimal('retention_score', { precision: 5, scale: 2 }), // how well information is retained
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('flashcard_stats_user_id_idx').on(table.userId),
  flashcardSetIdIdx: index('flashcard_stats_set_id_idx').on(table.flashcardSetId),
  sessionDateIdx: index('flashcard_stats_session_date_idx').on(table.sessionDate),
  accuracyRateIdx: index('flashcard_stats_accuracy_rate_idx').on(table.accuracyRate),
}));

// Learning goals and progress tracking
export const learningGoals = pgTable('learning_goals', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  
  // Goal Information
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 100 }), // academic, skill_development, certification, personal
  subject: varchar('subject', { length: 100 }),
  
  // Goal Type and Metrics
  goalType: varchar('goal_type', { length: 50 }).notNull(), // study_time, accuracy, completion, streak, score
  targetValue: decimal('target_value', { precision: 10, scale: 2 }).notNull(),
  currentValue: decimal('current_value', { precision: 10, scale: 2 }).default('0.00'),
  unit: varchar('unit', { length: 50 }), // minutes, hours, days, percentage, points, cards
  
  // Timeline
  startDate: timestamp('start_date').defaultNow(),
  targetDate: timestamp('target_date'),
  completedDate: timestamp('completed_date'),
  
  // Goal Status
  status: varchar('status', { length: 20 }).default('active'), // active, completed, paused, cancelled
  priority: varchar('priority', { length: 20 }).default('medium'), // low, medium, high
  
  // Progress Tracking
  milestones: jsonb('milestones').default([]), // intermediate checkpoints
  progressHistory: jsonb('progress_history').default([]), // daily/weekly progress snapshots
  
  // Related Content
  relatedContent: jsonb('related_content').default([]), // flashcard sets, notes, quizzes
  tags: jsonb('tags').default([]),
  
  // Motivation and Rewards
  reward: text('reward'), // what the user gets for completing the goal
  motivationalNotes: text('motivational_notes'),
  
  // Analytics
  completionPercentage: decimal('completion_percentage', { precision: 5, scale: 2 }).default('0.00'),
  averageDailyProgress: decimal('avg_daily_progress', { precision: 8, scale: 2 }),
  estimatedCompletionDate: timestamp('estimated_completion_date'),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('learning_goals_user_id_idx').on(table.userId),
  statusIdx: index('learning_goals_status_idx').on(table.status),
  categoryIdx: index('learning_goals_category_idx').on(table.category),
  targetDateIdx: index('learning_goals_target_date_idx').on(table.targetDate),
  priorityIdx: index('learning_goals_priority_idx').on(table.priority),
}));

// Achievement system
export const achievements = pgTable('achievements', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  
  // Achievement Details
  type: varchar('type', { length: 50 }).notNull(), // study_streak, quiz_master, social_butterfly, etc.
  category: varchar('category', { length: 50 }), // academic, social, engagement, mastery
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  
  // Achievement Properties
  rarity: varchar('rarity', { length: 20 }).default('common'), // common, uncommon, rare, epic, legendary
  points: integer('points').default(0), // points awarded for this achievement
  badgeIcon: varchar('badge_icon', { length: 255 }),
  badgeColor: varchar('badge_color', { length: 7 }).default('#3b82f6'),
  
  // Progress and Requirements
  requirementType: varchar('requirement_type', { length: 50 }), // count, streak, percentage, time
  requirementValue: decimal('requirement_value', { precision: 10, scale: 2 }),
  currentProgress: decimal('current_progress', { precision: 10, scale: 2 }).default('0.00'),
  
  // Achievement Status
  isUnlocked: boolean('is_unlocked').default(false),
  unlockedAt: timestamp('unlocked_at'),
  isVisible: boolean('is_visible').default(true), // hidden achievements
  
  // Related Data
  relatedData: jsonb('related_data'), // specific data that triggered the achievement
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('achievements_user_id_idx').on(table.userId),
  typeIdx: index('achievements_type_idx').on(table.type),
  categoryIdx: index('achievements_category_idx').on(table.category),
  isUnlockedIdx: index('achievements_is_unlocked_idx').on(table.isUnlocked),
  unlockedAtIdx: index('achievements_unlocked_at_idx').on(table.unlockedAt),
  rarityIdx: index('achievements_rarity_idx').on(table.rarity),
}));

// Platform usage analytics
export const platformAnalytics = pgTable('platform_analytics', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  
  // Event Details
  eventType: varchar('event_type', { length: 100 }).notNull(), // page_view, feature_used, session_start, etc.
  eventCategory: varchar('event_category', { length: 50 }), // engagement, learning, social, navigation
  eventAction: varchar('event_action', { length: 100 }),
  eventLabel: varchar('event_label', { length: 255 }),
  
  // Session Information
  sessionId: varchar('session_id', { length: 255 }),
  deviceType: varchar('device_type', { length: 50 }),
  platform: varchar('platform', { length: 50 }),
  browser: varchar('browser', { length: 100 }),
  operatingSystem: varchar('operating_system', { length: 100 }),
  
  // Location and Context
  country: varchar('country', { length: 2 }), // ISO country code
  region: varchar('region', { length: 100 }),
  city: varchar('city', { length: 100 }),
  timezone: varchar('timezone', { length: 50 }),
  
  // Event Data
  eventData: jsonb('event_data'), // flexible data specific to the event
  duration: integer('duration'), // how long the event lasted (if applicable)
  value: decimal('value', { precision: 10, scale: 2 }), // numerical value associated with the event
  
  // Page/Feature Context
  pageUrl: text('page_url'),
  referrer: text('referrer'),
  featureName: varchar('feature_name', { length: 100 }),
  
  // User Context
  userType: varchar('user_type', { length: 50 }),
  subscriptionTier: varchar('subscription_tier', { length: 50 }),
  
  // Timestamps
  timestamp: timestamp('timestamp').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('platform_analytics_user_id_idx').on(table.userId),
  eventTypeIdx: index('platform_analytics_event_type_idx').on(table.eventType),
  eventCategoryIdx: index('platform_analytics_event_category_idx').on(table.eventCategory),
  timestampIdx: index('platform_analytics_timestamp_idx').on(table.timestamp),
  sessionIdIdx: index('platform_analytics_session_id_idx').on(table.sessionId),
  deviceTypeIdx: index('platform_analytics_device_type_idx').on(table.deviceType),
}));

// Zod schemas
export const insertStudySessionSchema = createInsertSchema(studySessions);
export const selectStudySessionSchema = createSelectSchema(studySessions);
export const insertQuizAttemptSchema = createInsertSchema(quizAttempts);
export const selectQuizAttemptSchema = createSelectSchema(quizAttempts);
export const insertFlashcardStatsSchema = createInsertSchema(flashcardStats);
export const selectFlashcardStatsSchema = createSelectSchema(flashcardStats);
export const insertLearningGoalSchema = createInsertSchema(learningGoals);
export const selectLearningGoalSchema = createSelectSchema(learningGoals);
export const insertAchievementSchema = createInsertSchema(achievements);
export const selectAchievementSchema = createSelectSchema(achievements);
export const insertPlatformAnalyticsSchema = createInsertSchema(platformAnalytics);
export const selectPlatformAnalyticsSchema = createSelectSchema(platformAnalytics);

// Types
export type StudySession = z.infer<typeof selectStudySessionSchema>;
export type NewStudySession = z.infer<typeof insertStudySessionSchema>;
export type QuizAttempt = z.infer<typeof selectQuizAttemptSchema>;
export type NewQuizAttempt = z.infer<typeof insertQuizAttemptSchema>;
export type FlashcardStats = z.infer<typeof selectFlashcardStatsSchema>;
export type NewFlashcardStats = z.infer<typeof insertFlashcardStatsSchema>;
export type LearningGoal = z.infer<typeof selectLearningGoalSchema>;
export type NewLearningGoal = z.infer<typeof insertLearningGoalSchema>;
export type Achievement = z.infer<typeof selectAchievementSchema>;
export type NewAchievement = z.infer<typeof insertAchievementSchema>;
export type PlatformAnalytics = z.infer<typeof selectPlatformAnalyticsSchema>;
export type NewPlatformAnalytics = z.infer<typeof insertPlatformAnalyticsSchema>;