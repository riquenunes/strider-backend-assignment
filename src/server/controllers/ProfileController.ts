import { FastifyRequest, FastifyReply } from 'fastify';
import FetchProfile from '../../application/queries/fetch-profile/FetchProfile';
import FetchProfilePosts from '../../application/queries/fetch-posts/fetch-profile-posts/FetchProfilePosts';
import FollowProfile from '../../application/use-cases/FollowProfile';
import UnfollowProfile from '../../application/use-cases/UnfollowProfile';
import { StatusCodes } from 'http-status-codes';

export default class ProfileController {
  constructor(
    private readonly followProfileUseCase: FollowProfile,
    private readonly unfollowProfileUseCase: UnfollowProfile,
    private readonly fetchProfileQuery: FetchProfile,
    private readonly fetchProfilePostsQuery: FetchProfilePosts,
  ) { }

  public async fetchProfilePosts(request: FastifyRequest<any>, reply: FastifyReply<any>) {
    const posts = await this.fetchProfilePostsQuery.execute(
      request.params.username,
      request.query.oldestPostPosition,
    );

    reply.status(StatusCodes.OK).send(posts);
  }

  public async fetch(request: FastifyRequest<any>, reply: FastifyReply<any>) {
    const profile = await this.fetchProfileQuery.execute(
      request.username,
      request.params.username
    );

    reply.status(StatusCodes.OK).send(profile);
  }

  public async follow(request: FastifyRequest<any>, reply: FastifyReply<any>) {
    await this.followProfileUseCase.execute(
      request.username,
      request.params.username
    );

    reply.status(StatusCodes.NO_CONTENT).send();
  }

  public async unfollow(request: FastifyRequest<any>, reply: FastifyReply<any>) {
    await this.unfollowProfileUseCase.execute(
      request.username,
      request.params.username
    );

    reply.status(StatusCodes.NO_CONTENT).send();
  }
}
