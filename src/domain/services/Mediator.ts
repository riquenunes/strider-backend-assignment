import DomainEvent from '../event/DomainEvent';

export interface Handler {
  handle(event: DomainEvent): Promise<void>;
}

export default interface Mediator {
  publish(event: DomainEvent): Promise<void>;
  register(eventName: string, handler: Handler): void;
}
