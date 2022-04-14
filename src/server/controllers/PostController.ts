import { FastifyRequest, FastifyReply } from 'fastify';
import CreatePost from '../../application/use-cases/CreatePost'

export default class PostController {
  constructor(
    private readonly cratePostUseCase: CreatePost,
  ) { }

  public async create(request: FastifyRequest<any>, reply: FastifyReply<any>) {
    const createdPost = await this.cratePostUseCase.execute(
      request.username,
      request.body.content,
    );

    reply.status(201).send(createdPost);
  }
}
