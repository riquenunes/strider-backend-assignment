import Mediator from '../../../src/domain/services/Mediator';

export default class MediatorStub extends Mediator {
  register = jest.fn();
  publish = jest.fn();
}
