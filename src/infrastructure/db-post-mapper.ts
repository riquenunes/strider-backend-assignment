import { QuotedPost, OriginalPost, Repost } from '../domain/entities/Post';

export default function dbPostToPost(dbPost) {
  if (dbPost.content) {
    if (dbPost.originalPostId) {
      return new QuotedPost(
        dbPost.id,
        dbPost.author,
        dbPost.createdAt,
        dbPostToPost({
          id: dbPost.originalPostId,
          author: dbPost.originalPostAuthor,
          createdAt: dbPost.originalPostCreatedAt,
          content: dbPost.originalPostContent,
          originalPostId: null,
        }),
        dbPost.content,
      );
    }

    return new OriginalPost(
      dbPost.id,
      dbPost.author,
      dbPost.createdAt,
      dbPost.content,
    );
  }

  return new Repost(
    dbPost.id,
    dbPost.author,
    dbPost.createdAt,
    dbPostToPost({
      id: dbPost.originalPostId,
      author: dbPost.originalPostAuthor,
      createdAt: dbPost.originalPostCreatedAt,
      content: dbPost.originalPostContent,
      originalPostId: null,
    }),
  );
}
