import { pgTable, uuid, varchar, text, timestamp, boolean, integer, jsonb, index, unique, decimal } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { users } from './users.js';

// Folders for organizing content
export const folders = pgTable('folders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  parentId: uuid('parent_id').references(() => folders.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  color: varchar('color', { length: 7 }).default('#3b82f6'), // hex color
  icon: varchar('icon', { length: 50 }).default('folder'),
  isShared: boolean('is_shared').default(false),
  shareCode: varchar('share_code', { length: 50 }),
  position: integer('position').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('folders_user_id_idx').on(table.userId),
  parentIdIdx: index('folders_parent_id_idx').on(table.parentId),
  shareCodeIdx: index('folders_share_code_idx').on(table.shareCode),
}));

// Notes and documents
export const notes = pgTable('notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  folderId: uuid('folder_id').references(() => folders.id, { onDelete: 'set null' }),
  
  // Basic Information
  title: varchar('title', { length: 500 }).notNull(),
  content: text('content'),
  contentType: varchar('content_type', { length: 50 }).default('rich_text'), // rich_text, markdown, plain_text
  contentJson: jsonb('content_json'), // Structured content for rich text editor
  
  // Note Properties
  noteType: varchar('note_type', { length: 50 }).default('note'), // note, document, assignment, research
  subject: varchar('subject', { length: 100 }),
  tags: jsonb('tags').default([]),
  
  // Collaboration
  isPublic: boolean('is_public').default(false),
  allowComments: boolean('allow_comments').default(true),
  collaborators: jsonb('collaborators').default([]), // array of user IDs
  
  // Study Features
  studyMode: boolean('study_mode').default(false), // can be used for studying
  difficulty: varchar('difficulty', { length: 20 }), // easy, medium, hard
  estimatedReadTime: integer('estimated_read_time'), // in minutes
  
  // File Attachments
  attachments: jsonb('attachments').default([]),
  
  // Version Control
  version: integer('version').default(1),
  isTemplate: boolean('is_template').default(false),
  templateCategory: varchar('template_category', { length: 100 }),
  
  // Analytics
  viewCount: integer('view_count').default(0),
  studyCount: integer('study_count').default(0),
  lastStudiedAt: timestamp('last_studied_at'),
  
  // Status
  status: varchar('status', { length: 20 }).default('active'), // active, archived, deleted
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('notes_user_id_idx').on(table.userId),
  folderIdIdx: index('notes_folder_id_idx').on(table.folderId),
  subjectIdx: index('notes_subject_idx').on(table.subject),
  statusIdx: index('notes_status_idx').on(table.status),
  createdAtIdx: index('notes_created_at_idx').on(table.createdAt),
  studyModeIdx: index('notes_study_mode_idx').on(table.studyMode),
}));

// Flashcard sets
export const flashcardSets = pgTable('flashcard_sets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  folderId: uuid('folder_id').references(() => folders.id, { onDelete: 'set null' }),
  
  // Basic Information
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  subject: varchar('subject', { length: 100 }),
  tags: jsonb('tags').default([]),
  
  // Set Properties
  language: varchar('language', { length: 10 }).default('en'),
  difficulty: varchar('difficulty', { length: 20 }), // easy, medium, hard
  cardCount: integer('card_count').default(0),
  
  // Study Settings
  studySettings: jsonb('study_settings').default({
    showHints: true,
    shuffleCards: false,
    studyMode: 'flashcards', // flashcards, quiz, match, write
    timeLimit: null,
    autoPlay: false,
  }),
  
  // Spaced Repetition
  spacedRepetition: boolean('spaced_repetition').default(true),
  
  // Sharing
  isPublic: boolean('is_public').default(false),
  allowCopy: boolean('allow_copy').default(true),
  shareCode: varchar('share_code', { length: 50 }),
  
  // Analytics
  studyCount: integer('study_count').default(0),
  copyCount: integer('copy_count').default(0),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0.00'),
  ratingCount: integer('rating_count').default(0),
  
  // Status
  status: varchar('status', { length: 20 }).default('active'),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('flashcard_sets_user_id_idx').on(table.userId),
  folderIdIdx: index('flashcard_sets_folder_id_idx').on(table.folderId),
  subjectIdx: index('flashcard_sets_subject_idx').on(table.subject),
  isPublicIdx: index('flashcard_sets_is_public_idx').on(table.isPublic),
  shareCodeIdx: index('flashcard_sets_share_code_idx').on(table.shareCode),
  ratingIdx: index('flashcard_sets_rating_idx').on(table.rating),
}));

