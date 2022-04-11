export default class UnableToFollowSelf extends Error {
  constructor() {
    super('You cannot follow yourself');
  }
}
