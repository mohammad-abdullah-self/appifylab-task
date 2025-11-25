import {
  integer,
  text,
  boolean,
  varchar,
  pgTable,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const Users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const Posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  authorId: integer("author_id").references(() => Users.id),
  content: text("content").notNull(),
  imageUrl: varchar("image_url", { length: 512 }),
  isPrivate: boolean("is_private").notNull().default(false),
  likeCount: integer("like_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const Comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => Posts.id),
  authorId: integer("author_id").references(() => Users.id),
  parentId: integer("parent_id").references(() => Comments.id),
  content: text("content").notNull(),
  likeCount: integer("like_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const Likes = pgTable("likes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => Users.id),
  postId: integer("post_id").references(() => Posts.id),
  commentId: integer("comment_id").references(() => Comments.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const postsRelations = relations(Posts, ({ many, one }) => ({
  author: one(Users, {
    fields: [Posts.authorId],
    references: [Users.id],
  }),
  comments: many(Comments),
  likes: many(Likes),
}));

export const commentsRelations = relations(Comments, ({ many, one }) => ({
  author: one(Users, {
    fields: [Comments.authorId],
    references: [Users.id],
  }),
  post: one(Posts, {
    fields: [Comments.postId],
    references: [Posts.id],
  }),
  parent: one(Comments, {
    fields: [Comments.parentId],
    references: [Comments.id],
    relationName: "comment_parent",
  }),
  replies: many(Comments, {
    relationName: "comment_parent",
  }),
  likes: many(Likes),
}));

export const likesRelations = relations(Likes, ({ one }) => ({
  user: one(Users, {
    fields: [Likes.userId],
    references: [Users.id],
  }),
  post: one(Posts, {
    fields: [Likes.postId],
    references: [Posts.id],
  }),
  comment: one(Comments, {
    fields: [Likes.commentId],
    references: [Comments.id],
  }),
}));
