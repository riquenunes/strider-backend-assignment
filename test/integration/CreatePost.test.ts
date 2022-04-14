import chance from 'chance';
import CreatePost from '../../src/application/use-cases/CreatePost';
import { PostID } from '../../src/domain/entities/Post';
import DailyPostCreationLimitReached from '../../src/domain/errors/DailyPostCreationLimitReached';
import PostContentSizeLimitReached from '../../src/domain/errors/PostContentSizeLimitReached';
import PostCreatedEvent from '../../src/domain/event/PostCreatedEvent';
import PostRepository from '../../src/domain/repository/PostRepository';
import ProfileRepository from '../../src/domain/repository/ProfileRepository';
import Mediator from '../../src/domain/services/Mediator';
import PostCreator from '../../src/domain/services/PostCreator';
import MediatorStub from '../helpers/doubles/MediatorStub';
import PostRepositoryStub from '../helpers/doubles/PostRepositoryStub';
import ProfileDummy from '../helpers/doubles/ProfileDummy';
import ProfileRepositoryStub from '../helpers/doubles/ProfileRepositoryStub';

describe('Post creation tests', () => {
  let mediator: Mediator;
  let postRepository: PostRepository;
  let profileRepository: ProfileRepository;

  beforeEach(() => {
    mediator = new MediatorStub();
    postRepository = new PostRepositoryStub();
    profileRepository = new ProfileRepositoryStub();
  });

  it('creates a new original post', async () => {
    const profile = new ProfileDummy({ todaysPostCount: 0 });

    profileRepository.fetchProfile = jest.fn().mockResolvedValue(profile);

    const postCreator = new PostCreator(
      mediator,
      postRepository,
      profileRepository,
    );

    const createPostUseCase = new CreatePost(postCreator);
    const creationResult = await createPostUseCase.execute(
      profile.username.toString(),
      'Hello world!'
    );

    const postExpectation = expect.objectContaining({
      id: expect.any(PostID),
      content: 'Hello world!',
      author: profile.username.toString(),
      createdAt: expect.any(Date),
    });

    expect(creationResult).toMatchObject(postExpectation);
    expect(postRepository.createPost).toHaveBeenCalledWith(postExpectation);
    expect(mediator.publish).toHaveBeenCalledWith(expect.any(PostCreatedEvent));
  });

  it('throws error when post content is above 777 characters', () => {
    const profile = new ProfileDummy({ todaysPostCount: 0 });

    profileRepository.fetchProfile = jest.fn().mockResolvedValue(profile);

    const postCreator = new PostCreator(
      mediator,
      postRepository,
      profileRepository,
    );

    const createPostUseCase = new CreatePost(postCreator);

    expect(
      createPostUseCase.execute(chance().twitter(), 'A'.repeat(778))
    ).rejects.toThrow(PostContentSizeLimitReached);
  });

  it('throws error when user has already created five posts today', () => {
    const profile = new ProfileDummy({ todaysPostCount: 5 });

    profileRepository.fetchProfile = jest.fn().mockResolvedValue(profile);

    const postCreator = new PostCreator(
      mediator,
      postRepository,
      profileRepository,
    );

    const createPostUseCase = new CreatePost(postCreator);

    expect(
      createPostUseCase.execute(profile.username.toString(), 'Hello world!')
    ).rejects.toThrow(DailyPostCreationLimitReached);
  });
});
