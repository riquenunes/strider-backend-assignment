export default class ProfileNotFound extends Error {
  constructor(username: string) {
    super(`Profile not found: ${username}`);
  }
}
