import { Knex } from 'knex';
import Post, { OriginalPost, QuotedPost, Repost } from '../domain/entities/Post';
import PostNotFound from '../domain/errors/PostNotFound';
import PostRepository from '../domain/repository/PostRepository';
import dbConfig from '../../config/database';
import dbPostToPost from './db-post-mapper';

const { tables } = dbConfig;

export default class PGPostRepository implements PostRepository {
  constructor(
    private readonly db: Knex,
  ) { }

  async createPost(post: Post): Promise<void> {
    const getContent = () => {
      if (
        post instanceof OriginalPost ||
        post instanceof QuotedPost
      ) return post.content;

      return null;
    }

    await this.db(tables.post).insert({
      id: post.id.toString(),
      author: post.author,
      createdAt: post.createdAt,
      content: getContent(),
      originalPostId: post instanceof Repost ? post.originalPost.id : null,
    });
  }

  async fetchPost(id: string): Promise<Post> {
    const dbPost = await this.db(tables.post)
      .select(
        `${tables.post}.id`,
        `${tables.post}.content`,
        `${tables.post}.author`,
        `${tables.post}.createdAt`,
        'originalPost.id as originalPostId',
        'originalPost.content as originalPostContent',
        'originalPost.author as originalPostAuthor',
        'originalPost.createdAt as originalPostCreatedAt',
      )
      .leftJoin({ originalPost: tables.post }, `${tables.post}.originalPostId`, '=', 'originalPost.id')
      .where({ [`${tables.post}.id`]: id })
      .first();

    if (!dbPost) throw new PostNotFound(id);

    return dbPostToPost(dbPost);
  }
}
