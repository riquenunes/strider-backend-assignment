import { v4 as uuidv4 } from 'uuid';

export class PostID {
  constructor(
    public readonly value: string = uuidv4(),
  ) { }

  public toString(): string {
    return this.value;
  }
}

export default class Post {
  constructor(
    public readonly id: PostID,
    public readonly author: string,
    public readonly content: string,
    public readonly createdAt: Date,
  ) { }

  public validate(): void {
    if (this.content.length > 777) throw new Error('Post content is too long');
  }
}

export class Repost extends Post {
  constructor(
    id: PostID,
    author: string,
    createdAt: Date,
    public readonly originalPost: Post,
  ) {
    super(id, author, originalPost.content, createdAt);
  }
}

export class QuotedPost extends Repost {
  constructor(
    id: PostID,
    author: string,
    createdAt: Date,
    originalPost: Post,
    public readonly quote: string,
  ) {
    super(id, author, createdAt, originalPost);
  }

  public validate(): void {
    super.validate();

    if (this.quote.length > 777) throw new Error('Quote is too long');
  }
}
