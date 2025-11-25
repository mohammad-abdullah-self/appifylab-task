"use server";

import { db } from "@/db/drizzle";
import { Comments, Likes, Posts } from "@/db/schema";
import {
  CreateCommentReplyState,
  CreateCommentSchema,
  CreateCommentState,
  CreatePostSchema,
  CreatePostState,
  CreateReplySchema,
} from "@/app/lib/definitions";
import { verifySession } from "@/app/lib/dal";
import { writeFile } from "fs/promises";
import path from "path";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { promises as fs } from "fs";

export async function createPostAction(
  state: CreatePostState,
  formData: FormData
) {
  const validatedFields = CreatePostSchema.safeParse({
    content: formData.get("content"),
    image: formData.get("image"),
    isPrivate: formData.get("is_private"),
  });

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }

  const session = await verifySession();
  if (!session?.userId) throw new Error("Not authenticated");

  const { content, image, isPrivate } = validatedFields.data;
  let imageUrl: string | null = null;

  if (image && image.size > 0) {
    const bytes = Buffer.from(await image.arrayBuffer());
    const imageName = `${Date.now()}-${image.name.replace(/\s/g, "_")}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, imageName);
    await writeFile(filePath, bytes);

    imageUrl = `${process.env.APP_URL}/uploads/${imageName}`;
  }

  await db.insert(Posts).values({
    authorId: session.userId,
    content,
    imageUrl: imageUrl ?? null,
    isPrivate: Boolean(isPrivate) ?? false,
  });

  revalidatePath("/feed");
}

export async function getPostsAction() {
  const session = await verifySession();
  if (!session?.userId) throw new Error("Not authenticated");

  const posts = await db.query.Posts.findMany({
    where: (posts, { eq, or, and }) =>
      or(
        eq(posts.isPrivate, false),
        and(eq(posts.isPrivate, true), eq(posts.authorId, session.userId))
      ),
    orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    with: {
      author: true,
      likes: {
        orderBy: (likes, { desc }) => [desc(likes.createdAt)],
        with: {
          user: true,
        },
      },
      comments: {
        where: (comments, { isNull }) => isNull(comments.parentId),
        orderBy: (comments, { desc }) => [desc(comments.createdAt)],
        with: {
          author: true,
          likes: {
            orderBy: (likes, { desc }) => [desc(likes.createdAt)],
            with: { user: true },
          },
          replies: {
            orderBy: (replies, { desc }) => [desc(replies.createdAt)],
            with: {
              author: true,
              likes: {
                orderBy: (likes, { desc }) => [desc(likes.createdAt)],
                with: { user: true },
              },
            },
          },
        },
      },
    },
  });

  function fullName(user: {
    firstName?: string | null;
    lastName?: string | null;
  }) {
    const fn = (user?.firstName ?? "").trim();
    const ln = (user?.lastName ?? "").trim();
    return fn || ln ? `${fn}${fn && ln ? " " : ""}${ln}` : "Unknown";
  }

  const mapped = posts.map((post) => ({
    ...post,
    likesNames: (post.likes ?? []).map((l) => fullName(l.user)),
    comments: (post.comments ?? []).map((comment) => ({
      ...comment,
      likesNames: (comment.likes ?? []).map((l) => fullName(l.user)),
      replies: (comment.replies ?? []).map((reply) => ({
        ...reply,
        likesNames: (reply.likes ?? []).map((l) => fullName(l.user)),
      })),
    })),
  }));

  return mapped;
}

export async function toggleLikeAction(
  target: "post" | "comment",
  targetId: number
) {
  const session = await verifySession();
  if (!session?.userId) throw new Error("Not authenticated");
  const userId = session.userId;

  const existing = await db
    .select({ id: Likes.id })
    .from(Likes)
    .where(
      target === "post"
        ? sql`${Likes.userId} = ${userId} AND ${Likes.postId} = ${targetId}`
        : sql`${Likes.userId} = ${userId} AND ${Likes.commentId} = ${targetId}`
    )
    .limit(1);

  if (existing.length) {
    const likeId = existing[0].id;
    await db.delete(Likes).where(sql`${Likes.id} = ${likeId}`);

    if (target === "post") {
      await db
        .update(Posts)
        .set({ likeCount: sql`GREATEST(${Posts.likeCount} - 1, 0)` })
        .where(sql`${Posts.id} = ${targetId}`);
    } else {
      await db
        .update(Comments)
        .set({ likeCount: sql`GREATEST(${Comments.likeCount} - 1, 0)` })
        .where(sql`${Comments.id} = ${targetId}`);
    }

    revalidatePath("/feed");
    return { liked: false };
  } else {
    await db.insert(Likes).values({
      userId,
      postId: target === "post" ? targetId : undefined,
      commentId: target === "comment" ? targetId : undefined,
      createdAt: new Date(),
    });

    if (target === "post") {
      await db
        .update(Posts)
        .set({ likeCount: sql`${Posts.likeCount} + 1` })
        .where(sql`${Posts.id} = ${targetId}`);
    } else {
      await db
        .update(Comments)
        .set({ likeCount: sql`${Comments.likeCount} + 1` })
        .where(sql`${Comments.id} = ${targetId}`);
    }

    revalidatePath("/feed");
    return { liked: true };
  }
}

export async function createCommentAction(
  state: CreateCommentState,
  formData: FormData
) {
  const session = await verifySession();
  if (!session?.userId) throw new Error("Not authenticated");

  const parsed = CreateCommentSchema.safeParse({
    postId: formData.get("post_id"),
    content: formData.get("content"),
  });
  if (!parsed.success) {
    return {
      errors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const { postId, content } = parsed.data;

  const postExists = await db
    .select()
    .from(Posts)
    .where(eq(Posts.id, postId))
    .limit(1);

  if (!postExists?.length) throw new Error("Post not found");

  await db.insert(Comments).values({
    postId,
    authorId: session.userId,
    content,
  });

  revalidatePath("/feed");
}

export async function createReplyAction(
  state: CreateCommentReplyState,
  formData: FormData
) {
  const session = await verifySession();
  if (!session?.userId) throw new Error("Not authenticated");

  const parsed = CreateReplySchema.safeParse({
    postId: formData.get("post_id"),
    parentId: formData.get("comment_id"),
    content: formData.get("content"),
  });
  if (!parsed.success) {
    return {
      errors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const { postId, parentId, content } = parsed.data;

  const postExists = await db
    .select()
    .from(Posts)
    .where(eq(Posts.id, postId))
    .limit(1);
  if (!postExists?.length) throw new Error("Post not found");

  const parent = await db
    .select()
    .from(Comments)
    .where(eq(Comments.id, parentId))
    .limit(1);

  if (!parent?.length) throw new Error("Parent comment not found");
  if (parent[0].postId !== postId) {
    throw new Error("Parent comment does not belong to the same post");
  }

  await db.insert(Comments).values({
    postId,
    authorId: session.userId,
    parentId,
    content,
  });

  revalidatePath("/feed");
}