// Individual flashcards
export const flashcards = pgTable('flashcards', {
  id: uuid('id').primaryKey().defaultRandom(),
  setId: uuid('set_id').references(() => flashcardSets.id, { onDelete: 'cascade' }).notNull(),
  
  // Card Content
  front: text('front').notNull(),
  back: text('back').notNull(),
  frontType: varchar('front_type', { length: 20 }).default('text'), // text, image, audio, video
  backType: varchar('back_type', { length: 20 }).default('text'),
  
  // Rich Content
  frontJson: jsonb('front_json'), // structured content
  backJson: jsonb('back_json'),
  
  // Additional Information
  hint: text('hint'),
  explanation: text('explanation'),
  examples: jsonb('examples').default([]),
  
  // Media
  frontImage: text('front_image'),
  backImage: text('back_image'),
  audio: text('audio'),
  
  // Card Properties
  difficulty: varchar('difficulty', { length: 20 }).default('medium'),
  tags: jsonb('tags').default([]),
  position: integer('position').default(0),
  
  // Study Analytics
  correctCount: integer('correct_count').default(0),
  incorrectCount: integer('incorrect_count').default(0),
  lastStudiedAt: timestamp('last_studied_at'),
  
  // Spaced Repetition Data
  easeFactor: decimal('ease_factor', { precision: 3, scale: 2 }).default('2.50'),
  interval: integer('interval').default(1), // days
  repetitions: integer('repetitions').default(0),
  nextReviewAt: timestamp('next_review_at'),
  
  // Status
  isActive: boolean('is_active').default(true),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  setIdIdx: index('flashcards_set_id_idx').on(table.setId),
  positionIdx: index('flashcards_position_idx').on(table.position),
  nextReviewIdx: index('flashcards_next_review_idx').on(table.nextReviewAt),
  difficultyIdx: index('flashcards_difficulty_idx').on(table.difficulty),
}));

// Quizzes and assessments
export const quizzes = pgTable('quizzes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  folderId: uuid('folder_id').references(() => folders.id, { onDelete: 'set null' }),
  
  // Basic Information
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  subject: varchar('subject', { length: 100 }),
  tags: jsonb('tags').default([]),
  
  // Quiz Settings
  timeLimit: integer('time_limit'), // minutes
  attempts: integer('attempts').default(1), // max attempts, -1 for unlimited
  shuffleQuestions: boolean('shuffle_questions').default(false),
  shuffleAnswers: boolean('shuffle_answers').default(false),
  showCorrectAnswers: boolean('show_correct_answers').default(true),
  showExplanations: boolean('show_explanations').default(true),
  
  // Grading
  passingScore: integer('passing_score').default(70), // percentage
  gradingType: varchar('grading_type', { length: 20 }).default('percentage'), // percentage, points
  
  // Quiz Properties
  difficulty: varchar('difficulty', { length: 20 }),
  questionCount: integer('question_count').default(0),
  estimatedTime: integer('estimated_time'), // minutes
  
  // Access Control
  isPublic: boolean('is_public').default(false),
  requirePassword: boolean('require_password').default(false),
  password: varchar('password', { length: 255 }),
  shareCode: varchar('share_code', { length: 50 }),
  
  // Scheduling
  availableFrom: timestamp('available_from'),
  availableUntil: timestamp('available_until'),
  
  // Analytics
  attemptCount: integer('attempt_count').default(0),
  averageScore: decimal('average_score', { precision: 5, scale: 2 }).default('0.00'),
  
  // Status
  status: varchar('status', { length: 20 }).default('draft'), // draft, published, archived
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('quizzes_user_id_idx').on(table.userId),
  folderIdIdx: index('quizzes_folder_id_idx').on(table.folderId),
  subjectIdx: index('quizzes_subject_idx').on(table.subject),
  statusIdx: index('quizzes_status_idx').on(table.status),
  isPublicIdx: index('quizzes_is_public_idx').on(table.isPublic),
  shareCodeIdx: index('quizzes_share_code_idx').on(table.shareCode),
}));

