export default class PostNotFound extends Error {
  constructor(id: string) {
    super(`Post not found: ${id}`);
  }
}
