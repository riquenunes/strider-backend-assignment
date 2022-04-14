import DomainEvent from '../event/DomainEvent';
import EventEmitter from 'events';

export interface Handler {
  handle(event: DomainEvent): Promise<void>;
}

// TODO figure out where this needs to go
export default class Mediator {
  private readonly emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter()
  }

  public register(eventName: string, handler: Handler) {
    this.emitter.on(eventName, handler.handle.bind(handler));
    return this;
  }

  public async publish(event: DomainEvent) {
    this.emitter.emit(event.constructor.name, event);
  }
}
