import Mediator from '../../../src/domain/services/Mediator';

export default class MediatorStub implements Mediator {
  register = jest.fn();
  publish = jest.fn();
}
