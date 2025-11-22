import {
  integer,
  text,
  boolean,
  varchar,
  pgTable,
  serial,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at"),
  },
  (table) => [uniqueIndex("email_idx").on(table.email)]
);

// export const posts = pgTable("posts", {
//   id: serial("id").primaryKey(),
//   authorId: integer("author_id").references(() => users.id),
//   content: text("content"),
//   imageUrl: varchar("image_url", { length: 512 }).nullable(),
//   isPrivate: boolean("is_private").default(false),
//   createdAt: timestamp("created_at").defaultNow(),
// });

// export const comments = pgTable("comments", {
//   id: serial("id").primaryKey(),
//   postId: integer("post_id").references(() => posts.id),
//   authorId: integer("author_id").references(() => users.id),
//   content: text("content"),
//   createdAt: timestamp("created_at").defaultNow(),
// });

// export const likes = pgTable("likes", {
//   id: serial("id").primaryKey(),
//   userId: integer("user_id").references(() => users.id),
//   postId: integer("post_id").references(() => posts.id).nullable(),
//   commentId: integer("comment_id").references(() => comments.id).nullable(),
//   createdAt: timestamp("created_at").defaultNow(),
// });
