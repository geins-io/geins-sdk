import { EventService } from '../src/services/eventService';
import { BroadcastChannel } from 'broadcast-channel';
import { EventEmitter } from 'events';
import { isServerContext } from '../src/utils';
import type { GeinsEventMessage } from '@geins/types';

// Mock dependencies
jest.mock('broadcast-channel');
jest.mock('events');
jest.mock('../src/utils', () => ({
  isServerContext: jest.fn(),
}));

describe('EventService', () => {
  let eventService: EventService;

  beforeEach(() => {
    // Set isServerContext to return false to simulate a browser environment
    (isServerContext as jest.Mock).mockReturnValue(false);

    // Create a new instance of EventService before each test
    eventService = new EventService();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks after each test
  });

  it('should initialize BroadcastChannel in a browser context', () => {
    expect(BroadcastChannel).toHaveBeenCalledWith('geins-channel');
  });

  it('should not initialize BroadcastChannel in a server context', () => {
    (isServerContext as jest.Mock).mockReturnValue(true);

    // Reinitialize the EventService in a server context
    eventService = new EventService();
    expect(BroadcastChannel).not.toHaveBeenCalled();
  });

  it('should add a listener correctly', () => {
    const handler = jest.fn();
    eventService.listnerAdd(handler);

    // Trigger the event to verify that the handler is called
    eventService.push({
      subject: 'test message',
      payload: 'test payload',
      broadcast: false,
    });
    expect(handler).toHaveBeenCalledWith({
      message: 'test message',
      broadcast: false,
    });
  });

  it('should add a one-time listener correctly', () => {
    const handler = jest.fn();
    eventService.listnerOnce(handler);

    // Emit event for the first time
    eventService.push({
      subject: 'test message',
      payload: 'test payload',
      broadcast: false,
    });
    expect(handler).toHaveBeenCalledTimes(1);

    // Emit event again, but the handler should not be called this time
    eventService.push({
      subject: 'test message',
      payload: 'test payload',
      broadcast: false,
    });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should remove all listeners correctly', () => {
    const handler = jest.fn();
    eventService.listnerAdd(handler);

    // Ensure handler is added
    expect(eventService.listnerCount()).toBe(1);

    // Remove listener and verify it's removed
    eventService.listnerRemove();
    expect(eventService.listnerCount()).toBe(0);
  });

  it('should emit events through the emitter', () => {
    const handler = jest.fn();
    eventService.listnerAdd(handler);

    const message: GeinsEventMessage = {
      subject: 'test message',
      payload: 'test payload',
      broadcast: false,
    };
    eventService.push(message);

    expect(handler).toHaveBeenCalledWith(message);
  });

  it('should broadcast events when broadcast is enabled', () => {
    eventService.push({
      subject: 'broadcast event',
      payload: 'braodcast payload',
      broadcast: true,
    });

    // Verify that postMessage was called on the broadcast channel
    expect(eventService['broadcast']?.postMessage).toHaveBeenCalledWith({
      eventMessage: {
        subject: 'broadcast event',
        payload: 'braodcast payload',
        broadcast: true,
      },
      eventName: 'geins-event',
    });
  });

  it('should not broadcast events when broadcast is disabled', () => {
    eventService.push({
      subject: 'broadcast event',
      payload: 'braodcast payload',
      broadcast: true,
    });

    // Verify that postMessage was not called on the broadcast channel
    expect(eventService['broadcast']?.postMessage).not.toHaveBeenCalled();
  });

  it('should return the correct number of listeners for an event', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    eventService.listnerAdd(handler1);
    eventService.listnerAdd(handler2);

    // Verify the number of listeners
    expect(eventService.listnerCount()).toBe(2);
  });

  it('should return the correct list of listeners', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    eventService.listnerAdd(handler1);
    eventService.listnerAdd(handler2);

    // Verify that the returned listeners are correct
    const listeners = eventService.listnersGet();
    expect(listeners).toContain(handler1);
    expect(listeners).toContain(handler2);
  });
});
