export default class UnableToUnfollowSelf extends Error {
  constructor() {
    super('You cannot unfollow yourself');
  }
}
