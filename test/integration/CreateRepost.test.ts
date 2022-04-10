import CreateRepost from '../../src/application/use-cases/CreateRepost';
import { PostID } from '../../src/domain/entities/Post';
import DailyPostCreationLimitReached from '../../src/domain/errors/DailyPostCreationLimitReached';
import PostCreatedEvent from '../../src/domain/event/PostCreatedEvent';
import PostRepository from '../../src/domain/repository/PostRepository';
import ProfileRepository from '../../src/domain/repository/ProfileRepository';
import Mediator from '../../src/domain/services/Mediator';
import PostCreator from '../../src/domain/services/PostCreator';
import MediatorStub from '../helpers/doubles/MediatorStub';
import PostDummy from '../helpers/doubles/PostDummy';
import PostRepositoryStub from '../helpers/doubles/PostRepositoryStub';
import ProfileDummy from '../helpers/doubles/ProfileDummy';
import ProfileRepositoryStub from '../helpers/doubles/ProfileRepositoryStub';

describe('Repost creation tests', () => {
  let mediator: Mediator;
  let postRepository: PostRepository;
  let profileRepository: ProfileRepository;

  beforeEach(() => {
    mediator = new MediatorStub();
    postRepository = new PostRepositoryStub();
    profileRepository = new ProfileRepositoryStub();
  });

  it('creates a new repost', async () => {
    const profile = new ProfileDummy({ postCountToday: 0 });
    const existingPost = new PostDummy();

    profileRepository.fetchProfile = jest.fn().mockResolvedValue(profile);
    postRepository.fetchPost = jest.fn().mockResolvedValue(existingPost);

    const postCreator = new PostCreator(
      mediator,
      postRepository,
      profileRepository,
    );

    const useCase = new CreateRepost(postCreator, postRepository);
    const creationResult = await useCase.execute(
      profile.username,
      existingPost.id.toString(),
    );

    const postExpectation = expect.objectContaining({
      id: expect.any(PostID),
      content: existingPost.content,
      author: profile.username,
      createdAt: expect.any(Date),
      originalPost: existingPost,
    });

    expect(creationResult).toEqual(postExpectation);
    expect(postRepository.createPost).toHaveBeenCalledWith(postExpectation);
    expect(mediator.publish).toHaveBeenCalledWith(expect.any(PostCreatedEvent));
  });

  it('throws error when user has already created five posts today', () => {
    const profile = new ProfileDummy({ postCountToday: 5 });
    const existingPost = new PostDummy();

    profileRepository.fetchProfile = jest.fn().mockResolvedValue(profile);
    postRepository.fetchPost = jest.fn().mockResolvedValue(existingPost);

    const postCreator = new PostCreator(
      mediator,
      postRepository,
      profileRepository,
    );

    const useCase = new CreateRepost(postCreator, postRepository);

    expect(
      useCase.execute(profile.username, existingPost.id.toString())
    ).rejects.toThrow(DailyPostCreationLimitReached);
  });
});
