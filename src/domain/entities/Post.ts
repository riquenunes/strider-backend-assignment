import { v4 as uuidv4 } from 'uuid';
import PostContentSizeLimitReached from '../errors/PostContentSizeLimitReached';

export class PostID {
  constructor(
    public readonly value: string = uuidv4(),
  ) { }

  public toString(): string {
    return this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}

export default abstract class Post {
  constructor(
    public readonly id: PostID,
    public readonly author: string,
    public readonly createdAt: Date,
  ) { }

  abstract validate(): void;

  public createRepost(author: string): Repost {
    return new Repost(
      new PostID(),
      author,
      new Date(),
      this,
    );
  }

  public createQuote(author: string, quote: string): QuotedPost {
    return new QuotedPost(
      new PostID(),
      author,
      new Date(),
      this,
      quote,
    );
  }
}

export class OriginalPost extends Post {
  constructor(
    id: PostID,
    author: string,
    createdAt: Date,
    public readonly content: string,
  ) {
    super(id, author, createdAt);
  }

  validate(): void {
    if (this.content.length > 777) throw new PostContentSizeLimitReached();
  }
}

export class Repost extends Post {
  constructor(
    id: PostID,
    author: string,
    createdAt: Date,
    public readonly originalPost: Post,
  ) {
    super(id, author, createdAt);
  }

  validate(): void {

  }
}

export class QuotedPost extends Repost {
  constructor(
    id: PostID,
    author: string,
    createdAt: Date,
    originalPost: Post,
    public readonly content: string,
  ) {
    super(id, author, createdAt, originalPost);
  }

  public validate(): void {
    if (this.content.length > 777) throw new PostContentSizeLimitReached();
  }
}
