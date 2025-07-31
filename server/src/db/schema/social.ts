import { pgTable, uuid, varchar, text, timestamp, boolean, integer, jsonb, index, unique } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { users } from './users.js';

// Study groups
export const studyGroups = pgTable('study_groups', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: uuid('owner_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  
  // Basic Information
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  subject: varchar('subject', { length: 100 }),
  tags: jsonb('tags').default([]),
  
  // Group Settings
  isPublic: boolean('is_public').default(false),
  maxMembers: integer('max_members').default(50),
  joinCode: varchar('join_code', { length: 50 }),
  requireApproval: boolean('require_approval').default(false),
  
  // Group Properties
  language: varchar('language', { length: 10 }).default('en'),
  timezone: varchar('timezone', { length: 50 }).default('UTC'),
  meetingSchedule: jsonb('meeting_schedule'),
  
  // Features
  allowMessaging: boolean('allow_messaging').default(true),
  allowFileSharing: boolean('allow_file_sharing').default(true),
  allowVideoCall: boolean('allow_video_call').default(true),
  allowScreenShare: boolean('allow_screen_share').default(true),
  
  // Group Image and Branding
  avatar: text('avatar'),
  coverImage: text('cover_image'),
  color: varchar('color', { length: 7 }).default('#3b82f6'),
  
  // Analytics
  memberCount: integer('member_count').default(1),
  messageCount: integer('message_count').default(0),
  studySessionCount: integer('study_session_count').default(0),
  
  // Status
  isActive: boolean('is_active').default(true),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  ownerIdIdx: index('study_groups_owner_id_idx').on(table.ownerId),
  subjectIdx: index('study_groups_subject_idx').on(table.subject),
  isPublicIdx: index('study_groups_is_public_idx').on(table.isPublic),
  joinCodeIdx: index('study_groups_join_code_idx').on(table.joinCode),
  createdAtIdx: index('study_groups_created_at_idx').on(table.createdAt),
}));

// Study group memberships
export const studyGroupMembers = pgTable('study_group_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  groupId: uuid('group_id').references(() => studyGroups.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  
  // Membership Details
  role: varchar('role', { length: 50 }).default('member'), // owner, admin, moderator, member
  status: varchar('status', { length: 50 }).default('active'), // active, pending, banned, left
  
  // Permissions
  canInvite: boolean('can_invite').default(false),
  canModerate: boolean('can_moderate').default(false),
  canManageContent: boolean('can_manage_content').default(false),
  
  // Member Analytics
  joinedAt: timestamp('joined_at').defaultNow(),
  lastActiveAt: timestamp('last_active_at'),
  messageCount: integer('message_count').default(0),
  studyTime: integer('study_time').default(0), // minutes
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  groupIdIdx: index('study_group_members_group_id_idx').on(table.groupId),
  userIdIdx: index('study_group_members_user_id_idx').on(table.userId),
  roleIdx: index('study_group_members_role_idx').on(table.role),
  statusIdx: index('study_group_members_status_idx').on(table.status),
  groupUserUniqueIdx: unique('study_group_members_group_user_unique').on(table.groupId, table.userId),
}));

// Messages and chat
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  senderId: uuid('sender_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  
  // Message Target (group, direct message, study room)
  groupId: uuid('group_id').references(() => studyGroups.id, { onDelete: 'cascade' }),
  studyRoomId: uuid('study_room_id').references(() => studyRooms.id, { onDelete: 'cascade' }),
  recipientId: uuid('recipient_id').references(() => users.id, { onDelete: 'cascade' }),
  threadId: uuid('thread_id').references(() => messages.id, { onDelete: 'cascade' }),
  
  // Message Content
  content: text('content').notNull(),
  messageType: varchar('message_type', { length: 50 }).default('text'), // text, image, file, code, math, voice, video
  contentJson: jsonb('content_json'), // structured content for rich messages
  
  // Attachments
  attachments: jsonb('attachments').default([]),
  
  // Message Properties
  isEdited: boolean('is_edited').default(false),
  editedAt: timestamp('edited_at'),
  isDeleted: boolean('is_deleted').default(false),
  deletedAt: timestamp('deleted_at'),
  
  // Reactions and Interactions
  reactions: jsonb('reactions').default({}), // { emoji: [userId] }
  mentions: jsonb('mentions').default([]), // array of mentioned user IDs
  
  // Threading
  replyCount: integer('reply_count').default(0),
  
  // AI Features
  isAiGenerated: boolean('is_ai_generated').default(false),
  aiModel: varchar('ai_model', { length: 50 }),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  senderIdIdx: index('messages_sender_id_idx').on(table.senderId),
  groupIdIdx: index('messages_group_id_idx').on(table.groupId),
  studyRoomIdIdx: index('messages_study_room_id_idx').on(table.studyRoomId),
  recipientIdIdx: index('messages_recipient_id_idx').on(table.recipientId),
  threadIdIdx: index('messages_thread_id_idx').on(table.threadId),
  createdAtIdx: index('messages_created_at_idx').on(table.createdAt),
  messageTypeIdx: index('messages_type_idx').on(table.messageType),
}));

