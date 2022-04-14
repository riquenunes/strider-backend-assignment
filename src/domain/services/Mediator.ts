import EventEmitter from 'events';

export interface Handler {
  handle(event: any): Promise<void>;
}

export default class Mediator {
  private readonly emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter()
  }

  public register(eventName: string, handler: Handler) {
    this.emitter.on(eventName, handler.handle.bind(handler));
    return this;
  }

  public async publish<T>(event: T) {
    this.emitter.emit(event.constructor.name, event);
  }
}
