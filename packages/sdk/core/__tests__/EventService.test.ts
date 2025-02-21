import { GeinsEventType } from '@geins/core';
import type { GeinsEventMessage } from '@geins/types';
import { EventService } from '../src/services/eventService';

describe('EventService', () => {
  let eventService: EventService;
  const testEventMessage = {
    subject: 'string',
    payload: { data: 'data' },
    broadcast: true,
  };

  beforeEach(() => {
    // Create a new instance of EventService before each test
    eventService = new EventService();
  });

  it('should be defined', () => {
    expect(eventService).toBeDefined();
    eventService.listenerAdd(() => {});
    eventService.listenerOnce(() => {});
  });

  it('should add listener once emit and then be removed', () => {
    let listeners = 0;

    eventService.listenerOnce((data: GeinsEventMessage) => {
      expect(data).toEqual(testEventMessage);
    }, GeinsEventType.USER);

    // before emitting the event
    listeners = eventService.listenerCount(GeinsEventType.USER);
    expect(listeners).toBe(1);

    // emit the event
    eventService.push(testEventMessage, GeinsEventType.USER);

    // after emitting the event
    listeners = eventService.listenerCount(GeinsEventType.USER);
    expect(listeners).toBe(0);
  });

  it('should add listener  emit and then not be removed', () => {
    let listeners = 0;
    const eventHandler = jest.fn();
    eventService.listenerAdd(eventHandler);

    eventService.listenerAdd((data: GeinsEventMessage) => {
      expect(data).toEqual(testEventMessage);
    }, GeinsEventType.USER);

    // before emitting the event
    listeners = eventService.listenerCount(GeinsEventType.USER);
    expect(listeners).toBe(1);

    // emit the event
    eventService.push(testEventMessage, GeinsEventType.USER);

    // after emitting the event
    listeners = eventService.listenerCount(GeinsEventType.USER);
    expect(listeners).toBe(1);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks after each test
  });
});