// Study rooms for virtual collaboration
export const studyRooms = pgTable('study_rooms', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: uuid('owner_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  groupId: uuid('group_id').references(() => studyGroups.id, { onDelete: 'cascade' }),
  
  // Room Information
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  subject: varchar('subject', { length: 100 }),
  
  // Room Settings
  isPublic: boolean('is_public').default(false),
  maxParticipants: integer('max_participants').default(25),
  roomCode: varchar('room_code', { length: 50 }),
  password: varchar('password', { length: 255 }),
  
  // Features
  allowAudio: boolean('allow_audio').default(true),
  allowVideo: boolean('allow_video').default(true),
  allowScreenShare: boolean('allow_screen_share').default(true),
  allowChat: boolean('allow_chat').default(true),
  allowWhiteboard: boolean('allow_whiteboard').default(true),
  allowFileShare: boolean('allow_file_share').default(true),
  
  // Room Type and Purpose
  roomType: varchar('room_type', { length: 50 }).default('study'), // study, meeting, presentation, tutoring
  sessionType: varchar('session_type', { length: 50 }), // focused_study, group_discussion, quiz_session, presentation
  
  // Scheduling
  isScheduled: boolean('is_scheduled').default(false),
  scheduledStart: timestamp('scheduled_start'),
  scheduledEnd: timestamp('scheduled_end'),
  duration: integer('duration'), // minutes
  
  // Current Session
  isActive: boolean('is_active').default(false),
  currentParticipants: integer('current_participants').default(0),
  sessionStartedAt: timestamp('session_started_at'),
  
  // Analytics
  totalSessions: integer('total_sessions').default(0),
  totalDuration: integer('total_duration').default(0), // minutes
  totalParticipants: integer('total_participants').default(0),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  ownerIdIdx: index('study_rooms_owner_id_idx').on(table.ownerId),
  groupIdIdx: index('study_rooms_group_id_idx').on(table.groupId),
  isPublicIdx: index('study_rooms_is_public_idx').on(table.isPublic),
  roomCodeIdx: index('study_rooms_room_code_idx').on(table.roomCode),
  isActiveIdx: index('study_rooms_is_active_idx').on(table.isActive),
  scheduledStartIdx: index('study_rooms_scheduled_start_idx').on(table.scheduledStart),
}));

// Study room participants
export const studyRoomParticipants = pgTable('study_room_participants', {
  id: uuid('id').primaryKey().defaultRandom(),
  roomId: uuid('room_id').references(() => studyRooms.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  
  // Participation Details
  role: varchar('role', { length: 50 }).default('participant'), // host, co_host, presenter, participant
  status: varchar('status', { length: 50 }).default('joined'), // joined, left, disconnected, kicked
  
  // Permissions
  canPresent: boolean('can_present').default(false),
  canModerate: boolean('can_moderate').default(false),
  canRecord: boolean('can_record').default(false),
  
  // Media Status
  audioEnabled: boolean('audio_enabled').default(false),
  videoEnabled: boolean('video_enabled').default(false),
  screenSharing: boolean('screen_sharing').default(false),
  
  // Session Analytics
  joinedAt: timestamp('joined_at').defaultNow(),
  leftAt: timestamp('left_at'),
  duration: integer('duration').default(0), // minutes
  messageCount: integer('message_count').default(0),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  roomIdIdx: index('study_room_participants_room_id_idx').on(table.roomId),
  userIdIdx: index('study_room_participants_user_id_idx').on(table.userId),
  statusIdx: index('study_room_participants_status_idx').on(table.status),
  roomUserUniqueIdx: unique('study_room_participants_room_user_unique').on(table.roomId, table.userId),
}));

