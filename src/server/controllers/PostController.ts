import { FastifyRequest, FastifyReply } from 'fastify';
import FetchHomepagePosts from '../../application/queries/fetch-homepage-posts/FetchHomepagePosts';
import CreatePost from '../../application/use-cases/CreatePost'
import CreatePostQuote from '../../application/use-cases/CreatePostQuote';
import CreateRepost from '../../application/use-cases/CreateRepost';

export default class PostController {
  constructor(
    private readonly cratePostUseCase: CreatePost,
    private readonly createPostQuoteUseCase: CreatePostQuote,
    private readonly createRepostUseCase: CreateRepost,
    private readonly fetchHomepagePostsQuery: FetchHomepagePosts,
  ) { }

  public async fetchHomePosts(request: FastifyRequest<any>, reply: FastifyReply<any>) {
    const posts = await this.fetchHomepagePostsQuery.execute(
      request.username,
      +request.query.skip,
      10,
      request.query.allUsers === 'true',
    );

    reply.status(200).send(posts);
  }

  public async create(request: FastifyRequest<any>, reply: FastifyReply<any>) {
    const createdPost = await this.cratePostUseCase.execute(
      request.username,
      request.body.content,
    );

    reply.status(201).send(createdPost);
  }

  public async quote(request: FastifyRequest<any>, reply: FastifyReply<any>) {
    const createdPost = await this.createPostQuoteUseCase.execute(
      request.username,
      request.body.quote,
      request.params.postId,
    );

    reply.status(201).send(createdPost);
  }

  public async repost(request: FastifyRequest<any>, reply: FastifyReply<any>) {
    const createdPost = await this.createRepostUseCase.execute(
      request.username,
      request.params.postId,
    );

    reply.status(201).send(createdPost);
  }
}
