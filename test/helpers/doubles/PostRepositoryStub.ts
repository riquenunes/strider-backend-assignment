import PostRepository from '../../../src/domain/repository/PostRepository';
import PostDummy from './PostDummy';

export default class PostRepositoryStub implements PostRepository {
  public createPost = jest.fn();
  public fetchPost = jest.fn().mockResolvedValue(new PostDummy());
}