// Friend connections
export const friendships = pgTable('friendships', {
  id: uuid('id').primaryKey().defaultRandom(),
  requesterId: uuid('requester_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  addresseeId: uuid('addressee_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  
  // Friendship Status
  status: varchar('status', { length: 50 }).default('pending'), // pending, accepted, blocked, cancelled
  
  // Friendship Details
  note: text('note'), // optional note from requester
  mutualFriends: integer('mutual_friends').default(0),
  
  // Analytics
  interactionCount: integer('interaction_count').default(0),
  lastInteraction: timestamp('last_interaction'),
  
  // Timestamps
  requestedAt: timestamp('requested_at').defaultNow(),
  respondedAt: timestamp('responded_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  requesterIdIdx: index('friendships_requester_id_idx').on(table.requesterId),
  addresseeIdIdx: index('friendships_addressee_id_idx').on(table.addresseeId),
  statusIdx: index('friendships_status_idx').on(table.status),
  requesterAddresseeUniqueIdx: unique('friendships_requester_addressee_unique').on(table.requesterId, table.addresseeId),
}));

// Notifications system
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  
  // Notification Content
  type: varchar('type', { length: 50 }).notNull(), // friend_request, group_invite, message, study_reminder, etc.
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  
  // Notification Data
  data: jsonb('data').default({}), // additional data specific to notification type
  actionUrl: text('action_url'), // URL to navigate when clicked
  
  // Related Entities
  fromUserId: uuid('from_user_id').references(() => users.id, { onDelete: 'cascade' }),
  groupId: uuid('group_id').references(() => studyGroups.id, { onDelete: 'cascade' }),
  studyRoomId: uuid('study_room_id').references(() => studyRooms.id, { onDelete: 'cascade' }),
  
  // Notification Status
  isRead: boolean('is_read').default(false),
  readAt: timestamp('read_at'),
  
  // Priority and Delivery
  priority: varchar('priority', { length: 20 }).default('normal'), // low, normal, high, urgent
  deliveryMethod: jsonb('delivery_method').default(['in_app']), // in_app, email, push, sms
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('notifications_user_id_idx').on(table.userId),
  typeIdx: index('notifications_type_idx').on(table.type),
  isReadIdx: index('notifications_is_read_idx').on(table.isRead),
  fromUserIdIdx: index('notifications_from_user_id_idx').on(table.fromUserId),
  priorityIdx: index('notifications_priority_idx').on(table.priority),
  createdAtIdx: index('notifications_created_at_idx').on(table.createdAt),
}));

// Zod schemas
export const insertStudyGroupSchema = createInsertSchema(studyGroups);
export const selectStudyGroupSchema = createSelectSchema(studyGroups);
export const insertStudyGroupMemberSchema = createInsertSchema(studyGroupMembers);
export const selectStudyGroupMemberSchema = createSelectSchema(studyGroupMembers);
export const insertMessageSchema = createInsertSchema(messages);
export const selectMessageSchema = createSelectSchema(messages);
export const insertStudyRoomSchema = createInsertSchema(studyRooms);
export const selectStudyRoomSchema = createSelectSchema(studyRooms);
export const insertStudyRoomParticipantSchema = createInsertSchema(studyRoomParticipants);
export const selectStudyRoomParticipantSchema = createSelectSchema(studyRoomParticipants);
export const insertFriendshipSchema = createInsertSchema(friendships);
export const selectFriendshipSchema = createSelectSchema(friendships);
export const insertNotificationSchema = createInsertSchema(notifications);
export const selectNotificationSchema = createSelectSchema(notifications);

// Types
export type StudyGroup = z.infer<typeof selectStudyGroupSchema>;
export type NewStudyGroup = z.infer<typeof insertStudyGroupSchema>;
export type StudyGroupMember = z.infer<typeof selectStudyGroupMemberSchema>;
export type NewStudyGroupMember = z.infer<typeof insertStudyGroupMemberSchema>;
export type Message = z.infer<typeof selectMessageSchema>;
export type NewMessage = z.infer<typeof insertMessageSchema>;
export type StudyRoom = z.infer<typeof selectStudyRoomSchema>;
export type NewStudyRoom = z.infer<typeof insertStudyRoomSchema>;
export type StudyRoomParticipant = z.infer<typeof selectStudyRoomParticipantSchema>;
export type NewStudyRoomParticipant = z.infer<typeof insertStudyRoomParticipantSchema>;
export type Friendship = z.infer<typeof selectFriendshipSchema>;
export type NewFriendship = z.infer<typeof insertFriendshipSchema>;
export type Notification = z.infer<typeof selectNotificationSchema>;
export type NewNotification = z.infer<typeof insertNotificationSchema>;