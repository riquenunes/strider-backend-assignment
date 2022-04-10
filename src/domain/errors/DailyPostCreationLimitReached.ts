export default class DailyPostCreationLimitReached extends Error {
  constructor() {
    super('You cannot post more than 5 times a day');
  }
}