// Quiz questions
export const quizQuestions = pgTable('quiz_questions', {
  id: uuid('id').primaryKey().defaultRandom(),
  quizId: uuid('quiz_id').references(() => quizzes.id, { onDelete: 'cascade' }).notNull(),
  
  // Question Content
  question: text('question').notNull(),
  questionType: varchar('question_type', { length: 50 }).notNull(), // multiple_choice, true_false, short_answer, essay, matching, ordering
  
  // Question Options
  options: jsonb('options').default([]), // for multiple choice, matching, etc.
  correctAnswer: jsonb('correct_answer'), // flexible format for different question types
  
  // Additional Content
  explanation: text('explanation'),
  hint: text('hint'),
  tags: jsonb('tags').default([]),
  
  // Media
  image: text('image'),
  audio: text('audio'),
  video: text('video'),
  
  // Question Properties
  points: integer('points').default(1),
  difficulty: varchar('difficulty', { length: 20 }).default('medium'),
  position: integer('position').default(0),
  timeLimit: integer('time_limit'), // seconds for this specific question
  
  // Analytics
  timesAnswered: integer('times_answered').default(0),
  timesCorrect: integer('times_correct').default(0),
  averageTime: integer('average_time').default(0), // seconds
  
  // Status
  isActive: boolean('is_active').default(true),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  quizIdIdx: index('quiz_questions_quiz_id_idx').on(table.quizId),
  positionIdx: index('quiz_questions_position_idx').on(table.position),
  questionTypeIdx: index('quiz_questions_type_idx').on(table.questionType),
  difficultyIdx: index('quiz_questions_difficulty_idx').on(table.difficulty),
}));

// Zod schemas
export const insertFolderSchema = createInsertSchema(folders);
export const selectFolderSchema = createSelectSchema(folders);
export const insertNoteSchema = createInsertSchema(notes);
export const selectNoteSchema = createSelectSchema(notes);
export const insertFlashcardSetSchema = createInsertSchema(flashcardSets);
export const selectFlashcardSetSchema = createSelectSchema(flashcardSets);
export const insertFlashcardSchema = createInsertSchema(flashcards);
export const selectFlashcardSchema = createSelectSchema(flashcards);
export const insertQuizSchema = createInsertSchema(quizzes);
export const selectQuizSchema = createSelectSchema(quizzes);
export const insertQuizQuestionSchema = createInsertSchema(quizQuestions);
export const selectQuizQuestionSchema = createSelectSchema(quizQuestions);

// Types
export type Folder = z.infer<typeof selectFolderSchema>;
export type NewFolder = z.infer<typeof insertFolderSchema>;
export type Note = z.infer<typeof selectNoteSchema>;
export type NewNote = z.infer<typeof insertNoteSchema>;
export type FlashcardSet = z.infer<typeof selectFlashcardSetSchema>;
export type NewFlashcardSet = z.infer<typeof insertFlashcardSetSchema>;
export type Flashcard = z.infer<typeof selectFlashcardSchema>;
export type NewFlashcard = z.infer<typeof insertFlashcardSchema>;
export type Quiz = z.infer<typeof selectQuizSchema>;
export type NewQuiz = z.infer<typeof insertQuizSchema>;
export type QuizQuestion = z.infer<typeof selectQuizQuestionSchema>;
export type NewQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;