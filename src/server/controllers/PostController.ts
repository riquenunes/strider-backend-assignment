import { FastifyRequest, FastifyReply } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import FetchHomepagePosts from '../../application/queries/fetch-posts/fetch-homepage-posts/FetchHomepagePosts';
import SearchPosts from '../../application/queries/fetch-posts/search-posts/SearchPosts';
import CreatePost from '../../application/use-cases/CreatePost'
import CreatePostQuote from '../../application/use-cases/CreatePostQuote';
import CreateRepost from '../../application/use-cases/CreateRepost';

export default class PostController {
  constructor(
    private readonly cratePostUseCase: CreatePost,
    private readonly createPostQuoteUseCase: CreatePostQuote,
    private readonly createRepostUseCase: CreateRepost,
    private readonly fetchHomepagePostsQuery: FetchHomepagePosts,
    private readonly searchPostsQuery: SearchPosts,
  ) { }

  public async fetchHomePosts(request: FastifyRequest<any>, reply: FastifyReply<any>) {
    if (request.query.search) {
      const posts = await this.searchPostsQuery.execute(
        request.query.search,
        request.query.oldestPostPosition,
      );

      reply.status(StatusCodes.OK).send(posts);

      return;
    }

    const posts = await this.fetchHomepagePostsQuery.execute(
      request.username,
      request.query.oldestPostPosition,
      request.query.allUsers === 'true',
    );

    reply.status(StatusCodes.OK).send(posts);
  }

  public async create(request: FastifyRequest<any>, reply: FastifyReply<any>) {
    const createdPost = await this.cratePostUseCase.execute(
      request.username,
      request.body.content,
    );

    reply.status(StatusCodes.CREATED).send(createdPost);
  }

  public async quote(request: FastifyRequest<any>, reply: FastifyReply<any>) {
    const createdPost = await this.createPostQuoteUseCase.execute(
      request.username,
      request.body.content,
      request.params.postId,
    );

    reply.status(StatusCodes.CREATED).send(createdPost);
  }

  public async repost(request: FastifyRequest<any>, reply: FastifyReply<any>) {
    const createdPost = await this.createRepostUseCase.execute(
      request.username,
      request.params.postId,
    );

    reply.status(StatusCodes.CREATED).send(createdPost);
  }
}
