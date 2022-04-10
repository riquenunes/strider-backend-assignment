export default class PostContentSizeLimitReached extends Error {
  constructor() {
    super('Post content is too long');
  }
}
